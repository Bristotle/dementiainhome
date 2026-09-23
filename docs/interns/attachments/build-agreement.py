# Build the placement agreement as a fillable PDF.
#
# The CEO asked for a PDF a university can open on a Mac, type into, sign and
# return, after which he signs. Chrome cannot produce form fields, so this is
# reportlab with AcroForm widgets. Our side is pre-filled; theirs is blank.
#
# Edits from his review are applied here: dementiacompanions.com alongside
# dementiainhome.com, no limits on what interns may be asked to do beyond the
# core work, no named-supervisor field, no insurance clause, Wyoming law.

from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.colors import HexColor, black, white
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Flowable, Table, TableStyle

INK = HexColor("#1f2937"); HEAD = HexColor("#0f172a"); TEAL = HexColor("#0f766e")
AMBER = HexColor("#b45309"); PALE = HexColor("#fffbeb"); LINE = HexColor("#94a3b8")

body = ParagraphStyle("b", fontName="Times-Roman", fontSize=9.3, leading=12.4, textColor=INK, spaceAfter=3)
h1 = ParagraphStyle("h1", fontName="Times-Bold", fontSize=15, leading=18, textColor=HEAD, spaceAfter=1)
sub = ParagraphStyle("sub", fontName="Helvetica-Bold", fontSize=9.2, leading=12, textColor=TEAL, spaceAfter=9)
h2 = ParagraphStyle("h2", fontName="Helvetica-Bold", fontSize=9.8, leading=12, textColor=HEAD, spaceBefore=5, spaceAfter=1)
note = ParagraphStyle("n", parent=body)
lbl = ParagraphStyle("l", fontName="Helvetica", fontSize=7.8, leading=10, textColor=HexColor("#475569"))

class Field(Flowable):
    """An inline text field with a caption underneath."""
    def __init__(self, name, width, caption, value="", height=15):
        super().__init__(); self.name, self.w, self.cap, self.val, self.h = name, width, caption, value, height
    def wrap(self, aw, ah): return (self.w, self.h + 9)
    def draw(self):
        c = self.canv
        ax, ay = c.absolutePosition(0, 11)
        c.acroForm.textfield(name=self.name, x=ax, y=ay, width=self.w, height=self.h, value=self.val,
                             fontName="Helvetica", fontSize=9, borderWidth=0.6, borderColor=LINE,
                             fillColor=white, textColor=black, forceBorder=True)
        c.setFont("Helvetica", 7.6); c.setFillColor(HexColor("#475569")); c.drawString(0, 1, self.cap)

class Inline(Flowable):
    """A run of paragraph text with fields placed on the same line."""
    def __init__(self, parts, gap=5):
        super().__init__(); self.parts, self.gap = parts, gap
    def wrap(self, aw, ah):
        self.aw = aw; return (aw, 26)
    def draw(self):
        c = self.canv; x = 0
        for kind, v in self.parts:
            if kind == "t":
                c.setFont("Times-Roman", 9.6); c.setFillColor(INK); c.drawString(x, 11, v); x += c.stringWidth(v, "Times-Roman", 9.6) + self.gap
            else:
                name, w, cap = v
                ax, ay = c.absolutePosition(x, 8)
                c.acroForm.textfield(name=name, x=ax, y=ay, width=w, height=15, fontName="Helvetica", fontSize=9,
                                     borderWidth=0.6, borderColor=LINE, fillColor=white, textColor=black, forceBorder=True)
                c.setFont("Helvetica", 7.2); c.setFillColor(HexColor("#475569")); c.drawString(x, 0, cap); x += w + self.gap

doc = SimpleDocTemplate("Dementia-In-Home-Placement-Agreement.pdf", pagesize=A4,
                        leftMargin=16*mm, rightMargin=16*mm, topMargin=11*mm, bottomMargin=9*mm,
                        title="Student Placement Agreement", author="Dementia In Home")
S = []
S.append(Paragraph("Student Placement Agreement", h1))
S.append(Paragraph("Niches LLC dba Dementia In Home &nbsp;·&nbsp; Unpaid student placement", sub))

S.append(Paragraph("<b>Between:</b> Niches LLC dba Dementia In Home, of 30 N Gould St Ste R, Sheridan, WY 82801, United States (the Organization), and the University named below.", body))
S.append(Inline([("f", ("university_name", 320, "University name")), ("f", ("effective_date", 110, "Effective from (date)"))]))
S.append(Spacer(1, 4))
S.append(Paragraph("Reviewed annually, or when either party asks.", body))

S.append(Paragraph("1. What the placement is", h2))
S.append(Paragraph("The Organization will host students of the University in an unpaid, remote placement of approximately 10 hours a week, arranged around the student's timetable.", body))
S.append(Paragraph("The student identifies dementia clinicians in a given city from public sources, invites them to be interviewed, records a video interview of 30 to 60 minutes from a question set the Organization supplies and sends to the clinician in advance, and prepares it for publication on dementiainhome.com and dementiacompanions.com with a written summary and a signed release from the clinician.", body))
S.append(Paragraph("The majority of the work is research and interviewing dementia experts, and preparing valuable content for other dementia experts and for families dealing with the disease. Students may also be asked to follow up with experts on partnership and collaboration, which is part of the same work.", body))

S.append(Paragraph("2. Supervision, and its limits", h2))
S.append(Paragraph("The Organization provides day-to-day task supervision: setting the work, reviewing each interview and write-up, and being available to answer questions during agreed hours.", body))
S.append(Paragraph("<b>The Organization does not currently employ a licensed social worker and does not provide clinical or licensure supervision.</b> Where the University requires a placement to be supervised by an MSW or other licensed practitioner, the University retains that responsibility, or the placement proceeds on a voluntary basis outside the accredited practicum route. The Organization will not represent otherwise to a student or to a licensing body.", note))
S.append(Paragraph("Academic assessment, learning objectives and evaluation of the student remain with the University. The Organization will complete any evaluation form the University provides and will report any concern about a student promptly.", body))

S.append(Paragraph("3. The student", h2))
S.append(Paragraph("The student is not an employee, worker, contractor or agent of the Organization, is not paid, and acquires no entitlement to payment, benefits or future engagement. Either party or the student may end the placement at any time, in writing, without penalty.", body))
S.append(Paragraph("Work produced by the student is published with the student credited as interviewer. The student may use it in a portfolio without restriction. The Organization will provide a reference on request at the end of the placement.", body))

S.append(Paragraph("4. Consent, confidentiality and conduct", h2))
S.append(Paragraph("No interview is published without a signed release from the clinician, who may withdraw it at any time. Students follow the Organization's standing rule that no interviewee is asked to endorse or recommend its services, and published material does not suggest that they do.", body))
S.append(Paragraph("Each party keeps confidential the non-public information of the other, and complies with applicable data protection and student-record law. Neither party discriminates on any protected ground in relation to this placement.", body))

S.append(Paragraph("5. Law", h2))
S.append(Paragraph("This agreement is governed by the law of the State of Wyoming. Neither party is liable to the other for indirect or consequential loss. It may be replaced by the University's own affiliation agreement if the University prefers its standard form.", body))

S.append(Spacer(1, 4))
# Our side carries full name, title and company, pre-filled, with only the date
# and signature left for him. Theirs is blank throughout.
sig = Table([
    [Field("org_signatory", 210, "Signed for the Organization: name and title", "Maxim Pogulaev, Founder and CEO"),
     Field("uni_signatory", 210, "Signed for the University: name and title")],
    [Field("org_company", 210, "Company", "Niches LLC dba Dementia In Home"),
     Field("uni_institution", 210, "Institution")],
    [Field("org_signature", 210, "Signature", height=22), Field("uni_signature", 210, "Signature", height=22)],
    [Field("org_date", 210, "Date"), Field("uni_date", 210, "Date")],
], colWidths=[240, 240])
sig.setStyle(TableStyle([("VALIGN", (0,0), (-1,-1), "TOP"), ("LEFTPADDING", (0,0), (-1,-1), 0), ("BOTTOMPADDING", (0,0), (-1,-1), 4)]))
S.append(sig)

def footer(c, d):
    c.saveState()
    c.setStrokeColor(LINE); c.setLineWidth(0.5)
    c.line(16*mm, 9*mm, A4[0]-16*mm, 9*mm)
    c.setFont("Helvetica", 7.4); c.setFillColor(HexColor("#475569"))
    c.drawString(16*mm, 5.5*mm, "Niches LLC dba Dementia In Home  ·  30 N Gould St Ste R, Sheridan, WY 82801, United States  ·  dementiainhome.com  ·  dementiacompanions.com")
    c.restoreState()

doc.build(S, onFirstPage=footer, onLaterPages=footer)
print("built")

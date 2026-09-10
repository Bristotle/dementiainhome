# Intern programme

Sixteen university departments were contacted on 10 September 2026 about
supplying interns to record interviews with dementia clinicians. All sixteen
delivered. This directory is what has to exist before the first one says yes.

| File | What it is | Who reads it |
| --- | --- | --- |
| `placement-description.md` | The role, for a placements board | Placements officers, students |
| `interview-questions.md` | The question set and the rules | Interns |
| `consent-release.md` | Publication consent | Clinicians |

The publishing side already exists: `lib/interviews.ts` and the pages under
`app/interviews/`. Both require a `consentRef`, so an interview cannot go live
without a signed release. The library is currently empty, which is accurate.

## Open questions, which are not mine to answer

These block sending the placement description to any university. A placements
office asks both of them immediately, and a wrong answer is worse than a slow
one.

**1. Is the placement paid, and at what rate?**

The description has `[PAID AT RATE, OR UNPAID, OR STIPEND]` in it and cannot go
out until that is filled in. Unpaid internships carry legal exposure that varies
by state and by whether the student receives academic credit, and some
universities will not circulate an unpaid placement at all. Several of the
sixteen are large public institutions that are likely to be among them.

**2. How many hours a week, and for how long?**

`[HOURS PER WEEK]` and `[TERM]`. This has to be a number a student can hold
against a timetable.

## Also outstanding

- **The consent release has not been reviewed by a lawyer.** It is written to be
  clear and fair rather than to be enforceable, and it commits us to removing a
  page within five working days on request, which is a real obligation. It should
  be read by someone qualified before a clinician is asked to sign it.
- **Who supervises an intern day to day**, and who answers a question that
  arrives on a Tuesday afternoon.
- **What happens to a recording** between the interview and publication: where it
  is stored, who has access, and how long we keep it.

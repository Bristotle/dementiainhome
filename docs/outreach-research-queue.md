# Research queue

A list of institutions worth contacting, in the cities we cover. **None of these
are verified addresses.** Each row is a candidate: someone has to open the
department's own contact page and read the address off it.

## Why this file exists

Finding the address is the whole constraint on the outreach programme. The
sending pipeline handles 25 a day now and 175 a day from week four, and it has
run dry twice.

It is not slow because it is hard. It is slow because a great many university
pages cannot be read by an automated fetch: Columbia and NYU return 403 and 405,
Temple hides addresses behind a decode link, San Diego State and Arizona State
use Cloudflare's email obfuscation, and UTSA's social work contact page publishes
a telephone number and nothing else. Every one of those addresses is visible to a
person in a browser in about ten seconds.

So the split is: this file supplies the institutions, a person supplies the
addresses. Roughly one in four candidates yields a usable address, so a hundred
rows is about twenty-five targets, which is one full sending day.

## The rule, unchanged

An address only counts if it is **published on the institution's own page for
enquiries**, and that page's URL goes in `source_url`. A general departmental
address is ideal. A named programme contact on that programme's own page is
fine. An address from a research paper, a personal page, or a staff directory
not meant for enquiries is not, however easy it is to find.

## How to work the queue

1. Search: `<institution> <department> contact`
2. Open the department's own contact page. Not a directory site, not a search
   summary: those are wrong often enough to matter. The UNC Charlotte director's
   address came back from search as `chancock@uncc.edu` and is actually
   `chancock@charlotte.edu`, which would have bounced.
3. Copy the address and the page URL into a JSON row, format below.
4. Import. The importer checks that each domain can actually receive mail and
   refuses the whole file if one cannot, so a typo cannot reach the send queue.

```json
{
  "kind": "university",
  "org": "the Rush University College of Nursing",
  "department": "Nursing",
  "email": "",
  "city": "Chicago",
  "state": "IL",
  "source_url": "",
  "notes": "Where the address was published, and anything about fit."
}
```

    npm run outreach -- add docs/outreach-targets-batch4.json
    npm run outreach -- send          # preview
    npm run outreach -- send --confirm

`department` matters more than it looks. If it is a discipline the subject line
reads "Internship for Nursing students". If it is a unit, such as "Institute on
Aging", the templates fall back to "Internship for your students", because
"Internship for Institute on Aging students" is not a sentence.

## The queue

Grouped by the cities we publish guides for, because an intern near one of our
cities can interview clinicians we already cite there. Institutions already
contacted are listed in `docs/outreach-targets-*.json` and are not repeated here.

### New York
Nothing contacted yet, and it is our largest city.

- NYU Silver School of Social Work
- Columbia School of Social Work
- Hunter College Silberman School of Social Work
- Hunter College Brookdale Center for Healthy Aging
- Fordham Graduate School of Social Service
- NYU Rory Meyers College of Nursing, Hartford Institute for Geriatric Nursing
- CUNY Graduate School of Public Health
- Mount Sinai Brookdale Department of Geriatrics and Palliative Medicine

### Phoenix
- Arizona State University School of Social Work
- ASU Edson College of Nursing and Health Innovation
- ASU Center for Innovation in Healthy and Resilient Aging
- Northern Arizona University Department of Occupational Therapy

### San Antonio
- UT San Antonio Department of Social Work
- UT Health San Antonio School of Nursing
- UT Health San Antonio Glenn Biggs Institute for Alzheimer's and Neurodegenerative Diseases

### San Diego
- San Diego State University School of Social Work
- SDSU Center for Healthy Aging
- University of San Diego Hahn School of Nursing
- San Diego City College Human Services programme

### Chicago
- University of Illinois Chicago Jane Addams College of Social Work
- Rush University College of Nursing
- Northwestern Buehler Center for Health Policy and Economics
- University of Chicago Crown Family School of Social Work

### Los Angeles
- UCLA Luskin School of Public Affairs, Social Welfare
- UCLA School of Nursing
- Cal State Long Beach School of Social Work
- Cal State LA School of Nursing

### Philadelphia
- Temple University School of Social Work
- Thomas Jefferson University College of Nursing
- Drexel Dornsife School of Public Health

### Houston and Dallas
- UTHealth Houston Cizik School of Nursing
- Texas Woman's University School of Occupational Therapy
- UT Southwestern School of Health Professions
- Baylor University Louise Herrington School of Nursing

### Boston
- Simmons University School of Social Work
- Boston College School of Social Work
- MGH Institute of Health Professions

### Seattle, Denver, Phoenix, Columbus, Milwaukee, Detroit, Baltimore, Buffalo, Charlotte, Memphis, Tucson
One institution contacted in each. Second candidates:

- University of Washington School of Nursing (Seattle)
- Seattle University College of Nursing (Seattle)
- Colorado State University Department of Human Development and Family Studies (Denver)
- University of Colorado Anschutz Multidisciplinary Center on Aging (Denver)
- Ohio State University College of Nursing (Columbus)
- Marquette University College of Nursing (Milwaukee)
- Wayne State University School of Social Work (Detroit)
- University of Maryland School of Nursing (Baltimore)
- University at Buffalo School of Nursing (Buffalo)
- UNC Charlotte School of Nursing (Charlotte)
- University of Tennessee Health Science Center College of Nursing (Memphis)
- University of Arizona College of Nursing (Tucson)

## Area Agencies on Aging

A different track, and one worth testing before committing a sending day to it.
There are roughly six hundred AAAs and they are closer to families than
universities are. Two of them run the kind of service our only two
AI-cited pages describe, a state Medicaid waiver and a long term care ombudsman.

The catch is that many publish a telephone number and no address at all. The
Detroit Area Agency on Aging publishes only a contracts address, which is the
wrong desk and would fail our own rule.

**They also need a template we do not have.** The two we have ask for interns and
for interviews. Neither is the right ask for an AAA, which is more likely to be
an interview subject or a link partner. Write the template before building the
list, not after.

Start with the state units on aging, which publish directories:

- Ohio Department of Aging, local office finder
- Wisconsin Bureau of Aging and Disability Resources
- Michigan Aging and Adult Services Agency
- Texas Health and Human Services, Area Agencies on Aging

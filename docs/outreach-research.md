# Building the university target list

The pipeline is built and five verified targets are in it. This is how to add
the rest, and why it is done this way rather than bought or scraped.

## The rule

Every target needs a **real email address published on a real page**, and that
page's URL recorded as `source_url`. The database enforces it: `source_url` is
`NOT NULL` and an import with a row missing it is rejected.

This is not bureaucracy. Bounces damage a young sending domain faster than
volume does, and ours also carries the lead notifications families depend on. An
invented or guessed address costs more than the contact was worth. It is also
the same standard every other fact on this site is held to.

## What counts as a fair address

**Use:** an address a department publishes for enquiries. A general one
(`swinfo@buffalo.edu`, `ioginfo@wayne.edu`) or a named programme contact listed
on that programme's own page. These exist to be written to.

**Do not use:** an address found on a research paper, a personal page, or a
staff directory not intended for enquiries. A researcher's address is for their
work, and an internship pitch to it is spam however good the offer.

## The method, which is genuinely manual

Guessing contact-page URLs does not work: universities restructure constantly
and 14 of 19 guessed URLs returned 404. What works is one institution at a time.

1. Search for the department and "contact" - gerontology, nursing, social work
   or public health, at a university in a metro we serve.
2. Open the contact page and read the address off it. Do not trust a search
   result summary; they redact addresses.
3. Record it with that page as `source_url`.

Roughly one verified address per four attempts, so a list of 200 is a few days
of steady work. It is a good first task for an intern, which is neat, because
the list is what recruits the interns.

## Priority order

Departments in the twenty cities we already have pages for, because an intern
near one of our cities can interview clinicians we already cite there. In rough
order of fit: gerontology institutes, schools of social work, nursing schools
with a gerontology track, public health programmes with an aging concentration.

## Adding them

Copy `docs/outreach-targets-example.json`, add rows, then:

    npm run outreach -- add your-file.json     # import, skips duplicates
    npm run outreach                           # funnel and today's allowance
    npm run outreach -- next                   # who to contact today, capped
    npm run outreach -- stage <email> contacted

The daily cap is enforced against the send log during warm-up, so `next` will
refuse to list more than the day allows however long the list gets.

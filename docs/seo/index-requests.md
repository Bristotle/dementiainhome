# Manual index requests

Search Console's "Request Indexing" is a UI-only action, about ten a day, that
puts a URL in a priority crawl queue. The API cannot do it. This log records
each batch so the effect can be measured against pages that were not requested,
which is the first controlled test this site has had.

Check with `npm run indexation -- --queries` and URL inspection. What to look
for: last crawl date moving, coverage changing from "unknown" or "discovered" to
"indexed", and first impressions appearing.

## 17 September 2026, 00:55 to 01:06

Requested by Emmanuel. All ten passed the live test, all showed one valid
breadcrumb item.

| URL | State before | Why |
| --- | --- | --- |
| `/` | indexed, last crawled 17 Aug | homepage retitled the same hour; zero impressions in 28 days |
| `/services` | unknown to Google | never crawled |
| `/services/personal-care` | unknown to Google | never crawled |
| `/services/memory-care-at-home` | unknown to Google | never crawled |
| `/services/hospital-discharge-care` | unknown to Google | never crawled |
| `/states/texas` | not indexed | state hubs were 0 of 5 indexed on 11 Sept |
| `/states/california` | not indexed | as above |
| `/states/new-york` | not indexed | as above |
| `/cities/houston-tx/transparent-pricing-city` | indexed, 0 impressions | retitled 15 Sept |
| `/cities/new-york-ny/transparent-pricing-city` | indexed, 0 impressions | retitled 15 Sept |

### Controls, not requested

Compare against these when reading the result. Same change, no request.

- `/services/companion-care`, `/services/respite-care` (discovered, not indexed)
- `/states/arizona` (state hub, not requested)
- `/cities/chicago-il/transparent-pricing-city`, `/cities/dallas-tx/transparent-pricing-city` (retitled, not requested)

**Correction, 23 September.** `/states/florida` was listed here as a second state
control and is a 404: there are fifteen state hubs and Florida is not one,
because none of the twenty cities is in Florida. I assumed it existed rather
than checking. The state-hub arm of the test therefore has three requested
against one valid control, not two.

### Read the result on

- **24 September**: crawl dates and coverage on all sixteen URLs above.
- **1 October**: impressions on the two requested pricing pages against the two
  controls. If the requested pair has impressions and the controls do not, the
  retitle works and the remaining eighteen are worth a request each. If neither
  has any, the title was not the reason.

## Result, 23 September

**Request Indexing works on a page Google already knows, and did nothing for
pages it had never crawled.**

State hubs, three requested: Texas, California and New York are all indexed,
crawled between 17 and 22 September. The one valid control, Arizona, is still
unknown to Google and has never been crawled.

Service pages, four requested: all four are still unknown and have never been
crawled, seven days on, while the two controls reached "discovered". Every
technical cause was eliminated: 200 status, self-referencing canonical, index
and follow, present in the sitemap with ordinary priority and lastmod, real
internal links in the served HTML, and a robots.txt that allows them. What is
left is crawl budget, and a request does not appear to override it for a URL
Google has never fetched.

Pricing pages: Houston and New York were crawled on 17 September, the day of the
request. Chicago, a control, was last crawled on 1 September. Impressions are
the measure here and are read on 1 October.

**What to take from it.** A request is worth spending on a page Google knows
about and has stopped revisiting, and on a genuinely new page linked from pages
it already crawls. It is not a way to force attention onto a URL the crawler has
decided against.

## 23 September, second batch

Requested by Emmanuel: `/statistics`, `/glossary`, three city statistics pages,
three glossary terms. Two failed and are worth recording rather than hiding:
`/states/florida` does not exist, and `/glossary/respite-car` was a mistyped URL
missing its final letter. `/glossary/respite-care` still needs requesting.

`/glossary/sundowning` and `/glossary/medicaid-waiver` were already indexed by
the time they were inspected, two days after going live. That is the fastest
anything on this site has been indexed, and both are linked from twenty guide
pages each.

## What actually gets crawled on this domain, 23 September

Three findings from the same day, which together change how to plan work here.

**New URLs are indexed within two days. Existing URLs are re-crawled in weeks.**

The glossary went live on 21 September. By the 23rd, `/glossary`, and the
sundowning, Medicaid waiver and respite care terms, were all indexed. Nothing on
this site has been indexed that fast before.

Meanwhile `/cities/houston-tx/overnight-care-city` was last crawled on 29 August
and `/cities/chicago-il/overnight-care-city` on 3 September, both indexed, both
carrying a sitemap lastmod of 23 September. The sitemap is correct and current
for every route type; it is not being acted on quickly for pages Google has
already assessed.

**So an internal link does not exist until the linking page is re-crawled.**

Contextual links from five guide templates to the national service pages were
added on 14 September. Google's copies of those guides are from August and
early September, so from its point of view those links have never existed. That
is the likeliest reason the service pages remain uncrawled despite the links,
the sitemap entries and an explicit index request on the 17th.

The glossary worked for the opposite reason: `/glossary` was a new URL, crawled
within two days, and its thirty-two outbound links were followed from a page
Google had just fetched.

**Request Indexing does not override this.** Four service pages were requested on
17 September and none had been crawled seven days later, while three state hubs
requested the same day were all indexed. The difference is that Google already
knew the state hubs.

### What this means for planning

Adding pages was the right move, not the risk I called it on Monday. On a domain
this young, a new URL is the fastest route into the index, and a new index page
pulls its children in behind it. Fifty-four pages on Monday produced four
indexed URLs within two days; nine days of internal-linking work on existing
pages has produced none, because the pages carrying those links have not been
re-fetched.

The caveat that matters: indexed is not ranked. These pages are in the index
after two days and have no impressions yet. Speed of indexing says nothing about
whether they will earn attention.

Two things follow. Where a set of pages needs discovering, give it a new index
page rather than only adding links to old ones. And the seven service pages are
the clearest candidate for a decision: they have been in the sitemap since
1 September, have never been crawled, were requested once without effect, and
compete with city guides that already rank for the same generic terms.

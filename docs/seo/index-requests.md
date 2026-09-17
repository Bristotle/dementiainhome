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
- `/states/florida`, `/states/arizona` (state hubs, not requested)
- `/cities/chicago-il/transparent-pricing-city`, `/cities/dallas-tx/transparent-pricing-city` (retitled, not requested)

### Read the result on

- **24 September**: crawl dates and coverage on all sixteen URLs above.
- **1 October**: impressions on the two requested pricing pages against the two
  controls. If the requested pair has impressions and the controls do not, the
  retitle works and the remaining eighteen are worth a request each. If neither
  has any, the title was not the reason.

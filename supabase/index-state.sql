-- Per-URL index status from Search Console, with a real third state.
--
-- pages.indexed is boolean not null default false, so "false" means either
-- "Google says not indexed" or "nobody has asked yet", and the two cannot be
-- told apart. That made the persisted results useless for the question they
-- were persisted to answer: which pages has Google not reached, and do they
-- cluster.
--
-- Run once in the Supabase SQL editor. scripts/indexation.ts writes these when
-- they exist and falls back to the boolean when they do not.

alter table pages
  add column if not exists index_state text,
  add column if not exists inspected_at timestamptz;

create index if not exists pages_index_state_idx on pages (index_state);

-- What has been checked, what it said.
create or replace view index_coverage as
select
  coalesce(index_state, 'never checked') as state,
  count(*) as pages
from pages
where published = true
group by 1
order by 2 desc;

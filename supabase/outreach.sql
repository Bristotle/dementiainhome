-- Outreach pipeline
-- Paste into the Supabase SQL editor once. Everything else is scripted.
--
-- Two stages of outreach live in one table because they are the same pipeline
-- with different targets: universities are contacted to find interns, and the
-- experts those interns interview are contacted the same way. Keeping them
-- together means one set of scripts, one report, and a single honest view of
-- where the programme is stalling.
--
-- source_url is NOT NULL on purpose. Every other fact on this site carries its
-- provenance, and an email address we cannot say where we found is exactly the
-- kind of thing that should not be in a database we are about to send from.

create table if not exists outreach_targets (
  id                 uuid primary key default gen_random_uuid(),

  -- who
  kind               text not null check (kind in ('university','expert','organisation')),
  org                text not null,
  department         text,
  contact_name       text,
  email              text not null,
  role               text,
  city               text,
  state              text,
  source_url         text not null,

  -- where they are in the pipeline
  stage              text not null default 'to_contact'
                     check (stage in ('to_contact','contacted','replied','scheduled',
                                      'recorded','published','link_live','declined','bounced')),
  stage_changed_at   timestamptz not null default now(),
  first_contacted_at timestamptz,
  replied_at         timestamptz,
  notes              text,

  -- what came out of it
  interview_url      text,
  backlink_url       text,

  created_at         timestamptz not null default now(),
  unique (email)
);

create index if not exists outreach_stage_idx on outreach_targets (stage);
create index if not exists outreach_kind_idx  on outreach_targets (kind);

-- Send log, so the daily cap during warm-up is enforced against what was
-- actually sent rather than what someone remembers sending.
create table if not exists outreach_sends (
  id          uuid primary key default gen_random_uuid(),
  target_id   uuid not null references outreach_targets(id) on delete cascade,
  template    text not null,
  sent_at     timestamptz not null default now(),
  delivered   boolean,
  provider_id text
);

create index if not exists outreach_sends_day_idx on outreach_sends (sent_at);

-- Stage counts at a glance, which is what the monthly report needs.
create or replace view outreach_funnel as
select kind, stage, count(*) as n
from outreach_targets
group by kind, stage
order by kind, stage;

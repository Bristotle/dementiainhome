-- The Florida specialist research pool.
--
-- Max's intern programme plan assigns the Florida expert database to Emmanuel.
-- This is that: dementia and elder-care specialists in Florida, for interns to
-- invite to recorded interviews.
--
-- It is deliberately separate from outreach_targets. That table is the send
-- queue: email is NOT NULL and unique, because nothing belongs in it that
-- cannot be written to. This table is the research pool, where a specialist
-- exists with a name, a phone number and no email, because that is what the
-- federal NPI registry publishes. An intern's job is to find the email and
-- record where they found it; a row without email_source_url has not been
-- verified and is not ready to contact.
--
-- Run once in the Supabase SQL editor.

create table if not exists fl_specialists (
  id                uuid primary key default gen_random_uuid(),

  -- who, from NPPES
  npi               text unique,
  full_name         text not null,
  credential        text,
  specialty         text not null,
  organisation      text,

  -- where
  address           text,
  city              text not null,
  state             text not null default 'FL',
  postal_code       text,
  phone             text,

  -- how to reach them. Both null until an intern verifies one.
  email             text,
  email_source_url  text,
  verified_by       text,
  verified_at       timestamptz,

  -- provenance of the record itself
  source_url        text not null,

  -- pipeline, mirroring outreach_targets so the two read the same way
  stage             text not null default 'unverified'
                    check (stage in ('unverified','ready','assigned','invited','declined',
                                     'scheduled','recorded','published','bad_contact')),
  stage_changed_at  timestamptz not null default now(),
  assigned_to       text,
  notes             text,

  interview_url     text,
  created_at        timestamptz not null default now()
);

create index if not exists fl_spec_stage_idx    on fl_specialists (stage);
create index if not exists fl_spec_city_idx     on fl_specialists (city);
create index if not exists fl_spec_assigned_idx on fl_specialists (assigned_to);

-- An email without a source URL is an unverified guess, and guesses bounce.
alter table fl_specialists drop constraint if exists fl_spec_email_needs_source;
alter table fl_specialists add constraint fl_spec_email_needs_source
  check (email is null or email_source_url is not null);

-- What the pool looks like at a glance.
create or replace view fl_specialist_coverage as
select city, specialty, stage, count(*) as n
from fl_specialists
group by city, specialty, stage
order by city, specialty, stage;

-- Close direct writes to leads from the public key.
--
-- The site's anon key is in every page's source, as it must be, and until now
-- it could insert into leads directly. That meant every check in
-- app/api/leads/route.ts - required fields, email shape, rate limit, honeypot -
-- could be skipped by anyone who read the key out of the page. Reads were
-- already blocked; writes were not.
--
-- The API route now inserts through the service role, which never leaves the
-- server, so the anon insert policy has no legitimate caller. Run once in the
-- Supabase SQL editor.

drop policy if exists "Allow anonymous inserts" on leads;
drop policy if exists "Enable insert for anon" on leads;
drop policy if exists "anon_insert_leads" on leads;

-- Whatever the policy was called, this lists what remains so it can be checked.
select policyname, cmd, roles from pg_policies where tablename = 'leads';

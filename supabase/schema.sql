-- Run this once in Supabase: SQL Editor -> New query -> Run.
create table if not exists public.rsvps (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  invitation_id text not null,
  guest_name text not null check (char_length(guest_name) between 1 and 120),
  phone text not null check (char_length(phone) between 7 and 20),
  attending boolean not null,
  guest_count int not null default 0 check (guest_count between 0 and 20),
  message text check (message is null or char_length(message) <= 600)
);

alter table public.rsvps enable row level security;

-- Guests (anon key) may only INSERT. No select/update/delete policy exists for
-- anon, so guest data can never be read from the public website.
drop policy if exists "guests can submit rsvp" on public.rsvps;
create policy "guests can submit rsvp"
  on public.rsvps for insert to anon
  with check (true);

-- The family reads responses from the Supabase dashboard (Table Editor),
-- which uses the project owner role and bypasses RLS.

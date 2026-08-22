-- Sanity now owns blog documents. Supabase retains only engagement data and
-- addresses posts by their stable public slug instead of a Supabase content FK.

alter table public.blog_comments add column blog_slug text;
alter table public.blog_ratings add column blog_slug text;

update public.blog_comments c
set blog_slug = p.slug
from public.blog_posts p
where p.id = c.post_id;

update public.blog_ratings r
set blog_slug = p.slug
from public.blog_posts p
where p.id = r.post_id;

alter table public.blog_comments
  alter column blog_slug set not null,
  alter column post_id drop not null,
  add constraint blog_comments_slug_format check (blog_slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$');

alter table public.blog_ratings
  alter column blog_slug set not null,
  alter column post_id drop not null,
  add constraint blog_ratings_slug_format check (blog_slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$');

alter table public.blog_ratings
  drop constraint blog_ratings_post_id_fingerprint_hash_key,
  add constraint blog_ratings_slug_fingerprint_key unique (blog_slug, fingerprint_hash);

create index blog_comments_slug_idx
  on public.blog_comments(blog_slug, status, created_at desc);

create index blog_ratings_slug_idx
  on public.blog_ratings(blog_slug);

create function public.get_approved_blog_comments_by_slug(p_blog_slug text)
returns table(id uuid, name text, body text, created_at timestamptz)
language sql stable security definer set search_path = public
as $$
  select c.id, c.name, c.body, c.created_at
  from public.blog_comments c
  where c.blog_slug = p_blog_slug
    and c.status = 'approved'
  order by c.created_at desc;
$$;

revoke all on function public.get_approved_blog_comments_by_slug(text) from public;
grant execute on function public.get_approved_blog_comments_by_slug(text) to service_role;

create function public.get_blog_rating_summary_by_slug(p_blog_slug text)
returns table(average numeric, rating_count bigint)
language sql stable security definer set search_path = public
as $$
  select coalesce(round(avg(r.rating), 2), 0), count(r.id)
  from public.blog_ratings r
  where r.blog_slug = p_blog_slug;
$$;

revoke all on function public.get_blog_rating_summary_by_slug(text) from public;
grant execute on function public.get_blog_rating_summary_by_slug(text) to service_role;

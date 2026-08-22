-- Church Govern production content, engagement, lead, and analytics model.
-- Apply with `supabase db reset` locally or through the Supabase migration workflow.

create extension if not exists pgcrypto;

create type public.app_role as enum (
  'super_admin',
  'content_editor',
  'seo_manager',
  'lead_manager',
  'moderator',
  'analyst'
);
create type public.publish_status as enum ('draft', 'scheduled', 'published', 'archived');
create type public.moderation_status as enum ('pending', 'approved', 'rejected', 'spam');
create type public.lead_status as enum ('new', 'contacted', 'qualified', 'closed', 'spam');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null check (char_length(display_name) between 2 and 100),
  role public.app_role not null default 'content_editor',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.media_assets (
  id uuid primary key default gen_random_uuid(),
  storage_path text not null unique,
  alt_text text not null check (char_length(alt_text) <= 240),
  caption text,
  mime_type text not null,
  width integer check (width is null or width > 0),
  height integer check (height is null or height > 0),
  size_bytes bigint check (size_bytes is null or size_bytes > 0),
  is_public boolean not null default false,
  uploaded_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create table public.content_pages (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  title text not null check (char_length(title) between 1 and 160),
  excerpt text,
  blocks jsonb not null default '[]'::jsonb check (jsonb_typeof(blocks) = 'array'),
  status public.publish_status not null default 'draft',
  published_at timestamptz,
  seo jsonb not null default '{}'::jsonb check (jsonb_typeof(seo) = 'object'),
  created_by uuid references public.profiles(id) on delete set null,
  updated_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (status <> 'published' or published_at is not null)
);

create table public.product_suites (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  description text not null,
  sort_order integer not null default 0,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.product_modules (
  id uuid primary key default gen_random_uuid(),
  suite_id uuid not null references public.product_suites(id) on delete restrict,
  name text not null,
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  short_description text not null check (char_length(short_description) <= 320),
  overview text not null default '',
  icon_name text,
  hero_media_id uuid references public.media_assets(id) on delete set null,
  benefits jsonb not null default '[]'::jsonb check (jsonb_typeof(benefits) = 'array'),
  features jsonb not null default '[]'::jsonb check (jsonb_typeof(features) = 'array'),
  workflow jsonb not null default '[]'::jsonb check (jsonb_typeof(workflow) = 'array'),
  seo jsonb not null default '{}'::jsonb check (jsonb_typeof(seo) = 'object'),
  sort_order integer not null default 0,
  status public.publish_status not null default 'draft',
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (suite_id, name),
  check (status <> 'published' or published_at is not null)
);

create table public.module_screenshots (
  module_id uuid not null references public.product_modules(id) on delete cascade,
  media_id uuid not null references public.media_assets(id) on delete cascade,
  sort_order integer not null default 0,
  primary key (module_id, media_id)
);

create table public.related_modules (
  module_id uuid not null references public.product_modules(id) on delete cascade,
  related_module_id uuid not null references public.product_modules(id) on delete cascade,
  sort_order integer not null default 0,
  primary key (module_id, related_module_id),
  check (module_id <> related_module_id)
);

create table public.blog_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  description text,
  created_at timestamptz not null default now()
);

create table public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.blog_categories(id) on delete set null,
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  title text not null check (char_length(title) between 1 and 180),
  excerpt text not null check (char_length(excerpt) <= 420),
  content jsonb not null default '[]'::jsonb check (jsonb_typeof(content) = 'array'),
  author_name text not null check (char_length(author_name) between 2 and 100),
  thumbnail_id uuid references public.media_assets(id) on delete set null,
  inline_media_ids uuid[] not null default '{}',
  keywords text[] not null default '{}',
  status public.publish_status not null default 'draft',
  featured boolean not null default false,
  published_at timestamptz,
  seo jsonb not null default '{}'::jsonb check (jsonb_typeof(seo) = 'object'),
  created_by uuid references public.profiles(id) on delete set null,
  updated_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (cardinality(inline_media_ids) <= 2),
  check (status <> 'published' or published_at is not null)
);

create table public.blog_tags (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$')
);

create table public.blog_post_tags (
  post_id uuid not null references public.blog_posts(id) on delete cascade,
  tag_id uuid not null references public.blog_tags(id) on delete cascade,
  primary key (post_id, tag_id)
);

create table public.blog_comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.blog_posts(id) on delete cascade,
  name text not null check (char_length(name) between 2 and 80),
  email text not null check (char_length(email) <= 254),
  body text not null check (char_length(body) between 2 and 1500),
  status public.moderation_status not null default 'pending',
  ip_hash text,
  user_agent text,
  moderated_by uuid references public.profiles(id) on delete set null,
  moderated_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.blog_ratings (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.blog_posts(id) on delete cascade,
  rating smallint not null check (rating between 1 and 5),
  fingerprint_hash text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (post_id, fingerprint_hash)
);

create table public.topic_suggestions (
  id uuid primary key default gen_random_uuid(),
  name text check (name is null or char_length(name) between 2 and 80),
  email text check (email is null or char_length(email) <= 254),
  topic text not null check (char_length(topic) between 3 and 180),
  description text not null check (char_length(description) between 10 and 1500),
  status public.moderation_status not null default 'pending',
  ip_hash text,
  created_at timestamptz not null default now()
);

create table public.faqs (
  id uuid primary key default gen_random_uuid(),
  category text not null check (category in ('Product','Pricing','Security','Digitization','Deployment','Support','Implementation')),
  question text not null check (char_length(question) between 3 and 240),
  answer text not null check (char_length(answer) between 3 and 3000),
  module_id uuid references public.product_modules(id) on delete cascade,
  sort_order integer not null default 0,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.testimonials (
  id uuid primary key default gen_random_uuid(),
  member_name text not null,
  church_name text not null,
  designation text,
  quote text not null check (char_length(quote) between 10 and 1000),
  image_id uuid references public.media_assets(id) on delete set null,
  sort_order integer not null default 0,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.galleries (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  is_published boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.gallery_items (
  gallery_id uuid not null references public.galleries(id) on delete cascade,
  media_id uuid not null references public.media_assets(id) on delete cascade,
  sort_order integer not null default 0,
  primary key (gallery_id, media_id)
);

create table public.navigation_items (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid references public.navigation_items(id) on delete cascade,
  label text not null,
  href text not null,
  location text not null default 'header' check (location in ('header','footer','utility')),
  sort_order integer not null default 0,
  is_external boolean not null default false,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.site_settings (
  key text primary key check (key ~ '^[a-z0-9_.-]+$'),
  value jsonb not null,
  description text,
  is_public boolean not null default false,
  updated_by uuid references public.profiles(id) on delete set null,
  updated_at timestamptz not null default now()
);

create table public.demo_requests (
  id uuid primary key default gen_random_uuid(),
  church_name text not null,
  denomination text not null,
  contact_person text not null,
  email text not null,
  phone text not null,
  country text not null,
  state text not null,
  district text not null,
  city text not null,
  pincode text not null,
  consent boolean not null default false check (consent),
  status public.lead_status not null default 'new',
  source text,
  utm jsonb not null default '{}'::jsonb,
  ip_hash text,
  assigned_to uuid references public.profiles(id) on delete set null,
  internal_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.digitization_requests (
  id uuid primary key default gen_random_uuid(),
  church_name text not null,
  contact_person text not null,
  email text not null,
  phone text not null,
  record_type text not null check (record_type in ('old','new','both')),
  approximate_pages integer check (approximate_pages is null or approximate_pages > 0),
  page_sizes text[] not null check (cardinality(page_sizes) > 0),
  state text not null,
  district text not null,
  location text not null,
  pincode text not null,
  comments text,
  consent boolean not null default false check (consent),
  status public.lead_status not null default 'new',
  source text,
  utm jsonb not null default '{}'::jsonb,
  ip_hash text,
  assigned_to uuid references public.profiles(id) on delete set null,
  internal_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.general_inquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 100),
  email text not null check (char_length(email) <= 254),
  phone text,
  subject text not null check (char_length(subject) between 3 and 180),
  message text not null check (char_length(message) between 10 and 3000),
  consent boolean not null default false check (consent),
  status public.lead_status not null default 'new',
  source text,
  ip_hash text,
  assigned_to uuid references public.profiles(id) on delete set null,
  internal_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.audit_events (
  id bigint generated always as identity primary key,
  actor_id uuid references auth.users(id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id text,
  old_data jsonb,
  new_data jsonb,
  created_at timestamptz not null default now()
);

create table public.analytics_rollups (
  day date not null,
  metric text not null,
  dimension text not null default 'all',
  value numeric not null default 0,
  source text not null default 'internal',
  updated_at timestamptz not null default now(),
  primary key (day, metric, dimension, source)
);

create table public.rate_limits (
  bucket text not null,
  subject_hash text not null,
  window_started_at timestamptz not null,
  request_count integer not null default 1,
  primary key (bucket, subject_hash)
);

create index content_pages_public_idx on public.content_pages(status, published_at desc);
create index product_modules_public_idx on public.product_modules(status, sort_order);
create index blog_posts_public_idx on public.blog_posts(status, published_at desc);
create index blog_posts_search_idx on public.blog_posts using gin (to_tsvector('english', title || ' ' || excerpt));
create index blog_comments_post_idx on public.blog_comments(post_id, status, created_at desc);
create index faqs_public_idx on public.faqs(is_published, category, sort_order);
create index demo_requests_status_idx on public.demo_requests(status, created_at desc);
create index digitization_requests_status_idx on public.digitization_requests(status, created_at desc);

create function public.set_updated_at() returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create function public.handle_new_auth_user() returns trigger
language plpgsql security definer set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(nullif(trim(new.raw_user_meta_data->>'display_name'), ''), split_part(new.email, '@', 1), 'Administrator')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;
create trigger create_profile_after_signup
  after insert on auth.users
  for each row execute function public.handle_new_auth_user();

do $$
declare table_name text;
begin
  foreach table_name in array array[
    'profiles','content_pages','product_suites','product_modules','blog_posts',
    'blog_ratings','faqs','testimonials','navigation_items','demo_requests',
    'digitization_requests','general_inquiries'
  ] loop
    execute format('create trigger set_%I_updated_at before update on public.%I for each row execute function public.set_updated_at()', table_name, table_name);
  end loop;
end $$;

create function public.current_app_role() returns public.app_role
language sql stable security definer set search_path = public
as $$
  select role from public.profiles where id = auth.uid() and is_active = true;
$$;

create function public.has_any_role(required_roles public.app_role[]) returns boolean
language sql stable security definer set search_path = public
as $$
  select coalesce(public.current_app_role() = any(required_roles), false);
$$;

create function public.enforce_seo_manager_scope() returns trigger
language plpgsql set search_path = public
as $$
begin
  if public.current_app_role() = 'seo_manager' then
    if (to_jsonb(new) - array['seo','slug','updated_at','updated_by'])
       is distinct from (to_jsonb(old) - array['seo','slug','updated_at','updated_by']) then
      raise exception 'SEO managers may only update slug and SEO metadata';
    end if;
  end if;
  return new;
end;
$$;
create trigger enforce_pages_seo_scope before update on public.content_pages
  for each row execute function public.enforce_seo_manager_scope();
create trigger enforce_modules_seo_scope before update on public.product_modules
  for each row execute function public.enforce_seo_manager_scope();
create trigger enforce_blogs_seo_scope before update on public.blog_posts
  for each row execute function public.enforce_seo_manager_scope();

create function public.record_audit_event() returns trigger
language plpgsql security definer set search_path = public
as $$
begin
  insert into public.audit_events(actor_id, action, entity_type, entity_id, old_data, new_data)
  values (
    auth.uid(), lower(tg_op), tg_table_name,
    coalesce(to_jsonb(new)->>'id', to_jsonb(old)->>'id', to_jsonb(new)->>'key', to_jsonb(old)->>'key'),
    case
      when tg_table_name in ('demo_requests','digitization_requests','general_inquiries','blog_comments','topic_suggestions') then null
      when tg_op in ('UPDATE','DELETE') then to_jsonb(old)
    end,
    case
      when tg_table_name in ('demo_requests','digitization_requests','general_inquiries','blog_comments','topic_suggestions') then null
      when tg_op in ('INSERT','UPDATE') then to_jsonb(new)
    end
  );
  return coalesce(new, old);
end;
$$;

do $$
declare table_name text;
begin
  foreach table_name in array array[
    'content_pages','product_suites','product_modules','blog_posts','faqs',
    'testimonials','navigation_items','site_settings','demo_requests',
    'digitization_requests','general_inquiries','blog_comments','topic_suggestions'
  ] loop
    execute format('create trigger audit_%I after insert or update or delete on public.%I for each row execute function public.record_audit_event()', table_name, table_name);
  end loop;
end $$;

create function public.consume_rate_limit(
  p_bucket text,
  p_subject_hash text,
  p_limit integer,
  p_window_seconds integer
) returns boolean
language plpgsql security definer set search_path = public
as $$
declare allowed boolean;
begin
  if p_limit < 1 or p_window_seconds < 1 or char_length(p_subject_hash) < 16 then
    return false;
  end if;
  insert into public.rate_limits(bucket, subject_hash, window_started_at, request_count)
  values (p_bucket, p_subject_hash, now(), 1)
  on conflict (bucket, subject_hash) do update
    set window_started_at = case
          when public.rate_limits.window_started_at < now() - make_interval(secs => p_window_seconds) then now()
          else public.rate_limits.window_started_at
        end,
        request_count = case
          when public.rate_limits.window_started_at < now() - make_interval(secs => p_window_seconds) then 1
          else public.rate_limits.request_count + 1
        end
  returning request_count <= p_limit into allowed;
  return allowed;
end;
$$;

revoke all on function public.consume_rate_limit(text,text,integer,integer) from public;
grant execute on function public.consume_rate_limit(text,text,integer,integer) to service_role;

create function public.get_approved_blog_comments(p_post_id uuid)
returns table(id uuid, name text, body text, created_at timestamptz)
language sql stable security definer set search_path = public
as $$
  select c.id, c.name, c.body, c.created_at
  from public.blog_comments c
  join public.blog_posts p on p.id = c.post_id
  where c.post_id = p_post_id
    and c.status = 'approved'
    and p.status = 'published'
    and p.published_at <= now()
  order by c.created_at desc;
$$;
revoke all on function public.get_approved_blog_comments(uuid) from public;
grant execute on function public.get_approved_blog_comments(uuid) to anon, authenticated;

create function public.get_blog_rating_summary(p_post_id uuid)
returns table(average numeric, rating_count bigint)
language sql stable security definer set search_path = public
as $$
  select coalesce(round(avg(r.rating), 2), 0), count(r.id)
  from public.blog_ratings r
  join public.blog_posts p on p.id = r.post_id
  where r.post_id = p_post_id
    and p.status = 'published'
    and p.published_at <= now();
$$;
revoke all on function public.get_blog_rating_summary(uuid) from public;
grant execute on function public.get_blog_rating_summary(uuid) to anon, authenticated;

-- RLS: public users only see published content; CMS capabilities are role scoped.
do $$
declare table_name text;
begin
  foreach table_name in array array[
    'profiles','media_assets','content_pages','product_suites','product_modules',
    'module_screenshots','related_modules','blog_categories','blog_posts','blog_tags',
    'blog_post_tags','blog_comments','blog_ratings','topic_suggestions','faqs',
    'testimonials','galleries','gallery_items','navigation_items','site_settings',
    'demo_requests','digitization_requests','general_inquiries','audit_events','analytics_rollups','rate_limits'
  ] loop
    execute format('alter table public.%I enable row level security', table_name);
  end loop;
end $$;

create policy profiles_self_read on public.profiles for select to authenticated using (id = auth.uid());
create policy profiles_super_admin_all on public.profiles for all to authenticated
  using (public.has_any_role(array['super_admin']::public.app_role[]))
  with check (public.has_any_role(array['super_admin']::public.app_role[]));

create policy media_public_read on public.media_assets for select using (is_public);
create policy media_editor_write on public.media_assets for all to authenticated
  using (public.has_any_role(array['super_admin','content_editor']::public.app_role[]))
  with check (public.has_any_role(array['super_admin','content_editor']::public.app_role[]));

create policy pages_public_read on public.content_pages for select using (status = 'published' and published_at <= now());
create policy pages_editor_write on public.content_pages for all to authenticated
  using (public.has_any_role(array['super_admin','content_editor']::public.app_role[]))
  with check (public.has_any_role(array['super_admin','content_editor']::public.app_role[]));
create policy pages_seo_update on public.content_pages for update to authenticated
  using (public.has_any_role(array['seo_manager']::public.app_role[]))
  with check (public.has_any_role(array['seo_manager']::public.app_role[]));

create policy suites_public_read on public.product_suites for select using (is_published);
create policy suites_editor_write on public.product_suites for all to authenticated
  using (public.has_any_role(array['super_admin','content_editor']::public.app_role[]))
  with check (public.has_any_role(array['super_admin','content_editor']::public.app_role[]));
create policy modules_public_read on public.product_modules for select using (status = 'published' and published_at <= now());
create policy modules_editor_write on public.product_modules for all to authenticated
  using (public.has_any_role(array['super_admin','content_editor']::public.app_role[]))
  with check (public.has_any_role(array['super_admin','content_editor']::public.app_role[]));
create policy modules_seo_update on public.product_modules for update to authenticated
  using (public.has_any_role(array['seo_manager']::public.app_role[]))
  with check (public.has_any_role(array['seo_manager']::public.app_role[]));

create policy module_screens_public_read on public.module_screenshots for select using (
  exists (select 1 from public.product_modules m where m.id = module_id and m.status = 'published' and m.published_at <= now())
);
create policy module_screens_editor_write on public.module_screenshots for all to authenticated
  using (public.has_any_role(array['super_admin','content_editor']::public.app_role[]))
  with check (public.has_any_role(array['super_admin','content_editor']::public.app_role[]));
create policy related_modules_public_read on public.related_modules for select using (
  exists (select 1 from public.product_modules m where m.id = module_id and m.status = 'published' and m.published_at <= now())
  and exists (select 1 from public.product_modules m where m.id = related_module_id and m.status = 'published' and m.published_at <= now())
);
create policy related_modules_editor_write on public.related_modules for all to authenticated
  using (public.has_any_role(array['super_admin','content_editor']::public.app_role[]))
  with check (public.has_any_role(array['super_admin','content_editor']::public.app_role[]));

create policy blog_taxonomy_public_read on public.blog_categories for select using (
  exists (select 1 from public.blog_posts p where p.category_id = id and p.status = 'published' and p.published_at <= now())
);
create policy blog_taxonomy_editor_write on public.blog_categories for all to authenticated
  using (public.has_any_role(array['super_admin','content_editor','seo_manager']::public.app_role[]))
  with check (public.has_any_role(array['super_admin','content_editor','seo_manager']::public.app_role[]));
create policy blog_tags_public_read on public.blog_tags for select using (
  exists (
    select 1 from public.blog_post_tags pt
    join public.blog_posts p on p.id = pt.post_id
    where pt.tag_id = id and p.status = 'published' and p.published_at <= now()
  )
);
create policy blog_tags_editor_write on public.blog_tags for all to authenticated
  using (public.has_any_role(array['super_admin','content_editor','seo_manager']::public.app_role[]))
  with check (public.has_any_role(array['super_admin','content_editor','seo_manager']::public.app_role[]));
create policy blog_posts_public_read on public.blog_posts for select using (status = 'published' and published_at <= now());
create policy blog_posts_editor_write on public.blog_posts for all to authenticated
  using (public.has_any_role(array['super_admin','content_editor']::public.app_role[]))
  with check (public.has_any_role(array['super_admin','content_editor']::public.app_role[]));
create policy blog_posts_seo_update on public.blog_posts for update to authenticated
  using (public.has_any_role(array['seo_manager']::public.app_role[]))
  with check (public.has_any_role(array['seo_manager']::public.app_role[]));
create policy blog_post_tags_public_read on public.blog_post_tags for select using (
  exists (select 1 from public.blog_posts p where p.id = post_id and p.status = 'published' and p.published_at <= now())
);
create policy blog_post_tags_editor_write on public.blog_post_tags for all to authenticated
  using (public.has_any_role(array['super_admin','content_editor','seo_manager']::public.app_role[]))
  with check (public.has_any_role(array['super_admin','content_editor','seo_manager']::public.app_role[]));

create policy comments_moderator_read on public.blog_comments for select to authenticated
  using (public.has_any_role(array['super_admin','moderator']::public.app_role[]));
create policy comments_moderator_update on public.blog_comments for update to authenticated
  using (public.has_any_role(array['super_admin','moderator']::public.app_role[]))
  with check (public.has_any_role(array['super_admin','moderator']::public.app_role[]));
create policy comments_super_delete on public.blog_comments for delete to authenticated
  using (public.has_any_role(array['super_admin']::public.app_role[]));
create policy suggestions_moderator_read on public.topic_suggestions for select to authenticated
  using (public.has_any_role(array['super_admin','content_editor','moderator']::public.app_role[]));
create policy suggestions_moderator_update on public.topic_suggestions for update to authenticated
  using (public.has_any_role(array['super_admin','content_editor','moderator']::public.app_role[]))
  with check (public.has_any_role(array['super_admin','content_editor','moderator']::public.app_role[]));
create policy suggestions_super_delete on public.topic_suggestions for delete to authenticated
  using (public.has_any_role(array['super_admin']::public.app_role[]));

create policy faqs_public_read on public.faqs for select using (is_published);
create policy faqs_editor_write on public.faqs for all to authenticated
  using (public.has_any_role(array['super_admin','content_editor']::public.app_role[]))
  with check (public.has_any_role(array['super_admin','content_editor']::public.app_role[]));
create policy testimonials_public_read on public.testimonials for select using (is_published);
create policy testimonials_editor_write on public.testimonials for all to authenticated
  using (public.has_any_role(array['super_admin','content_editor']::public.app_role[]))
  with check (public.has_any_role(array['super_admin','content_editor']::public.app_role[]));
create policy galleries_public_read on public.galleries for select using (is_published);
create policy galleries_editor_write on public.galleries for all to authenticated
  using (public.has_any_role(array['super_admin','content_editor']::public.app_role[]))
  with check (public.has_any_role(array['super_admin','content_editor']::public.app_role[]));
create policy gallery_items_public_read on public.gallery_items for select using (true);
create policy gallery_items_editor_write on public.gallery_items for all to authenticated
  using (public.has_any_role(array['super_admin','content_editor']::public.app_role[]))
  with check (public.has_any_role(array['super_admin','content_editor']::public.app_role[]));

create policy nav_public_read on public.navigation_items for select using (is_published);
create policy nav_editor_write on public.navigation_items for all to authenticated
  using (public.has_any_role(array['super_admin','content_editor']::public.app_role[]))
  with check (public.has_any_role(array['super_admin','content_editor']::public.app_role[]));
create policy settings_public_read on public.site_settings for select using (is_public);
create policy settings_editor_write on public.site_settings for all to authenticated
  using (public.has_any_role(array['super_admin','content_editor','seo_manager']::public.app_role[]))
  with check (public.has_any_role(array['super_admin','content_editor','seo_manager']::public.app_role[]));

create policy demo_lead_read on public.demo_requests for select to authenticated
  using (public.has_any_role(array['super_admin','lead_manager']::public.app_role[]));
create policy demo_lead_update on public.demo_requests for update to authenticated
  using (public.has_any_role(array['super_admin','lead_manager']::public.app_role[]))
  with check (public.has_any_role(array['super_admin','lead_manager']::public.app_role[]));
create policy demo_lead_delete on public.demo_requests for delete to authenticated
  using (public.has_any_role(array['super_admin']::public.app_role[]));
create policy digitization_lead_read on public.digitization_requests for select to authenticated
  using (public.has_any_role(array['super_admin','lead_manager']::public.app_role[]));
create policy digitization_lead_update on public.digitization_requests for update to authenticated
  using (public.has_any_role(array['super_admin','lead_manager']::public.app_role[]))
  with check (public.has_any_role(array['super_admin','lead_manager']::public.app_role[]));
create policy digitization_lead_delete on public.digitization_requests for delete to authenticated
  using (public.has_any_role(array['super_admin']::public.app_role[]));
create policy inquiries_lead_read on public.general_inquiries for select to authenticated
  using (public.has_any_role(array['super_admin','lead_manager']::public.app_role[]));
create policy inquiries_lead_update on public.general_inquiries for update to authenticated
  using (public.has_any_role(array['super_admin','lead_manager']::public.app_role[]))
  with check (public.has_any_role(array['super_admin','lead_manager']::public.app_role[]));
create policy inquiries_lead_delete on public.general_inquiries for delete to authenticated
  using (public.has_any_role(array['super_admin']::public.app_role[]));

create policy audit_authorized_read on public.audit_events for select to authenticated
  using (public.has_any_role(array['super_admin','analyst']::public.app_role[]));
create policy analytics_authorized_read on public.analytics_rollups for select to authenticated
  using (public.has_any_role(array['super_admin','analyst']::public.app_role[]));
create policy analytics_super_write on public.analytics_rollups for all to authenticated
  using (public.has_any_role(array['super_admin']::public.app_role[]))
  with check (public.has_any_role(array['super_admin']::public.app_role[]));

-- Draft uploads are private. Publishing deliberately copies assets to the public bucket.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('site-media-private', 'site-media-private', false, 10485760, array['image/jpeg','image/png','image/webp','image/avif']),
  ('site-media-public', 'site-media-public', true, 10485760, array['image/jpeg','image/png','image/webp','image/avif'])
on conflict (id) do nothing;
create policy site_media_public_read on storage.objects for select using (bucket_id = 'site-media-public');
create policy site_media_private_admin_read on storage.objects for select to authenticated
  using (bucket_id = 'site-media-private' and public.has_any_role(array['super_admin','content_editor']::public.app_role[]));
create policy site_media_admin_insert on storage.objects for insert to authenticated
  with check (
    (bucket_id = 'site-media-private' and public.has_any_role(array['super_admin','content_editor']::public.app_role[]))
    or (bucket_id = 'site-media-public' and public.has_any_role(array['super_admin']::public.app_role[]))
  );
create policy site_media_admin_update on storage.objects for update to authenticated
  using (
    (bucket_id = 'site-media-private' and public.has_any_role(array['super_admin','content_editor']::public.app_role[]))
    or (bucket_id = 'site-media-public' and public.has_any_role(array['super_admin']::public.app_role[]))
  )
  with check (
    (bucket_id = 'site-media-private' and public.has_any_role(array['super_admin','content_editor']::public.app_role[]))
    or (bucket_id = 'site-media-public' and public.has_any_role(array['super_admin']::public.app_role[]))
  );
create policy site_media_admin_delete on storage.objects for delete to authenticated
  using (
    (bucket_id = 'site-media-private' and public.has_any_role(array['super_admin','content_editor']::public.app_role[]))
    or (bucket_id = 'site-media-public' and public.has_any_role(array['super_admin']::public.app_role[]))
  );

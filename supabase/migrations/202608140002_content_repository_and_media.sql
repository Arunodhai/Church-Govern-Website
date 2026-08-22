-- Complete the typed public content and managed-media model.
-- This migration is additive because 202608140001 has already been applied.

alter table public.media_assets
  add column bucket_id text not null default 'site-media-private'
    check (bucket_id in ('site-media-private', 'site-media-public')),
  add column title text,
  add column original_filename text,
  add column updated_at timestamptz not null default now(),
  add constraint media_public_bucket_consistency
    check (not is_public or bucket_id = 'site-media-public');

alter table public.product_modules
  add column eyebrow text not null default '',
  add column related_slugs text[] not null default '{}';

alter table public.blog_posts
  add column read_time_minutes integer not null default 5
    check (read_time_minutes between 1 and 120);

alter table public.galleries
  add column description text,
  add column updated_at timestamptz not null default now();

create trigger set_media_assets_updated_at before update on public.media_assets
  for each row execute function public.set_updated_at();
create trigger set_galleries_updated_at before update on public.galleries
  for each row execute function public.set_updated_at();

drop policy if exists media_public_read on public.media_assets;
create policy media_public_read on public.media_assets for select
  using (is_public and bucket_id = 'site-media-public');

drop policy if exists gallery_items_public_read on public.gallery_items;
create policy gallery_items_public_read on public.gallery_items for select using (
  exists (
    select 1 from public.galleries gallery
    where gallery.id = gallery_id and gallery.is_published
  )
  and exists (
    select 1 from public.media_assets asset
    where asset.id = media_id
      and asset.is_public
      and asset.bucket_id = 'site-media-public'
  )
);

create index if not exists media_assets_public_idx
  on public.media_assets(is_public, bucket_id, created_at desc);
create index if not exists navigation_items_public_idx
  on public.navigation_items(location, is_published, sort_order);
create unique index if not exists navigation_items_location_href_key
  on public.navigation_items(location, href);
create unique index if not exists faqs_question_key on public.faqs(question);
create index if not exists galleries_public_idx
  on public.galleries(is_published, slug);

comment on column public.product_modules.related_slugs is
  'Editor-friendly related module slugs; normalized related_modules remains supported for gallery/workflow compatibility.';
comment on column public.media_assets.bucket_id is
  'Storage bucket containing the object. Published metadata must point to the public bucket.';

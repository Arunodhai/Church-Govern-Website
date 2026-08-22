-- Supabase projects may grant execute on newly created public-schema functions
-- directly to anon/authenticated through default privileges. The earlier PUBLIC
-- revoke does not remove those direct grants, so enforce the intended server-only
-- API boundary explicitly.

revoke all on function public.get_approved_blog_comments_by_slug(text) from anon, authenticated;
revoke all on function public.get_blog_rating_summary_by_slug(text) from anon, authenticated;

grant execute on function public.get_approved_blog_comments_by_slug(text) to service_role;
grant execute on function public.get_blog_rating_summary_by_slug(text) to service_role;

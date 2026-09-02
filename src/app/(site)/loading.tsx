export default function SiteLoading() {
  return (
    <div className="site-loading" role="status" aria-live="polite" aria-label="Loading page">
      <div className="shell site-loading__hero">
        <div>
          <span className="site-loading__line site-loading__line--eyebrow" />
          <span className="site-loading__line site-loading__line--title" />
          <span className="site-loading__line site-loading__line--title-short" />
          <span className="site-loading__line site-loading__line--body" />
          <span className="site-loading__line site-loading__line--body-short" />
        </div>
        <span className="site-loading__visual" />
      </div>
      <span className="sr-only">Loading page content…</span>
    </div>
  );
}

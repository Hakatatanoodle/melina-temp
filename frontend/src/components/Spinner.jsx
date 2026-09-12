export function Spinner({ dark }) {
  return <span className={`spinner${dark ? ' spinner--dark' : ''}`} aria-hidden="true" />;
}

/** Full-page (or large-area) loading state. */
export function PageLoader({ label = 'Loading…' }) {
  return (
    <div className="page-loader" role="status">
      <Spinner dark />
      <span>{label}</span>
    </div>
  );
}

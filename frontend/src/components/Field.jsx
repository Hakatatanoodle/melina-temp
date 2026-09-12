/** Labeled form field with optional error and hint. */
export default function Field({ label, htmlFor, error, hint, children, optional, className }) {
  return (
    <div className={`field${error ? ' field--error' : ''}${className ? ` ${className}` : ''}`}>
      {label && (
        <label className="field__label" htmlFor={htmlFor}>
          {label} {optional && <small>(optional)</small>}
        </label>
      )}
      {children}
      {error && (
        <p className="field__error" role="alert">
          {error}
        </p>
      )}
      {!error && hint && <p className="field__hint">{hint}</p>}
    </div>
  );
}

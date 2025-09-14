type SpinnerProps = {
  size?: number;          
  className?: string;     
  label?: string;         
};

export default function Spinner({ size = 20, className = "", label }: SpinnerProps) {
  const s = Math.max(10, size);
  return (
    <div className={`inline-flex items-center gap-2 ${className}`} role="status" aria-live="polite">
      <span
        className="inline-block animate-spin rounded-full border-2 border-current/30 border-t-transparent"
        style={{ width: s, height: s }}
        aria-hidden="true"
      />
      {label ? <span className="text-sm text-black/70">{label}</span> : null}
    </div>
  );
}

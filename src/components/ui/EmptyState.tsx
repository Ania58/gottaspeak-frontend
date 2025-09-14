import type { ReactNode } from "react";

type EmptyStateProps = {
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;       
  className?: string;
};

export default function EmptyState({ title, description, action, className = "" }: EmptyStateProps) {
  return (
    <div
      className={`rounded-2xl border bg-gradient-to-b from-lime-50/60 via-cyan-50/50 to-violet-50/60 p-6 text-center ${className}`}
    >
      <div className="mx-auto h-1 w-24 rounded-full bg-gradient-to-r from-lime-400 via-cyan-400 to-violet-400" />
      <h3 className="mt-3 text-lg font-medium">{title}</h3>
      {description ? <p className="mt-1 text-sm text-black/70">{description}</p> : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}

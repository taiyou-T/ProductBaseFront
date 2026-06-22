import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

type BillingPlanCardProps = {
  audience: string;
  name: string;
  price: string;
  summary: string;
  features: readonly string[];
  isActive?: boolean;
  activeBadge?: string;
  note?: string;
  action?: {
    label: string;
    disabled?: boolean;
    loading?: boolean;
    onClick: () => void;
  };
  footer?: string;
};

export function BillingPlanCard({
  audience,
  name,
  price,
  summary,
  features,
  isActive = false,
  activeBadge,
  note,
  action,
  footer,
}: BillingPlanCardProps) {
  return (
    <div
      className={`rounded-xl border p-5 ${
        isActive
          ? "border-green-300 bg-green-50/50 dark:border-green-800 dark:bg-green-950/20"
          : "border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900"
      }`}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium uppercase tracking-wide text-indigo-600 dark:text-indigo-400">
            {audience}
          </p>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-semibold">{name}</h3>
            {isActive && activeBadge && <Badge variant="success">{activeBadge}</Badge>}
          </div>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{summary}</p>
          {note && (
            <p className="mt-2 text-xs text-amber-700 dark:text-amber-300">{note}</p>
          )}
        </div>
        <p className="shrink-0 text-lg font-bold text-indigo-600 dark:text-indigo-400">{price}</p>
      </div>

      <ul className="mt-4 space-y-2 border-t border-zinc-200 pt-4 dark:border-zinc-800">
        {features.map((feature) => (
          <li key={feature} className="flex gap-2 text-sm text-zinc-700 dark:text-zinc-300">
            <span className="mt-0.5 text-indigo-500" aria-hidden>
              ✓
            </span>
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      {footer && (
        <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">{footer}</p>
      )}

      {action && (
        <Button
          type="button"
          className="mt-4"
          disabled={action.disabled}
          onClick={action.onClick}
        >
          {action.loading ? "リダイレクト中..." : action.label}
        </Button>
      )}
    </div>
  );
}

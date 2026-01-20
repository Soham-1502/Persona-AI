// components/dashboard/MetricCard.jsx
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function MetricCard({
  icon: Icon,
  label,
  value,
  subtitle,
  badgeText,
  badgeTone = "positive",
  className,
}) {

  // Mappings for Subtitle
  const selectedDate = {
    today : "Today",
    last7 : "This Week",
    last30 : "This Month"
  }

  return (
    <Card
      className={cn(
        "h-45 w-full rounded-2xl bg-card cursor-pointer",
        "dark:bg-card dark:text-card-foreground",
        "flex flex-col justify-between px-6 py-4 gap-3",
        className
      )}
    >
      {/* top row: icon + badge */}
      <div className="flex items-start justify-between">
        <div className="w-10 h-10 rounded-2xl border bg-persona-purple/10 text-persona-purple flex items-center justify-center">
          <Icon className="w-5 h-5" />
        </div>
        {badgeText && (
          <span
            className={cn(
              "px-3 py-1 rounded-full text-[12px] font-semibold",
              "bg-emerald-50 text-emerald-600",
              badgeTone === "neutral" && "bg-slate-100 text-slate-600",
              badgeTone === "negative" && "bg-rose-50 text-rose-600"
            )}
          >
            {badgeText}
          </span>
        )}
      </div>

      {/* bottom: value + labels */}
      <div>
        <div className="text-4xl font-extrabold tracking-tight text-persona-ink">
          {value}
        </div>
        <div className="mt-1 text-md font-semibold text-persona-ink/80">
          {label}
        </div>
        <div className="text-sm text-persona-ink/45">{selectedDate[subtitle]}</div>
      </div>
    </Card>
  );
}
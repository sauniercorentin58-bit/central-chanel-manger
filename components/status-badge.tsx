import { cn } from "@/lib/utils";

type Status = "todo" | "in_progress" | "done";

const statusLabel: Record<Status, string> = {
  todo: "À faire",
  in_progress: "En cours",
  done: "Terminé"
};

const statusClass: Record<Status, string> = {
  todo: "bg-amber-100 text-amber-700",
  in_progress: "bg-sky-100 text-sky-700",
  done: "bg-emerald-100 text-emerald-700"
};

export function StatusBadge({ status }: { status: Status }) {
  return <span className={cn("rounded-full px-2 py-1 text-xs font-medium", statusClass[status])}>{statusLabel[status]}</span>;
}

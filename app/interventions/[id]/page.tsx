import Link from "next/link";
import { notFound } from "next/navigation";
import { toggleChecklistItem, updateInterventionStatus } from "@/app/actions";
import { Header } from "@/components/header";
import { StatusBadge } from "@/components/status-badge";
import { createClient } from "@/lib/supabase/server";

export default async function InterventionDetailsPage({ params }: { params: { id: string } }) {
  const supabase = await createClient();

  const { data: intervention } = await supabase
    .from("interventions")
    .select("id, cleaner_name, scheduled_for, status, notes, properties(name)")
    .eq("id", params.id)
    .single();

  if (!intervention) notFound();

  const { data: checklist } = await supabase
    .from("checklist_items")
    .select("id, label, completed")
    .eq("intervention_id", intervention.id)
    .order("order_index", { ascending: true });

  const doneItems = checklist?.filter((item) => item.completed).length ?? 0;

  return (
    <div>
      <Header />
      <main className="mx-auto max-w-4xl space-y-6 px-4 py-8">
        <Link href="/interventions" className="text-sm text-brand-600 hover:text-brand-700">
          ← Retour aux interventions
        </Link>

        <section className="rounded-xl bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold">{(intervention.properties as { name?: string } | null)?.name ?? "Intervention"}</h2>
              <p className="text-sm text-slate-600">
                {new Date(intervention.scheduled_for).toLocaleString("fr-FR")} • {intervention.cleaner_name}
              </p>
              {intervention.notes ? <p className="mt-2 text-sm text-slate-700">{intervention.notes}</p> : null}
            </div>
            <StatusBadge status={intervention.status} />
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
            <p className="text-sm text-slate-600">
              Progression: {doneItems}/{checklist?.length ?? 0} tâches
            </p>
            <form action={updateInterventionStatus} className="flex items-center gap-2">
              <input type="hidden" name="intervention_id" value={intervention.id} />
              <select name="status" defaultValue={intervention.status}>
                <option value="todo">À faire</option>
                <option value="in_progress">En cours</option>
                <option value="done">Terminé</option>
              </select>
              <button className="rounded-lg border border-slate-300 px-3 py-2 text-sm hover:bg-slate-50">Mettre à jour</button>
            </form>
          </div>
        </section>

        <section className="rounded-xl bg-white p-5 shadow-sm">
          <h3 className="text-lg font-semibold">Checklist</h3>
          <div className="mt-3 space-y-2">
            {checklist?.map((item) => (
              <form action={toggleChecklistItem} key={item.id} className="flex items-center justify-between rounded-lg border border-slate-200 p-3">
                <p className={item.completed ? "text-slate-400 line-through" : "text-slate-700"}>{item.label}</p>
                <div className="flex items-center gap-2">
                  <input type="hidden" name="item_id" value={item.id} />
                  <input type="hidden" name="intervention_id" value={intervention.id} />
                  <input type="hidden" name="completed" value={item.completed ? "false" : "true"} />
                  <button className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-50">
                    {item.completed ? "Décocher" : "Cocher"}
                  </button>
                </div>
              </form>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

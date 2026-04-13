import { Header } from "@/components/header";
import { StatusBadge } from "@/components/status-badge";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();

  const [{ count: propertiesCount }, { count: interventionsCount }, { count: doneCount }, { data: nextInterventions }] = await Promise.all([
    supabase.from("properties").select("id", { count: "exact", head: true }),
    supabase.from("interventions").select("id", { count: "exact", head: true }),
    supabase.from("interventions").select("id", { count: "exact", head: true }).eq("status", "done"),
    supabase
      .from("interventions")
      .select("id, cleaner_name, scheduled_for, status, properties(name)")
      .order("scheduled_for", { ascending: true })
      .limit(5)
  ]);

  return (
    <div>
      <Header />
      <main className="mx-auto max-w-6xl space-y-8 px-4 py-8">
        <section className="grid gap-4 md:grid-cols-3">
          <article className="rounded-xl bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Biens</p>
            <p className="mt-2 text-3xl font-bold">{propertiesCount ?? 0}</p>
          </article>
          <article className="rounded-xl bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Interventions totales</p>
            <p className="mt-2 text-3xl font-bold">{interventionsCount ?? 0}</p>
          </article>
          <article className="rounded-xl bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Interventions terminées</p>
            <p className="mt-2 text-3xl font-bold">{doneCount ?? 0}</p>
          </article>
        </section>

        <section className="rounded-xl bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold">Prochaines interventions</h2>
          <div className="mt-4 space-y-3">
            {nextInterventions?.map((intervention) => (
              <div key={intervention.id} className="flex items-center justify-between rounded-lg border border-slate-200 p-3">
                <div>
                  <p className="font-medium">{(intervention.properties as { name?: string } | null)?.name ?? "Bien"}</p>
                  <p className="text-sm text-slate-600">
                    {new Date(intervention.scheduled_for).toLocaleDateString("fr-FR")} • {intervention.cleaner_name}
                  </p>
                </div>
                <StatusBadge status={intervention.status} />
              </div>
            ))}
            {!nextInterventions?.length ? <p className="text-sm text-slate-500">Aucune intervention planifiée.</p> : null}
          </div>
        </section>
      </main>
    </div>
  );
}

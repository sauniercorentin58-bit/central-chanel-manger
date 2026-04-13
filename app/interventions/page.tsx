import Link from "next/link";
import { createIntervention, updateInterventionStatus } from "@/app/actions";
import { Header } from "@/components/header";
import { StatusBadge } from "@/components/status-badge";
import { createClient } from "@/lib/supabase/server";

export default async function InterventionsPage() {
  const supabase = await createClient();
  const [{ data: properties }, { data: interventions }] = await Promise.all([
    supabase.from("properties").select("id, name").order("name"),
    supabase
      .from("interventions")
      .select("id, cleaner_name, scheduled_for, status, properties(name)")
      .order("scheduled_for", { ascending: false })
  ]);

  return (
    <div>
      <Header />
      <main className="mx-auto grid max-w-6xl gap-8 px-4 py-8 md:grid-cols-[380px_1fr]">
        <section className="rounded-xl bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold">Créer une intervention</h2>
          <form action={createIntervention} className="mt-4 space-y-3">
            <div className="space-y-1">
              <label className="text-sm">Bien</label>
              <select name="property_id" required defaultValue="">
                <option value="" disabled>
                  Sélectionner un bien
                </option>
                {properties?.map((property) => (
                  <option key={property.id} value={property.id}>
                    {property.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-sm">Agent de ménage</label>
              <input name="cleaner_name" required placeholder="Sofia" />
            </div>
            <div className="space-y-1">
              <label className="text-sm">Date prévue</label>
              <input name="scheduled_for" type="datetime-local" required />
            </div>
            <div className="space-y-1">
              <label className="text-sm">Notes</label>
              <textarea name="notes" rows={3} placeholder="Instructions spécifiques..." />
            </div>
            <button className="rounded-lg bg-brand-600 px-4 py-2 text-white hover:bg-brand-700">Créer l'intervention</button>
          </form>
        </section>

        <section className="rounded-xl bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold">Interventions</h2>
          <div className="mt-4 space-y-3">
            {interventions?.map((intervention) => (
              <article key={intervention.id} className="rounded-lg border border-slate-200 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-medium">{(intervention.properties as { name?: string } | null)?.name ?? "Bien"}</p>
                    <p className="text-sm text-slate-600">
                      {new Date(intervention.scheduled_for).toLocaleString("fr-FR")} • {intervention.cleaner_name}
                    </p>
                  </div>
                  <StatusBadge status={intervention.status} />
                </div>
                <div className="mt-3 flex items-center justify-between gap-3">
                  <form action={updateInterventionStatus} className="flex items-center gap-2">
                    <input type="hidden" name="intervention_id" value={intervention.id} />
                    <select name="status" defaultValue={intervention.status}>
                      <option value="todo">À faire</option>
                      <option value="in_progress">En cours</option>
                      <option value="done">Terminé</option>
                    </select>
                    <button className="rounded-lg border border-slate-300 px-3 py-2 text-sm hover:bg-slate-50">Mettre à jour</button>
                  </form>
                  <Link href={`/interventions/${intervention.id}`} className="text-sm text-brand-600 hover:text-brand-700">
                    Ouvrir checklist →
                  </Link>
                </div>
              </article>
            ))}
            {!interventions?.length ? <p className="text-sm text-slate-500">Aucune intervention enregistrée.</p> : null}
          </div>
        </section>
      </main>
    </div>
  );
}

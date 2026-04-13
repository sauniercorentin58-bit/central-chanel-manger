import { Header } from "@/components/header";
import { StatusBadge } from "@/components/status-badge";
import { createClient } from "@/lib/supabase/server";

export default async function HistoryPage() {
  const supabase = await createClient();
  const { data: interventions } = await supabase
    .from("interventions")
    .select("id, cleaner_name, scheduled_for, status, properties(name)")
    .order("scheduled_for", { ascending: false });

  return (
    <div>
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <section className="rounded-xl bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold">Historique des interventions</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500">
                  <th className="px-2 py-2 font-medium">Bien</th>
                  <th className="px-2 py-2 font-medium">Date</th>
                  <th className="px-2 py-2 font-medium">Agent</th>
                  <th className="px-2 py-2 font-medium">Statut</th>
                </tr>
              </thead>
              <tbody>
                {interventions?.map((intervention) => (
                  <tr key={intervention.id} className="border-b border-slate-100">
                    <td className="px-2 py-3">{(intervention.properties as { name?: string } | null)?.name ?? "Bien"}</td>
                    <td className="px-2 py-3">{new Date(intervention.scheduled_for).toLocaleString("fr-FR")}</td>
                    <td className="px-2 py-3">{intervention.cleaner_name}</td>
                    <td className="px-2 py-3">
                      <StatusBadge status={intervention.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!interventions?.length ? <p className="py-4 text-sm text-slate-500">Aucun historique pour le moment.</p> : null}
          </div>
        </section>
      </main>
    </div>
  );
}

import { createProperty } from "@/app/actions";
import { Header } from "@/components/header";
import { createClient } from "@/lib/supabase/server";

export default async function PropertiesPage() {
  const supabase = await createClient();
  const { data: properties } = await supabase.from("properties").select("id, name, address, created_at").order("created_at", { ascending: false });

  return (
    <div>
      <Header />
      <main className="mx-auto grid max-w-6xl gap-8 px-4 py-8 md:grid-cols-[350px_1fr]">
        <section className="rounded-xl bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold">Nouveau bien</h2>
          <form action={createProperty} className="mt-4 space-y-3">
            <div className="space-y-1">
              <label className="text-sm">Nom</label>
              <input name="name" required placeholder="Appartement République" />
            </div>
            <div className="space-y-1">
              <label className="text-sm">Adresse</label>
              <textarea name="address" required rows={3} placeholder="14 rue ..." />
            </div>
            <button className="rounded-lg bg-brand-600 px-4 py-2 text-white hover:bg-brand-700">Ajouter le bien</button>
          </form>
        </section>

        <section className="rounded-xl bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold">Liste des biens</h2>
          <div className="mt-4 space-y-3">
            {properties?.map((property) => (
              <article key={property.id} className="rounded-lg border border-slate-200 p-4">
                <p className="font-medium">{property.name}</p>
                <p className="text-sm text-slate-600">{property.address}</p>
              </article>
            ))}
            {!properties?.length ? <p className="text-sm text-slate-500">Aucun bien enregistré.</p> : null}
          </div>
        </section>
      </main>
    </div>
  );
}

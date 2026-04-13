import { redirect } from "next/navigation";
import { AuthForm } from "@/components/auth-form";
import { createClient } from "@/lib/supabase/server";

export default async function LoginPage() {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (user) redirect("/dashboard");

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-xs uppercase tracking-wide text-brand-600">Conciergerie Airbnb</p>
        <h1 className="mt-2 text-2xl font-bold">Connexion</h1>
        <p className="mt-1 text-sm text-slate-600">Connectez-vous pour gérer vos checklists de ménage.</p>
        <div className="mt-6">
          <AuthForm />
        </div>
      </section>
    </main>
  );
}

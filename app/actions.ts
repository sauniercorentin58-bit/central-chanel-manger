"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

const defaultChecklist = [
  "Aérer le logement",
  "Désinfecter les surfaces",
  "Changer les draps",
  "Vérifier les serviettes",
  "Nettoyer la cuisine",
  "Contrôler les consommables"
];

export async function signIn(_prevState: { error: string }, formData: FormData) {
  const email = formData.get("email")?.toString() ?? "";
  const password = formData.get("password")?.toString() ?? "";

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: "Identifiants invalides." };
  }

  redirect("/dashboard");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export async function createProperty(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  await supabase.from("properties").insert({
    name: formData.get("name")?.toString() ?? "",
    address: formData.get("address")?.toString() ?? "",
    user_id: user.id
  });

  revalidatePath("/properties");
}

export async function createIntervention(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: intervention, error } = await supabase
    .from("interventions")
    .insert({
      property_id: formData.get("property_id")?.toString() ?? "",
      cleaner_name: formData.get("cleaner_name")?.toString() ?? "",
      notes: formData.get("notes")?.toString() || null,
      scheduled_for: formData.get("scheduled_for")?.toString() ?? new Date().toISOString(),
      user_id: user.id,
      status: "todo"
    })
    .select("id")
    .single();

  if (error || !intervention) return;

  await supabase.from("checklist_items").insert(
    defaultChecklist.map((label, index) => ({
      intervention_id: intervention.id,
      label,
      order_index: index,
      completed: false
    }))
  );

  revalidatePath("/interventions");
  revalidatePath("/dashboard");
}

export async function updateInterventionStatus(formData: FormData) {
  const supabase = await createClient();
  const interventionId = formData.get("intervention_id")?.toString() ?? "";
  const status = formData.get("status")?.toString() ?? "todo";

  await supabase
    .from("interventions")
    .update({ status: status as "todo" | "in_progress" | "done" })
    .eq("id", interventionId);

  revalidatePath("/interventions");
  revalidatePath("/history");
  revalidatePath(`/interventions/${interventionId}`);
  revalidatePath("/dashboard");
}

export async function toggleChecklistItem(formData: FormData) {
  const supabase = await createClient();

  const itemId = formData.get("item_id")?.toString() ?? "";
  const interventionId = formData.get("intervention_id")?.toString() ?? "";
  const completed = formData.get("completed")?.toString() === "true";

  await supabase.from("checklist_items").update({ completed }).eq("id", itemId);

  revalidatePath(`/interventions/${interventionId}`);
}

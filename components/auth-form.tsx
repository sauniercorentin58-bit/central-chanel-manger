"use client";

import { useFormState, useFormStatus } from "react-dom";
import { signIn } from "@/app/actions";

const initialState = { error: "" };

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-lg bg-brand-600 px-4 py-2 text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Connexion..." : "Se connecter"}
    </button>
  );
}

export function AuthForm() {
  const [state, formAction] = useFormState(signIn as never, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-1">
        <label className="text-sm font-medium">Email</label>
        <input name="email" type="email" required placeholder="manager@conciergerie.fr" />
      </div>
      <div className="space-y-1">
        <label className="text-sm font-medium">Mot de passe</label>
        <input name="password" type="password" required placeholder="••••••••" />
      </div>
      {state?.error ? <p className="text-sm text-rose-600">{state.error}</p> : null}
      <SubmitButton />
    </form>
  );
}

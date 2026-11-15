"use client";

import { useActionState } from "react";
import { loginAction } from "@/app/admin/actions";

export function LoginForm({ next }: { next: string }) {
  const [state, action, pending] = useActionState(loginAction, undefined);
  return (
    <form action={action} className="mt-6 space-y-4">
      <input type="hidden" name="next" value={next} />
      <div>
        <label htmlFor="password" className="mb-1.5 block text-sm font-semibold text-forest">Password</label>
        <input id="password" name="password" type="password" required autoComplete="current-password" className="field" />
      </div>
      {state?.error ? <p role="alert" className="text-sm font-semibold text-red-700">{state.error}</p> : null}
      <button type="submit" className="btn btn-primary w-full" disabled={pending}>
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}

"use client";

import { useActionState } from "react";
import { loginAction } from "@/lib/actions/auth";
import type { ActionResult } from "@/types/action";

const initialState: ActionResult = { success: true };

export function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, initialState);
  return (
    <form action={action} className="space-y-4">
      {!state.success && <p className="rounded-md bg-red-50 p-3 text-sm text-red-700">{state.message}</p>}
      <label className="block text-sm font-medium">Email
        <input name="email" type="email" autoComplete="email" required className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2" />
      </label>
      <label className="block text-sm font-medium">Password
        <input name="password" type="password" autoComplete="current-password" required minLength={8} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2" />
      </label>
      <button disabled={pending} className="w-full rounded-md bg-slate-900 px-4 py-2.5 font-medium text-white disabled:opacity-60">
        {pending ? "Masuk…" : "Masuk"}
      </button>
    </form>
  );
}

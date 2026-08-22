"use client";

import { useActionState } from "react";
import { login, type LoginState } from "./actions";

const initialState: LoginState = undefined;

export function LoginForm({ nextPath }: { nextPath: string }) {
  const [state, action, pending] = useActionState(login, initialState);
  return (
    <form action={action} className="mt-8 space-y-5">
      <input type="hidden" name="next" value={nextPath} />
      <div>
        <label htmlFor="email" className="mb-2 block text-sm font-semibold text-slate-700">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-950 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
        />
        {state?.errors?.email?.map((error) => <p className="mt-1 text-sm text-red-700" key={error}>{error}</p>)}
      </div>
      <div>
        <label htmlFor="password" className="mb-2 block text-sm font-semibold text-slate-700">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-950 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
        />
        {state?.errors?.password?.map((error) => <p className="mt-1 text-sm text-red-700" key={error}>{error}</p>)}
      </div>
      {state?.message && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-800">{state.message}</p>}
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-xl bg-emerald-800 px-4 py-3 font-semibold text-white transition hover:bg-emerald-900 disabled:cursor-wait disabled:opacity-60"
      >
        {pending ? "Signing in…" : "Sign in securely"}
      </button>
    </form>
  );
}


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
          className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-950 outline-none transition focus:border-[#8fa313] focus:ring-2 focus:ring-[#eff8a7]"
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
          className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-950 outline-none transition focus:border-[#8fa313] focus:ring-2 focus:ring-[#eff8a7]"
        />
        {state?.errors?.password?.map((error) => <p className="mt-1 text-sm text-red-700" key={error}>{error}</p>)}
      </div>
      {state?.message && <p role="alert" className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">{state.message}</p>}
      <button
        type="submit"
        disabled={pending}
        className="min-h-12 w-full rounded-lg bg-[#dff43b] px-4 py-3 font-semibold text-[#101112] transition hover:bg-[#cfe72b] disabled:cursor-wait disabled:opacity-60"
      >
        {pending ? "Signing in…" : "Sign in securely"}
      </button>
    </form>
  );
}

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { loginUser } from "@/lib/api";
import { setAuthSession } from "@/lib/storage";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await loginUser({ email, password });
      setAuthSession(response);
      router.push("/dashboard");
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 items-center px-6 py-14">
      <section className="w-full rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">
        <h1 className="mb-2 text-3xl font-bold text-slate-900">Login</h1>
        <p className="mb-8 text-slate-600">Access your dashboard securely.</p>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">Email</label>
            <input className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-teal-600" type="email" placeholder="name@email.com" value={email} onChange={(event) => setEmail(event.target.value)} />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">Password</label>
            <input className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-teal-600" type="password" placeholder="Enter password" value={password} onChange={(event) => setPassword(event.target.value)} />
          </div>
          {error ? <p className="rounded-lg bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">{error}</p> : null}
          <button className="w-full rounded-lg bg-teal-700 px-4 py-2.5 font-semibold text-white hover:bg-teal-800 disabled:cursor-not-allowed disabled:bg-teal-300" type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="mt-5 text-sm text-slate-600">
          No account?{" "}
          <Link className="font-semibold text-teal-700 hover:underline" href="/register">
            Create one
          </Link>
        </p>
      </section>
    </main>
  );
}
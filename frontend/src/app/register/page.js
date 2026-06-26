"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { registerUser } from "@/lib/api";
import { setAuthSession } from "@/lib/storage";

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await registerUser({ fullName, email, password });
      setAuthSession(response);
      router.push("/dashboard");
    } catch (err) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 items-center px-6 py-14">
      <section className="w-full rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">
        <h1 className="mb-2 text-3xl font-bold text-slate-900">Register</h1>
        <p className="mb-8 text-slate-600">Create your user account.</p>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">Full name</label>
            <input className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-teal-600" type="text" placeholder="John Doe" value={fullName} onChange={(event) => setFullName(event.target.value)} />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">Email</label>
            <input className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-teal-600" type="email" placeholder="name@email.com" value={email} onChange={(event) => setEmail(event.target.value)} />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">Password</label>
            <input className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-teal-600" type="password" placeholder="Minimum 6 characters" value={password} onChange={(event) => setPassword(event.target.value)} />
          </div>
          {error ? <p className="rounded-lg bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">{error}</p> : null}
          <button className="w-full rounded-lg bg-slate-900 px-4 py-2.5 font-semibold text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-400" type="submit" disabled={loading}>
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="mt-5 text-sm text-slate-600">
          Already registered?{" "}
          <Link className="font-semibold text-teal-700 hover:underline" href="/login">
            Login
          </Link>
        </p>
      </section>
    </main>
  );
}
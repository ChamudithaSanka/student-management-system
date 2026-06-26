import Link from "next/link";

export default function Home() {
  return (
    <main className="flex w-full flex-1 flex-col">
      <section className="mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center gap-12 px-6 py-16 md:flex-row md:items-center md:px-10 lg:py-24">
        <div className="max-w-2xl">
          <span className="inline-flex rounded-full border border-teal-200 bg-teal-50 px-4 py-1 text-sm font-semibold text-teal-800">
            Student Management System
          </span>
          <h1 className="mt-5 text-5xl font-black leading-tight tracking-tight text-slate-950 md:text-6xl">
            Manage students and courses in one clean workspace.
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-slate-600">
            Register users, log in securely, and keep student and course data
            organized from a simple dashboard connected to your Spring Boot API.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link className="rounded-xl bg-teal-700 px-6 py-3 font-semibold text-white shadow-lg shadow-teal-200 transition hover:bg-teal-800" href="/register">Get Started</Link>
            <Link className="rounded-xl border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-800 transition hover:bg-slate-50" href="/login">Login</Link>
            <Link className="rounded-xl border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-800 transition hover:bg-slate-50" href="/dashboard">Open Dashboard</Link>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {[
              ["Auth", "JWT login and registration"],
              ["Students", "CRUD for student records"],
              ["Courses", "CRUD for course records"],
            ].map(([title, description]) => (
              <article key={title} className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur">
                <p className="font-semibold text-slate-900">{title}</p>
                <p className="mt-1 text-sm text-slate-600">{description}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/70 md:p-8">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-500">Live Overview</p>
              <h2 className="text-2xl font-bold text-slate-900">Simple system at a glance</h2>
            </div>
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700">Connected</span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {[
              ["Students", "CRUD available"],
              ["Courses", "CRUD available"],
              ["Login", "JWT protected"],
              ["Dashboard", "Summary ready"],
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl bg-slate-50 p-4">
                <p className="text-sm font-medium text-slate-500">{label}</p>
                <p className="mt-2 text-lg font-semibold text-slate-900">{value}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-2xl bg-slate-900 p-5 text-white">
            <p className="text-sm text-slate-300">Backend ready</p>
            <p className="mt-1 text-lg font-semibold">Spring Boot API + Supabase PostgreSQL</p>
          </div>
        </div>
      </section>
    </main>
  );
}

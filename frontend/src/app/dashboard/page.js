"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getCourses, getStudents } from "@/lib/api";
import { getAuthSession } from "@/lib/storage";

export default function DashboardPage() {
  const [cards, setCards] = useState([
    { label: "Total Students", value: "-" },
    { label: "Total Courses", value: "-" },
    { label: "Signed In Role", value: "-" },
  ]);

  useEffect(() => {
    const session = getAuthSession();
    if (!session?.token) {
      return;
    }

    async function loadStats() {
      try {
        const [students, courses] = await Promise.all([
          getStudents(session.token),
          getCourses(session.token),
        ]);

        setCards([
          { label: "Total Students", value: String(students.length) },
          { label: "Total Courses", value: String(courses.length) },
          { label: "Signed In Role", value: session.role || "USER" },
        ]);
      } catch {
        setCards([
          { label: "Total Students", value: "0" },
          { label: "Total Courses", value: "0" },
          { label: "Signed In Role", value: session.role || "USER" },
        ]);
      }
    }

    loadStats();
  }, []);

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 px-6 py-10 md:px-10">
      <div className="w-full space-y-8">
        <header className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
          <p className="mt-1 text-slate-600">Quick view of your system.</p>
        </header>

        <section className="grid gap-4 md:grid-cols-3">
          {cards.map((card) => (
            <article key={card.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm font-semibold text-slate-500">{card.label}</p>
              <p className="mt-2 text-3xl font-bold text-slate-900">{card.value}</p>
            </article>
          ))}
        </section>

        <section className="grid gap-3 sm:grid-cols-2">
          <Link className="rounded-xl bg-teal-700 px-5 py-3 text-center font-semibold text-white hover:bg-teal-800" href="/students">Manage Students</Link>
          <Link className="rounded-xl bg-slate-900 px-5 py-3 text-center font-semibold text-white hover:bg-slate-700" href="/courses">Manage Courses</Link>
        </section>
      </div>
    </main>
  );
}
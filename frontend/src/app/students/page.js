"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { deleteStudent, getStudents } from "@/lib/api";
import { getAuthSession } from "@/lib/storage";

export default function StudentsPage() {
  const [students, setStudents] = useState([]);
  const [message, setMessage] = useState("Loading students...");
  const [actionError, setActionError] = useState("");

  useEffect(() => {
    const session = getAuthSession();
    if (!session?.token) {
      setMessage("Login required to view students.");
      return;
    }

    async function loadStudents() {
      try {
        const data = await getStudents(session.token);
        setStudents(data);
        setMessage("");
      } catch (error) {
        setMessage(error.message || "Unable to load students.");
      }
    }

    loadStudents();
  }, []);

  async function handleDelete(studentId) {
    const session = getAuthSession();
    if (!session?.token) {
      setActionError("Login required to delete students.");
      return;
    }

    if (!window.confirm("Delete this student?")) {
      return;
    }

    try {
      await deleteStudent(session.token, studentId);
      setStudents((currentStudents) => currentStudents.filter((student) => student.id !== studentId));
      setActionError("");
    } catch (error) {
      setActionError(error.message || "Unable to delete student.");
    }
  }

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 px-6 py-10 md:px-10">
      <section className="w-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Students</h1>
            <p className="text-slate-600">View and manage student records.</p>
          </div>
          <Link className="rounded-lg bg-teal-700 px-4 py-2.5 text-center font-semibold text-white hover:bg-teal-800" href="/students/form">Add or Edit Student</Link>
        </div>

        {message ? (
          <p className="mb-4 rounded-lg bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700">{message}</p>
        ) : null}

        {actionError ? (
          <p className="mb-4 rounded-lg bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">{actionError}</p>
        ) : null}

        <div className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-0">
            <thead>
              <tr>
                <th className="border-b border-slate-200 px-4 py-3 text-left text-sm font-semibold text-slate-700">Name</th>
                <th className="border-b border-slate-200 px-4 py-3 text-left text-sm font-semibold text-slate-700">Email</th>
                <th className="border-b border-slate-200 px-4 py-3 text-left text-sm font-semibold text-slate-700 hidden md:table-cell">Phone</th>
                <th className="border-b border-slate-200 px-4 py-3 text-left text-sm font-semibold text-slate-700">Course</th>
                <th className="border-b border-slate-200 px-4 py-3 text-left text-sm font-semibold text-slate-700">Status</th>
                <th className="border-b border-slate-200 px-4 py-3 text-left text-sm font-semibold text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id}>
                  <td className="border-b border-slate-100 px-4 py-3 text-sm text-slate-800">{student.firstName} {student.lastName}</td>
                  <td className="border-b border-slate-100 px-4 py-3 text-sm text-slate-600">{student.email}</td>
                  <td className="border-b border-slate-100 px-4 py-3 text-sm text-slate-600 hidden md:table-cell">{student.phone || "-"}</td>
                  <td className="border-b border-slate-100 px-4 py-3 text-sm text-slate-600">{student.course ? student.course.courseName : "None"}</td>
                  <td className="border-b border-slate-100 px-4 py-3 text-sm font-semibold text-slate-700">{student.status}</td>
                  <td className="border-b border-slate-100 px-4 py-3 text-sm">
                    <div className="flex gap-3">
                      <Link className="font-semibold text-teal-700 hover:underline" href={`/students/form?id=${student.id}`}>
                        Edit
                      </Link>
                      <button className="font-semibold text-rose-700 hover:underline" type="button" onClick={() => handleDelete(student.id)}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
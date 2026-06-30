"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { deleteCourse, getCourses } from "@/lib/api";
import { getAuthSession } from "@/lib/storage";

export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [message, setMessage] = useState("Loading courses...");
  const [actionError, setActionError] = useState("");

  useEffect(() => {
    const session = getAuthSession();
    if (!session?.token) {
      setMessage("Login required to view courses.");
      return;
    }

    async function loadCourses() {
      try {
        const data = await getCourses(session.token);
        setCourses(data);
        setMessage("");
      } catch (error) {
        setMessage(error.message || "Unable to load courses.");
      }
    }

    loadCourses();
  }, []);

  async function handleDelete(courseId) {
    const session = getAuthSession();
    if (!session?.token) {
      setActionError("Login required to delete courses.");
      return;
    }

    if (!window.confirm("Delete this course?")) {
      return;
    }

    try {
      await deleteCourse(session.token, courseId);
      setCourses((currentCourses) => currentCourses.filter((course) => course.id !== courseId));
      setActionError("");
    } catch (error) {
      setActionError(error.message || "Unable to delete course.");
    }
  }

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 px-6 py-10 md:px-10">
      <section className="w-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Courses</h1>
            <p className="text-slate-600">View and manage course records.</p>
          </div>
          <Link className="rounded-lg bg-slate-900 px-4 py-2.5 text-center font-semibold text-white hover:bg-slate-700" href="/courses/form">Add or Edit Course</Link>
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
                <th className="border-b border-slate-200 px-4 py-3 text-left text-sm font-semibold text-slate-700">Code</th>
                <th className="border-b border-slate-200 px-4 py-3 text-left text-sm font-semibold text-slate-700">Name</th>
                <th className="border-b border-slate-200 px-4 py-3 text-left text-sm font-semibold text-slate-700">Duration</th>
                <th className="border-b border-slate-200 px-4 py-3 text-left text-sm font-semibold text-slate-700">Status</th>
                <th className="border-b border-slate-200 px-4 py-3 text-left text-sm font-semibold text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => (
                <tr key={course.id}>
                  <td className="border-b border-slate-100 px-4 py-3 text-sm font-semibold text-slate-800">{course.courseCode}</td>
                  <td className="border-b border-slate-100 px-4 py-3 text-sm text-slate-700">{course.courseName}</td>
                  <td className="border-b border-slate-100 px-4 py-3 text-sm text-slate-600">{course.duration || "-"}</td>
                  <td className="border-b border-slate-100 px-4 py-3 text-sm text-slate-700">{course.status}</td>
                  <td className="border-b border-slate-100 px-4 py-3 text-sm">
                    <div className="flex gap-3">
                      <Link className="font-semibold text-teal-700 hover:underline" href={`/courses/form?id=${course.id}`}>
                        Edit
                      </Link>
                      <button className="font-semibold text-rose-700 hover:underline" type="button" onClick={() => handleDelete(course.id)}>
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
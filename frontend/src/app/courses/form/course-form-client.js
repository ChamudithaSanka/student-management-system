"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { getCourseById, saveCourse } from "@/lib/api";
import { getAuthSession } from "@/lib/storage";

export default function CourseFormClient({ courseId }) {
	const router = useRouter();
	const isEditMode = useMemo(() => Boolean(courseId), [courseId]);
	const [courseName, setCourseName] = useState("");
	const [courseCode, setCourseCode] = useState("");
	const [description, setDescription] = useState("");
	const [duration, setDuration] = useState("");
	const [status, setStatus] = useState("ACTIVE");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	useEffect(() => {
		if (!courseId) {
			return;
		}

		async function loadCourse() {
			try {
				const session = getAuthSession();
				const course = await getCourseById(session.token, courseId);
				setCourseName(course.courseName || "");
				setCourseCode(course.courseCode || "");
				setDescription(course.description || "");
				setDuration(course.duration || "");
				setStatus(course.status || "ACTIVE");
			} catch (err) {
				setError(err.message || "Unable to load course");
			}
		}

		loadCourse();
	}, [courseId]);

	async function handleSubmit(event) {
		event.preventDefault();
		setLoading(true);
		setError("");

		try {
			const session = getAuthSession();
			await saveCourse(session.token, {
				courseName,
				courseCode,
				description,
				duration,
				status,
			}, courseId || undefined);
			router.push("/courses");
		} catch (err) {
			setError(err.message || "Unable to save course");
		} finally {
			setLoading(false);
		}
	}

	return (
		<main className="mx-auto flex w-full max-w-3xl flex-1 px-6 py-10 md:px-10">
			<section className="w-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
				<h1 className="text-3xl font-bold text-slate-900">{isEditMode ? "Edit Course" : "Add Course"}</h1>
				<p className="mt-1 text-slate-600">Use this one form for creating and updating course details.</p>

				<form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
					<div>
						<label className="mb-2 block text-sm font-semibold text-slate-700">Course name</label>
						<input className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-slate-800" type="text" value={courseName} onChange={(event) => setCourseName(event.target.value)} />
					</div>
					<div>
						<label className="mb-2 block text-sm font-semibold text-slate-700">Course code</label>
						<input className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-slate-800" type="text" value={courseCode} onChange={(event) => setCourseCode(event.target.value)} />
					</div>
					<div>
						<label className="mb-2 block text-sm font-semibold text-slate-700">Description</label>
						<textarea className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-slate-800" rows="4" value={description} onChange={(event) => setDescription(event.target.value)} />
					</div>
					<div className="grid gap-4 md:grid-cols-2">
						<div>
							<label className="mb-2 block text-sm font-semibold text-slate-700">Duration</label>
							<input className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-slate-800" type="text" placeholder="e.g. 6 months" value={duration} onChange={(event) => setDuration(event.target.value)} />
						</div>
						<div>
							<label className="mb-2 block text-sm font-semibold text-slate-700">Status</label>
							<select className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-slate-800" value={status} onChange={(event) => setStatus(event.target.value)}>
								<option value="ACTIVE">ACTIVE</option>
								<option value="INACTIVE">INACTIVE</option>
							</select>
						</div>
					</div>

					{error ? <p className="rounded-lg bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">{error}</p> : null}

					<button className="mt-2 rounded-lg bg-slate-900 px-4 py-2.5 font-semibold text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-400" type="submit" disabled={loading}>
						{loading ? "Saving..." : isEditMode ? "Update Course" : "Save Course"}
					</button>
				</form>
			</section>
		</main>
	);
}
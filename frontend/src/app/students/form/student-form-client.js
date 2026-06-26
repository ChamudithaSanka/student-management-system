"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { getStudentById, saveStudent } from "@/lib/api";
import { getAuthSession } from "@/lib/storage";

export default function StudentFormClient({ studentId }) {
	const router = useRouter();
	const isEditMode = useMemo(() => Boolean(studentId), [studentId]);
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [email, setEmail] = useState("");
	const [phone, setPhone] = useState("");
	const [dateOfBirth, setDateOfBirth] = useState("");
	const [courseId, setCourseId] = useState("");
	const [status, setStatus] = useState("ACTIVE");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	useEffect(() => {
		if (!studentId) {
			return;
		}

		async function loadStudent() {
			try {
				const session = getAuthSession();
				const student = await getStudentById(session.token, studentId);
				setFirstName(student.firstName || "");
				setLastName(student.lastName || "");
				setEmail(student.email || "");
				setPhone(student.phone || "");
				setDateOfBirth(student.dateOfBirth || "");
				setStatus(student.status || "ACTIVE");
				setCourseId(student.course?.id ? String(student.course.id) : "");
			} catch (err) {
				setError(err.message || "Unable to load student");
			}
		}

		loadStudent();
	}, [studentId]);

	async function handleSubmit(event) {
		event.preventDefault();
		setLoading(true);
		setError("");

		try {
			const session = getAuthSession();
			await saveStudent(
				session.token,
				{
					firstName,
					lastName,
					email,
					phone,
					dateOfBirth: dateOfBirth || null,
					status,
					course: courseId ? { id: Number(courseId) } : null,
				},
				studentId || undefined,
			);
			router.push("/students");
		} catch (err) {
			setError(err.message || "Unable to save student");
		} finally {
			setLoading(false);
		}
	}

	return (
		<main className="mx-auto flex w-full max-w-3xl flex-1 px-6 py-10 md:px-10">
			<section className="w-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
				<h1 className="text-3xl font-bold text-slate-900">{isEditMode ? "Edit Student" : "Add Student"}</h1>
				<p className="mt-1 text-slate-600">Use this one form for creating and updating student details.</p>

				<form className="mt-6 grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
					<div>
						<label className="mb-2 block text-sm font-semibold text-slate-700">First name</label>
						<input className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-teal-600" type="text" value={firstName} onChange={(event) => setFirstName(event.target.value)} />
					</div>
					<div>
						<label className="mb-2 block text-sm font-semibold text-slate-700">Last name</label>
						<input className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-teal-600" type="text" value={lastName} onChange={(event) => setLastName(event.target.value)} />
					</div>
					<div>
						<label className="mb-2 block text-sm font-semibold text-slate-700">Email</label>
						<input className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-teal-600" type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
					</div>
					<div>
						<label className="mb-2 block text-sm font-semibold text-slate-700">Phone</label>
						<input className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-teal-600" type="text" value={phone} onChange={(event) => setPhone(event.target.value)} />
					</div>
					<div>
						<label className="mb-2 block text-sm font-semibold text-slate-700">Date of birth</label>
						<input className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-teal-600" type="date" value={dateOfBirth} onChange={(event) => setDateOfBirth(event.target.value)} />
					</div>
					<div>
						<label className="mb-2 block text-sm font-semibold text-slate-700">Status</label>
						<select className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-teal-600" value={status} onChange={(event) => setStatus(event.target.value)}>
							<option value="ACTIVE">ACTIVE</option>
							<option value="INACTIVE">INACTIVE</option>
						</select>
					</div>
					<div className="md:col-span-2">
						<label className="mb-2 block text-sm font-semibold text-slate-700">Course ID</label>
						<input className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-teal-600" type="number" value={courseId} onChange={(event) => setCourseId(event.target.value)} />
					</div>
					{error ? <p className="rounded-lg bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700 md:col-span-2">{error}</p> : null}
					<button className="mt-2 rounded-lg bg-teal-700 px-4 py-2.5 font-semibold text-white hover:bg-teal-800 md:col-span-2" type="submit">
						{loading ? "Saving..." : isEditMode ? "Update Student" : "Save Student"}
					</button>
				</form>
			</section>
		</main>
	);
}
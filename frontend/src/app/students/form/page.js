import StudentFormClient from "./student-form-client";

export default async function StudentFormPage({ searchParams }) {
	const params = await searchParams;
	return <StudentFormClient studentId={params?.id || null} />;
}
import StudentFormClient from "./student-form-client";

export default function StudentFormPage({ searchParams }) {
	return <StudentFormClient studentId={searchParams?.id || null} />;
}
import CourseFormClient from "./course-form-client";

export default async function CourseFormPage({ searchParams }) {
	const params = await searchParams;
	return <CourseFormClient courseId={params?.id || null} />;
}
import CourseFormClient from "./course-form-client";

export default function CourseFormPage({ searchParams }) {
	return <CourseFormClient courseId={searchParams?.id || null} />;
}
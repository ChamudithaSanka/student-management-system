const API_BASE_URL =
	process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

async function request(path, options = {}) {
	const headers = new Headers(options.headers || {});
	if (!headers.has("Content-Type") && options.body) {
		headers.set("Content-Type", "application/json");
	}

	const response = await fetch(`${API_BASE_URL}${path}`, {
		...options,
		headers,
		cache: "no-store",
	});

	if (!response.ok) {
		let message = "Request failed";
		try {
			const errorBody = await response.json();
			message = errorBody.message || errorBody.error || message;
		} catch {
			message = response.statusText || message;
		}
		throw new Error(message);
	}

	if (response.status === 204) {
		return null;
	}

	return response.json();
}

export function loginUser(payload) {
	return request("/api/auth/login", {
		method: "POST",
		body: JSON.stringify(payload),
	});
}

export function registerUser(payload) {
	return request("/api/auth/register", {
		method: "POST",
		body: JSON.stringify(payload),
	});
}

export function getStudents(token) {
	return request("/api/students", {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});
}

export function getStudentById(token, id) {
	return request(`/api/students/${id}`, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});
}

export function deleteStudent(token, id) {
	return request(`/api/students/${id}`, {
		method: "DELETE",
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});
}

export function getCourses(token) {
	return request("/api/courses", {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});
}

export function getCourseById(token, id) {
	return request(`/api/courses/${id}`, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});
}

export function deleteCourse(token, id) {
	return request(`/api/courses/${id}`, {
		method: "DELETE",
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});
}

export function saveStudent(token, student, id) {
	return request(id ? `/api/students/${id}` : "/api/students", {
		method: id ? "PUT" : "POST",
		headers: {
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify(student),
	});
}

export function saveCourse(token, course, id) {
	return request(id ? `/api/courses/${id}` : "/api/courses", {
		method: id ? "PUT" : "POST",
		headers: {
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify(course),
	});
}

export function getApiBaseUrl() {
	return API_BASE_URL;
}
export function getAuthSession() {
	if (typeof window === "undefined") {
		return null;
	}

	const raw = window.localStorage.getItem("sms_auth");
	if (!raw) {
		return null;
	}

	try {
		return JSON.parse(raw);
	} catch {
		return null;
	}
}

export function setAuthSession(session) {
	window.localStorage.setItem("sms_auth", JSON.stringify(session));
}

export function clearAuthSession() {
	window.localStorage.removeItem("sms_auth");
}
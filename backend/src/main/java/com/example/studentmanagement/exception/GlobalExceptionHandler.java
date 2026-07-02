package com.example.studentmanagement.exception;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;

import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalExceptionHandler {

	/**
	 * Handles @Valid / @Validated bean validation failures (400 Bad Request).
	 * Collects all field-level errors into a single readable message.
	 * Example: "firstName: must not be blank; email: must be a valid email address"
	 */
	@ExceptionHandler(MethodArgumentNotValidException.class)
	public ResponseEntity<ErrorResponse> handleValidationException(
			MethodArgumentNotValidException ex,
			HttpServletRequest request) {

		String message = ex.getBindingResult()
				.getFieldErrors()
				.stream()
				.map(FieldError::getDefaultMessage)
				.collect(Collectors.joining("; "));

		// Include field names for clarity
		String detailedMessage = ex.getBindingResult()
				.getFieldErrors()
				.stream()
				.map(e -> e.getField() + ": " + e.getDefaultMessage())
				.collect(Collectors.joining("; "));

		ErrorResponse error = new ErrorResponse(
				HttpStatus.BAD_REQUEST.value(),
				"Validation Failed",
				detailedMessage,
				request.getRequestURI()
		);

		return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
	}

	/**
	 * Handles ResponseStatusException thrown manually in services.
	 * Used for 404 (not found), 409 (conflict), 401 (unauthorized).
	 * Example: "Student not found", "Email already exists"
	 */
	@ExceptionHandler(ResponseStatusException.class)
	public ResponseEntity<ErrorResponse> handleResponseStatusException(
			ResponseStatusException ex,
			HttpServletRequest request) {

		ErrorResponse error = new ErrorResponse(
				ex.getStatusCode().value(),
				ex.getStatusCode().toString().replaceFirst("^\\d+\\s*", ""),
				ex.getReason() != null ? ex.getReason() : ex.getMessage(),
				request.getRequestURI()
		);

		return ResponseEntity.status(ex.getStatusCode()).body(error);
	}

	/**
	 * Handles Spring Security's AccessDeniedException (403 Forbidden).
	 * Thrown when an authenticated user lacks the required role.
	 * Example: STUDENT tries to access /api/students
	 */
	@ExceptionHandler(AccessDeniedException.class)
	public ResponseEntity<ErrorResponse> handleAccessDeniedException(
			AccessDeniedException ex,
			HttpServletRequest request) {

		ErrorResponse error = new ErrorResponse(
				HttpStatus.FORBIDDEN.value(),
				"Forbidden",
				"Access denied: you do not have permission to perform this action",
				request.getRequestURI()
		);

		return ResponseEntity.status(HttpStatus.FORBIDDEN).body(error);
	}

	/**
	 * Handles Spring Security's AuthenticationException (401 Unauthorized).
	 * Thrown when no valid JWT token is provided.
	 */
	@ExceptionHandler(AuthenticationException.class)
	public ResponseEntity<ErrorResponse> handleAuthenticationException(
			AuthenticationException ex,
			HttpServletRequest request) {

		ErrorResponse error = new ErrorResponse(
				HttpStatus.UNAUTHORIZED.value(),
				"Unauthorized",
				"Authentication required: " + ex.getMessage(),
				request.getRequestURI()
		);

		return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
	}

	/**
	 * Fallback handler for any unhandled exception (500 Internal Server Error).
	 * Prevents raw stack traces from leaking to the client.
	 */
	@ExceptionHandler(Exception.class)
	public ResponseEntity<ErrorResponse> handleGenericException(
			Exception ex,
			HttpServletRequest request) {

		ErrorResponse error = new ErrorResponse(
				HttpStatus.INTERNAL_SERVER_ERROR.value(),
				"Internal Server Error",
				"An unexpected error occurred. Please try again later.",
				request.getRequestURI()
		);

		return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
	}
}

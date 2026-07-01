package com.example.studentmanagement.controller;

import com.example.studentmanagement.entity.User;
import com.example.studentmanagement.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;

import static org.springframework.http.HttpStatus.NOT_FOUND;

@RestController
@RequestMapping("/api/users")
public class UserController {

	private final UserRepository userRepository;

	public UserController(UserRepository userRepository) {
		this.userRepository = userRepository;
	}

	/**
	 * GET /api/users/me
	 * Returns the profile of the currently authenticated user.
	 * Accessible by all roles (ADMIN, STAFF, STUDENT).
	 */
	@GetMapping("/me")
	public ResponseEntity<Map<String, Object>> getCurrentUser() {
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		String email = auth.getName();

		User user = userRepository.findByEmail(email)
				.orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "User not found"));

		Map<String, Object> profile = Map.of(
				"id", user.getId(),
				"fullName", user.getFullName(),
				"email", user.getEmail(),
				"role", user.getRole(),
				"createdAt", user.getCreatedAt() != null ? user.getCreatedAt().toString() : ""
		);

		return ResponseEntity.ok(profile);
	}

	/**
	 * GET /api/users
	 * Returns all registered users.
	 * ADMIN only (enforced by SecurityConfig).
	 */
	@GetMapping
	public ResponseEntity<List<Map<String, Object>>> getAllUsers() {
		List<Map<String, Object>> users = userRepository.findAll().stream()
				.map(user -> Map.<String, Object>of(
						"id", user.getId(),
						"fullName", user.getFullName(),
						"email", user.getEmail(),
						"role", user.getRole(),
						"createdAt", user.getCreatedAt() != null ? user.getCreatedAt().toString() : ""
				))
				.toList();

		return ResponseEntity.ok(users);
	}
}

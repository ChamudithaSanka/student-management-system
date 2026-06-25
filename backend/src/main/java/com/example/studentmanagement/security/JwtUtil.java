package com.example.studentmanagement.security;

import org.springframework.stereotype.Component;

@Component
public class JwtUtil {

	public String generateToken(String subject) {
		return subject;
	}

	public String extractUsername(String token) {
		return token;
	}

	public boolean validateToken(String token, String username) {
		return token != null && token.equals(username);
	}
}
package com.example.studentmanagement.dto;

public class AuthResponse {

	private String token;
	private String tokenType;
	private String fullName;
	private String email;
	private String role;

	public AuthResponse() {
	}

	public AuthResponse(String token) {
		this.tokenType = "Bearer";
		this.token = token;
	}

	public AuthResponse(String token, String fullName, String email, String role) {
		this.tokenType = "Bearer";
		this.token = token;
		this.fullName = fullName;
		this.email = email;
		this.role = role;
	}

	public String getToken() {
		return token;
	}

	public void setToken(String token) {
		this.token = token;
	}

	public String getTokenType() {
		return tokenType;
	}

	public void setTokenType(String tokenType) {
		this.tokenType = tokenType;
	}

	public String getFullName() {
		return fullName;
	}

	public void setFullName(String fullName) {
		this.fullName = fullName;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getRole() {
		return role;
	}

	public void setRole(String role) {
		this.role = role;
	}
}
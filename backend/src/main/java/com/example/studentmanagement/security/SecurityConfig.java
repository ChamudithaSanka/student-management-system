package com.example.studentmanagement.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;

import java.time.LocalDateTime;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
public class SecurityConfig {

	private final JwtFilter jwtFilter;

	public SecurityConfig(JwtFilter jwtFilter) {
		this.jwtFilter = jwtFilter;
	}

	/** Build a minimal error JSON without requiring Jackson on the compile classpath. */
	private static String errorJson(int status, String error, String message, String path) {
		return String.format(
				"{\"status\":%d,\"error\":\"%s\",\"message\":\"%s\",\"path\":\"%s\",\"timestamp\":\"%s\"}",
				status, error, message, path, LocalDateTime.now()
		);
	}

	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
		return http
				.csrf(AbstractHttpConfigurer::disable)
				.cors(cors -> cors.configurationSource(corsConfigurationSource()))
				.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
				// 401 — no token or invalid token
				.exceptionHandling(ex -> ex
						.authenticationEntryPoint((request, response, authException) -> {
						response.setStatus(HttpStatus.UNAUTHORIZED.value());
						response.setContentType(MediaType.APPLICATION_JSON_VALUE);
						response.getWriter().write(errorJson(
								HttpStatus.UNAUTHORIZED.value(),
								"Unauthorized",
								"Authentication required: missing or invalid token",
								request.getRequestURI()
						));
					})
					// 403 — authenticated but wrong role
					.accessDeniedHandler((request, response, accessDeniedException) -> {
						response.setStatus(HttpStatus.FORBIDDEN.value());
						response.setContentType(MediaType.APPLICATION_JSON_VALUE);
						response.getWriter().write(errorJson(
								HttpStatus.FORBIDDEN.value(),
								"Forbidden",
								"Access denied: you do not have permission to perform this action",
								request.getRequestURI()
						));
					})
				)
				.authorizeHttpRequests(authorize -> authorize
					.requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
					.requestMatchers("/api/auth/**").permitAll()
					// Students: ADMIN + STAFF can read/write; only ADMIN can delete; STUDENT has no access
					.requestMatchers(HttpMethod.GET, "/api/students/**").hasAnyRole("ADMIN", "STAFF")
					.requestMatchers(HttpMethod.POST, "/api/students/**").hasAnyRole("ADMIN", "STAFF")
					.requestMatchers(HttpMethod.PUT, "/api/students/**").hasAnyRole("ADMIN", "STAFF")
					.requestMatchers(HttpMethod.DELETE, "/api/students/**").hasRole("ADMIN")
					// Courses: all authenticated users can read; ADMIN + STAFF can write; only ADMIN can delete
					.requestMatchers(HttpMethod.GET, "/api/courses/**").authenticated()
					.requestMatchers(HttpMethod.POST, "/api/courses/**").hasAnyRole("ADMIN", "STAFF")
					.requestMatchers(HttpMethod.PUT, "/api/courses/**").hasAnyRole("ADMIN", "STAFF")
					.requestMatchers(HttpMethod.DELETE, "/api/courses/**").hasRole("ADMIN")
					// Profile: any authenticated user can view their own info
					.requestMatchers("/api/users/me").authenticated()
					// User list: ADMIN only
					.requestMatchers("/api/users/**").hasRole("ADMIN")
					.anyRequest().authenticated())
				.addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)
				.build();
	}

	@Bean
	public CorsConfigurationSource corsConfigurationSource() {
		CorsConfiguration configuration = new CorsConfiguration();
		configuration.setAllowedOriginPatterns(List.of(
				"http://localhost:*",
				"http://127.0.0.1:*"
		));
		configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
		configuration.setAllowedHeaders(List.of("Authorization", "Content-Type", "Accept", "Origin"));
		configuration.setExposedHeaders(List.of("Authorization"));
		configuration.setAllowCredentials(true);

		UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
		source.registerCorsConfiguration("/**", configuration);
		return source;
	}
}
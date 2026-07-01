package com.example.studentmanagement.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
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

	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
		return http
				.csrf(AbstractHttpConfigurer::disable)
				.cors(cors -> cors.configurationSource(corsConfigurationSource()))
				.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
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
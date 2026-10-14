package com.feedback.configurations;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;

import org.springframework.security.config.annotation.web.builders.HttpSecurity;

import org.springframework.security.config.http.SessionCreationPolicy;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.feedback.jwt.JWTRequestVaildator;

@Configuration
public class SecurityConfiguration 
{

    @Autowired
    private JWTRequestVaildator jwtRequestVaildator;

    // Password Encoder
    @Bean
    public PasswordEncoder passwordEncoder() 
    {
        return new BCryptPasswordEncoder();
    }


    // Authentication Manager
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration)
            throws Exception {

        return configuration.getAuthenticationManager();
    }


    // CORS Configuration
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration = new CorsConfiguration();

        configuration.setAllowedOrigins(
                List.of("http://localhost:3000")
        );

        configuration.setAllowedMethods(
                List.of(
                        "GET",
                        "POST",
                        "PUT",
                        "DELETE",
                        "OPTIONS")
        );

        configuration.setAllowedHeaders( List.of("*"));

        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration("/**",configuration);

        return source;
    }


    // Security Filter Chain
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http)
            throws Exception {

        http
            // Enable CORS
            .cors(cors -> {})

            // Disable CSRF because we are using JWT
            .csrf(csrf -> csrf.disable())

            // JWT is stateless
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

            // Authorization rules
            .authorizeHttpRequests(auth -> auth

                    // CORS preflight
                    .requestMatchers(
                            org.springframework.http.HttpMethod.OPTIONS,
                            "/**"
                    ).permitAll()

                    // Public APIs
                    .requestMatchers(
                            "/api/v1/user/register",
                            "/api/v1/user/login"
                    ).permitAll()

                    // Admin APIs
                    .requestMatchers(
                            "/api/v1/admin/**"
                    )
                    .hasAuthority("ADMIN")

                    // User Feedback APIs
                    .requestMatchers(
                            "/api/v1/userfeedback/**"
                    )
                    .hasAnyAuthority(
                            "USER",
                            "ADMIN"
                    )

                    // User APIs
                    .requestMatchers(
                            "/api/v1/user/**"
                    )
                    .hasAnyAuthority(
                            "USER",
                            "ADMIN"
                    )

                    // All remaining APIs
                    .anyRequest()
                    .authenticated()
            )

            // JWT Filter
            .addFilterBefore(jwtRequestVaildator,UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
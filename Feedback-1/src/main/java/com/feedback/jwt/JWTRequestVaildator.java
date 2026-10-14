package com.feedback.jwt;

import java.io.IOException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.feedback.services.MyUserDetailsService;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JWTRequestVaildator extends OncePerRequestFilter {

    @Autowired
    private JWTTokenGenerator jwtTokenGenerator;

    @Autowired
    private MyUserDetailsService myUserDetailsService;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        // Get Authorization header
        final String header = request.getHeader("Authorization");

        String jwtToken = null;
        String username = null;
        String role = null;

        // Extract JWT token
        if (header != null && header.startsWith("Bearer ")) {

            jwtToken = header.substring(7);

            try {

                // Extract username from JWT
                username = jwtTokenGenerator.extractUsername(jwtToken);

                // Extract role from JWT
                role = jwtTokenGenerator.extractRole(jwtToken);

                System.out.println("USERNAME FROM TOKEN = " + username);
                System.out.println("ROLE FROM TOKEN = " + role);

            } catch (Exception e) 
            {
                System.out.println("Invalid Token: " + e.getMessage());
            }
        }

        // Authenticate user
        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) 
        {
            try 
            {
                // Load user from database
                UserDetails userDetails = myUserDetailsService .loadUserByUsername(username);

                // Validate JWT
                if (jwtTokenGenerator.validateToken(jwtToken, userDetails)) 
                {

                    /*
                     * Create authority from JWT role
                     *
                     * Example:
                     * role = USER
                     *
                     * authority = USER
                     */
                    List<SimpleGrantedAuthority> authorities = List.of( new SimpleGrantedAuthority(role));

                    System.out.println("AUTHORITIES SET = " + authorities);

                    // Create authentication object
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                                    userDetails,
                                    null,
                                    authorities
                            );

                    // Add request details
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                    // Set authentication
                    SecurityContextHolder.getContext().setAuthentication(authToken);

                    System.out.println("AUTHENTICATION SET SUCCESSFULLY");
                }

            } catch (Exception e) 
            {
                System.out.println("Authentication Error: " + e.getMessage());
            }
        }

        // Continue filter chain
        filterChain.doFilter(request, response);
    }
}
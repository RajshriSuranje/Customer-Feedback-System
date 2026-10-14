package com.feedback.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.feedback.dto.RegisterRequest;
import com.feedback.dto.UserLogin;
import com.feedback.entities.User;
import com.feedback.enums.Role;
import com.feedback.jwt.JWTTokenGenerator;
import com.feedback.repositories.UserRepository;
import com.feedback.response.JWTResponseWrapper;
import com.feedback.response.UniversalResponse;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UniversalResponse response;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private MyUserDetailsService myUserDetailsService;

    @Autowired
    private JWTTokenGenerator jwtTokenGenerator;

    @Autowired
    private JWTResponseWrapper jwtResponseWrapper;

    public ResponseEntity<?> register(RegisterRequest registerRequest) 
    {
        // Check username
        if (userRepository.existsByUsername(registerRequest.getUsername())) 
        {
            return response.send("Username already exists", null, HttpStatus.FOUND);
        }

        // Check password and confirm password
        if (!registerRequest.getPassword().equals(registerRequest.getConfirmPassword())) 
        {
            return response.send("Password and Confirm Password do not match", null, HttpStatus.BAD_REQUEST);
        }

        // Create User entity
        User user = new User();
        user.setUsername(registerRequest.getUsername());
        user.setEmail(registerRequest.getEmail());

        // Encode password
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));

        // Set default role
        user.setRole(Role.USER);

        // Save user
        userRepository.save(user);

        // Return response
        return response.send("Registration successful", null, HttpStatus.CREATED);
    }

    public ResponseEntity<?> login(UserLogin userLogin) 
    {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        userLogin.getUserName(),
                        userLogin.getPassword())
        );

        UserDetails userDetails = myUserDetailsService.loadUserByUsername(userLogin.getUserName());

        User user = userRepository.findByUsername(userLogin.getUserName());

        String token = jwtTokenGenerator.generateToken(
                        userDetails,
                        user.getRole().name());

        jwtResponseWrapper.setId(user.getId());
        jwtResponseWrapper.setToken(token);
        jwtResponseWrapper.setRole(user.getRole().name());

        return response.send("Login successful",jwtResponseWrapper,HttpStatus.OK);
    }
}
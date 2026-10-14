package com.feedback.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.feedback.dto.RegisterRequest;
import com.feedback.dto.UserLogin;
import com.feedback.services.UserService;

@RestController
@RequestMapping("/api/v1/")
public class UserController 
{
    @Autowired
    private UserService userService;

    // Register User
    @PostMapping("/user/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest registerRequest) 
    {
        return userService.register(registerRequest);
    }

    // Login User
    @PostMapping("/user/login")
    public ResponseEntity<?> login(@RequestBody UserLogin userLogin) 
    {
        return userService.login(userLogin);
    }
    
    // Test JWT
    @GetMapping("/user/test")
    public ResponseEntity<?> test() 
    {
        return ResponseEntity.ok("JWT Authentication Successful");
    }
  
    @GetMapping("/admin/test")
    public ResponseEntity<?> adminTest() 
    {
        return ResponseEntity.ok("ADMIN Authentication Successful");
    }
}
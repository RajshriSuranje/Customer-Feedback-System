package com.feedback.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.feedback.entities.UserFeedback;
import com.feedback.services.UserFeedbackService;
import org.springframework.security.core.Authentication;
@RestController
@RequestMapping("/api/v1/userfeedback")
public class UserFeedbackController 
{
    @Autowired
    private UserFeedbackService userFeedbackService;

    // Add Feedback
    @PostMapping("/add")
    public ResponseEntity<?> addFeedback(@RequestParam String feedback, Authentication authentication) 
    {
        String username = authentication.getName();
        UserFeedback userFeedback = userFeedbackService.addFeedback(username, feedback);
        return ResponseEntity.ok(userFeedback);
    }

    // View My Feedback
    @GetMapping("/my")
    public ResponseEntity<?> getMyFeedback(@RequestParam String username) 
    {
        List<UserFeedback> feedbackList = userFeedbackService.getMyFeedback(username);
        return ResponseEntity.ok(feedbackList);
    }

    // Edit Feedback
    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateFeedback(@PathVariable Long id, @RequestParam String username, @RequestParam String feedback) 
    {
        UserFeedback userFeedback = userFeedbackService.updateFeedback(id,username,feedback);

        return ResponseEntity.ok(userFeedback);
    }
}
package com.feedback.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.feedback.entities.UserFeedback;
import com.feedback.services.AdminService;

@RestController
@RequestMapping("/api/v1/admin")
public class AdminController 
{

    @Autowired
    private AdminService adminService;

    @GetMapping("/feedback")
    public ResponseEntity<?> getAllFeedback() 
    {

        List<UserFeedback> feedbackList = adminService.getAllFeedback();

        return ResponseEntity.ok(feedbackList);
    }

    @GetMapping("/feedback/{id}")
    public ResponseEntity<?> getFeedbackById( @PathVariable Long id) 
    {

        UserFeedback feedback = adminService.getFeedbackById(id);

        if (feedback == null) 
        {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(feedback);
    }

    @PutMapping("/feedback/{id}")
    public ResponseEntity<?> updateFeedback(@PathVariable Long id, @RequestParam String feedback) 
    {
        UserFeedback updatedFeedback = adminService.updateFeedback(id, feedback);
        if (updatedFeedback == null) 
        {
            return ResponseEntity.notFound().build();
        }
        
        return ResponseEntity.ok(updatedFeedback);
    }

    @DeleteMapping("/feedback/{id}")
    public ResponseEntity<?> deleteFeedback(@PathVariable Long id) 
    {
        boolean deleted = adminService.deleteFeedback(id);
        if (!deleted) 
        {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok("Feedback deleted successfully");
    }
}
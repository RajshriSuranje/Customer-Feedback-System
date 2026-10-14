package com.feedback.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.feedback.entities.UserFeedback;
import com.feedback.repositories.UserFeedbackRepository;

@Service
public class AdminService 
{
    @Autowired
    private UserFeedbackRepository userFeedbackRepository;


    // Get all feedback
    public List<UserFeedback> getAllFeedback() 
    {
        return userFeedbackRepository.findAll();
    }


    // Get feedback by ID
    public UserFeedback getFeedbackById(Long id) 
    {
        return userFeedbackRepository.findById(id).orElse(null);
    }


    // Update feedback
    public UserFeedback updateFeedback(Long id, String feedback) 
    {

        UserFeedback existingFeedback = userFeedbackRepository.findById(id).orElse(null);

        if (existingFeedback == null) 
        {
            return null;
        }

        existingFeedback.setFeedback(feedback);

        return userFeedbackRepository.save(existingFeedback);
    }


    // Delete feedback
    public boolean deleteFeedback(Long id) 
    {
        if (!userFeedbackRepository.existsById(id)) 
        {
            return false;
        }

        userFeedbackRepository.deleteById(id);
        return true;
    }
}
package com.feedback.services;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.feedback.entities.User;
import com.feedback.entities.UserFeedback;
import com.feedback.repositories.UserFeedbackRepository;
import com.feedback.repositories.UserRepository;

@Service
public class UserFeedbackService {

    @Autowired
    private UserFeedbackRepository userFeedbackRepository;

    @Autowired
    private UserRepository userRepository;


    // Add Feedback
    public UserFeedback addFeedback(String username, String feedbackText) 
    {
        User user = userRepository.findByUsername(username);
        if (user == null) 
        {
            throw new RuntimeException("User not found");
        }

        UserFeedback userFeedback = new UserFeedback();

        userFeedback.setFeedback(feedbackText);

        userFeedback.setDate(LocalDate.now());

        userFeedback.setUser(user);

        return userFeedbackRepository.save(userFeedback);
    }


    // Get My Feedback
    public List<UserFeedback> getMyFeedback(String username) 
    {
        User user = userRepository.findByUsername(username);
        if (user == null) 
        {
            throw new RuntimeException("User not found");
        }
        return userFeedbackRepository.findByUser(user);
    }


    // Edit Feedback
    public UserFeedback updateFeedback(Long id,String username,String feedbackText) 
    {
        User user = userRepository.findByUsername(username);
        if (user == null) 
        {
            throw new RuntimeException("User not found");
        }

        UserFeedback userFeedback = userFeedbackRepository.findById(id).orElseThrow(() -> new RuntimeException("Feedback not found"));

        // Check ownership
        if (!userFeedback.getUser().getId().equals(user.getId())) 
        {
            throw new RuntimeException("You are not allowed to edit this feedback");
        }
        
        userFeedback.setFeedback(feedbackText);

        return userFeedbackRepository.save(userFeedback);
    }
}
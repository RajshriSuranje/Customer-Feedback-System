package com.feedback.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.feedback.entities.User;
import com.feedback.entities.UserFeedback;

@Repository
public interface UserFeedbackRepository extends JpaRepository<UserFeedback, Long> 
{
    List<UserFeedback> findByUser(User user);

}
package com.feedback.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import com.feedback.entities.User;

public interface UserRepository extends JpaRepository<User, Long>
{
	boolean existsByUsername(String username);
	
	User findByUsername(String username);
}

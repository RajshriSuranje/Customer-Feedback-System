package com.feedback.response;

import org.springframework.stereotype.Component;

import lombok.Data;

@Component
@Data
public class JWTResponseWrapper 
{ 
	private long id;
	private String token;
	private String role;
	
}

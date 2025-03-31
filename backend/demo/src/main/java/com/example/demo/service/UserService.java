package com.example.demo.service;

import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.exception.UnauthorizedAccessException;
import com.example.demo.model.Users;
import com.example.demo.repository.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepo repo;

    @Autowired
    private JWTService jwtService;

    @Autowired
    private AuthenticationManager authManager;

    private BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);

    public Users register(Users user){
        user.setPassword(encoder.encode(user.getPassword()));
        return repo.save(user);
    }

    public String verify(Users user) {
        Authentication authentication = authManager.authenticate(new UsernamePasswordAuthenticationToken(user.getUsername(), user.getPassword()));

        if(authentication.isAuthenticated()){
            return jwtService.generateToken(user.getUsername());
        }
        return "User details is incorrect";
    }

    public ResponseEntity<String> updateProfile(Users user){
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (!(principal instanceof UserDetails)){
            throw new UnauthorizedAccessException("User is not authenticated");
        }
        String username = ((UserDetails) principal).getUsername();
        Users loggedUser = repo.findByUsername(username);

        if (loggedUser == null) {
            throw new ResourceNotFoundException("User not found: " + username);
        }

        if (user.getUsername() != null && !user.getUsername().isEmpty()) {
            loggedUser.setUsername(user.getUsername());
        }

        if (user.getEmail() != null && !user.getEmail().isEmpty()) {
            loggedUser.setEmail(user.getEmail());
        }

        if (user.getPassword() != null && !user.getPassword().isEmpty()) {
            loggedUser.setPassword(encoder.encode(user.getPassword()));
        }

        repo.save(loggedUser);

        return new ResponseEntity<>("Profile Updated Successfully", HttpStatus.OK);
    }

}

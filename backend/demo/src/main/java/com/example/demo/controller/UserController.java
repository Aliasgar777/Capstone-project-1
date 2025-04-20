package com.example.demo.controller;


import com.example.demo.exception.ResourceAlreadyExistsException;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.exception.UnauthorizedAccessException;
import com.example.demo.model.Users;
import com.example.demo.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class UserController {

    @Autowired
    private UserService service;

    @PostMapping("/signup")
    public ResponseEntity<Users> register(@RequestBody Users user){
        try {
            Users newUser = service.register(user);
            return new ResponseEntity<>(newUser, HttpStatus.CREATED);
        } catch (ResourceAlreadyExistsException e) {
            return new ResponseEntity<>(HttpStatus.CONFLICT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody Users user){
        try {
            String token = service.verify(user);
            return new ResponseEntity<>(token, HttpStatus.OK);
        } catch (UnauthorizedAccessException e) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
    }

    @PutMapping("/profile")
    public ResponseEntity<String> updateProfile(@RequestBody Users user){
        try{
            service.updateProfile(user);
            return new ResponseEntity<>("Profile Updated Successfully", HttpStatus.OK);
        }
        catch(UnauthorizedAccessException e){
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        catch (ResourceNotFoundException e){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

}

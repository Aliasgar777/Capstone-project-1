package com.example.demo.service;


import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.exception.UnauthorizedAccessException;
import com.example.demo.model.Task;
import com.example.demo.model.Users;
import com.example.demo.repository.TaskRepo;
import com.example.demo.repository.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class TaskService {

    @Autowired
    private TaskRepo repo;

    @Autowired
    private UserRepo userRepo;

    public List<Task> getAllTask(){
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        String username = ((UserDetails) principal).getUsername();
        Users user = userRepo.findByUsername(username);

        if(user == null){
            throw new ResourceNotFoundException("user not found " + username);
        }

        return user.getTasks();
    }

    public Task addTask(Task task){
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        String username = ((UserDetails) principal).getUsername();
        Users user = userRepo.findByUsername(username);

        if(user == null) throw new ResourceNotFoundException("User not found: " + username);

        task.setUser(user);
        return repo.save(task);

    }

    public Task updateTask(Task task , int id){
        return repo.findById(id).map(singleTask -> {
            singleTask.setTitle(task.getTitle());
            singleTask.setDescription(task.getDescription());
            singleTask.setPriority(task.getPriority());
            singleTask.setDate(task.getDate());
            singleTask.setStatus(task.getStatus());
            return repo.save(singleTask);
        }).orElse(null);
    }

    public String deleteTask(int id){

        Optional<Task> optionalTask = repo.findById(id);

        if(optionalTask.isPresent()){

            Task task = optionalTask.get();
            Users user = task.getUser();

            user.getTasks().removeIf(t -> t.getTask_id() == id);
            userRepo.save(user);

            repo.deleteById(id);

            return "Task Deleted Succesfully";
        }
        else{
            throw new ResourceNotFoundException("Resource with "+ id + " not found");
        }
    }

    public List<Task> getTaskWithStatus(String status){
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        String username = ((UserDetails) principal).getUsername();
        Users user = userRepo.findByUsername(username);

        if(user == null){
            throw new ResourceNotFoundException("user not found " + username);
        }

        return repo.findByStatusAndUser_UserId(status, user.getUserId());
    }

}
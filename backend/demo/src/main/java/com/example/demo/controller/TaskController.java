package com.example.demo.controller;

import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.model.Task;
import com.example.demo.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
public class TaskController {

    @Autowired
    private TaskService service;

    @GetMapping("/tasks")
    public ResponseEntity<List<Task>> getAllTask(){
        try{
            List<Task> tasks = service.getAllTask();
            return new ResponseEntity<>(tasks, HttpStatus.OK);
        }
        catch(ResourceNotFoundException e){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping("/tasks")
    public ResponseEntity<Task> addTask(@RequestBody Task task){
        try{
            Task newTask = service.addTask(task);
            return new ResponseEntity<>(newTask, HttpStatus.CREATED);
        }
        catch (ResourceNotFoundException e){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PutMapping("/tasks/{task_id}")
    public ResponseEntity<Task> updateTask(@RequestBody Task task, @PathVariable int task_id){
        Task updatedTask = service.updateTask(task, task_id);
        if(updatedTask == null){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(updatedTask, HttpStatus.OK);
    }

    @DeleteMapping("/tasks/{task_id}")
    public ResponseEntity<String> deleteTask(@PathVariable int task_id){
        try{
            String res = service.deleteTask(task_id);
            return new ResponseEntity<>(res, HttpStatus.OK);
        }
        catch (ResourceNotFoundException e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/tasks/status/{status}")
    public ResponseEntity<List<Task>> getTaskWithStatus(@PathVariable String status){
        try{
            List<Task> tasks = service.getTaskWithStatus(status);
            return new ResponseEntity<>(tasks, HttpStatus.OK);
        }
        catch (ResourceNotFoundException e){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

}

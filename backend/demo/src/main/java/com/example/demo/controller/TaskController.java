package com.example.demo.controller;

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
    public List<Task> getAllTask(){
        return service.getAllTask();
    }

    @PostMapping("/tasks")
    public ResponseEntity<Task> addTask(@RequestBody Task task){
        return new ResponseEntity<>(service.addTask(task), HttpStatus.CREATED);
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
        return service.deleteTask(task_id);
    }

    @GetMapping("/tasks/status/{status}")
    public List<Task> getTaskWithStatus(@PathVariable String status){
        return service.getTaskWithStatus(status);
    }

}

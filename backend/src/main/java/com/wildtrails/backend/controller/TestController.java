package com.wildtrails.backend.controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/")
public class TestController {

    @GetMapping
    public String getTestMessage() {
        return "Hello, this is a test message!";
    }
}

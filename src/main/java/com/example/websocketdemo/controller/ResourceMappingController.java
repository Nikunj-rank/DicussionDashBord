package com.example.websocketdemo.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class ResourceMappingController {

    @GetMapping("/")
    public String root() {
        return "login";
    }

    @GetMapping("/login")
    public String login() {
        return "login";
    }

    @GetMapping("/topic")
    public String listOfTopic() {
        return "index";
    }

    @GetMapping("/dashboard")
    public String getDashboard() {
        return "dashboard";
    }

    @GetMapping("/addTopic")
    public String addTopic() {
        return "addTopic";
    }

    @GetMapping("/index")
    public String index() {
        return "index";
    }
}
package com.example.websocketdemo.controller;

import com.example.websocketdemo.model.ChatMessage;
import com.example.websocketdemo.model.Comment;
import com.example.websocketdemo.model.Discussion;
import com.example.websocketdemo.model.Topic;
import com.example.websocketdemo.service.SqlService;
import com.google.gson.Gson;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;

import java.util.List;
import java.util.concurrent.CompletionException;

@Controller
public class DiscussionController {

    @Autowired
    SqlService sqlService;

    private Gson gson = new Gson();

    @MessageMapping("/chat.sendMessage")
    @SendTo("/channel/public")
    public ChatMessage sendMessage(@Payload ChatMessage chatMessage) {
        return chatMessage;
    }

    @MessageMapping("/chat.addUser")
    @SendTo("/channel/public")
    public ChatMessage addUser(@Payload ChatMessage chatMessage,
                               SimpMessageHeaderAccessor headerAccessor) {
        headerAccessor.getSessionAttributes().put("username", chatMessage.getSender());
        return chatMessage;
    }

    @MessageMapping("/chat.addTopic")
    @SendTo("/channel/public")
    public Topic addTopic(@Payload Topic topic,
                          SimpMessageHeaderAccessor headerAccessor) {
        headerAccessor.getSessionAttributes().put("username", topic.getUsername());
        return topic;
    }

    @MessageMapping("/chat.addDiscussion")
    @SendTo("/channel/public")
    public Discussion addDiscussion(@Payload Discussion discussion,
                                    SimpMessageHeaderAccessor headerAccessor) {
        headerAccessor.getSessionAttributes().put("username", discussion.getUserName());
        return discussion;
    }

    @MessageMapping("/chat.addComment")
    @SendTo("/channel/public")
    public Comment addComment(@Payload Comment comment,
                              SimpMessageHeaderAccessor headerAccessor) {
        headerAccessor.getSessionAttributes().put("username", comment.getUserName());
        return comment;
    }


    @PostMapping("/topics")
    public ResponseEntity<String> getAllTopic() {
        return new ResponseEntity<>(gson.toJson(sqlService.getAllTopic()), HttpStatus.ACCEPTED);
    }


}

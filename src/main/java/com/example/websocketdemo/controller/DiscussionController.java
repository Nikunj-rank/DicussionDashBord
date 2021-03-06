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
import org.springframework.web.bind.annotation.RequestBody;

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

    @MessageMapping("/chat.addDiscussion")
    @SendTo("/channel/public")
    public Discussion addDiscussion(@Payload Discussion discussion,
                                    SimpMessageHeaderAccessor headerAccessor) {
        headerAccessor.getSessionAttributes().put("type", "discussion");
        sqlService.addDiscussion(discussion);
        return discussion;
    }

    @MessageMapping("/chat.addComment")
    @SendTo("/channel/public")
    public Comment addComment(@Payload Comment comment,
                              SimpMessageHeaderAccessor headerAccessor) {
        headerAccessor.getSessionAttributes().put("username", comment.getUserName());
        sqlService.addComment(comment);
        return comment;
    }


    @MessageMapping("/chat.topic.like")
    @SendTo("/channel/public")
    public Topic addTopicLike(@Payload Topic topic,
                              SimpMessageHeaderAccessor headerAccessor) {
        return sqlService.addTopicLike(topic);
    }


    @PostMapping("/topics")
    public ResponseEntity<String> getAllTopic() {
        return new ResponseEntity<>(gson.toJson(sqlService.getAllTopic()), HttpStatus.ACCEPTED);
    }

    @PostMapping(value = "/topic", headers = "Accept=application/json")
    public ResponseEntity<Boolean> addTopic(@RequestBody Topic topic) {
        sqlService.addTopic(topic);
        return new ResponseEntity<>( HttpStatus.ACCEPTED);
    }

    @PostMapping(value = "/topic/id", headers = "Accept=application/json")
    public ResponseEntity<String> getTopic(@RequestBody int topicId) {
        return new ResponseEntity<>(gson.toJson(sqlService.getTopic(topicId)), HttpStatus.ACCEPTED);
    }


}

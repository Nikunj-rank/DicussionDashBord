package com.example.websocketdemo.service;

import com.example.websocketdemo.model.Topic;
import com.example.websocketdemo.repository.TopicRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class SqlService {
    @Autowired
    TopicRepo topicRepo;

    public List<Topic> getAllTopic(){
        List<Topic> topics = new ArrayList<>();
        topicRepo.findAll().forEach(topics::add);
        return topics;
    }

    public void addTopic(Topic topic){
        topicRepo.save(topic);
    }
}

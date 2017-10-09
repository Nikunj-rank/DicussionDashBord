package com.example.websocketdemo.service;

import com.example.websocketdemo.model.Discussion;
import com.example.websocketdemo.model.Topic;
import com.example.websocketdemo.repository.DiscussionRepo;
import com.example.websocketdemo.repository.TopicRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class SqlService {

    @Autowired
    TopicRepo topicRepo;

    @Autowired
    DiscussionRepo discussionRepo;

    public List<Topic> getAllTopic(){
        List<Topic> topics = new ArrayList<>();
        topicRepo.findAll().forEach(topics::add);
        return topics;
    }

    public void addTopic(Topic topic){
        topicRepo.save(topic);
    }

    public Topic getTopic(int topicId){
        return topicRepo.findOne(topicId);
    }

    public void addDiscussion(Discussion discussion){
        discussionRepo.save(discussion);
    }
}

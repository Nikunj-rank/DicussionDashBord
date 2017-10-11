package com.example.websocketdemo.service;

import com.example.websocketdemo.model.*;
import com.example.websocketdemo.repository.CommentRepo;
import com.example.websocketdemo.repository.DiscussionRepo;
import com.example.websocketdemo.repository.TopicRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class SqlService {

    @Autowired
    TopicRepo topicRepo;

    @Autowired
    DiscussionRepo discussionRepo;

    @Autowired
    CommentRepo commentRepo;

    int count=1;

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
        discussion.setDiscussionId(count++);
        Topic one = topicRepo.findOne(discussion.getTopicId());
        one.getDiscussions().put(discussion.getDiscussionId(),discussion);
        topicRepo.save(one);
    }

    public void addComment(Comment comment){
        commentRepo.save(comment);
        Topic one1 = topicRepo.findOne(comment.getTopicId());
        one1.getDiscussions().get(comment.getDiscussionId()).getCommentList().put(comment.getCommentId(),comment);
        discussionRepo.save(one1.getDiscussions().get(comment.getDiscussionId()));
        topicRepo.save(one1);
        System.out.println(one1);
    }

    public Topic addTopicLike(Topic topic){
        Topic one1 = topicRepo.findOne(topic.getTopicId());

        if(topic.getListOfUserLiked()==null){
            if(one1.getListOfUserDisLiked().contains(topic.getUserName())){
                one1.getListOfUserDisLiked().remove(topic.getUserName());
            }else {
                one1.getListOfUserLiked().remove(topic.getUserName());
                one1.getListOfUserDisLiked().add(topic.getUserName());
            }
        }else {
            if(one1.getListOfUserLiked().contains(topic.getUserName())){
                one1.getListOfUserLiked().remove(topic.getUserName());
            }else {
                one1.getListOfUserDisLiked().remove(topic.getUserName());
                one1.getListOfUserLiked().add(topic.getUserName());
            }
        }
        topicRepo.save(one1);
        one1.setMessageType(MessageType.TLIKE);
        return one1;
    }
}

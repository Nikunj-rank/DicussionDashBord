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
    private TopicRepo topicRepo;

    @Autowired
    private DiscussionRepo discussionRepo;

    @Autowired
    private CommentRepo commentRepo;

    public List<Topic> getAllTopic() {
        List<Topic> topics = new ArrayList<>();
        topicRepo.findAll().forEach(topics::add);
        return topics;
    }

    public void addTopic(Topic topic) {
        topicRepo.save(topic);
    }

    public Topic getTopic(int topicId) {
        return topicRepo.findOne(topicId);
    }

    public void addDiscussion(Discussion discussion) {
        discussionRepo.save(discussion);
        Topic one = topicRepo.findOne(discussion.getTopicId());
        one.getDiscussions().put(discussion.getDiscussionId(), discussion);
        topicRepo.save(one);
    }

    public void addComment(Comment comment) {
        commentRepo.save(comment);
        Topic topic = topicRepo.findOne(comment.getTopicId());
        topic.getDiscussions().get(comment.getDiscussionId()).getCommentList().put(comment.getCommentId(), comment);
        discussionRepo.save(topic.getDiscussions().get(comment.getDiscussionId()));
        topicRepo.save(topic);
        System.out.println(topic);
    }

    public Topic addTopicLike(Topic topic) {
        Topic topicObj = topicRepo.findOne(topic.getTopicId());
        String userName = topic.getUserName();

        if (topic.getListOfUserLiked() == null) {
            if (topicObj.getListOfUserDisLiked().contains(userName)) {
                topicObj.getListOfUserDisLiked().remove(userName);
            } else {
                topicObj.getListOfUserLiked().remove(userName);
                topicObj.getListOfUserDisLiked().add(userName);
            }
        } else {
            if (topicObj.getListOfUserLiked().contains(userName)) {
                topicObj.getListOfUserLiked().remove(userName);
            } else {
                topicObj.getListOfUserDisLiked().remove(userName);
                topicObj.getListOfUserLiked().add(userName);
            }
        }
        topicRepo.save(topicObj);
        topicObj.setMessageType(MessageType.TLIKE);
        return topicObj;
    }

    public Discussion addDiscussionLike(Discussion discussion) {
        Topic topicObj = topicRepo.findOne(discussion.getTopicId());
        String userName = discussion.getUserName();
        Discussion discussion1 = topicObj.getDiscussions().get(discussion.getDiscussionId());

        if (discussion.getListOfUserLiked() != null) {
            if (discussion1.getListOfUserLiked().contains(userName)) {
                discussion1.getListOfUserLiked().remove(userName);
            } else {
                discussion1.getListOfUserDisLiked().remove(userName);
                discussion1.getListOfUserLiked().add(userName);
            }
        } else {
            if (discussion1.getListOfUserDisLiked().contains(userName)) {
                discussion1.getListOfUserDisLiked().remove(userName);
            } else {
                discussion1.getListOfUserLiked().remove(userName);
                discussion1.getListOfUserDisLiked().add(userName);
            }
        }
        topicObj.getDiscussions().put(discussion.getDiscussionId(), discussion1);
        discussionRepo.save(discussion1);
        topicRepo.save(topicObj);
        topicObj.setMessageType(MessageType.DLIKE);
        discussion1.setMessageType(MessageType.DLIKE);
        return discussion1;
    }
}

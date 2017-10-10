package com.example.websocketdemo.model;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.util.List;

@Getter
@Setter
@Entity
@EqualsAndHashCode(of = {"discussionId","commentId"}, callSuper = false)
@IdClass(CommentPk.class)
public class Comment {
    @Id
    private int commentId;
    @Id
    private int discussionId;
    private int topicId;
    private String comment;
    private String userName;
    @ElementCollection
    private List<String> listOfUserLiked;
    @ElementCollection
    private List<String> listOfUserDisLiked;
    private long dateTime;
    MessageType messageType;
}

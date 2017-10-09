package com.example.websocketdemo.model;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.util.List;

@Getter
@Setter
@Entity
public class Discussion {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int id;
    private int topicId;
    private String post;
    private String userName;
    @ElementCollection
    private List<Comment> commentList;
    @ElementCollection
    private List<String> listOfUserLiked;
    @ElementCollection
    private List<String> listOfUserDisLiked;
    private long dateTime;
    MessageType messageType;
}

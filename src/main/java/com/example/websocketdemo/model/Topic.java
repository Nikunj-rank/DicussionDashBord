package com.example.websocketdemo.model;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.util.List;

@Getter
@Setter
@Entity
public class Topic {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int id;
    private String subject;
    @ElementCollection
    private List<String> tags;
    @ElementCollection
    private List<String> keyWords;
    private String desc;
    private String url;
    private String username;
    @ElementCollection
    private List<String> listOfUserLiked;
    @ElementCollection
    private List<String> listOfUserDisLiked;
    @ElementCollection
    private List<Discussion> discussions;
    private long dateTime;
    MessageType messageType;
}

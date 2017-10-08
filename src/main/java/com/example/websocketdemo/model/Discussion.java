package com.example.websocketdemo.model;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.ElementCollection;
import javax.persistence.Entity;
import javax.persistence.Id;
import java.util.List;

@Getter
@Setter
@Entity
public class Discussion {
    @Id
    private int id;
    private String post;
    private String userName;
    @ElementCollection
    private List<Comment> commentList;
    @ElementCollection
    private List<String> listOfUserLiked;
    @ElementCollection
    private List<String> listOfUserDisLiked;
    private long dateTime;
}

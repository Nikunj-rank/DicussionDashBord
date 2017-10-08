package com.example.websocketdemo.model;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.ElementCollection;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Entity;
import javax.persistence.Id;
import java.util.List;

@Getter
@Setter
@Entity
public class Comment {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int id;
    private String comment;
    private String userName;
    @ElementCollection
    private List<String> listOfUserLiked;
    @ElementCollection
    private List<String> listOfUserDisLiked;
    private long dateTime;
}

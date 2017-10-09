package com.example.websocketdemo.model;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.util.List;

@Getter
@Setter
@Entity
@EqualsAndHashCode(of = {"topicId"}, callSuper = false)
public class Topic {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int topicId;
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
    @OneToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL, mappedBy = "topicId")
    private List<Discussion> discussions;
    private long dateTime;
    MessageType messageType;
}

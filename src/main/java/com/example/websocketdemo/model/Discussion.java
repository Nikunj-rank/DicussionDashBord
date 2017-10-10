package com.example.websocketdemo.model;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.util.List;
import java.util.Map;

@Getter
@Setter
@Entity
//@EqualsAndHashCode(of = {"topicId", "discussionId"}, callSuper = false)
//@IdClass(DiscussionPk.class)
public class Discussion {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int discussionId;
    private int topicId;
    private String post;
    private String userName;
    @OneToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @ElementCollection
    private Map<Integer,Comment> commentList;
    @ElementCollection
    private List<String> listOfUserLiked;
    @ElementCollection
    private List<String> listOfUserDisLiked;
    private long dateTime;
    MessageType messageType;
}

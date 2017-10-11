package com.example.websocketdemo.model;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.LazyCollection;
import org.hibernate.annotations.LazyCollectionOption;

import javax.persistence.*;
import java.util.List;
import java.util.Map;

@Getter
@Setter
@Entity
public class Discussion {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int discussionId;
    private int topicId;
    private String post;
    private String userName;
    @ElementCollection
    @LazyCollection(LazyCollectionOption.FALSE)
    private Map<Integer, Comment> commentList;
    @LazyCollection(LazyCollectionOption.FALSE)
    @ElementCollection
    private List<String> listOfUserLiked;
    @ElementCollection
    @LazyCollection(LazyCollectionOption.FALSE)
    private List<String> listOfUserDisLiked;
    private long dateTime;
    MessageType messageType;
}

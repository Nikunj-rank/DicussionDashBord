package com.example.websocketdemo.model;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.LazyCollection;
import org.hibernate.annotations.LazyCollectionOption;

import javax.persistence.*;
import java.util.List;
import java.util.Set;

@Getter
@Setter
@Entity
public class Comment {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int commentId;
    private int discussionId;
    private int topicId;
    private String comment;
    private String userName;
    @ElementCollection
    @LazyCollection(LazyCollectionOption.FALSE)
    private Set<String> listOfUserLiked;
    @ElementCollection
    @LazyCollection(LazyCollectionOption.FALSE)
    private Set<String> listOfUserDisLiked;
    private long dateTime;
    MessageType messageType;
}

package com.example.websocketdemo.model;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;
import org.hibernate.annotations.LazyCollection;
import org.hibernate.annotations.LazyCollectionOption;

import javax.persistence.*;
import java.util.List;
import java.util.Map;
import java.util.Set;

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
    @LazyCollection(LazyCollectionOption.FALSE)
    private List<String> tags;
    @ElementCollection
    @LazyCollection(LazyCollectionOption.FALSE)
    private List<String> keyWords;
    private String desc;
    private String url;
    private String userName;
    @ElementCollection
    @LazyCollection(LazyCollectionOption.FALSE)
    private Set<String> listOfUserLiked;
    @ElementCollection
    @LazyCollection(LazyCollectionOption.FALSE)
    private Set<String> listOfUserDisLiked;
    @OneToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    private Map<Integer,Discussion> discussions;
    private long dateTime;
    MessageType messageType;
}

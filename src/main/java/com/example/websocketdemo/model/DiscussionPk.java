
package com.example.websocketdemo.model;

import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;

@Getter
@Setter
public class DiscussionPk implements Serializable {

    int topicId;
    int discussionId;
}

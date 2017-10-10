
package com.example.websocketdemo.model;

import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;

@Getter
@Setter
class CommentPk implements Serializable {

    int commentId;
    int discussionId;
}

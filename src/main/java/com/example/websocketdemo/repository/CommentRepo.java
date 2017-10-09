package com.example.websocketdemo.repository;

import com.example.websocketdemo.model.Comment;
import com.example.websocketdemo.model.Topic;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CommentRepo extends CrudRepository<Comment, Integer> {
}

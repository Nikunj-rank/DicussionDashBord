package com.example.websocketdemo.repository;

import com.example.websocketdemo.model.Topic;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DiscussionRepo extends CrudRepository<Topic, String> {
}

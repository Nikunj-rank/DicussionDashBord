package com.example.websocketdemo.model;


import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import java.io.Serializable;

@Getter
@Setter
@Entity
@Table(name = "user_roles")
@ToString
public class user_roles implements Serializable {

    @Column(name = "username")
    @Id
    String userName;

    String role;
}

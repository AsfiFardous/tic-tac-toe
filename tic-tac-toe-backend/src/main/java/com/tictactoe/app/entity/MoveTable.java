package com.tictactoe.app.entity;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity
public class MoveTable {

    @Id
    @GeneratedValue(strategy=GenerationType.AUTO)
    private Integer move_id;

    private Integer user_id;
    private Integer game_id;
    private String cur_state;
    private Integer position;

    public Integer getUser_id() {
        return user_id;
    }

    public void setUser_id(Integer user_id) {
        this.user_id = user_id;
    }

    public Integer getGame_id() {
        return game_id;
    }

    public void setGame_id(Integer game_id) {
        this.game_id = game_id;
    }

    public String getCur_state() {
        return cur_state;
    }

    public void setCur_state(String cur_state) {
        this.cur_state = cur_state;
    }

    public Integer getPosition() {
        return position;
    }

    public void setPosition(Integer position) {
        this.position = position;
    }

}

package com.tictactoe.app.entity;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity
public class PlayAgainTable {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;
    private Integer gameId;
    private Integer newGameId;
    private Integer firstPlayerId;

    private Integer secondPlayerId;
    private String gameStatus;
    private String newGameStatus;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getGameId() {
        return gameId;
    }

    public void setGameId(Integer gameId) {
        this.gameId = gameId;
    }

    public Integer getNewGameId() {
        return newGameId;
    }

    public void setNewGameId(Integer newGameId) {
        this.newGameId = newGameId;
    }

    public Integer getFirstPlayerId() {
        return firstPlayerId;
    }

    public void setFirstPlayerId(Integer firstPlayerId) {
        this.firstPlayerId = firstPlayerId;
    }

    public Integer getSecondPlayerId() {
        return secondPlayerId;
    }

    public void setSecondPlayerId(Integer secondPlayerId) {
        this.secondPlayerId = secondPlayerId;
    }

    public String getGameStatus() {
        return gameStatus;
    }

    public void setGameStatus(String gameStatus) {
        this.gameStatus = gameStatus;
    }

    public String getNewGameStatus() {
        return newGameStatus;
    }

    public void setNewGameStatus(String newGameStatus) {
        this.newGameStatus = newGameStatus;
    }
}

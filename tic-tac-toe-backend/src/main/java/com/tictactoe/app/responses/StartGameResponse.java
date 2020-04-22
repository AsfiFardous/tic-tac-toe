package com.tictactoe.app.responses;

public class StartGameResponse {
    private Integer gameId, firstPlayer, secondPlayer;
    private String status;

    private String username1;
    private String username2;

    public StartGameResponse(Integer gameId, Integer firstPlayer, Integer secondPlayer, String status, String username1, String username2) {
        this.gameId = gameId;
        this.firstPlayer = firstPlayer;
        this.secondPlayer = secondPlayer;
        this.status = status;
        this.username1 = username1;
        this.username2 = username2;
    }

    public Integer getGameId() {
        return gameId;
    }

    public void setGameId(Integer gameId) {
        this.gameId = gameId;
    }

    public Integer getFirstPlayer() {
        return firstPlayer;
    }

    public void setFirstPlayer(Integer firstPlayer) {
        this.firstPlayer = firstPlayer;
    }

    public Integer getSecondPlayer() {
        return secondPlayer;
    }

    public void setSecondPlayer(Integer secondPlayer) {
        this.secondPlayer = secondPlayer;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getUsername1() {
        return username1;
    }

    public void setUsername1(String username1) {
        this.username1 = username1;
    }

    public String getUsername2() {
        return username2;
    }

    public void setUsername2(String username2) {
        this.username2 = username2;
    }
}


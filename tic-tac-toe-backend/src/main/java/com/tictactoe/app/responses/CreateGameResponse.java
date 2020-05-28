package com.tictactoe.app.responses;

public class CreateGameResponse {
    private int gameId,userId;
    private String username,status;
    private String username1;
    private Integer opponent;
    private String username2;

    public CreateGameResponse(int gameId, int userId, String username, String status, String username1, Integer opponent,String username2) {
        this.gameId = gameId;
        this.userId = userId;
        this.username = username;
        this.status = status;
        this.username1 = username1;
        this.opponent = opponent;
        this.username2 = username2;
    }

    public int getGameId() {
        return gameId;
    }

    public void setGameId(int gameId) {
        this.gameId = gameId;
    }

    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
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

    public Integer getOpponent() {
        return opponent;
    }

    public void setOpponent(Integer opponent) {
        this.opponent = opponent;
    }

    public String getUsername2() {
        return username2;
    }

    public void setUsername2(String username2) {
        this.username2 = username2;
    }
}

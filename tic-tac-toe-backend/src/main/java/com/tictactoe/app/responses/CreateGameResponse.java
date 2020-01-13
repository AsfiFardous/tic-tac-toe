package com.tictactoe.app.responses;

public class CreateGameResponse {
    private int gameId,userId;
    private String status;

    public CreateGameResponse(int gameId, int userId, String status) {
        this.gameId = gameId;
        this.userId = userId;
        this.status = status;
//        this.value= value;
    }

    public int getGameId() {
        return gameId;
    }

    public int getUserId() {
        return userId;
    }

    public void setGameId(int gameId) {
        this.gameId = gameId;
    }
    public String getStatus() {
        return status;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public void setStatus(String status) {
        this.status = status;
    }

//    public String getValue() {
//        return value;

}

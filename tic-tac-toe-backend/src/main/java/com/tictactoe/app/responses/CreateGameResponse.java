package com.tictactoe.app.responses;

public class CreateGameResponse {
    private int gameId,userId;

    public CreateGameResponse(int gameId,int userId) {
        this.gameId = gameId;
        this.userId= userId;
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
}

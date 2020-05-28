package com.tictactoe.app.responses;

public class PlayAgainGameResponse {
    private int gameId;
    private int firstPlayer;
    private int secondPlayer;
    private int next;
    private String username1 ;
    private String username2 ;
    public PlayAgainGameResponse(int gameId, int firstPlayer, int secondPlayer, int next, String username1,  String username2) {
        this.gameId = gameId;
        this.firstPlayer = firstPlayer;
        this.secondPlayer = secondPlayer;
        this.next = next;
        this.username1= username1;
        this.username2= username2;


    }

    public int getGameId() {
        return gameId;
    }

    public void setGameId(int gameId) {
        this.gameId = gameId;
    }

    public int getFirstPlayer() {
        return firstPlayer;
    }

    public void setFirstPlayer(int firstPlayer) {
        this.firstPlayer = firstPlayer;
    }

    public int getSecondPlayer() {
        return secondPlayer;
    }

    public void setSecondPlayer(int secondPlayer) {
        this.secondPlayer = secondPlayer;
    }

    public int getNext() {
        return next;
    }

    public void setNext(int next) {
        this.next = next;
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

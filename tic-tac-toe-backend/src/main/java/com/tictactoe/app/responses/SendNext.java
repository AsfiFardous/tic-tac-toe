package com.tictactoe.app.responses;

public class SendNext {
    private Integer next,position;
    private String lastValue;
    private String status;


    public SendNext(Integer next,String lastValue, Integer position, String status) {
        this.next = next;
        this.lastValue = lastValue;
        this.position = position;
        this.status = status;
    }

    public Integer getNext() {
        return next;
    }

    public void setNext(Integer next) {
        this.next = next;
    }

    public String getLastValue() {
        return lastValue;
    }

    public void setLastValue(String lastValue) {
        this.lastValue = lastValue;
    }

    public Integer getPosition() {
        return position;
    }

    public void setPosition(Integer position) {
        this.position = position;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}

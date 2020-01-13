package com.tictactoe.app.responses;

public class SendPlayerValue {
    private String value;
    public SendPlayerValue (String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }
}

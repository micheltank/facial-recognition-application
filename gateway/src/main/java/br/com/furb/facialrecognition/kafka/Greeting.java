package br.com.furb.facialrecognition.kafka;

public class Greeting {
    private String message;

    public Greeting() {
    }

    public String getMessage() {
        return message;
    }

    public Greeting setMessage(String message) {
        this.message = message;
        return this;
    }
}

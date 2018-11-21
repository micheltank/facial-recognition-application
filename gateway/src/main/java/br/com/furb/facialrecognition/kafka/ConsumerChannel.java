package br.com.furb.facialrecognition.kafka;

import org.springframework.cloud.stream.annotation.Input;
import org.springframework.messaging.SubscribableChannel;

public interface ConsumerChannel {

    String CHANNEL = "subscribableChannel";

    @Input
    SubscribableChannel subscribableChannel();
}
package br.com.furb.facialrecognition.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import feign.Request;

@Configuration
@EnableFeignClients(basePackages = "br.com.furb.facialrecognition")
public class FeignConfiguration {

    /**
     * Set the Feign specific log level to log client REST requests
     */
    @Bean
    feign.Logger.Level feignLoggerLevel() {
        return feign.Logger.Level.BASIC;
    }
    
    @Value("${feign.connectTimeout:10000}")
    private int connectTimeout;

    @Value("${feign.readTimeOut:300000}")
    private int readTimeout;

    @Bean
    public Request.Options options() {
        return new Request.Options(connectTimeout, readTimeout);
    }
}

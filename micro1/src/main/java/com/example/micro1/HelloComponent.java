package com.example.micro1;

import io.opentelemetry.instrumentation.annotations.WithSpan;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@Component
public class HelloComponent {

    @Value("${MICRO2_URL}")
    private String baseUrl;

    @WithSpan
    public Mono<String> getName() {
        return WebClient.create(baseUrl)
                .get()
                .uri("/name")
                .retrieve()
                .bodyToMono(String.class);
    }

    @WithSpan
    public String getGreeting() {
        return "Hello";
    }

}

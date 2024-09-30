package com.example.micro2;

import io.opentelemetry.instrumentation.annotations.WithSpan;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;

@Component
public class NameComponent {

    @WithSpan
    public Mono<String> getName() {
        return Mono.just("Andreas");
    }

}

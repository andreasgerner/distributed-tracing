package com.example.company;

import io.opentelemetry.instrumentation.annotations.WithSpan;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;

@Component
public class PaymentClient {

    @Value("${payment.url}")
    private String baseUrl;

    @WithSpan
    public List<Company.Payment> getPayments(long companyId) {
        return WebClient.create(baseUrl)
                .get()
                .uri("/payments?companyId=%d".formatted(companyId))
                .retrieve()
                .bodyToFlux(Company.Payment.class)
                .collectList()
                .block();
    }

}

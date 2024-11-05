package com.example.company;

import io.opentelemetry.api.trace.Span;
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
    public List<Company.PaymentDto> getPayments(long companyId) {
        final String uri = "/payments/%d".formatted(companyId);

        Span span = Span.current();
        span.setAttribute("request.url", baseUrl + uri);

        return WebClient.create(baseUrl)
                .get()
                .uri(uri)
                .retrieve()
                .bodyToFlux(Company.PaymentDto.class)
                .collectList()
                .block();
    }

}

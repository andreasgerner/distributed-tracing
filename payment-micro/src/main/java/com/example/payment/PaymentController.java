package com.example.payment;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@CrossOrigin
public class PaymentController {

    private final PaymentRepository paymentRepository;

    public PaymentController(PaymentRepository paymentRepository) {
        this.paymentRepository = paymentRepository;
    }

    @GetMapping("/payments/{id}")
    public ResponseEntity<List<Payment.PaymentDto>> getPayments(@PathVariable long id) {
        final List<Payment> payments = paymentRepository.findAllByCompanyId(id);
        return ResponseEntity.ok(
                payments.stream()
                        .map(Payment::toDto)
                        .collect(Collectors.toList())
        );
    }

    @PutMapping(value = "/payments/{id}", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Void> addPayment(@PathVariable long id,
                                           @RequestBody Payment.PaymentDto body) throws URISyntaxException {

        final Payment payment = new Payment();
        payment.setCompanyId(id);
        payment.setAmount(body.amount());

        paymentRepository.saveAndFlush(payment);
        return ResponseEntity.created(new URI("/payments/" + id)).build();
    }

}

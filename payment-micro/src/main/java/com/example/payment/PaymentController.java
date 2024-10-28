package com.example.payment;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class PaymentController {

    private final PaymentRepository paymentRepository;

    public PaymentController(PaymentRepository paymentRepository) {
        this.paymentRepository = paymentRepository;
    }

    @GetMapping("/payments")
    public ResponseEntity<List<Payment>> getPayments(@RequestParam("companyId") long companyId) {
        final List<Payment> payments = paymentRepository.findAllByCompanyId(companyId);
        return ResponseEntity.ok(payments);
    }

}

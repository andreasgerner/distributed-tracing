package com.example.payment;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class Payment {

    public record PaymentDto(double amount) {}

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    @Column(name = "id", nullable = false)
    private Long id;

    @Column(name = "company_id", nullable = false)
    private Long companyId;

    @Column(name = "amount", nullable = false)
    private Double amount;

    public PaymentDto toDto() {
        return new PaymentDto(amount);
    }

}

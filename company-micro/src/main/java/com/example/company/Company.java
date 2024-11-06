package com.example.company;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Entity
@Getter
@Setter
public class Company {

    public record CompanyDto(long id, String name) {
    }

    public record PaymentDto(int amount) {
    }

    public record CompanyWithPaymentsDto(long id, String name, List<PaymentDto> payments) {
    }

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    @Column(name = "id", nullable = false)
    private Long id;

    @Column(name = "name", nullable = false)
    private String name;

    @Transient
    private List<PaymentDto> payments;

    public CompanyDto toDto() {
        return new CompanyDto(this.id, this.name);
    }

    public CompanyWithPaymentsDto toPaymentsDto() {
        return new CompanyWithPaymentsDto(this.id, this.name, this.payments);
    }

}

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

    public record Payment(long id, double amount) {
    }

    public record CompanyWithPaymentsDto(long id, String name, List<Payment> payments) {
    }

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id", nullable = false)
    private Long id;

    @Column(name = "name", nullable = false)
    private String name;

    @Transient
    private List<Payment> payments;

    public CompanyDto toDto() {
        return new CompanyDto(this.id, this.name);
    }

    public CompanyWithPaymentsDto toPaymentsDto() {
        return new CompanyWithPaymentsDto(this.id, this.name, this.payments);
    }
}

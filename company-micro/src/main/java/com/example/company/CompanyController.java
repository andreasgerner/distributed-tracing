package com.example.company;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@CrossOrigin
public class CompanyController {

    private final CompanyRepository companyRepository;
    private final PaymentClient paymentClient;

    public CompanyController(CompanyRepository companyRepository, PaymentClient paymentClient) {
        this.companyRepository = companyRepository;
        this.paymentClient = paymentClient;
    }

    @GetMapping("/companies")
    public ResponseEntity<List<Company.CompanyDto>> getCompanies() {
        final List<Company> companies = companyRepository.findAll();
        return ResponseEntity.ok(
                companies.stream()
                        .map(Company::toDto)
                        .collect(Collectors.toList())
        );
    }

    @GetMapping("/companies/{id}")
    public ResponseEntity<Company.CompanyWithPaymentsDto> getCompany(@PathVariable long id) {
        final Company company = companyRepository.findCompanyById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        final List<Company.PaymentDto> payments = paymentClient.getPayments(company.getId());
        company.setPayments(payments);

        return ResponseEntity.ok(company.toPaymentsDto());
    }

}

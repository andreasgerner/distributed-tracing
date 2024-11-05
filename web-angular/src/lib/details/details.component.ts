import { Component, OnInit } from "@angular/core";
import { NgForOf, NgIf } from "@angular/common";
import { Company } from "../types";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { AddPaymentComponent } from "../add-payment/add-payment.component";

@Component({
  standalone: true,
  templateUrl: "./details.component.html",
  imports: [
    NgForOf,
    AddPaymentComponent,
    NgIf,
    RouterLink,
  ],
  styleUrl: "./details.component.css"
})
export class DetailsComponent implements OnInit {

  company: Company | undefined;

  formatter = new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
  });

  constructor(private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.route.data.subscribe(({company}) => this.company = company);
  }

}

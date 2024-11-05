import { Component, OnInit } from "@angular/core";
import { NgForOf } from "@angular/common";
import { Company } from "../types";
import { ActivatedRoute, RouterLink } from "@angular/router";

@Component({
  standalone: true,
  templateUrl: "./home.component.html",
  imports: [
    NgForOf,
    RouterLink,
  ],
  styleUrl: "./home.component.css"
})
export class HomeComponent implements OnInit {

  companies: Company[] = [];

  constructor(private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.route.data.subscribe(({companies}) => this.companies = companies);
  }

}

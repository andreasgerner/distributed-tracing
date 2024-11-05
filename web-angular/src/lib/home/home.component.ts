import { Component, OnInit } from "@angular/core";
import { NgForOf } from "@angular/common";
import { Company } from "../types";
import { ActivatedRoute } from "@angular/router";

@Component({
  standalone: true,
  templateUrl: "./home.component.html",
  imports: [
    NgForOf,
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

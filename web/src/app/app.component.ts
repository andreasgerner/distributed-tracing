import { Component, OnInit } from "@angular/core";
import { CurrencyPipe, NgForOf, NgIf, NgOptimizedImage } from "@angular/common";
import { Company } from "../lib/types";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  imports: [
    NgForOf,
    NgIf,
    CurrencyPipe,
    NgOptimizedImage
  ],
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {

  companies?: Company[];
  company?: Company;

  constructor(private http: HttpClient) {
  }

  ngOnInit() {
    this.http.get<Company[]>('http://company.localhost/companies')
      .subscribe(res => this.companies = res);
  }

  loadCompanyDetails(id: number) {
    this.http.get<Company>(`http://company.localhost/companies/${id}`)
      .subscribe(res => this.company = res);
  }

  closeDetails() {
    this.company = undefined;
  }
}

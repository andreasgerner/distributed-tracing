import { Injectable } from "@angular/core";
import { Resolve } from "@angular/router";
import { Company } from "../types";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({providedIn: "root"})
export class HomeResolver implements Resolve<Company[]> {
  constructor(private http: HttpClient) {
  }

  resolve(): Observable<Company[]> {
    return this.http.get<Company[]>("http://company.localhost/companies");
  }
}

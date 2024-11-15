import { Injectable } from "@angular/core";
import { Resolve } from "@angular/router";
import { Company } from "../types";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";

@Injectable({providedIn: "root"})
export class HomeResolver implements Resolve<Company[]> {
  constructor(private http: HttpClient) {
  }

  resolve(): Observable<Company[]> {
    return this.http.get<Company[]>(`${environment.companyUrl}/companies`);
  }
}

import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve } from "@angular/router";
import { Company } from "../types";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({providedIn: 'root'})
export class DetailsResolver implements Resolve<Company> {
  constructor(private http: HttpClient) {
  }

  resolve(route: ActivatedRouteSnapshot): Observable<Company> {
    return this.http.get<Company>(`http://company.localhost/companies/${route.paramMap.get("id")}`);
  }
}

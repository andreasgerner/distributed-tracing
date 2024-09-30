import { Component } from '@angular/core';
import { HttpClient } from "@angular/common/http";

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
})
export class AppComponent {
  text = "";

  constructor(private http: HttpClient) {
  }

  loadText() {
    this.http.get("http://micro1.localhost/hello", {responseType: "text"})
      .subscribe(value => {
        console.log(value)
        this.text = value;
      })
  }
}

import { Component } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { FormControl, ReactiveFormsModule } from "@angular/forms";

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [
    ReactiveFormsModule
  ]
})
export class AppComponent {
  text = "Nicht geladen"
  name = new FormControl('')

  constructor(private http: HttpClient) {
  }

  loadText() {
    this.http.get("http://micro1.localhost/hello", {responseType: "text"})
      .subscribe(value => {
        this.text = value
      })
  }

  saveName() {
    this.http.post("http://micro2.localhost/name", {
      name: this.name.value
    })
      .subscribe(() => {
        this.name.reset()
      })
  }
}

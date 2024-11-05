import { Component } from "@angular/core";
import { NgOptimizedImage } from "@angular/common";
import { RouterOutlet } from "@angular/router";

@Component({
  selector: "app-root",
  standalone: true,
  templateUrl: "./app.component.html",
  imports: [
    NgOptimizedImage,
    RouterOutlet
  ],
  styleUrl: "./app.component.css"
})
export class AppComponent {
}

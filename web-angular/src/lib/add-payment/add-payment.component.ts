import { Component, Input } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";

@Component({
  selector: "app-add-payment",
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: "./add-payment.component.html",
  styleUrl: "./add-payment.component.css"
})
export class AddPaymentComponent {
  @Input() companyId!: number;

  addPaymentForm = new FormGroup({
    amount: new FormControl()
  });

  constructor(private http: HttpClient, private router: Router) {
  }

  addPayment() {
    const trimmedAmount = Math.floor(this.addPaymentForm.value.amount * 100);
    const data = {
      amount: trimmedAmount
    };

    this.http.put(`http://payment.localhost/payments/${this.companyId}`, data).subscribe(async () => {
      await this.router.navigate([this.companyId], {onSameUrlNavigation: "reload"});
      this.addPaymentForm.reset();
    });
  }
}

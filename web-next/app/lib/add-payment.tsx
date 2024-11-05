import styles from "./add-payment.module.css";
import { revalidatePath } from "next/cache";

export default function AddPayment({companyId}: { companyId: number }) {

  async function addPayment(formData: FormData) {
    "use server";

    if (!process.env.PAYMENT_URL) return;

    const data = {
      amount: formData.get("amount")
    };

    const res = await fetch(`${process.env.PAYMENT_URL}/payments/${companyId}`, {
      method: "PUT",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json"
      }
    });

    if (res.ok) {
      revalidatePath(`/${companyId}`);
    }
  }

  return <form className={styles.form} action={addPayment}>
    <p>Neue Beitragszahlung hinzufügen:</p>
    <div>
      <input type={"number"} min={"0.01"} step={"0.01"} id={"amount"} name={"amount"}/>
      <button type="submit">Hinzufügen</button>
    </div>
  </form>
}

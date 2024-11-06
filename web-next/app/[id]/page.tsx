import { Company } from "@/types";
import styles from "./page.module.css";
import Link from "next/link";
import AddPayment from "@/app/lib/add-payment";

export default async function Details({params}: { params: Promise<{ id: string }> }) {
  if (!process.env.COMPANY_URL) return;

  const res = await fetch(`${process.env.COMPANY_URL}/companies/${(await params).id}`);
  const company: Company = await res.json();

  const formatter = new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
  });

  return <div className={styles.content}>
    <div className={styles.header}>
      <h1>{company.name}</h1>
      <Link href={"/"}>
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"
             fill="#000000">
          <path
            d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/>
        </svg>
      </Link>
    </div>
    <div>
      <p>Bisherige Beitragszahlungen:</p>
      {company.payments?.map((payment, idx) =>
        <p key={idx}>{formatter.format(payment.amount / 100)}</p>)}
    </div>
    <AddPayment companyId={company.id}/>
  </div>
}

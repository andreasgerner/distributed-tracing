import { Company } from "@/types";
import styles from './modal.module.css';
import Link from "next/link";

export default async function Modal({id}: { id: string }) {
  const res = await fetch(`http://company.localhost/companies/${id}`);
  const company: Company = await res.json();

  return <div className={styles.popover}>
    <div className={styles.content}>
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
        {company.payments?.map((payment, idx) => <p key={idx}>{payment.amount}</p>)}
      </div>
    </div>
  </div>
}

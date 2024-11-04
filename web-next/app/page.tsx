import styles from "@/app/page.module.css";
import Image from "next/image";
import { Company } from "@/types";
import Link from "next/link";

export const revalidate = 60;

export default async function Home() {
  const res = await fetch('http://company.localhost/companies');
  let companies: Company[] = await res.json();

  return (
    <div className={styles.page}>
      <div className={styles.title}>
        <Image src="./icon.svg" alt="Logo der Nürnberger Versicherung" width="40" height="40"/>
        <h1>Beitragsverwaltung</h1>
      </div>
      <table className={styles.table}>
        <thead>
        <tr>
          <th>Firmenname</th>
          <th>Aktionen</th>
        </tr>
        </thead>
        <tbody>
        {companies.map(company =>
          <tr key={company.id}>
            <td>{company.name}</td>
            <td>
              <Link className={styles.load} href={`/${company.id}`}>Details anzeigen</Link>
            </td>
          </tr>)}
        </tbody>
      </table>
    </div>
  )
    ;
}

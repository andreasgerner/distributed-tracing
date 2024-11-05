import React from "react";
import localFont from "next/font/local";
import { Metadata } from "next";
import "./global.css";
import styles from "@/app/layout.module.css";
import Image from "next/image";

const nbgFont = localFont({
  src: "./fonts/NuernbergerText-Regular.woff2",
  weight: "400",
});

export const metadata: Metadata = {
  title: "Web Next"
};

export default function RootLayout({children}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="de">
    <body className={nbgFont.className}>
    <div className={styles.page}>
      <div className={styles.title}>
        <Image src="./icon.svg" alt="Logo der Nürnberger Versicherung" width="40" height="40"/>
        <h1>Beitragsverwaltung</h1>
      </div>
      {children}
    </div>
    </body>
    </html>
  );
}

import React from "react";
import localFont from "next/font/local";
import { Metadata } from "next";
import './global.css';

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
    {children}
    </body>
    </html>
  );
}

import React from "react";
import "./globals.css";
import { Inter } from "next/font/google";
import { Providers } from "@/providers";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>Crowdsourced Meal Map</title>
      </head>
      <body className={`${inter.className} relative overflow-x-hidden`}>
        <div className="dotted-background"></div>
        <Providers>
          <div className="relative z-10">{children}</div>
        </Providers>
      </body>
    </html>
  );
}

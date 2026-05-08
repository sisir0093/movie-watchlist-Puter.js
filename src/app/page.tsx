"use client";

import Script from "next/script";
import { WatchlistApp } from "@/components/WatchlistApp";

export default function Home() {
  return (
    <>
      {/* Load Puter.js SDK from CDN */}
      <Script
        src="https://js.puter.com/v2/"
        strategy="beforeInteractive"
      />
      <WatchlistApp />
    </>
  );
}

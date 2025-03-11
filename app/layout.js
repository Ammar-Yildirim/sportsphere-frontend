"use client";

import "./globals.css";
import { LoadScript } from "@react-google-maps/api";

const libraries = ["places"];

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <LoadScript
          googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY}
          libraries={libraries}
        >
          {children}
        </LoadScript>
      </body>
    </html>
  );
}

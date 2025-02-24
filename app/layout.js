import "./globals.css";

export default function RootLayout({children}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <div className="absolute"></div>
        {children}
      </body>
    </html>
  );
}

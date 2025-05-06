import "./globals.css";

export const metadata = {
  title: "Eclero",
  description: "World's first peer to peer learning platform",
  icons: {
    icon: "/eclero-high-resolution-logo-transparent.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}

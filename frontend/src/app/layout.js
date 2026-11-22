import "./globals.css";

export const metadata = {
  title: "AI Ticket Classifier",
  description: "AI-powered customer support ticket classification dashboard",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}


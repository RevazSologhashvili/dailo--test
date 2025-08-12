import type { Metadata } from "next";
import { Roboto, Roboto_Mono, } from "next/font/google";
import "./globals.css";
import { UserProvider } from "./context/UserContext";


const geistSans = Roboto({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Roboto_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dailo.ai - Chats",
  description: "Callcenter for Company using Dailo.ai",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <UserProvider>
          {children}
        </UserProvider>
        <script async src="https://testwidget.dailo.ai/widget.js" data-client-key="uWKgosmm7Q3tVcElrArBsBVGTqDhRL8y" data-theme="forest"></script>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "@mantine/core/styles.css";
import "./globals.css";
import { ColorSchemeScript, mantineHtmlProps } from "@mantine/core";
import AppMantineProvider from "@/components/AppMantineProvider";
import CopilotProvider from "@/components/CopilotProvider";
import Sidebar from "@/components/Sidebar";

const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-open-sans",
});

export const metadata: Metadata = {
  title: "KELOLA - Dashboard Home",
  description: "HR Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" {...mantineHtmlProps} className={openSans.variable}>
      <head>
        <ColorSchemeScript />
      </head>
      <body className="min-h-screen bg-[#f8f9fa]">
        <AppMantineProvider>
          <CopilotProvider>
            <Sidebar />
            <main
              style={{
                minWidth: 0,
                minHeight: "100vh",
                marginLeft: "var(--sidebar-w, 220px)",
                transition: "margin-left 0.22s ease",
              }}
            >
              {children}
            </main>
          </CopilotProvider>
        </AppMantineProvider>
      </body>
    </html>
  );
}

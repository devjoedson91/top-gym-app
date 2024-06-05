"use client";
import "./globals.css";
import { Roboto } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/hooks/auth";
import { QueryClientProvider, QueryClient } from "react-query";
import TabControlProvider from "@/hooks/tab-control";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700", "900"],
});

const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <title>Top Gym</title>
        <meta name="description" content="Generated by create next app" />
      </head>
      <body className={`${roboto.className} antialiased text-white bg-default`}>
        <QueryClientProvider client={queryClient}>
          <TabControlProvider>
            <AuthProvider>
              <main>{children}</main>
              <Toaster />
            </AuthProvider>
          </TabControlProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}

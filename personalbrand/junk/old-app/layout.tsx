import type { Metadata } from "next";
import { Geist, Geist_Mono, Calistoga, Inter, JetBrains_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/components/theme-provider";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { CalEmbed } from "@/components/cal-embed";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const calistoga = Calistoga({
  variable: "--font-calistoga",
  subsets: ["latin"],
  weight: "400",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "Dr. Md. Shamsul Ahsan Maksud — Adult Psychiatry & Oral Medicine in Dhaka",
    template: "%s | Dr. Md. Shamsul Ahsan Maksud",
  },
  description:
    "Adult Psychiatry & Oral Medicine in Dhaka. Psychiatrist, Oral Medicine specialist and Addiction Psychiatrist.",
  openGraph: {
    title: "Dr. Md. Shamsul Ahsan Maksud",
    description: "Adult Psychiatry & Oral Medicine in Dhaka.",
    type: "website",
    url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dr. Md. Shamsul Ahsan Maksud",
    description: "Adult Psychiatry & Oral Medicine in Dhaka.",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${calistoga.variable} ${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='dark'||(!t&&matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark')}}catch(e){}})();`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <ClerkProvider>
          <ThemeProvider>
            <CalEmbed />
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
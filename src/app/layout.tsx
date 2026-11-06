import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: {
    default: "NotHuman.ai — No-Code Voice AI Agents for Bharat",
    template: "%s · NotHuman.ai",
  },
  description:
    "Design, train and deploy human-like voice AI agents in English, Hindi, Tamil, Telugu and 9 more Indian languages — no code required. Built for calls, WhatsApp and IVR at India scale.",
  keywords: [
    "voice AI",
    "no-code voice agent",
    "conversational AI India",
    "multilingual voice bot",
    "IVR automation",
    "AI call centre India",
    "DPDP compliant AI",
  ],
  openGraph: {
    title: "NotHuman.ai — No-Code Voice AI Agents for Bharat",
    description:
      "The no-code platform for voice AI agents that speak fluent Hindi, Tamil, Telugu and 9 more Indian languages.",
    type: "website",
    locale: "en_IN",
    siteName: "NotHuman.ai",
  },
  twitter: {
    card: "summary_large_image",
    title: "NotHuman.ai — No-Code Voice AI Agents for Bharat",
    description:
      "Design, train and deploy human-like voice AI agents in 12 languages. No code required.",
  },
};

export const viewport = {
  themeColor: "#0a0a12",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

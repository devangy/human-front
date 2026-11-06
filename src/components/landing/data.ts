import {
  Languages as LanguagesIcon,
  MicVocal,
  Zap,
  Brain,
  Workflow,
  Shield,
  Wand2,
  Bot,
  Rocket,
  type LucideIcon,
} from "lucide-react";

export type Language = {
  native: string;
  en: string;
  dir?: "rtl";
};

export const LANGUAGES: Language[] = [
  { native: "English", en: "English" },
  { native: "हिंदी", en: "Hindi" },
  { native: "தமிழ்", en: "Tamil" },
  { native: "తెలుగు", en: "Telugu" },
  { native: "বাংলা", en: "Bengali" },
  { native: "मराठी", en: "Marathi" },
  { native: "ગુજરાતી", en: "Gujarati" },
  { native: "ಕನ್ನಡ", en: "Kannada" },
  { native: "മലയാളം", en: "Malayalam" },
  { native: "ਪੰਜਾਬੀ", en: "Punjabi" },
  { native: "اردو", en: "Urdu", dir: "rtl" },
  { native: "ଓଡ଼ିଆ", en: "Odia" },
];

export const TRUSTED_BY = [
  "KIRANA365",
  "PayNest",
  "Swasthya+",
  "Urban Tadka",
  "LoanSetu",
  "HousingKart",
  "QuickDawa",
  "FinBridge",
  "Mandi Fresh",
  "Setu Health",
];

export const HERO_STATS = [
  { value: "40M+", label: "Call minutes handled" },
  { value: "12", label: "Indian languages" },
  { value: "<200ms", label: "Avg. voice latency" },
];

export const STATS_BAND = [
  { value: 500, suffix: "+", label: "Businesses onboarded" },
  { value: 40, suffix: "M+", label: "Call minutes processed" },
  { value: 12, suffix: "", label: "Indian languages supported" },
  { value: 99.9, suffix: "%", label: "Platform uptime SLA" },
];

export const STEPS: {
  icon: LucideIcon;
  num: string;
  title: string;
  desc: string;
}[] = [
  {
    icon: Wand2,
    num: "01",
    title: "Design",
    desc: "Drag, drop and connect greetings, intents, conditions and actions on our visual, no-code flow canvas — the same canvas your team will use every day.",
  },
  {
    icon: Bot,
    num: "02",
    title: "Train & Localize",
    desc: "Feed in your FAQs, SOPs and past call transcripts. Your agent learns your business and speaks it back in the languages your customers actually use.",
  },
  {
    icon: Rocket,
    num: "03",
    title: "Deploy & Scale",
    desc: "Publish across inbound/outbound calls, WhatsApp and IVR in one click, then scale to thousands of concurrent conversations without adding headcount.",
  },
];

export const FEATURES: {
  icon: LucideIcon;
  title: string;
  desc: string;
  big?: boolean;
}[] = [
  {
    icon: LanguagesIcon,
    title: "Fluent in every Bharat",
    desc: "English plus 11 Indian languages out of the box, with automatic code-switching mid-conversation — the way your customers really talk.",
    big: true,
  },
  {
    icon: MicVocal,
    title: "Human-grade voice synthesis",
    desc: "Natural tone, pacing and emotion that's hard to tell apart from a trained support rep.",
  },
  {
    icon: Zap,
    title: "Real-time, under 200ms",
    desc: "Streaming speech pipelines keep conversation turns fast, so calls never feel like talking to a machine.",
  },
  {
    icon: Brain,
    title: "Contextual memory",
    desc: "Every agent remembers past calls, order history and preferences across every channel.",
  },
  {
    icon: Workflow,
    title: "WhatsApp, IVR & CRM ready",
    desc: "Native connectors for WhatsApp Business API, Indian telephony and tools like Zoho, Salesforce and Freshdesk.",
  },
  {
    icon: Shield,
    title: "DPDP-ready, India-resident",
    desc: "Customer data stays on infrastructure within India, built to align with the Digital Personal Data Protection Act.",
  },
];

export const TESTIMONIALS = [
  {
    quote:
      "Switching to a voice AI that actually spoke Tamil to our customers cut our support costs by 40% in two months.",
    name: "Priya Raghunathan",
    role: "Head of CX, Urban Tadka",
  },
  {
    quote:
      "We went from a blank canvas to a live IVR flow in an afternoon — no developers, no vendor calls, no waiting.",
    name: "Rohan Mehta",
    role: "Founder, LoanSetu",
  },
  {
    quote:
      "Our customers in tier-2 cities finally feel heard, literally. Support CSAT jumped from 72% to 94% in one quarter.",
    name: "Ananya Iyer",
    role: "VP Operations, Swasthya+",
  },
];

export const PRICING_PLANS = [
  {
    name: "Starter",
    monthly: 4999,
    annual: 3999,
    sub: "For small teams getting started",
    features: [
      "1,000 call minutes / month",
      "3 voice agents",
      "2 Indian languages",
      "Basic analytics",
      "Email support",
    ],
    featured: false,
  },
  {
    name: "Growth",
    monthly: 14999,
    annual: 11999,
    sub: "For scaling, customer-first teams",
    features: [
      "10,000 call minutes / month",
      "15 voice agents",
      "All 12 languages",
      "WhatsApp & CRM integrations",
      "Priority support",
      "Custom voice cloning",
    ],
    featured: true,
  },
  {
    name: "Enterprise",
    monthly: null,
    annual: null,
    sub: "For large, regulated organizations",
    features: [
      "Unlimited minutes & agents",
      "Dedicated infrastructure",
      "24×7 SLA support",
      "Custom model fine-tuning",
      "SSO & DPDP compliance support",
      "Dedicated India data residency",
    ],
    featured: false,
  },
];

export const FAQS = [
  {
    q: "Is my customer data stored in India?",
    a: "Yes. All voice, transcript and customer data is hosted on data centres located within India, and our architecture is built to align with the Digital Personal Data Protection (DPDP) Act, 2023.",
  },
  {
    q: "Which languages are supported?",
    a: "English plus 11 Indian languages out of the box — Hindi, Tamil, Telugu, Bengali, Marathi, Gujarati, Kannada, Malayalam, Punjabi, Urdu and Odia — with automatic code-switching mid-conversation.",
  },
  {
    q: "Do I need developers to build an agent?",
    a: "No. Every flow is built visually on our no-code canvas — drag, connect and publish. Developers are only needed if you want custom API integrations.",
  },
  {
    q: "How fast can we go live?",
    a: "Most teams launch their first agent in under a day. Complex, multi-department flows typically take one to two weeks.",
  },
  {
    q: "What channels can my agent talk on?",
    a: "Inbound and outbound phone calls, WhatsApp Business messages, and IVR — all designed from the same flow.",
  },
  {
    q: "What happens if the AI can't resolve a query?",
    a: "You define the fallback — a warm transfer to a human agent, a scheduled callback, or an SMS/WhatsApp follow-up — configured directly in the flow builder.",
  },
];

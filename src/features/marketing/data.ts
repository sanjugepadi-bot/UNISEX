import type { LucideIcon } from "lucide-react";
import {
  Dumbbell,
  Users,
  Award,
  Clock,
  Flame,
  ShieldCheck,
  TrendingUp,
  HeartPulse,
  Trophy,
  Sparkles,
} from "lucide-react";

export const BUSINESS_INFO = {
  name: "D Warrior Nation Gym",
  legalName: "D Warrior Nation Gym",
  shortName: { primary: "D WARRIOR", secondary: "NATION" },
  tagline: "Jonai, Assam",
  phoneDisplay: "+91 97075 94478",
  phoneTel: "+919707594478",
  whatsappUrl: "https://wa.me/919707594478",
  addressLine1: "Pegu Complex, near Reliance Trends",
  addressLine2: "No.3 Murkong Selek Part III, Lakhi Nepali, Jonai, Assam 787060",
  fullAddress:
    "Pegu Complex, near Reliance Trends, No.3 Murkong Selek Part III, Lakhi Nepali, Jonai, Assam 787060",
  locality: "Jonai",
  region: "Assam",
  postalCode: "787060",
  country: "IN",
  latitude: 27.8393103,
  longitude: 95.2226351,
  directionsUrl: "https://www.google.com/maps/dir/?api=1&destination=27.8393103,95.2226351",
  mapEmbedUrl: "https://www.google.com/maps?q=27.8393103,95.2226351&z=16&output=embed",
  instagramUrl: "https://www.instagram.com/dwarriornation_unisexgym",
  rating: 4.9,
  reviewCount: 32,
  hoursNote: "Mon–Sat 4:30–10 AM & 4–10 PM · Closed Sundays",
  hoursSpecification: [
    {
      days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "04:30",
      closes: "10:00",
    },
    {
      days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "16:00",
      closes: "22:00",
    },
  ],
} as const;

export const NAV_LINKS = [
  { href: "#about", label: "About" },
  { href: "#programs", label: "Programs" },
  { href: "#trainers", label: "Trainers" },
  { href: "#membership", label: "Membership" },
  { href: "#gallery", label: "Gallery" },
  { href: "#faq", label: "FAQ" },
  { href: "#contact", label: "Contact" },
] as const;

export interface FeatureHighlight {
  icon: LucideIcon;
  title: string;
  description: string;
}

export const ABOUT_HIGHLIGHTS: FeatureHighlight[] = [
  {
    icon: Dumbbell,
    title: "Full Equipment Arsenal",
    description:
      "Functional trainers, free weights, and cardio machines built for every stage of your training.",
  },
  {
    icon: Users,
    title: "Certified Coaches",
    description:
      "Every session is guided by trainers certified in strength, conditioning, and injury prevention.",
  },
  {
    icon: Clock,
    title: "Open Early, Open Late",
    description: "Train on your schedule with extended hours, seven days a week.",
  },
  {
    icon: Award,
    title: "Proven Transformations",
    description: "Hundreds of members have rebuilt their strength, physique, and confidence here.",
  },
];

export const WHY_CHOOSE_US: FeatureHighlight[] = [
  {
    icon: Flame,
    title: "High-Intensity Programming",
    description: "Structured programs designed to push your limits safely and effectively.",
  },
  {
    icon: ShieldCheck,
    title: "Safety First",
    description: "Certified spotters and form correction on every heavy lift.",
  },
  {
    icon: TrendingUp,
    title: "Measurable Progress",
    description: "Track strength gains, body composition, and milestones every month.",
  },
  {
    icon: HeartPulse,
    title: "Holistic Health",
    description: "Strength, cardio, mobility, and recovery — all under one roof.",
  },
  {
    icon: Trophy,
    title: "Competition Ready",
    description: "Train alongside members who compete in powerlifting and physique shows.",
  },
  {
    icon: Sparkles,
    title: "Premium Experience",
    description: "A clean, modern space engineered to keep you motivated every visit.",
  },
];

export interface Program {
  title: string;
  description: string;
  tag: string;
}

export const PROGRAMS: Program[] = [
  {
    title: "Strength Training",
    description:
      "Progressive overload programming to build raw power through compound barbell lifts.",
    tag: "Foundational",
  },
  {
    title: "Weight Loss",
    description:
      "Metabolic conditioning circuits paired with nutrition guidance for sustainable fat loss.",
    tag: "Transformation",
  },
  {
    title: "Bodybuilding",
    description:
      "Hypertrophy-focused splits with precision volume tracking to sculpt every muscle group.",
    tag: "Aesthetic",
  },
  {
    title: "CrossFit",
    description:
      "High-intensity functional workouts that build strength, stamina, and mental grit.",
    tag: "Performance",
  },
  {
    title: "Personal Training",
    description:
      "One-on-one coaching tailored entirely around your goals, schedule, and starting point.",
    tag: "1-on-1",
  },
];

export interface Trainer {
  initials: string;
  name: string;
  role: string;
  specialty: string;
}

export const TRAINERS: Trainer[] = [
  {
    initials: "RK",
    name: "Rohan Kadam",
    role: "Head Strength Coach",
    specialty: "Powerlifting & Olympic Lifting",
  },
  {
    initials: "AS",
    name: "Aisha Sheikh",
    role: "Transformation Coach",
    specialty: "Weight Loss & Nutrition",
  },
  {
    initials: "VP",
    name: "Vikram Patil",
    role: "Bodybuilding Coach",
    specialty: "Hypertrophy & Physique Prep",
  },
  {
    initials: "SN",
    name: "Sara Nair",
    role: "Conditioning Coach",
    specialty: "CrossFit & Mobility",
  },
];

export interface MembershipPlan {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  featured?: boolean;
}

export const MEMBERSHIP_PLANS: MembershipPlan[] = [
  {
    name: "Starter",
    price: "1,999",
    period: "/ month",
    description: "Everything you need to start training with purpose.",
    features: [
      "Full gym floor access",
      "Locker room access",
      "1 free trainer consultation",
      "Standard operating hours",
    ],
  },
  {
    name: "Pro",
    price: "3,499",
    period: "/ month",
    description: "For members serious about consistent progress.",
    features: [
      "Everything in Starter",
      "Group class access",
      "Monthly body composition scan",
      "Extended early/late hours",
      "Diet plan check-ins",
    ],
    featured: true,
  },
  {
    name: "Elite",
    price: "5,999",
    period: "/ month",
    description: "Full-service coaching for maximum results.",
    features: [
      "Everything in Pro",
      "Weekly personal training session",
      "Custom AI-generated workout plans",
      "Priority booking",
      "Guest passes (2 / month)",
    ],
  },
];

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "Six months at D Warrior Nation Gym changed how I move, eat, and think about training. The coaches actually watch your form every single set.",
    name: "Aditya M.",
    role: "Member since 2024",
  },
  {
    quote:
      "I walked in after years off training. The Elite plan and weekly PT sessions got me back to my strongest in under a year.",
    name: "Priya R.",
    role: "Elite Member",
  },
  {
    quote:
      "Best equipment I've trained on in the city, and the energy in this place is unmatched. Early morning sessions are never empty.",
    name: "Karan D.",
    role: "Pro Member",
  },
];

export interface Stat {
  label: string;
  value: number;
  suffix: string;
}

export const STATS: Stat[] = [
  { label: "Members Trained", value: 500, suffix: "+" },
  { label: "Years of Excellence", value: 8, suffix: "+" },
  { label: "Success Stories", value: 300, suffix: "+" },
  { label: "Expert Trainers", value: 12, suffix: "+" },
];

export interface FaqItem {
  question: string;
  answer: string;
}

export const FAQ_ITEMS: FaqItem[] = [
  {
    question: "Do you offer a free trial session?",
    answer:
      "Yes. New members get one free trial session with a coach to walk through the gym floor and build a starting plan.",
  },
  {
    question: "Can I freeze or pause my membership?",
    answer:
      "Memberships can be paused for up to 30 days per year for travel or injury — just notify the front desk in advance.",
  },
  {
    question: "Are personal trainers included in every plan?",
    answer:
      "Starter includes one consultation. Pro and Elite include ongoing coaching touchpoints, with Elite offering a weekly 1-on-1 session.",
  },
  {
    question: "What are your operating hours?",
    answer:
      "We're open 5:00 AM – 11:00 PM on weekdays and 6:00 AM – 9:00 PM on weekends, with extended access for Pro and Elite members.",
  },
  {
    question: "Is there a joining fee or lock-in contract?",
    answer:
      "No hidden joining fees. Plans are month-to-month with no long-term lock-in unless you opt into a discounted annual plan.",
  },
];

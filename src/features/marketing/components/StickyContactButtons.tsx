"use client";

import { motion } from "framer-motion";
import { Phone, MessageCircle } from "lucide-react";
import { BUSINESS_INFO } from "../data";

export function StickyContactButtons() {
  return (
    <div className="fixed bottom-7 left-6 z-40 flex flex-col gap-3">
      <motion.a
        href={BUSINESS_INFO.whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with us on WhatsApp"
        initial={{ opacity: 0, x: -16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: 1 }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        className="flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_12px_32px_-8px_rgba(37,211,102,0.6)] transition-shadow duration-300 hover:shadow-[0_16px_40px_-8px_rgba(37,211,102,0.8)] lg:h-14 lg:w-14"
      >
        <MessageCircle size={22} fill="currentColor" className="text-white" strokeWidth={0} />
      </motion.a>

      <motion.a
        href={`tel:${BUSINESS_INFO.phoneTel}`}
        aria-label="Call us now"
        initial={{ opacity: 0, x: -16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: 1.15 }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-red-600 text-white shadow-[0_12px_32px_-8px_rgba(220,38,38,0.6)] transition-shadow duration-300 hover:shadow-[0_16px_40px_-8px_rgba(220,38,38,0.85)] lg:h-14 lg:w-14"
      >
        <Phone size={20} />
      </motion.a>
    </div>
  );
}

"use client";

import { MessageCircle } from "lucide-react";
import Link from "next/link";

export function FloatingWhatsApp() {
  const whatsappNumber = "254728747441";
  const message = "Hello! I'm interested in learning more about Ready Pips trading signals.";
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

  return (
    <Link href={whatsappLink} target="_blank" rel="noopener noreferrer">
      <div className="fixed bottom-6 right-6 z-50">
        <button
          className="flex items-center justify-center w-14 h-14 rounded-full bg-green-600 hover:bg-green-700 text-white shadow-lg transition-all duration-300 hover:scale-110 active:scale-95"
          aria-label="Contact us on WhatsApp"
          title="Chat with us on WhatsApp"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      </div>
    </Link>
  );
}

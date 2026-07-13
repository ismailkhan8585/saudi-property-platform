'use client';

import { MessageCircle } from 'lucide-react';
import { WHATSAPP_URL, WHATSAPP_GENERAL_MSG } from '@/lib/constants';

export default function WhatsAppButton() {
  return (
    <a
      href={`${WHATSAPP_URL}?text=${encodeURIComponent(WHATSAPP_GENERAL_MSG)}`}
      target="_blank"
      rel="noopener noreferrer"
      className="hidden md:flex fixed bottom-6 right-6 z-40 w-14 h-14 bg-green-500 hover:bg-green-600 rounded-full shadow-2xl items-center justify-center text-white whatsapp-pulse transition-colors"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="w-7 h-7" />
    </a>
  );
}

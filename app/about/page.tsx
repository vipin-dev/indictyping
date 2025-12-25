'use client';

import Link from 'next/link';
import { trackLinkClick } from '@/utils/analytics';

export default function AboutPage() {
  return (
    <div className="h-full bg-gradient-to-br from-slate-50 via-white to-slate-100 text-slate-900 overflow-y-auto">
      <div className="mx-auto max-w-4xl px-6 py-12 space-y-6">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.25rem] text-indigo-500">About</p>
          <h1 className="text-3xl font-semibold text-slate-900">IndicTyping</h1>
          <p className="text-slate-600">
            IndicTyping is a lightweight Malayalam InScript practice tool from indictyping.in. It focuses on clear feedback, an on-screen keyboard, and grapheme-aware validation so you can type faster and more accurately.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <p className="text-slate-700">
            We designed IndicTyping to stay simple: no sign-ups, no distractions—just practice, instant accuracy checks, and visual guidance for the next key. Whether you're learning InScript for the first time or sharpening your speed, we aim to keep the experience smooth on both desktop and mobile.
          </p>
          <p className="text-slate-700">
            Built by the indictyping.in team with a focus on clarity and accessibility for Malayalam typists everywhere.
          </p>
          <Link 
            href="/contact" 
            onClick={() => trackLinkClick('Get in touch', '/contact', 'about_page')}
            className="text-indigo-600 hover:text-indigo-800 text-sm"
          >
            Get in touch
          </Link>
        </div>
      </div>
    </div>
  );
}

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact – IndicTyping',
  description: 'Contact information for IndicTyping',
};

const contactEmail = 'contact@indictyping.in';
const lastUpdated = '23 Dec 2025';

export default function ContactPage() {
  return (
    <div className="bg-gradient-to-br from-slate-50 via-white to-slate-100 text-slate-900">
      <div className="mx-auto max-w-4xl px-6 py-12 space-y-6">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.25rem] text-indigo-500">Contact</p>
          <h1 className="text-3xl font-semibold text-slate-900">Get in touch</h1>
          <p className="text-sm text-slate-600">Last updated: {lastUpdated}</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4 text-slate-800 leading-relaxed">
          <p>
            Have a question, found a bug, or want to suggest a feature? Reach us at{' '}
            <a className="text-indigo-600 hover:text-indigo-800" href={`mailto:${contactEmail}`}>
              {contactEmail}
            </a>.
          </p>
          <h2 className="text-xl font-semibold text-slate-900">Bug reporting checklist</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>Page URL where you saw the issue</li>
            <li>What you expected to happen vs. what happened</li>
            <li>Browser/device (e.g., Chrome 123 on Windows, Safari on iOS)</li>
            <li>Steps to reproduce (as few bullet points as possible)</li>
            <li>Screenshot or short clip (if available)</li>
          </ul>
          <p className="text-slate-700">
            We aim to keep IndicTyping smooth and reliable. Thanks for helping us improve!
          </p>
        </div>
      </div>
    </div>
  );
}

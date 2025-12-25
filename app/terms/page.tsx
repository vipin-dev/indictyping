'use client';

import { trackLinkClick } from '@/utils/analytics';

const lastUpdated = '23 Dec 2025';
const contactEmail = 'contact@indictyping.in';

export default function TermsPage() {
  return (
    <div className="h-full bg-gradient-to-br from-slate-50 via-white to-slate-100 text-slate-900 overflow-y-auto">
      <div className="mx-auto max-w-4xl px-6 py-12 space-y-6">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.25rem] text-indigo-500">Terms</p>
          <h1 className="text-3xl font-semibold text-slate-900">Terms of Service</h1>
          <p className="text-sm text-slate-600">Last updated: {lastUpdated}</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4 text-slate-800 leading-relaxed">
          <h2 className="text-xl font-semibold text-slate-900">Acceptance of Terms</h2>
          <p>
            By accessing or using IndicTyping, you agree to these Terms of Service. If you do not agree, please do not use the service.
          </p>
          <h2 className="text-xl font-semibold text-slate-900">Use of the Service</h2>
          <p>
            IndicTyping is provided for personal and educational use to practice Malayalam InScript typing. You agree not to misuse the service, attempt to disrupt it, or use it for unlawful purposes.
          </p>
          <h2 className="text-xl font-semibold text-slate-900">Intellectual Property</h2>
          <p>
            IndicTyping and its content are owned by their respective creators. You may not copy, modify, or redistribute the service without permission.
          </p>
          <h2 className="text-xl font-semibold text-slate-900">Disclaimer</h2>
          <p>
            IndicTyping is provided “as is” without warranties of any kind. We do not guarantee accuracy, availability, or fitness for a particular purpose.
          </p>
          <h2 className="text-xl font-semibold text-slate-900">Limitation of Liability</h2>
          <p>
            To the fullest extent permitted by law, IndicTyping is not liable for any damages arising from use or inability to use the service.
          </p>
          <h2 className="text-xl font-semibold text-slate-900">Changes to Terms</h2>
          <p>
            We may update these Terms from time to time. Continued use after changes indicates acceptance of the updated Terms.
          </p>
          <h2 className="text-xl font-semibold text-slate-900">Contact</h2>
          <p>
            For questions about these Terms, contact us at <a 
              className="text-indigo-600 hover:text-indigo-800" 
              href={`mailto:${contactEmail}`}
              onClick={() => trackLinkClick(contactEmail, `mailto:${contactEmail}`, 'terms_page')}
            >{contactEmail}</a>.
          </p>
        </div>
      </div>
    </div>
  );
}

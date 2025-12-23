import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy – IndicTyping',
  description: 'Privacy Policy for IndicTyping',
};

const lastUpdated = '23 Dec 2025';
const contactEmail = 'contact@indictyping.in';

export default function PrivacyPage() {
  return (
    <div className="bg-gradient-to-br from-slate-50 via-white to-slate-100 text-slate-900">
      <div className="mx-auto max-w-4xl px-6 py-12 space-y-6">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.25rem] text-indigo-500">Privacy</p>
          <h1 className="text-3xl font-semibold text-slate-900">Privacy Policy</h1>
          <p className="text-sm text-slate-600">Last updated: {lastUpdated}</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4 text-slate-800 leading-relaxed">
          <p>
            We respect your privacy and are committed to protecting the information you share with us. This Privacy Policy explains how we collect, use, and safeguard your information when you use IndicTyping.
          </p>
          <h2 className="text-xl font-semibold text-slate-900">Information We Collect</h2>
          <p>
            IndicTyping does not require you to create an account. We may collect anonymized analytics data (such as page views and basic device information) to understand usage patterns and improve the product. No personal text you type for practice is stored by us.
          </p>
          <h2 className="text-xl font-semibold text-slate-900">How We Use Information</h2>
          <p>
            Analytics data is used to measure performance, improve features, and ensure reliability. We do not sell your data.
          </p>
          <h2 className="text-xl font-semibold text-slate-900">Cookies and Tracking</h2>
          <p>
            IndicTyping may use cookies or similar technologies for analytics and to deliver ads (via Google AdSense). You can control cookies through your browser settings.
          </p>
          <h2 className="text-xl font-semibold text-slate-900">Third-Party Services</h2>
          <p>
            We may use third-party services such as Google Analytics and Google AdSense. These services may collect data in accordance with their own privacy policies.
          </p>
          <h2 className="text-xl font-semibold text-slate-900">Data Security</h2>
          <p>
            We implement reasonable measures to protect data transmitted to and from IndicTyping. However, no method of transmission or storage is completely secure.
          </p>
          <h2 className="text-xl font-semibold text-slate-900">Children&apos;s Privacy</h2>
          <p>
            IndicTyping is intended for users aged 13 and above. We do not knowingly collect personal information from children under 13.
          </p>
          <h2 className="text-xl font-semibold text-slate-900">Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. Material changes will be reflected with a new “Last updated” date.
          </p>
          <h2 className="text-xl font-semibold text-slate-900">Contact</h2>
          <p>
            If you have questions about this Privacy Policy, contact us at <a className="text-indigo-600 hover:text-indigo-800" href={`mailto:${contactEmail}`}>{contactEmail}</a>.
          </p>
        </div>
      </div>
    </div>
  );
}

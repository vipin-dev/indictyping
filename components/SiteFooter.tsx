'use client';

import Link from 'next/link';

const footerLinks = [
  { href: '/about', label: 'About' },
  { href: '/privacy', label: 'Privacy' },
  { href: '/terms', label: 'Terms' },
  { href: '/contact', label: 'Contact' },
];

export default function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white/70 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-4 px-6 py-4 text-sm text-slate-600">
        {footerLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="hover:text-indigo-700"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </footer>
  );
}

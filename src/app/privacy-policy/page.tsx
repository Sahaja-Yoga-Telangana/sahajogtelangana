import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { FiShield, FiLock, FiMapPin, FiCamera, FiMail, FiCheckCircle } from 'react-icons/fi';

export const metadata: Metadata = {
  title: 'Privacy Policy | Sahaja Yoga Telangana App',
  description: 'Privacy Policy for the Sahaja Yoga Telangana mobile application and website, explaining how user data, location permissions, and accounts are protected.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] text-zinc-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white border border-zinc-200 shadow-sm rounded-2xl p-6 sm:p-10 space-y-8">
        
        {/* Header */}
        <div className="border-b border-zinc-200 pb-6 space-y-3">
          <div className="flex items-center space-x-2 text-saffron font-bold uppercase text-xs tracking-widest">
            <FiShield className="w-4 h-4" />
            <span>Sahaja Yoga Telangana</span>
          </div>
          <h1 className="text-3xl font-light tracking-tight text-zinc-900 sm:text-4xl">
            Privacy Policy & Data Transparency
          </h1>
          <p className="text-sm text-zinc-500 font-light">
            Last Updated: July 22, 2026 &bull; Effective for SY Telangana Mobile App & Web Services
          </p>
        </div>

        {/* Intro Banner */}
        <div className="bg-amber-50/60 border border-amber-200/80 rounded-xl p-5 text-sm leading-relaxed text-amber-900 flex items-start space-x-3">
          <FiCheckCircle className="w-5 h-5 text-saffron shrink-0 mt-0.5" />
          <div>
            <strong>Our Commitment to Your Privacy:</strong> All Sahaja Yoga meditation sessions, programs, and digital tools are completely free of charge. We respect your spiritual journey and personal privacy. We never sell, rent, or monetize your personal or device data.
          </div>
        </div>

        {/* Section 1: Data We Collect */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-zinc-900 border-b border-zinc-100 pb-2 flex items-center gap-2">
            <FiLock className="text-saffron" /> 1. Information We Collect
          </h2>
          <p className="text-sm text-zinc-600 font-light leading-relaxed">
            When you use the Sahaja Yoga Telangana mobile application or website, we may collect minimal personal information necessary to facilitate meditation sessions, seeker follow-ups, and event registrations:
          </p>
          <ul className="list-disc list-inside text-sm text-zinc-600 space-y-2 font-light pl-2">
            <li><strong>Account & Registration Information:</strong> Full Name, Email Address, Mobile Phone Number, City, and State when registering for events, seeker follow-ups, or creating a practitioner account.</li>
            <li><strong>Voluntary Seeker Details:</strong> Information provided voluntarily by seekers or volunteers during outreach programs for follow-up guidance.</li>
            <li><strong>Technical Diagnostics:</strong> Non-personally identifiable app usage analytics and error logs to improve application performance.</li>
          </ul>
        </section>

        {/* Section 2: Permissions */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-zinc-900 border-b border-zinc-100 pb-2 flex items-center gap-2">
            <FiMapPin className="text-saffron" /> 2. Device Permissions & Usage
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            <div className="border border-zinc-200 rounded-xl p-4 bg-zinc-50/50 space-y-2">
              <div className="flex items-center space-x-2 text-zinc-900 font-semibold text-sm">
                <FiMapPin className="text-saffron" />
                <span>Location Permissions</span>
              </div>
              <p className="text-xs text-zinc-600 font-light leading-relaxed">
                We request approximate or precise location permission (<code>ACCESS_FINE_LOCATION</code>) strictly to calculate distances to nearby Sahaja Yoga meditation centers in Telangana and show them on the live map view. Your location data is processed locally on your device and is never stored or tracked.
              </p>
            </div>

            <div className="border border-zinc-200 rounded-xl p-4 bg-zinc-50/50 space-y-2">
              <div className="flex items-center space-x-2 text-zinc-900 font-semibold text-sm">
                <FiCamera className="text-saffron" />
                <span>Camera & Storage Access</span>
              </div>
              <p className="text-xs text-zinc-600 font-light leading-relaxed">
                Optional camera and image library access is requested only if you choose to take or upload photos (e.g., sharing a testimonial or scanning seeker registration sheets).
              </p>
            </div>
          </div>
        </section>

        {/* Section 3: How We Use Data */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-zinc-900 border-b border-zinc-100 pb-2">
            3. How We Use Your Information
          </h2>
          <p className="text-sm text-zinc-600 font-light leading-relaxed">
            We use collected information solely for spiritual outreach and operational purposes:
          </p>
          <ul className="list-disc list-inside text-sm text-zinc-600 space-y-2 font-light pl-2">
            <li>Guiding seekers to nearby meditation centers and programs.</li>
            <li>Sending event registration confirmations and PDF receipts.</li>
            <li>Enabling authorized Sahaja Yoga volunteers to follow up with seekers who requested guidance.</li>
            <li>Ensuring application stability and preventing security abuses.</li>
          </ul>
        </section>

        {/* Section 4: Data Security */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-zinc-900 border-b border-zinc-100 pb-2">
            4. Data Protection & Security
          </h2>
          <p className="text-sm text-zinc-600 font-light leading-relaxed">
            All data transmissions between the mobile app and our servers are encrypted using Industry Standard Transport Layer Security (HTTPS / SSL). We store information on secure databases protected by strict role-based access controls.
          </p>
        </section>

        {/* Section 5: Data Rights */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-zinc-900 border-b border-zinc-100 pb-2 flex items-center gap-2">
            <FiMail className="text-saffron" /> 5. Data Deletion & Contact
          </h2>
          <p className="text-sm text-zinc-600 font-light leading-relaxed">
            You have full control over your personal data. If you wish to update your information, request account deletion, or have any privacy questions, please contact us:
          </p>
          <div className="bg-zinc-50 border border-zinc-200 p-4 rounded-xl text-xs space-y-1 font-mono">
            <div><strong>Organization:</strong> Sahaja Yoga Telangana Trust</div>
            <div><strong>Email:</strong> <a href="mailto:sahajogtelangana@gmail.com" className="text-saffron underline">sahajogtelangana@gmail.com</a></div>
            <div><strong>Website:</strong> <a href="https://www.sahajayogatelangana.org" className="text-saffron underline">https://www.sahajayogatelangana.org</a></div>
          </div>
        </section>

        {/* Footer */}
        <div className="pt-6 border-t border-zinc-200 flex flex-col sm:flex-row justify-between items-center text-xs text-zinc-500 gap-4">
          <div>&copy; 2026 Sahaja Yoga Telangana. All rights reserved.</div>
          <Link href="/" className="text-saffron font-semibold hover:underline">
            ← Return to Home Page
          </Link>
        </div>

      </div>
    </div>
  );
}

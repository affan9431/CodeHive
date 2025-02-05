import React from "react";
import {
  Shield,
  Lock,
  CreditCard,
  UserCheck,
  Database,
  FileCheck,
  Mail,
} from "lucide-react";

export default function Security() {
  return (
    <div className="min-h-screen bg-gray-100">
      <main className="container mx-auto px-4 py-8">
        <section className="mb-12">
          <h2 className="text-3xl font-semibold mb-6 flex items-center">
            <Shield className="mr-2" /> Our Security Approach
          </h2>
          <p className="text-lg mb-4">
            At CodeHive, the security of our users and their transactions is our
            highest priority. We have implemented several measures to ensure a
            secure environment for buying and selling educational content.
          </p>
        </section>

        <div className="grid md:grid-cols-2 gap-8">
          <section className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-2xl font-semibold mb-4 flex items-center">
              <CreditCard className="mr-2 text-blue-500" /> Secure Transactions
              with Stripe
            </h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="bg-blue-100 p-1 rounded-full mr-2 mt-1">
                  <CreditCard className="w-4 h-4 text-blue-500" />
                </span>
                <span>All payments securely processed through Stripe</span>
              </li>
              <li className="flex items-start">
                <span className="bg-green-100 p-1 rounded-full mr-2 mt-1">
                  <UserCheck className="w-4 h-4 text-green-500" />
                </span>
                <span>PCI DSS Level 1 compliance for maximum security</span>
              </li>
              <li className="flex items-start">
                <span className="bg-blue-100 p-1 rounded-full mr-2 mt-1">
                  <Lock className="w-4 h-4 text-blue-500" />
                </span>
                <span>Strong encryption for all financial data</span>
              </li>
            </ul>
          </section>

          <section className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-2xl font-semibold mb-4 flex items-center">
              <Lock className="mr-2 text-blue-500" /> Account Security
            </h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="bg-purple-100 p-1 rounded-full mr-2 mt-1">
                  <Lock className="w-4 h-4 text-purple-500" />
                </span>
                <span>Strong password requirements</span>
              </li>
              <li className="flex items-start">
                <span className="bg-indigo-100 p-1 rounded-full mr-2 mt-1">
                  <Shield className="w-4 h-4 text-indigo-500" />
                </span>
                <span>Two-Factor Authentication (2FA) encouraged</span>
              </li>
              <li className="flex items-start">
                <span className="bg-red-100 p-1 rounded-full mr-2 mt-1">
                  <Shield className="w-4 h-4 text-red-500" />
                </span>
                <span>Continuous monitoring for suspicious activities</span>
              </li>
            </ul>
          </section>

          <section className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-2xl font-semibold mb-4 flex items-center">
              <Database className="mr-2 text-green-500" /> Data Protection
            </h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="bg-green-100 p-1 rounded-full mr-2 mt-1">
                  <UserCheck className="w-4 h-4 text-green-500" />
                </span>
                <span>No sharing of personal data without consent</span>
              </li>
              <li className="flex items-start">
                <span className="bg-blue-100 p-1 rounded-full mr-2 mt-1">
                  <Lock className="w-4 h-4 text-blue-500" />
                </span>
                <span>All personal data encrypted and securely stored</span>
              </li>
            </ul>
          </section>

          <section className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-2xl font-semibold mb-4 flex items-center">
              <FileCheck className="mr-2 text-indigo-500" /> Safe Course Uploads
              and Downloads
            </h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="bg-indigo-100 p-1 rounded-full mr-2 mt-1">
                  <UserCheck className="w-4 h-4 text-indigo-500" />
                </span>
                <span>Verification process for sellers</span>
              </li>
              <li className="flex items-start">
                <span className="bg-red-100 p-1 rounded-full mr-2 mt-1">
                  <Shield className="w-4 h-4 text-red-500" />
                </span>
                <span>Content scanning for malware and harmful files</span>
              </li>
            </ul>
          </section>
        </div>

        <section className="mt-12 bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-2xl font-semibold mb-4 flex items-center">
            <Mail className="mr-2 text-blue-500" /> Need Help?
          </h3>
          <p className="mb-4">
            If you encounter any issues or need assistance while using CodeHive,
            feel free to contact us at:
          </p>
          <p className="text-lg font-semibold">
            Email:{" "}
            <a
              href="mailto:codehive@gmail.com"
              className="text-blue-500 hover:underline"
            >
              codehive@gmail.com
            </a>
          </p>
          <p className="mt-2">
            We are available to support you with any inquiries regarding course
            uploads, purchases, or general platform navigation. Our team will
            respond within 24-48 hours.
          </p>
        </section>
      </main>
    </div>
  );
}

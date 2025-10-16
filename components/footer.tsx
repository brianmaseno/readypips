"use client";

import Link from "next/link";
import { Heart } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-black border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="text-lg font-bold text-black dark:text-white mb-4">
              Ready Pips
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              AI-powered trading signals platform for forex, crypto, and stocks.
            </p>
          </div>

          {/* Products */}
          <div>
            <h4 className="font-semibold text-black dark:text-white mb-4">
              Products
            </h4>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>
                <Link
                  href="/signals"
                  className="hover:text-green-600 transition-colors"
                >
                  Trading Signals
                </Link>
              </li>
              <li>
                <Link
                  href="/charts"
                  className="hover:text-green-600 transition-colors"
                >
                  Charts & Analytics
                </Link>
              </li>
              <li>
                <Link
                  href="/copy-trading"
                  className="hover:text-green-600 transition-colors"
                >
                  Copy Trading
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold text-black dark:text-white mb-4">
              Resources
            </h4>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>
                <Link
                  href="/faqs"
                  className="hover:text-green-600 transition-colors"
                >
                  FAQs
                </Link>
              </li>
              <li>
                <Link
                  href="/testimonials"
                  className="hover:text-green-600 transition-colors"
                >
                  Testimonials
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy-policy"
                  className="hover:text-green-600 transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms-conditions"
                  className="hover:text-green-600 transition-colors"
                >
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-black dark:text-white mb-4">
              Contact
            </h4>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>
                <a
                  href="mailto:briancreatives@gmail.com"
                  className="hover:text-green-600 transition-colors"
                >
                  Email Support
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/254728747441"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-green-600 transition-colors"
                >
                  WhatsApp Support
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 dark:border-gray-800 py-8">
          {/* Bottom Footer */}
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <p>
                © {currentYear} Ready Pips. All rights reserved. Made with{" "}
                <Heart className="w-4 h-4 inline text-red-600" /> for traders.
              </p>
            </div>
            <div className="flex space-x-6 mt-4 md:mt-0 text-sm text-gray-600 dark:text-gray-400">
              <Link
                href="/privacy-policy"
                className="hover:text-green-600 transition-colors"
              >
                Privacy
              </Link>
              <Link
                href="/terms-conditions"
                className="hover:text-green-600 transition-colors"
              >
                Terms
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

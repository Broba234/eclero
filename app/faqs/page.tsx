"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function FAQsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-blue-300">
      {/* Top Navigation */}
      <nav className="w-full flex justify-center space-x-6 mt-4">
        <Link
          href="/how-it-works"
          className="px-4 py-2 bg-white border border-gray-300 rounded-full text-gray-700 hover:bg-gray-100 hover:text-black font-medium text-lg"
        >
          How It Works
        </Link>
        <Link
          href="/faqs"
          className="px-4 py-2 bg-white border border-gray-300 rounded-full text-gray-700 hover:bg-gray-100 hover:text-black font-medium text-lg"
        >
          FAQs
        </Link>
        <Link
          href="/terms"
          className="px-4 py-2 bg-white border border-gray-300 rounded-full text-gray-700 hover:bg-gray-100 hover:text-black font-medium text-lg"
        >
          Terms
        </Link>
        <Link
          href="/privacy"
          className="px-4 py-2 bg-white border border-gray-300 rounded-full text-gray-700 hover:bg-gray-100 hover:text-black font-medium text-lg"
        >
          Privacy
        </Link>
      </nav>
      {/* Main Content Placeholder */}
      <div className="flex-1 flex items-center justify-center w-full">
        <h1 className="text-3xl font-bold text-black">FAQs</h1>
      </div>
    </div>
  );
}
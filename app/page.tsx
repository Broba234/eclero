"use client";

import React, { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";
import Link from "next/link";

export default function LandingPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    const { error } = await supabase.from("waitlist").insert({ email });
    if (!error) setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex flex-col relative bg-gradient-to-b from-white to-blue-300">
      {/* Logo in top-left */}
      <div className="absolute top-4 left-4">
        <Image
          src="/logo.png"
          alt="Éclero Logo"
          width={300}
          height={300}
          className="object-contain"
        />
      </div>
      {/* Top Buttons */}
      <nav className="w-full flex justify-center space-x-6 mt-4">
        <Link href="/how-it-works" className="px-4 py-2 bg-white border border-gray-300 rounded-full text-gray-700 hover:bg-gray-100 hover:text-black font-medium text-lg">
          How It Works
        </Link>
        <Link href="/faqs" className="px-4 py-2 bg-white border border-gray-300 rounded-full text-gray-700 hover:bg-gray-100 hover:text-black font-medium text-lg">
          FAQs
        </Link>
        <Link href="/terms" className="px-4 py-2 bg-white border border-gray-300 rounded-full text-gray-700 hover:bg-gray-100 hover:text-black font-medium text-lg">
          Terms
        </Link>
        <Link href="/privacy" className="px-4 py-2 bg-white border border-gray-300 rounded-full text-gray-700 hover:bg-gray-100 hover:text-black font-medium text-lg">
          Privacy
        </Link>
      </nav>
      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center w-full">
        <section className="grid grid-cols-1 md:grid-cols-2 items-center justify-items-center max-w-6xl mx-auto mt-12 p-6 gap-8">
          {/* Left Column */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-4 md:w-full">
            <h1 className="text-5xl font-bold text-black">
              Learn anything,<br />
              Teach anywhere
            </h1>
            <p className="text-lg text-gray-600">
              Connect students and tutors, schedule sessions,{" "}
              and unlock potential.
            </p>
            <div className="flex space-x-4">
              <Link href="/signup">
                <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                  Get Started
                </button>
              </Link>
              <Link href="/login">
                <button className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700">
                  Login
                </button>
              </Link>
            </div>
          </div>

          {/* Right Column */}
          <div className="md:w-full w-full flex items-center justify-center">
            <Image
              src="/anywhereanything.png"
              alt="Anywhere Anything"
              width={600}
              height={400}
              className="rounded-lg object-cover w-full h-auto"
            />
          </div>
        </section>
      </div>
    </div>
  );
}
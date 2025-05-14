"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

interface Profile {
  full_name: string;
  email: string;
}

export default function TutorDashboardPage() {
  const [profile, setProfile] = useState<Profile>({ full_name: "", email: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user && user.id) {
        const { data, error } = await supabase
          .from("users")
          .select("full_name, email")
          .eq("id", user.id)
          .single();
        if (error) {
          console.error("Error fetching profile:", error);
        } else if (data) {
          setProfile(data);
        }
      }
      setLoading(false);
    }
    loadProfile();
  }, []);

  if (loading) return <div className="p-6 text-black">Loading...</div>;

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Header */}
      <header className="bg-blue-600 text-white p-6">
        <h1 className="text-2xl font-semibold">Tutor Dashboard</h1>
      </header>

      <main className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Sidebar / Navigation */}
        <nav className="md:col-span-1 bg-gray-100 p-4 rounded">
          <ul className="space-y-2">
            <li>
              <Link 
                href="/tutor/dashboard"
                className="block py-2 px-3 rounded hover:bg-gray-200 text-black"
              >
                Home
              </Link>
            </li>
            <li>
              <Link 
                href="/tutor/students"
                className="block py-2 px-3 rounded hover:bg-gray-200 text-black"
              >
                My Students
              </Link>
            </li>
            <li>
              <Link 
                href="/tutor/settings"
                className="block py-2 px-3 rounded hover:bg-gray-200 text-black"
              >
                Settings
              </Link>
            </li>
          </ul>
        </nav>

        {/* Main Content */}
        <section className="md:col-span-2 space-y-6">
          {/* Profile Card */}
          <div className="bg-white border rounded shadow p-6">
            <h2 className="text-xl font-medium mb-2 text-black">Your Profile</h2>
            <p className="text-black"><strong>Name:</strong> {profile.full_name}</p>
            <p className="text-black"><strong>Email:</strong> {profile.email}</p>
          </div>

          {/* Placeholder for future widgets */}
          <div className="bg-white border rounded shadow p-6">
            <h2 className="text-xl font-medium mb-2 text-black">Upcoming Sessions</h2>
            <p className="text-black">You have no scheduled sessions yet.</p>
          </div>

          {/* Action Button */}
          <div className="bg-white border rounded shadow p-6">
            <h2 className="text-xl font-medium mb-2 text-black">Get Started</h2>
            <Link 
              href="/find-tutor"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Find a Tutor Now
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
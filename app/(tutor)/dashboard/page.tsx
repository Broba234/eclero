

"use client";

import React from "react";
import Link from "next/link";

export default function TutorDashboardPage() {
  return (
    <main className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-black">Tutor Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Schedule Card */}
        <Link
          href="/schedule"
          className="block p-6 bg-white rounded-lg shadow hover:shadow-md transition"
        >
          <h2 className="text-lg font-semibold text-black mb-2">📅 My Schedule</h2>
          <p className="text-sm text-gray-600">
            View and manage your availability.
          </p>
        </Link>

        {/* Profile Card */}
        <Link
          href="/profile"
          className="block p-6 bg-white rounded-lg shadow hover:shadow-md transition"
        >
          <h2 className="text-lg font-semibold text-black mb-2">👤 My Profile</h2>
          <p className="text-sm text-gray-600">
            View and edit your tutor profile.
          </p>
        </Link>
      </div>
    </main>
  );
}
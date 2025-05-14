'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    const { data, error: authErr } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (authErr) {
      setError(authErr.message);
      return;
    }

    // Fetch the user after successful login
    const { data: userData, error: userErr } = await supabase.auth.getUser();
    if (userErr) {
      setError(userErr.message);
      return;
    }
    const user = userData.user;

    if (user) {
      const { data: profile, error: profileErr } = await supabase
        .from("users")
        .select("role, full_name, email")
        .eq("id", user.id)
        .single();
      if (profileErr) {
        console.error("Profile fetch error:", profileErr);
        router.push("/"); // fallback
      } else {
        // Confirm full_name and email match
        if (profile.full_name && profile.email === email) {
          // Route user based on their role
          if (profile.role === "tutor") {
            router.push("/tutor/dashboard");
          } else {
            router.push("/student/dashboard");
          }
        } else {
          setError("Profile information does not match.");
        }
      }
    }
  };

  // Optional: clear error on page load
  useEffect(() => {
    setError(null);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6 space-y-8">
      {/* Login Card */}
      <div className="w-full max-w-md bg-white p-6 rounded shadow space-y-4">
        <h1 className="text-2xl font-bold">Log In</h1>
        {error && <div className="text-red-500">{error}</div>}
        <form onSubmit={handleLogin} className="space-y-4">
          <label className="block">
            <span className="font-medium">Email</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1 border px-3 py-2 rounded"
            />
          </label>
          <label className="block">
            <span className="font-medium">Password</span>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-1 border px-3 py-2 rounded"
            />
          </label>
          <button
            type="submit"
            className="w-full bg-blue-600 text-black font-semibold py-2 rounded hover:bg-blue-700"
          >
            Log In
          </button>
        </form>
      </div>
    </div>
  );
}

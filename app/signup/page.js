'use client';

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";

export default function SignUpPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("tutor"); // Default role
  const [error, setError] = useState(null);

  useEffect(() => {
    // Get the role from the query parameters
    const roleParam = searchParams.get("role");
    if (roleParam) {
      setRole(roleParam);
    }
  }, [searchParams]);

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError(null);

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { role } },
    });

    if (signUpError) {
      setError(signUpError.message);
      return;
    }

    if (data.user) {
      const { error: insertError } = await supabase
        .from("profiles")
        .insert({ id: data.user.id, role });

      if (insertError) {
        setError(insertError.message);
        return;
      }

      router.push(`/dashboard/${role}`);
    }
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
      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center w-full">
        <section className="flex flex-col items-center justify-center max-w-6xl mx-auto mt-12 p-6 space-y-6">
          <h1 className="text-5xl font-bold text-black">
            Sign Up
          </h1>
          <p className="text-lg text-gray-600">
            Create an account to start learning and teaching.
          </p>
          {error && <div className="text-red-500 mb-4">{error}</div>}
          <form onSubmit={handleSignUp} className="flex flex-col space-y-4">
            <input
              type="text"
              placeholder="Your name"
              className="border rounded px-4 py-2 w-64"
            />
            <input
              type="email"
              placeholder="Your email"
              className="border rounded px-4 py-2 w-64"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              className="border rounded px-4 py-2 w-64"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="role"
                  value="tutor"
                  checked={role === "tutor"}
                  onChange={() => setRole("tutor")}
                  className="mr-2"
                />
                Tutor
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="role"
                  value="student"
                  checked={role === "student"}
                  onChange={() => setRole("student")}
                  className="mr-2"
                />
                Student
              </label>
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Sign Up
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}

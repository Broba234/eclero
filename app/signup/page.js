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
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [role, setRole] = useState("student"); // Default role
  const [error, setError] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [newsletter, setNewsletter] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

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
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // Try to sign up or sign in if already registered
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });
    let user = signUpData?.user;

    if (signUpError) {
      // If user already exists, attempt sign in
      if (signUpError.message.includes("already registered")) {
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) {
          setError(signInError.message);
          return;
        }
        user = signInData.user;
      } else {
        setError(signUpError.message);
        return;
      }
    }

    if (user) {
      // Upsert into 'users' table (create or update)
      const { data: upsertData, error: upsertError } = await supabase
        .from("users")
        .upsert({
          id: user.id,
          email,
          full_name: `${firstName.trim()} ${lastName.trim()}`,
          role,
          newsletter,
          availability: []
        })
        .select();

      console.log("Upsert response:", upsertData, upsertError);

      if (upsertError) {
        setError(upsertError.message);
        return;
      }

      // Success: redirect to dashboard
      router.push(`/${role}/dashboard`);
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
        <section className="flex flex-col items-center justify-center max-w-6xl mx-auto mt-12 p-6 space-y-8">
          <div className="w-full bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-2">
              {role === "tutor" ? "Tutor Account" : "Student Account"}
            </h2>
            <p className="text-gray-700">
              {role === "tutor"
                ? "As a Tutor, you can create and manage your availability, connect with students, and earn by teaching topics you are passionate about."
                : "As a Student, you can browse available tutors, schedule sessions at your convenience, and enhance your learning with expert guidance."}
            </p>
          </div>
          <div className="w-full">
            <h1 className="text-5xl font-bold text-black">
              Sign Up
            </h1>
            <p className="text-lg text-gray-600">
              Create an account to start learning and teaching.
            </p>
            {emailSent && (
              <div className="text-green-600 mb-4">
                Confirmation email sent! Please check your inbox.
              </div>
            )}
            {error && !emailSent && (
              <div className="text-red-500 mb-4">{error}</div>
            )}
            <form onSubmit={handleSignUp} className="flex flex-col space-y-4">
              <div className="flex space-x-4">
                <input
                  type="text"
                  placeholder="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="border border-black text-black rounded px-4 py-2 w-64"
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="border border-black text-black rounded px-4 py-2 w-64"
                />
              </div>
              <input
                type="email"
                placeholder="Your email"
                className="border border-black text-black rounded px-4 py-2 w-full"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="password"
                placeholder="Password"
                className="border border-black text-black rounded px-4 py-2 w-full"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <input
                type="password"
                placeholder="Confirm Password"
                className="border border-black text-black rounded px-4 py-2 w-full"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <label className="flex items-center space-x-2 text-black">
                <input
                  type="checkbox"
                  checked={newsletter}
                  onChange={(e) => setNewsletter(e.target.checked)}
                  className="border border-black rounded"
                />
                <span>Subscribe to newsletter</span>
              </label>
              <div className="flex items-center space-x-4">
                <label className="flex items-center text-black">
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
                <label className="flex items-center text-black">
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
              </div>
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Sign Up
              </button>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
}

'use client';
import Image from 'next/image';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-r from-blue-500 to-blue-300 flex flex-col items-center justify-center">
      <div className="flex justify-center items-center py-12">
        <Image
          src="/eclero-high-resolution-logo-transparent.png"
          alt="Éclero Logo"
          width={256}
          height={256}
          className="w-48 sm:w-64"
        />
      </div>
      <Link href="/select-role" className="mt-8 px-6 py-3 bg-blue-600 text-white text-lg font-medium rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200">
        Commencer
      </Link>
    </main>
  );
}
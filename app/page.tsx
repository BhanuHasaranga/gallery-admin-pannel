import Link from 'next/link';
import React from 'react';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <img src="/logo.png" className="h-24 mb-8" alt="Gray House Media Logo" />
      <h2 className="text-3xl font-semibold text-gray-800 mb-4">
        Admin Panel for Grayhouse Media
      </h2>
      <p className="text-gray-600 text-lg mb-6">
        By logging to the admin panel, you may publish both video and photo albums and edit them.
      </p>
      <Link href="/login">
        <h6 className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-md shadow-md transition duration-300">
          Login here
        </h6>
      </Link>
    </div>
  );
}

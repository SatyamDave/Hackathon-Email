import React, { useState } from 'react';
import { EmailProvider } from './contexts/EmailContext';
import Layout from './components/Layout';

function LandingPage({ onStart }: { onStart: () => void }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-green-900 opacity-80 z-0" />
      <div className="relative z-10 flex flex-col items-center justify-center px-6 py-12">
        <div className="flex items-center space-x-4 mb-8">
          <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center shadow-lg">
            <svg className="w-10 h-10 text-black" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18m9-9H3" /></svg>
          </div>
          <h1 className="text-5xl font-extrabold tracking-tight text-white">GreenInbox</h1>
        </div>
        <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-gray-100 text-center max-w-2xl">The next generation of AI-powered email, reimagined for speed, focus, and delight.</h2>
        <p className="text-lg text-gray-400 mb-10 text-center max-w-xl">Experience a smarter, cleaner, and greener way to manage your emails. Minimal. Fast. Private. <span className="text-green-400 font-semibold">No distractions.</span></p>
        <button
          onClick={onStart}
          className="px-8 py-4 bg-green-500 hover:bg-green-400 text-black font-bold rounded-2xl text-xl shadow-xl transition-all duration-200"
        >
          Get Started
        </button>
      </div>
      <div className="absolute bottom-0 left-0 right-0 flex justify-center pb-8 z-0">
        <span className="text-gray-600 text-xs">Inspired by rabbit.tech &mdash; Built for you</span>
      </div>
    </div>
  );
}

export default function App() {
  const [started, setStarted] = useState(false);
  return started ? (
    <div className="dark min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900 text-gray-100">
      <EmailProvider>
        <Layout />
      </EmailProvider>
    </div>
  ) : (
    <LandingPage onStart={() => setStarted(true)} />
  );
}
import React, { useState } from 'react';
import { EmailProvider } from './contexts/EmailContext';
import Layout from './components/Layout';

function LandingPage({ onStart }: { onStart: () => void }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-gray-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-gray-50 opacity-80 z-0" />
      <div className="relative z-10 flex flex-col items-center justify-center px-6 py-12">
        <div className="flex items-center space-x-4 mb-8">
          <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center shadow-lg">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18m9-9H3" /></svg>
          </div>
          <h1 className="text-5xl font-extrabold tracking-tight text-gray-900">SmartBox</h1>
        </div>
        <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-gray-900 text-center max-w-2xl">AI-powered email, designed for clarity and productivity.</h2>
        <p className="text-lg text-gray-600 mb-10 text-center max-w-xl">Experience a smarter, cleaner way to manage your emails. Minimal. Fast. Intelligent. <span className="text-blue-600 font-semibold">No distractions.</span></p>
        <button
          onClick={onStart}
          className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl text-xl shadow-xl transition-all duration-200"
        >
          Get Started
        </button>
      </div>
      <span className="text-gray-500 text-xs">Welcome to SmartBox &mdash; Built for you</span>
    </div>
  );
}

export default function App() {
  const [started, setStarted] = useState(false);
  
  return started ? (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <EmailProvider>
        <Layout />
      </EmailProvider>
    </div>
  ) : (
    <LandingPage onStart={() => setStarted(true)} />
  );
}
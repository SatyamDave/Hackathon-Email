import React, { useState } from 'react';
import { EmailProvider } from './contexts/EmailContext';
import Layout from './components/Layout';
import AuthenticationModal from './components/AuthenticationModal';
import { useMsal } from '@azure/msal-react';

function LandingPage({ onStart }: { onStart: () => void }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-dark-primary text-dark-text-primary relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-dark-primary via-dark-secondary to-dark-muted opacity-80 z-0" />
      <div className="relative z-10 flex flex-col items-center justify-center px-6 py-12">
        <div className="flex items-center space-x-4 mb-8">
          <div className="w-16 h-16 rounded-full bg-dark-accent flex items-center justify-center shadow-lg">
            <svg className="w-10 h-10 text-dark-primary" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18m9-9H3" /></svg>
          </div>
          <h1 className="text-5xl font-extrabold tracking-tight text-dark-text-primary">GreenInbox</h1>
        </div>
        <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-dark-text-primary text-center max-w-2xl">The next generation of AI-powered email, reimagined for speed, focus, and delight.</h2>
        <p className="text-lg text-dark-text-secondary mb-10 text-center max-w-xl">Experience a smarter, cleaner, and greener way to manage your emails. Minimal. Fast. Private. <span className="text-dark-accent font-semibold">No distractions.</span></p>
        <button
          onClick={onStart}
          className="px-8 py-4 bg-dark-accent hover:bg-dark-accent/90 text-dark-primary font-bold rounded-2xl text-xl shadow-xl transition-all duration-200"
        >
          Get Started
        </button>
      </div>
      <span className="text-dark-text-secondary text-xs">Inspired by rabbit.tech &mdash; Built for you</span>
    </div>
  );
}

function AppContent() {
  const { accounts } = useMsal();
  const isSignedIn = accounts.length > 0;
  const [showAuthModal, setShowAuthModal] = useState(!isSignedIn);

  if (!isSignedIn) {
    return (
      <AuthenticationModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    );
  }

  return (
    <EmailProvider>
      <Layout />
    </EmailProvider>
  );
}

export default function App() {
  const [started, setStarted] = useState(false);
  return started ? (
    <div className="dark min-h-screen bg-gradient-to-br from-dark-primary via-dark-secondary to-dark-muted text-dark-text-primary">
      <AppContent />
    </div>
  ) : (
    <LandingPage onStart={() => setStarted(true)} />
  );
}
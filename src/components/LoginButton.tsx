import React from "react";

export const LoginButton: React.FC = () => {
  const handleMockLogin = () => {
    // Simulate login process
    console.log('Mock login initiated');
    // In a real app, this would trigger the MSAL login flow
  };

  return (
    <button 
      onClick={handleMockLogin}
      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
    >
      Sign in with Microsoft
    </button>
  );
}; 
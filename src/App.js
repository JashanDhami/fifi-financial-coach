import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import HomePage from './components/HomePage';
import GoalsPage from './components/GoalsPage';
import InvestingPage from './components/InvestingPage';
import SubscriptionsPage from './components/SubscriptionsPage';
import ProfilePage from './components/ProfilePage';
import Navigation from './components/Navigation';
import FiFiAssistant from './components/FiFiAssistant';
import { UserProvider, useUser } from './context/UserContext';

function App() {
  return (
    <UserProvider>
      <AppContent />
    </UserProvider>
  );
}

function AppContent() {
  const { state } = useUser();
  const [showFiFiAssistant, setShowFiFiAssistant] = useState(false);

  // Check if user has completed profile setup
  if (!state.user.userType) {
    return (
      <Router>
        <Routes>
          <Route path="*" element={<LoginPage />} />
        </Routes>
      </Router>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <div className="pb-20">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/goals" element={<GoalsPage />} />
            <Route path="/investing" element={<InvestingPage />} />
            <Route path="/subscriptions" element={<SubscriptionsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Routes>
        </div>
        
        <Navigation />
        
        <FiFiAssistant 
          isOpen={showFiFiAssistant}
          onClose={() => setShowFiFiAssistant(false)}
        />
        
        <button
          onClick={() => setShowFiFiAssistant(true)}
          className="fixed bottom-24 right-4 w-14 h-14 bg-primary-600 hover:bg-primary-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110 z-50"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
      </div>
    </Router>
  );
}

export default App; 
import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import { motion } from 'framer-motion';
import { Settings, Bell, Shield, Heart, ExternalLink, Check, Crown } from 'lucide-react';
import FiFiCharacter from './FiFiCharacter';

function ProfilePage() {
  const { state, actions } = useUser();
  const [showContentCreatorModal, setShowContentCreatorModal] = useState(false);
  const [selectedCreator, setSelectedCreator] = useState(state.user.selectedContentCreator);

  const contentCreators = [
    {
      id: 1,
      name: 'Dave Ramsey',
      platform: 'YouTube',
      followers: '5.2M',
      philosophy: 'Debt-free living, emergency fund first, then investing',
      approach: 'Conservative',
      avatar: '👨‍💼',
      description: 'Focuses on getting out of debt before investing, emphasizes emergency funds and living below your means.'
    },
    {
      id: 2,
      name: 'Graham Stephan',
      platform: 'YouTube',
      followers: '4.8M',
      philosophy: 'Real estate investing, side hustles, early retirement',
      approach: 'Moderate',
      avatar: '🏠',
      description: 'Advocates for real estate investing, multiple income streams, and building wealth through passive income.'
    },
    {
      id: 3,
      name: 'Andrei Jikh',
      platform: 'YouTube',
      followers: '2.1M',
      philosophy: 'Crypto, tech stocks, aggressive growth investing',
      approach: 'Aggressive',
      avatar: '📈',
      description: 'Focuses on high-growth investments, cryptocurrency, and emerging technologies for maximum returns.'
    },
    {
      id: 4,
      name: 'Tiffany Aliche',
      platform: 'Instagram',
      followers: '1.2M',
      philosophy: 'Budgeting, saving, building credit, community wealth',
      approach: 'Conservative',
      avatar: '💎',
      description: 'Emphasizes budgeting, saving strategies, building good credit, and community-based financial education.'
    }
  ];

  const handleCreatorSelect = (creator) => {
    setSelectedCreator(creator);
    actions.setContentCreator(creator);
    setShowContentCreatorModal(false);
  };

  const getApproachColor = (approach) => {
    switch (approach) {
      case 'Conservative': return 'text-success-600 bg-success-50';
      case 'Moderate': return 'text-warning-600 bg-warning-50';
      case 'Aggressive': return 'text-danger-600 bg-danger-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Profile & Settings</h1>
        <p className="text-gray-600">Customize your FiFi experience</p>
      </motion.div>

      {/* User Info Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fifi-card mb-6"
      >
        <div className="flex items-center gap-4 mb-4">
          <FiFiCharacter mood="happy" size="large" />
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{state.user.name}</h2>
            <p className="text-gray-600">{state.user.email}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-sm text-gray-500">Level {state.user.level}</span>
              <span className="text-sm text-gray-500">•</span>
              <span className="text-sm text-gray-500">🔥 {state.user.streak} week streak</span>
            </div>
          </div>
        </div>

        {/* User Profile Details */}
        {state.user.userType && (
          <div className="border-t border-gray-200 pt-4">
            <h3 className="font-medium text-gray-900 mb-3">Your Financial Profile</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">User Type:</span>
                <span className="ml-2 font-medium capitalize">{state.user.userType}</span>
              </div>
              {state.user.age && (
                <div>
                  <span className="text-gray-500">Age:</span>
                  <span className="ml-2 font-medium">{state.user.age}</span>
                </div>
              )}
              {state.user.employment && (
                <div>
                  <span className="text-gray-500">Employment:</span>
                  <span className="ml-2 font-medium capitalize">{state.user.employment}</span>
                </div>
              )}
              {state.user.experience && (
                <div>
                  <span className="text-gray-500">Experience:</span>
                  <span className="ml-2 font-medium capitalize">{state.user.experience}</span>
                </div>
              )}
              {state.user.riskTolerance && (
                <div>
                  <span className="text-gray-500">Risk Tolerance:</span>
                  <span className="ml-2 font-medium capitalize">{state.user.riskTolerance}</span>
                </div>
              )}
            </div>
            
            {state.user.primaryGoals && state.user.primaryGoals.length > 0 && (
              <div className="mt-3">
                <span className="text-gray-500 text-sm">Primary Goals:</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {state.user.primaryGoals.map((goal, index) => (
                    <span key={index} className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-full">
                      {goal.replace('_', ' ')}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </motion.div>

      {/* Logout Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fifi-card mb-6"
      >
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Account</h2>
        <button
          onClick={() => {
            // Reset user profile to trigger login flow
            actions.setUserProfile({});
          }}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
        >
          Sign Out
        </button>
      </motion.div>

      {/* Content Creator Integration */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fifi-card mb-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Content Creator Integration</h2>
          <button
            onClick={() => setShowContentCreatorModal(true)}
            className="text-primary-600 hover:text-primary-700 text-sm font-medium"
          >
            Change
          </button>
        </div>

        {selectedCreator ? (
          <div className="p-4 bg-primary-50 rounded-lg border border-primary-200">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">{selectedCreator.avatar}</span>
              <div>
                <h3 className="font-semibold text-gray-900">{selectedCreator.name}</h3>
                <p className="text-sm text-gray-600">{selectedCreator.platform} • {selectedCreator.followers} followers</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getApproachColor(selectedCreator.approach)}`}>
                {selectedCreator.approach}
              </span>
            </div>
            <p className="text-sm text-gray-700">{selectedCreator.description}</p>
            <div className="mt-3 p-3 bg-white rounded-lg">
              <div className="flex items-start gap-2">
                <FiFiCharacter mood="happy" size="small" />
                <p className="text-sm text-gray-700">
                  "I'll now align my advice with {selectedCreator.name}'s {selectedCreator.approach.toLowerCase()} approach to help you achieve your financial goals!"
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Creator Selected</h3>
            <p className="text-gray-600 mb-4">
              Choose a financial content creator to personalize FiFi's advice
            </p>
            <button
              onClick={() => setShowContentCreatorModal(true)}
              className="fifi-button"
            >
              Select Creator
            </button>
          </div>
        )}
      </motion.div>

      {/* App Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fifi-card mb-6"
      >
        <h2 className="text-lg font-semibold text-gray-900 mb-4">App Settings</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                <Bell className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Push Notifications</h3>
                <p className="text-sm text-gray-600">Get alerts for important financial events</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-success-100 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-success-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Data Privacy</h3>
                <p className="text-sm text-gray-600">Control how your financial data is used</p>
              </div>
            </div>
            <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
              Manage
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-warning-100 rounded-lg flex items-center justify-center">
                <Settings className="w-5 h-5 text-warning-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Advanced Settings</h3>
                <p className="text-sm text-gray-600">Customize investment preferences and risk tolerance</p>
              </div>
            </div>
            <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
              Configure
            </button>
          </div>
        </div>
      </motion.div>

      {/* Support & Help */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fifi-card mb-6"
      >
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Support & Help</h2>
        <div className="space-y-3">
          <button className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                  <ExternalLink className="w-4 h-4 text-primary-600" />
                </div>
                <span className="font-medium text-gray-900">Help Center</span>
              </div>
              <ExternalLink className="w-4 h-4 text-gray-400" />
            </div>
          </button>

          <button className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-success-100 rounded-lg flex items-center justify-center">
                  <Heart className="w-4 h-4 text-success-600" />
                </div>
                <span className="font-medium text-gray-900">Contact Support</span>
              </div>
              <ExternalLink className="w-4 h-4 text-gray-400" />
            </div>
          </button>

          <button 
            onClick={() => alert('Premium features coming soon! This will include advanced analytics, priority support, and exclusive FiFi accessories.')}
            className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-warning-100 rounded-lg flex items-center justify-center">
                  <Crown className="w-4 h-4 text-warning-600" />
                </div>
                <span className="font-medium text-gray-900">Premium Features</span>
              </div>
              <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded-full">New</span>
            </div>
          </button>
        </div>
      </motion.div>

      {/* Content Creator Selection Modal */}
      {showContentCreatorModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => setShowContentCreatorModal(false)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Choose Your Financial Guru</h2>
              <button
                onClick={() => setShowContentCreatorModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                ×
              </button>
            </div>

            <div className="grid gap-4">
              {contentCreators.map((creator) => (
                <div
                  key={creator.id}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    selectedCreator?.id === creator.id
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'
                  }`}
                  onClick={() => handleCreatorSelect(creator)}
                >
                  <div className="flex items-start gap-4">
                    <span className="text-3xl">{creator.avatar}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-gray-900">{creator.name}</h3>
                        <span className="text-sm text-gray-500">•</span>
                        <span className="text-sm text-gray-500">{creator.platform}</span>
                        <span className="text-sm text-gray-500">•</span>
                        <span className="text-sm text-gray-500">{creator.followers} followers</span>
                      </div>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getApproachColor(creator.approach)} mb-2`}>
                        {creator.approach} Approach
                      </span>
                      <p className="text-sm text-gray-700 mb-2">{creator.description}</p>
                      <p className="text-sm font-medium text-gray-900">Philosophy: {creator.philosophy}</p>
                    </div>
                    {selectedCreator?.id === creator.id && (
                      <div className="w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-primary-50 rounded-lg border border-primary-200">
              <div className="flex items-start gap-3">
                <FiFiCharacter mood="happy" size="medium" />
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">How This Works</h4>
                  <p className="text-sm text-gray-700">
                    Once you select a content creator, I'll adapt my financial advice to align with their philosophy and approach. 
                    This helps ensure the guidance you receive is consistent with trusted sources you already follow.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}

export default ProfilePage; 
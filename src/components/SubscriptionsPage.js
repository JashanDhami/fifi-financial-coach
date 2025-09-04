import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import { motion } from 'framer-motion';
import { CreditCard, AlertTriangle, CheckCircle, Clock, X, Bell, Trash2 } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import FiFiCharacter from './FiFiCharacter';

function SubscriptionsPage() {
  const { state } = useUser();
  const [filter, setFilter] = useState('all');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState(null);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-5 h-5 text-success-600" />;
      case 'free_trial': return <Clock className="w-5 h-5 text-warning-600" />;
      case 'suspicious': return <AlertTriangle className="w-5 h-5 text-danger-600" />;
      default: return <CheckCircle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-success-50 text-success-700 border-success-200';
      case 'free_trial': return 'bg-warning-50 text-warning-700 border-warning-200';
      case 'suspicious': return 'bg-danger-50 text-danger-700 border-danger-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'active': return 'Active';
      case 'free_trial': return 'Free Trial';
      case 'suspicious': return 'Suspicious';
      default: return 'Unknown';
    }
  };

  const filteredSubscriptions = state.subscriptions.filter(sub => {
    if (filter === 'all') return true;
    return sub.status === filter;
  });

  const totalMonthlyCost = state.subscriptions
    .filter(sub => sub.status === 'active')
    .reduce((sum, sub) => sum + sub.cost, 0);

  const handleCancelSubscription = (subscription) => {
    setSelectedSubscription(subscription);
    setShowCancelModal(true);
  };

  const confirmCancel = () => {
    // In a real app, this would integrate with the service provider
    console.log(`Cancelling subscription: ${selectedSubscription.name}`);
    setShowCancelModal(false);
    setSelectedSubscription(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Subscriptions</h1>
        <p className="text-gray-600">Manage your recurring charges and subscriptions</p>
      </motion.div>

      {/* Summary Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-2 gap-4 mb-6"
      >
        <div className="fifi-card text-center">
          <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <CreditCard className="w-6 h-6 text-primary-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">${totalMonthlyCost.toFixed(2)}</p>
          <p className="text-sm text-gray-600">Monthly Cost</p>
        </div>
        <div className="fifi-card text-center">
          <div className="w-12 h-12 bg-warning-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <Clock className="w-6 h-6 text-warning-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {state.subscriptions.filter(sub => sub.status === 'free_trial').length}
          </p>
          <p className="text-sm text-gray-600">Free Trials</p>
        </div>
      </motion.div>

      {/* Filter Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          {[
            { key: 'all', label: 'All', count: state.subscriptions.length },
            { key: 'active', label: 'Active', count: state.subscriptions.filter(s => s.status === 'active').length },
            { key: 'free_trial', label: 'Trials', count: state.subscriptions.filter(s => s.status === 'free_trial').length },
            { key: 'suspicious', label: 'Suspicious', count: state.subscriptions.filter(s => s.status === 'suspicious').length }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                filter === tab.key
                  ? 'bg-white text-primary-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>
      </motion.div>

      {/* Subscriptions List */}
      <div className="space-y-4">
        <AnimatePresence>
          {filteredSubscriptions.map((subscription, index) => (
            <motion.div
              key={subscription.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
              className="fifi-card"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  {getStatusIcon(subscription.status)}
                  <div>
                    <h3 className="font-semibold text-gray-900">{subscription.name}</h3>
                    <p className="text-sm text-gray-600 capitalize">{subscription.category}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900">
                    ${subscription.cost.toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-500">per month</p>
                </div>
              </div>

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(subscription.status)}`}>
                    {getStatusLabel(subscription.status)}
                  </span>
                  <span className="text-sm text-gray-600">
                    Next billing: {new Date(subscription.nextBilling).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                {subscription.status === 'free_trial' && (
                  <button
                    onClick={() => handleCancelSubscription(subscription)}
                    className="flex-1 fifi-button-secondary py-2 flex items-center justify-center gap-2"
                  >
                    <X className="w-4 h-4" />
                    Cancel Trial
                  </button>
                )}
                {subscription.status === 'active' && (
                  <>
                    <button 
                      onClick={() => alert(`Reminder set for ${subscription.name}! You'll be notified 3 days before your next billing date.`)}
                      className="flex-1 fifi-button-secondary py-2 flex items-center justify-center gap-2"
                    >
                      <Bell className="w-4 h-4" />
                      Remind Me
                    </button>
                    <button
                      onClick={() => handleCancelSubscription(subscription)}
                      className="flex-1 fifi-button-secondary py-2 flex items-center justify-center gap-2 text-danger-600 hover:text-danger-700"
                    >
                      <Trash2 className="w-4 h-4" />
                      Cancel
                    </button>
                  </>
                )}
                {subscription.status === 'suspicious' && (
                  <button 
                    onClick={() => alert(`Investigation started for ${subscription.name}. FiFi will analyze this charge and provide recommendations within 24 hours.`)}
                    className="flex-1 fifi-button-secondary py-2 flex items-center justify-center gap-2"
                  >
                    <AlertTriangle className="w-4 h-4" />
                    Investigate
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* FiFi's Subscription Tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fifi-card mt-6"
      >
        <h2 className="text-lg font-semibold text-gray-900 mb-4">FiFi's Subscription Tips</h2>
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3 bg-primary-50 rounded-lg">
            <FiFiCharacter mood="happy" size="small" />
            <p className="text-sm text-gray-700">
              Review your subscriptions every 3 months. You might find services you're not using anymore!
            </p>
          </div>
          <div className="flex items-start gap-3 p-3 bg-warning-50 rounded-lg">
            <FiFiCharacter mood="sad" size="small" />
            <p className="text-sm text-gray-700">
              Set calendar reminders for free trial end dates to avoid unexpected charges.
            </p>
          </div>
          <div className="flex items-start gap-3 p-3 bg-success-50 rounded-lg">
            <FiFiCharacter mood="happy" size="small" />
            <p className="text-sm text-gray-700">
              Consider annual subscriptions for services you use regularly - they often offer discounts.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Cancel Confirmation Modal */}
      {showCancelModal && selectedSubscription && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => setShowCancelModal(false)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white rounded-xl p-6 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-danger-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-danger-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Cancel Subscription?
              </h2>
              <p className="text-gray-600">
                Are you sure you want to cancel <strong>{selectedSubscription.name}</strong>?
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 fifi-button-secondary py-3"
              >
                Keep It
              </button>
              <button
                onClick={confirmCancel}
                className="flex-1 bg-danger-600 hover:bg-danger-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
              >
                Cancel Subscription
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}

export default SubscriptionsPage; 
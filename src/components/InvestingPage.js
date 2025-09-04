import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import { motion } from 'framer-motion';
import { TrendingUp, Lock, Unlock, Shield } from 'lucide-react';
import FiFiCharacter from './FiFiCharacter';

function InvestingPage() {
  const { state } = useUser();
  const [selectedETF, setSelectedETF] = useState(null);
  const [showETFDetails, setShowETFDetails] = useState(false);

  const emergencyFundProgress = (state.user.emergencyFundCurrent / state.user.emergencyFundTarget) * 100;
  const isInvestingUnlocked = emergencyFundProgress >= 100;

  const etfs = [
    {
      id: 1,
      symbol: 'VTI',
      name: 'Vanguard Total Stock Market ETF',
      description: 'Broad exposure to the entire U.S. stock market',
      expenseRatio: '0.03%',
      risk: 'Low-Medium',
      performance: '+12.5%',
      category: 'Total Market',
      fifiExplanation: "Think of VTI like buying a tiny piece of every company in America. It's like having a diversified portfolio in one investment. Perfect for beginners who want steady growth without the stress of picking individual stocks."
    },
    {
      id: 2,
      symbol: 'VXUS',
      name: 'Vanguard Total International Stock ETF',
      description: 'International stock exposure for global diversification',
      expenseRatio: '0.08%',
      risk: 'Medium',
      performance: '+8.2%',
      category: 'International',
      fifiExplanation: "VXUS gives you access to companies outside the U.S. - think Toyota, Samsung, Nestle. It's like having a passport to global growth. Great for diversifying beyond just American companies."
    },
    {
      id: 3,
      symbol: 'BND',
      name: 'Vanguard Total Bond Market ETF',
      description: 'U.S. bond market exposure for stability',
      expenseRatio: '0.03%',
      risk: 'Low',
      performance: '+3.1%',
      category: 'Bonds',
      fifiExplanation: "BND is like lending money to the government and companies. It's more stable than stocks but grows slower. Think of it as the 'safety net' in your investment portfolio."
    },
    {
      id: 4,
      symbol: 'QQQ',
      name: 'Invesco QQQ Trust',
      description: 'Technology-focused growth stocks',
      expenseRatio: '0.20%',
      risk: 'Medium-High',
      performance: '+18.7%',
      category: 'Technology',
      fifiExplanation: "QQQ focuses on big tech companies like Apple, Microsoft, and Amazon. It's more exciting (and risky) than total market funds. Great if you believe technology will keep growing fast."
    }
  ];

  const projectedGrowth = (monthlyInvestment, years, annualReturn) => {
    const monthlyRate = annualReturn / 100 / 12;
    const months = years * 12;
    return monthlyInvestment * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
  };

  if (!isInvestingUnlocked) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="w-24 h-24 mx-auto mb-6 bg-gray-200 rounded-full flex items-center justify-center">
            <Lock className="w-12 h-12 text-gray-400" />
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Investing is Locked</h1>
          <p className="text-gray-600 mb-6">
            Build your emergency fund first to unlock investing features and start building wealth!
          </p>

          <div className="fifi-card max-w-md mx-auto mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Emergency Fund Progress</h2>
            <div className="text-center mb-4">
              <div className="w-20 h-20 mx-auto mb-3 relative">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="35"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="8"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="35"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="8"
                    strokeDasharray={`${2 * Math.PI * 35}`}
                    strokeDashoffset={`${2 * Math.PI * 35 * (1 - emergencyFundProgress / 100)}`}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-bold text-gray-900">{emergencyFundProgress.toFixed(0)}%</span>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-1">
                ${state.user.emergencyFundCurrent.toLocaleString()} / ${state.user.emergencyFundTarget.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500">Target: 3-6 months of expenses</p>
            </div>
          </div>

          <div className="bg-primary-50 rounded-xl p-6 max-w-md mx-auto border-l-4 border-primary-500">
            <div className="flex items-start gap-3">
              <FiFiCharacter mood="sad" size="medium" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">FiFi's Advice</h3>
                <p className="text-gray-700 text-sm">
                  "Before you start investing, it's crucial to have a safety net. Your emergency fund should cover 3-6 months of expenses. Once you reach this goal, you'll unlock the investing section where we can start building your wealth together!"
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-success-600 rounded-full flex items-center justify-center">
            <Unlock className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Investing</h1>
        </div>
        <p className="text-gray-600">Start building wealth with smart, diversified investments</p>
      </motion.div>

      {/* 80/20 Rule Explanation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fifi-card mb-6"
      >
        <h2 className="text-lg font-semibold text-gray-900 mb-4">The 80/20 Investing Rule</h2>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center p-4 bg-primary-50 rounded-lg">
            <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-2">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            <p className="text-sm font-medium text-gray-900">80%</p>
            <p className="text-xs text-gray-600">ETFs & Stocks</p>
          </div>
          <div className="text-center p-4 bg-success-50 rounded-lg">
            <div className="w-16 h-16 bg-success-600 rounded-full flex items-center justify-center mx-auto mb-2">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <p className="text-sm font-medium text-gray-900">20%</p>
            <p className="text-xs text-gray-600">Savings & Bonds</p>
          </div>
        </div>
        <p className="text-sm text-gray-600 text-center">
          This simple rule helps balance growth potential with stability
        </p>
      </motion.div>

      {/* Featured ETFs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fifi-card mb-6"
      >
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Featured ETFs</h2>
        <div className="space-y-3">
          {etfs.map((etf) => (
            <div
              key={etf.id}
              className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 transition-colors cursor-pointer"
              onClick={() => {
                setSelectedETF(etf);
                setShowETFDetails(true);
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{etf.symbol}</h3>
                    <p className="text-sm text-gray-600">{etf.name}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-success-600">{etf.performance}</p>
                  <p className="text-xs text-gray-500">{etf.expenseRatio}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Projected Growth */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fifi-card mb-6"
      >
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Projected Growth</h2>
        <div className="text-center p-6 bg-gradient-to-r from-primary-50 to-success-50 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">If you invest $500/month for 30 years</h3>
          <div className="text-3xl font-bold text-primary-600 mb-2">
            ${projectedGrowth(500, 30, 7).toLocaleString()}
          </div>
          <p className="text-sm text-gray-600">
            Assuming 7% annual return (historical average)
          </p>
        </div>
      </motion.div>

      {/* FiFi's Investment Tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fifi-card"
      >
        <h2 className="text-lg font-semibold text-gray-900 mb-4">FiFi's Investment Tips</h2>
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3 bg-primary-50 rounded-lg">
            <FiFiCharacter mood="happy" size="small" />
            <p className="text-sm text-gray-700">
              Start early! Even small amounts invested regularly can grow significantly over time thanks to compound interest.
            </p>
          </div>
          <div className="flex items-start gap-3 p-3 bg-success-50 rounded-lg">
            <FiFiCharacter mood="happy" size="small" />
            <p className="text-sm text-gray-700">
              Don't try to time the market. Consistent investing (dollar-cost averaging) often beats trying to pick the perfect moment.
            </p>
          </div>
          <div className="flex items-start gap-3 p-3 bg-warning-50 rounded-lg">
            <FiFiCharacter mood="sad" size="small" />
            <p className="text-sm text-gray-700">
              Remember: Past performance doesn't guarantee future results. Always invest within your risk tolerance.
            </p>
          </div>
        </div>
      </motion.div>

      {/* ETF Details Modal */}
      {showETFDetails && selectedETF && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => setShowETFDetails(false)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white rounded-xl p-6 w-full max-w-md max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">{selectedETF.symbol}</h2>
              <button
                onClick={() => setShowETFDetails(false)}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-900 mb-1">{selectedETF.name}</h3>
                <p className="text-sm text-gray-600">{selectedETF.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Expense Ratio</p>
                  <p className="font-medium text-gray-900">{selectedETF.expenseRatio}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Risk Level</p>
                  <p className="font-medium text-gray-900">{selectedETF.risk}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Category</p>
                  <p className="font-medium text-gray-900">{selectedETF.category}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Performance</p>
                  <p className="font-medium text-success-600">{selectedETF.performance}</p>
                </div>
              </div>

              <div className="bg-primary-50 rounded-lg p-4 border-l-4 border-primary-500">
                <div className="flex items-start gap-3">
                  <FiFiCharacter mood="happy" size="small" />
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">FiFi Explains</h4>
                    <p className="text-sm text-gray-700">{selectedETF.fifiExplanation}</p>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => alert(`Investment feature coming soon! This will allow you to start investing in ${selectedETF.symbol}. For now, focus on building your emergency fund first.`)}
                className="w-full fifi-button py-3"
              >
                Start Investing in {selectedETF.symbol}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}

export default InvestingPage; 
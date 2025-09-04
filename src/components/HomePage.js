import React, { useState, useEffect, useCallback } from 'react';
import { useUser } from '../context/UserContext';
import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle, DollarSign } from 'lucide-react';
import FiFiCharacter from './FiFiCharacter';

function HomePage() {
  const { state } = useUser();
  const [greeting, setGreeting] = useState('');
  const [greetingType, setGreetingType] = useState('positive');

  const generateGreeting = useCallback(() => {
    const { spending } = state;
    const totalSpent = spending.currentMonth;
    const budget = state.user.monthlyBudget;
    const remaining = budget - totalSpent;
    const percentageUsed = (totalSpent / budget) * 100;

    // Personalized greetings based on user type and survey responses
    if (state.user.userType === 'student') {
      if (percentageUsed > 90) {
        setGreeting("Hey there! As a student, it's super important to watch your spending. Let's find some budget-friendly alternatives!");
        setGreetingType('warning');
      } else {
        setGreeting(`Great job managing your student budget! You still have $${remaining.toFixed(0)} for the month.`);
        setGreetingType('positive');
      }
    } else if (state.user.userType === 'freelancer') {
      if (percentageUsed > 90) {
        setGreeting("Freelancer life can be unpredictable! Let's review your spending and plan for variable income months.");
        setGreetingType('warning');
      } else {
        setGreeting(`Excellent work managing your freelance income! You have $${remaining.toFixed(0)} remaining this month.`);
        setGreetingType('positive');
      }
    } else if (state.user.userType === 'entrepreneur') {
      if (percentageUsed > 90) {
        setGreeting("Business owner alert! Let's optimize your personal spending to keep more capital in your business.");
        setGreetingType('warning');
      } else {
        setGreeting(`Smart business thinking! You have $${remaining.toFixed(0)} for personal expenses this month.`);
        setGreetingType('positive');
      }
    } else {
      if (percentageUsed > 90) {
        setGreeting("You're approaching your monthly budget limit. Let's review your spending together!");
        setGreetingType('warning');
      } else if (percentageUsed > 75) {
        setGreeting("You're doing well with your budget, but there's room for optimization. Want some tips?");
        setGreetingType('neutral');
      } else {
        setGreeting(`Great job staying under budget! You still have $${remaining.toFixed(0)} remaining this month.`);
        setGreetingType('positive');
      }
    }
  }, [state]);

  useEffect(() => {
    generateGreeting();
  }, [generateGreeting]);


  const getStatusIcon = (status) => {
    switch (status) {
      case 'safe': return <CheckCircle className="w-5 h-5 text-success-600" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-warning-600" />;
      case 'danger': return <AlertTriangle className="w-5 h-5 text-danger-600" />;
      default: return <CheckCircle className="w-5 h-5 text-success-600" />;
    }
  };

  const emergencyFundProgress = (state.user.emergencyFundCurrent / state.user.emergencyFundTarget) * 100;

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Welcome back, {state.user.name}! 👋
        </h1>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>🔥 {state.user.streak} week streak</span>
          <span>•</span>
          <span>Level {state.user.level}</span>
        </div>
      </motion.div>

      {/* FiFi's Greeting */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`fifi-card mb-6 border-l-4 ${
          greetingType === 'positive' ? 'border-success-500 bg-success-50' :
          greetingType === 'warning' ? 'border-warning-500 bg-warning-50' :
          'border-primary-500 bg-primary-50'
        }`}
      >
        <div className="flex items-start gap-3">
          <FiFiCharacter 
            mood={greetingType === 'positive' ? 'happy' : greetingType === 'warning' ? 'sad' : 'crying'}
            size="medium"
            className="flex-shrink-0"
          />
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-1">FiFi's Daily Insight</h3>
            <p className="text-gray-700">{greeting}</p>
          </div>
        </div>
      </motion.div>

      {/* Financial Snapshot */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fifi-card mb-6"
      >
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Financial Snapshot</h2>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Monthly Budget</p>
            <p className="text-2xl font-bold text-gray-900">${state.user.monthlyBudget}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Spent This Month</p>
            <p className="text-2xl font-bold text-gray-900">${state.spending.currentMonth}</p>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Budget Progress</span>
            <span>{((state.spending.currentMonth / state.user.monthlyBudget) * 100).toFixed(1)}%</span>
          </div>
          <div className="progress-bar">
            <div 
              className={`progress-fill ${
                (state.spending.currentMonth / state.user.monthlyBudget) > 0.9 ? 'status-danger' :
                (state.spending.currentMonth / state.user.monthlyBudget) > 0.75 ? 'status-warning' :
                'status-safe'
              }`}
              style={{ width: `${Math.min((state.spending.currentMonth / state.user.monthlyBudget) * 100, 100)}%` }}
            ></div>
          </div>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            {state.spending.currentMonth < state.user.monthlyBudget ? (
              <span className="text-success-600">
                ${(state.user.monthlyBudget - state.spending.currentMonth).toFixed(0)} remaining
              </span>
            ) : (
              <span className="text-danger-600">
                ${(state.spending.currentMonth - state.user.monthlyBudget).toFixed(0)} over budget
              </span>
            )}
          </p>
        </div>
      </motion.div>

      {/* Emergency Fund Tracker */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fifi-card mb-6"
      >
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Emergency Fund</h2>
        <div className="text-center mb-4">
          <div className="w-24 h-24 mx-auto mb-3 relative">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="8"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#10b981"
                strokeWidth="8"
                strokeDasharray={`${2 * Math.PI * 40}`}
                strokeDashoffset={`${2 * Math.PI * 40 * (1 - emergencyFundProgress / 100)}`}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-lg font-bold text-gray-900">{emergencyFundProgress.toFixed(0)}%</span>
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-1">
            ${state.user.emergencyFundCurrent.toLocaleString()} / ${state.user.emergencyFundTarget.toLocaleString()}
          </p>
          <p className="text-xs text-gray-500">Target: 3-6 months of expenses</p>
        </div>
      </motion.div>

      {/* Spending Categories */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fifi-card mb-6"
      >
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Spending by Category</h2>
        <div className="space-y-3">
          {Object.entries(state.spending.categories).map(([category, data]) => (
            <div key={category} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {getStatusIcon(data.status)}
                <span className="capitalize font-medium text-gray-700">{category}</span>
              </div>
              <div className="text-right">
                <p className="font-medium text-gray-900">${data.spent}</p>
                <p className="text-sm text-gray-500">/ ${data.budget}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fifi-card"
      >
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-3">
          <button 
            onClick={() => alert('Add Income feature coming soon! This will help you track additional income sources.')}
            className="fifi-button-secondary py-3"
          >
            <DollarSign className="w-5 h-5 mx-auto mb-2" />
            <span className="text-sm">Add Income</span>
          </button>
          <button 
            onClick={() => window.location.href = '/goals'}
            className="fifi-button-secondary py-3"
          >
            <DollarSign className="w-5 h-5 mx-auto mb-2" />
            <span className="text-sm">Set New Goal</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default HomePage; 
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { Mail, Lock, User } from 'lucide-react';
import FiFiCharacter from './FiFiCharacter';

function LoginPage() {
  const navigate = useNavigate();
  const { actions } = useUser();
  const [isLogin, setIsLogin] = useState(true);
  const [showSurvey, setShowSurvey] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: ''
  });

  const [surveyData, setSurveyData] = useState({
    age: '',
    income: '',
    employment: '',
    financialGoals: [],
    experience: '',
    riskTolerance: '',
    monthlyIncome: '',
    monthlyExpenses: '',
    currentSavings: '',
    debtAmount: ''
  });

  const employmentOptions = [
    { value: 'student', label: 'Student', icon: '🎓' },
    { value: 'fulltime', label: 'Full-time Employee', icon: '💼' },
    { value: 'parttime', label: 'Part-time Employee', icon: '⏰' },
    { value: 'freelance', label: 'Freelancer/Contractor', icon: '🖥️' },
    { value: 'entrepreneur', label: 'Entrepreneur/Business Owner', icon: '🚀' },
    { value: 'unemployed', label: 'Currently Unemployed', icon: '🔍' }
  ];

  const financialGoals = [
    { value: 'emergency_fund', label: 'Build Emergency Fund', icon: '🛡️' },
    { value: 'debt_payoff', label: 'Pay Off Debt', icon: '💳' },
    { value: 'savings', label: 'Save for Big Purchase', icon: '💰' },
    { value: 'investment', label: 'Start Investing', icon: '📈' },
    { value: 'retirement', label: 'Plan for Retirement', icon: '🏖️' },
    { value: 'budgeting', label: 'Learn Budgeting', icon: '📊' }
  ];

  const experienceLevels = [
    { value: 'beginner', label: 'Complete Beginner', description: 'New to personal finance' },
    { value: 'novice', label: 'Some Knowledge', description: 'Basic understanding of money' },
    { value: 'intermediate', label: 'Intermediate', description: 'Comfortable with most concepts' },
    { value: 'advanced', label: 'Advanced', description: 'Experienced investor/saver' }
  ];

  const riskToleranceLevels = [
    { value: 'conservative', label: 'Conservative', description: 'Prefer safety over growth' },
    { value: 'moderate', label: 'Moderate', description: 'Balance of safety and growth' },
    { value: 'aggressive', label: 'Aggressive', description: 'Prefer growth over safety' }
  ];

  const handleFormSubmit = (e) => {
    e.preventDefault();
    // Both login and registration go to survey
    setShowSurvey(true);
  };

  const validateCurrentStep = () => {
    switch (currentStep) {
      case 0: // Age and employment
        return surveyData.age && surveyData.employment;
      case 1: // Income level
        return surveyData.income;
      case 2: // Monthly income
        return surveyData.monthlyIncome && parseFloat(surveyData.monthlyIncome) > 0;
      case 3: // Monthly expenses
        return surveyData.monthlyExpenses && parseFloat(surveyData.monthlyExpenses) >= 0;
      case 4: // Current savings
        return surveyData.currentSavings !== '' && parseFloat(surveyData.currentSavings) >= 0;
      case 5: // Current debt
        return surveyData.debtAmount !== '' && parseFloat(surveyData.debtAmount) >= 0;
      case 6: // Financial goals
        return surveyData.financialGoals.length > 0;
      case 7: // Experience and risk tolerance
        return surveyData.experience && surveyData.riskTolerance;
      default:
        return true;
    }
  };

  const handleSurveyNext = () => {
    if (!validateCurrentStep()) {
      alert('Please complete all required fields before continuing.');
      return;
    }
    
    if (currentStep < 7) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete survey and create user profile
      const userProfile = createUserProfile();
      actions.setUserProfile(userProfile);
      navigate('/');
    }
  };

  const handleSurveyBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const createUserProfile = () => {
    const { 
      age, 
      employment, 
      financialGoals, 
      experience, 
      riskTolerance,
      monthlyIncome,
      monthlyExpenses,
      currentSavings,
      debtAmount
    } = surveyData;
    
    // Calculate real budget based on user input
    const monthlyIncomeNum = parseFloat(monthlyIncome) || 0;
    const monthlyExpensesNum = parseFloat(monthlyExpenses) || 0;
    const currentSavingsNum = parseFloat(currentSavings) || 0;
    const debtAmountNum = parseFloat(debtAmount) || 0;
    
    // Calculate available budget (income - expenses)
    const availableBudget = monthlyIncomeNum - monthlyExpensesNum;
    
    // Calculate emergency fund target (3-6 months of expenses)
    const emergencyFundTarget = monthlyExpensesNum * 4; // 4 months as default
    
    // Determine user type based on employment and financial situation
    let userType = 'standard';
    
    if (employment === 'student') {
      userType = 'student';
    } else if (employment === 'freelance') {
      userType = 'freelancer';
    } else if (employment === 'entrepreneur') {
      userType = 'entrepreneur';
    }

    return {
      name: formData.name || 'Demo User',
      email: formData.email,
      userType,
      monthlyBudget: availableBudget,
      emergencyFundTarget,
      currentSavings: currentSavingsNum,
      debtAmount: debtAmountNum,
      monthlyIncome: monthlyIncomeNum,
      monthlyExpenses: monthlyExpensesNum,
      experience,
      riskTolerance,
      primaryGoals: financialGoals,
      employment,
      age
    };
  };

  const renderSurveyStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <FiFiCharacter mood="happy" size="large" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Tell Us About Yourself</h2>
            <p className="text-gray-600 mb-6">This helps FiFi provide personalized financial advice</p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Age Range</label>
                <select
                  value={surveyData.age}
                  onChange={(e) => setSurveyData({...surveyData, age: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">Select age range</option>
                  <option value="18-24">18-24 years old</option>
                  <option value="25-34">25-34 years old</option>
                  <option value="35-44">35-44 years old</option>
                  <option value="45-54">45-54 years old</option>
                  <option value="55+">55+ years old</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Employment Status</label>
                <div className="grid grid-cols-2 gap-3">
                  {employmentOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setSurveyData({...surveyData, employment: option.value})}
                      className={`p-3 border-2 rounded-lg text-center transition-all ${
                        surveyData.employment === option.value
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 hover:border-primary-300'
                      }`}
                    >
                      <div className="text-2xl mb-2">{option.icon}</div>
                      <div className="text-sm font-medium">{option.label}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <FiFiCharacter mood="happy" size="large" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Income & Financial Situation</h2>
            <p className="text-gray-600 mb-6">This helps us understand your financial capacity</p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Income Level</label>
                <select
                  value={surveyData.income}
                  onChange={(e) => setSurveyData({...surveyData, income: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">Select income level</option>
                  <option value="low">Below $30,000/year</option>
                  <option value="medium">$30,000 - $70,000/year</option>
                  <option value="high">$70,000 - $120,000/year</option>
                  <option value="very_high">Above $120,000/year</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Current Debt Level</label>
                <select
                  value={surveyData.debtLevel}
                  onChange={(e) => setSurveyData({...surveyData, debtLevel: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">Select debt level</option>
                  <option value="none">No debt</option>
                  <option value="low">Low debt (under $5,000)</option>
                  <option value="medium">Medium debt ($5,000 - $25,000)</option>
                  <option value="high">High debt (over $25,000)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Current Savings Rate</label>
                <select
                  value={surveyData.savingsRate}
                  onChange={(e) => setSurveyData({...surveyData, savingsRate: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">Select savings rate</option>
                  <option value="none">Not saving currently</option>
                  <option value="low">Saving 1-10% of income</option>
                  <option value="medium">Saving 10-20% of income</option>
                  <option value="high">Saving 20%+ of income</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <FiFiCharacter mood="happy" size="large" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Monthly Income</h2>
            <p className="text-gray-600 mb-6">Let's understand your financial capacity</p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">What's your monthly take-home income?</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    value={surveyData.monthlyIncome}
                    onChange={(e) => setSurveyData({...surveyData, monthlyIncome: e.target.value})}
                    className="w-full pl-8 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-center text-lg"
                    placeholder="0"
                    required
                    min="0"
                    step="100"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Enter your after-tax monthly income</p>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <FiFiCharacter mood="happy" size="large" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Monthly Expenses</h2>
            <p className="text-gray-600 mb-6">Let's track your spending patterns</p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">What are your typical monthly expenses?</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    value={surveyData.monthlyExpenses}
                    onChange={(e) => setSurveyData({...surveyData, monthlyExpenses: e.target.value})}
                    className="w-full pl-8 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-center text-lg"
                    placeholder="0"
                    required
                    min="0"
                    step="100"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Include rent, utilities, food, transportation, etc.</p>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <FiFiCharacter mood="happy" size="large" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Current Savings</h2>
            <p className="text-gray-600 mb-6">Let's see where you stand</p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">How much do you currently have saved?</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    value={surveyData.currentSavings}
                    onChange={(e) => setSurveyData({...surveyData, currentSavings: e.target.value})}
                    className="w-full pl-8 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-center text-lg"
                    placeholder="0"
                    required
                    min="0"
                    step="100"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Include savings accounts, emergency funds, etc.</p>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <FiFiCharacter mood="happy" size="large" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Current Debt</h2>
            <p className="text-gray-600 mb-6">Let's understand your debt situation</p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">How much debt do you currently have?</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    value={surveyData.debtAmount}
                    onChange={(e) => setSurveyData({...surveyData, debtAmount: e.target.value})}
                    className="w-full pl-8 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-center text-lg"
                    placeholder="0"
                    required
                    min="0"
                    step="100"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Include credit cards, loans, student debt, etc.</p>
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <FiFiCharacter mood="happy" size="large" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Financial Goals</h2>
            <p className="text-gray-600 mb-6">Select your top 3 financial priorities</p>
            
            <div className="grid grid-cols-2 gap-3">
              {financialGoals.map((goal) => (
                <button
                  key={goal.value}
                  type="button"
                  onClick={() => {
                    const currentGoals = surveyData.financialGoals;
                    if (currentGoals.includes(goal.value)) {
                      setSurveyData({
                        ...surveyData,
                        financialGoals: currentGoals.filter(g => g !== goal.value)
                      });
                    } else if (currentGoals.length < 3) {
                      setSurveyData({
                        ...surveyData,
                        financialGoals: [...currentGoals, goal.value]
                      });
                    }
                  }}
                  className={`p-4 border-2 rounded-lg text-center transition-all ${
                    surveyData.financialGoals.includes(goal.value)
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-primary-300'
                  }`}
                >
                  <div className="text-2xl mb-2">{goal.icon}</div>
                  <div className="text-sm font-medium">{goal.label}</div>
                </button>
              ))}
            </div>
            
            <p className="text-sm text-gray-500 mt-4">
              Selected: {surveyData.financialGoals.length}/3
            </p>
          </div>
        );

      case 7:
        return (
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <FiFiCharacter mood="happy" size="large" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Experience & Risk Tolerance</h2>
            <p className="text-gray-600 mb-6">This helps FiFi tailor investment advice</p>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Financial Experience Level</label>
                <div className="space-y-3">
                  {experienceLevels.map((level) => (
                    <label key={level.value} className="flex items-start p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="experience"
                        value={level.value}
                        checked={surveyData.experience === level.value}
                        onChange={(e) => setSurveyData({...surveyData, experience: e.target.value})}
                        className="mr-3 mt-1"
                      />
                      <div>
                        <div className="font-medium">{level.label}</div>
                        <div className="text-sm text-gray-500">{level.description}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Risk Tolerance</label>
                <div className="space-y-3">
                  {riskToleranceLevels.map((level) => (
                    <label key={level.value} className="flex items-start p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="riskTolerance"
                        value={level.value}
                        checked={surveyData.riskTolerance === level.value}
                        onChange={(e) => setSurveyData({...surveyData, riskTolerance: e.target.value})}
                        className="mr-3 mt-1"
                      />
                      <div>
                        <div className="font-medium">{level.label}</div>
                        <div className="text-sm text-gray-500">{level.description}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );



      default:
        return null;
    }
  };

  if (showSurvey) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        >
          <div className="p-8">
            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Step {currentStep + 1} of 7</span>
                <span>{Math.round(((currentStep + 1) / 7) * 100)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentStep + 1) / 7) * 100}%` }}
                ></div>
              </div>
            </div>

            {renderSurveyStep()}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              <button
                onClick={handleSurveyBack}
                disabled={currentStep === 0}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Back
              </button>
              
              <button
                onClick={handleSurveyNext}
                className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                {currentStep === 6 ? 'Complete Setup' : 'Next'}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-success-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md"
      >
        <div className="p-8">
          {/* Logo & Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <FiFiCharacter mood="happy" size="large" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">FiFi</h1>
            <p className="text-gray-600">Your Smart Financial Coach</p>
          </div>

          {/* Form */}
          <form onSubmit={handleFormSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter your full name"
                    required={!isLogin}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Confirm your password"
                    required={!isLogin}
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 transition-colors font-medium"
            >
              {isLogin ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          {/* Toggle */}
          <div className="text-center mt-6">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
            </button>
          </div>

          {/* Demo Access */}
          <div className="mt-8 p-4 bg-gray-50 rounded-lg text-center">
            <p className="text-sm text-gray-600 mb-2">Want to try FiFi first?</p>
            <button
              onClick={() => {
                // Set demo data and skip to survey
                setFormData({
                  name: 'Demo User',
                  email: 'demo@fifi.com',
                  password: '',
                  confirmPassword: ''
                });
                setSurveyData({
                  age: '25-34',
                  income: 'medium',
                  employment: 'fulltime',
                  financialGoals: ['emergency_fund', 'savings', 'budgeting'],
                  experience: 'beginner',
                  riskTolerance: 'moderate',
                  monthlyIncome: '5000',
                  monthlyExpenses: '3500',
                  currentSavings: '2000',
                  debtAmount: '5000'
                });
                setShowSurvey(true);
              }}
              className="text-primary-600 hover:text-primary-700 font-medium text-sm"
            >
              Try Demo Mode
            </button>
            <p className="text-xs text-gray-500 mt-1">Uses sample data to explore the app</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default LoginPage; 
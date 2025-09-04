import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, X, Calculator, TrendingUp, Shield, CreditCard } from 'lucide-react';
import FiFiCharacter from './FiFiCharacter';

function FiFiAssistant({ isOpen, onClose }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'fifi',
      content: "Hi! I'm FiFi, your personal financial coach. How can I help you today? I can explain financial concepts, help with strategies, or answer any money questions you have! 💰",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const quickQuestions = [
    {
      question: "What is a credit score?",
      icon: <CreditCard className="w-4 h-4" />
    },
    {
      question: "How do I start investing?",
      icon: <TrendingUp className="w-4 h-4" />
    },
    {
      question: "What's an emergency fund?",
      icon: <Shield className="w-4 h-4" />
    },
    {
      question: "How do I create a budget?",
      icon: <Calculator className="w-4 h-4" />
    }
  ];

  const financialConcepts = {
    'credit score': {
      title: 'Credit Score',
      explanation: "A credit score is a three-digit number (300-850) that represents your creditworthiness. Think of it as a financial report card that lenders use to decide whether to give you credit and at what interest rate.",
      keyPoints: [
        "Excellent: 800-850 (Best rates)",
        "Good: 670-799 (Good rates)",
        "Fair: 580-669 (Higher rates)",
        "Poor: 300-579 (Hard to get credit)"
      ],
      tips: [
        "Pay bills on time",
        "Keep credit card balances low",
        "Don't close old accounts",
        "Limit new credit applications"
      ]
    },
    'investing': {
      title: 'Investing Basics',
      explanation: "Investing is putting your money to work to earn more money over time. It's like planting seeds that grow into trees - your money grows through compound interest and market gains.",
      keyPoints: [
        "Start with your emergency fund first",
        "Consider index funds or ETFs for beginners",
        "Diversify your investments",
        "Invest for the long term (5+ years)"
      ],
      tips: [
        "Start small and increase over time",
        "Don't invest money you need soon",
        "Consider your risk tolerance",
        "Automate your investments"
      ]
    },
    'emergency fund': {
      title: 'Emergency Fund',
      explanation: "An emergency fund is money set aside for unexpected expenses like medical bills, car repairs, or job loss. It's your financial safety net that prevents you from going into debt.",
      keyPoints: [
        "Aim for 3-6 months of expenses",
        "Keep it in a high-yield savings account",
        "Only use for true emergencies",
        "Replenish after using it"
      ],
      tips: [
        "Start with $1,000 goal",
        "Save 20% of your income",
        "Cut unnecessary expenses",
        "Use windfalls (tax returns, bonuses)"
      ]
    },
    'budget': {
      title: 'Creating a Budget',
      explanation: "A budget is a plan for how you'll spend your money. It helps you control your spending, save money, and reach your financial goals.",
      keyPoints: [
        "Track all income and expenses",
        "Use the 50/30/20 rule",
        "50% for needs (rent, food, bills)",
        "30% for wants (entertainment, shopping)",
        "20% for savings and debt repayment"
      ],
      tips: [
        "Use apps like FiFi to track spending",
        "Review and adjust monthly",
        "Set realistic goals",
        "Celebrate small wins"
      ]
    }
  };

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate FiFi's response
    setTimeout(() => {
      const response = generateFiFiResponse(inputValue.toLowerCase());
      const fifiMessage = {
        id: Date.now() + 1,
        type: 'fifi',
        content: response,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, fifiMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 2000); // Random delay for realism
  };

  const generateFiFiResponse = (userInput) => {
    // Check for specific financial concepts
    for (const [concept, info] of Object.entries(financialConcepts)) {
      if (userInput.includes(concept)) {
        return `${info.title} 💡\n\n${info.explanation}\n\nKey Points:\n${info.keyPoints.map(point => `• ${point}`).join('\n')}\n\nPro Tips:\n${info.tips.map(tip => `✨ ${tip}`).join('\n')}`;
      }
    }

    // Generic responses based on keywords
    if (userInput.includes('debt') || userInput.includes('credit card')) {
      return "Debt can feel overwhelming, but you're not alone! 💪\n\nHere's a simple strategy:\n1. List all your debts from smallest to largest\n2. Pay minimum on all, extra on the smallest\n3. When smallest is paid off, move to the next\n4. This creates momentum and keeps you motivated!\n\nWould you like me to explain the debt snowball method in detail?";
    }

    if (userInput.includes('save') || userInput.includes('saving')) {
      return "Great question about saving! 🎯\n\nStart with the 1% rule: save just 1% of your income this month, then increase by 1% each month. Before you know it, you'll be saving 12%!\n\nAlso try:\n• Save your change (round up purchases)\n• Use the 52-week challenge\n• Automate transfers to savings\n\nWhat's your biggest saving challenge right now?";
    }

    if (userInput.includes('invest') || userInput.includes('stock')) {
      return "Investing can seem scary, but it's actually simpler than you think! 📈\n\nStart with these steps:\n1. Build your emergency fund first\n2. Start with index funds (like VTI or VOO)\n3. Invest regularly (even $50/month helps)\n4. Don't try to time the market\n\nRemember: The best time to start investing was yesterday. The second best time is today!\n\nWant me to explain index funds?";
    }

    // Default helpful response
    return "That's a great question! 🤔\n\nI'm here to help you understand any financial concept. You can ask me about:\n• Credit scores and building credit\n• Creating and sticking to budgets\n• Starting to invest\n• Managing debt\n• Building emergency funds\n• And much more!\n\nWhat specific area would you like to learn more about?";
  };

  const handleQuickQuestion = (question) => {
    setInputValue(question);
    handleSendMessage();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md h-[600px] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <FiFiCharacter mood="happy" size="medium" />
            <div>
              <h2 className="font-semibold text-gray-900">FiFi Assistant</h2>
              <p className="text-sm text-gray-500">Your Financial Coach</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.type === 'fifi' && (
                <FiFiCharacter mood="happy" size="small" className="mr-2 flex-shrink-0" />
              )}
              <div
                className={`max-w-[80%] p-3 rounded-2xl ${
                  message.type === 'user'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <p className="text-sm whitespace-pre-line">{message.content}</p>
                <p className={`text-xs mt-2 ${
                  message.type === 'user' ? 'text-primary-100' : 'text-gray-500'
                }`}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </motion.div>
          ))}

          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <FiFiCharacter mood="happy" size="small" className="mr-2 flex-shrink-0" />
              <div className="bg-gray-100 text-gray-900 p-3 rounded-2xl">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Questions */}
        {messages.length === 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="px-4 pb-3"
          >
            <p className="text-xs text-gray-500 mb-2">Quick questions:</p>
            <div className="grid grid-cols-2 gap-2">
              {quickQuestions.map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickQuestion(item.question)}
                  className="p-2 text-xs bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex items-center gap-2 justify-center"
                >
                  {item.icon}
                  <span className="truncate">{item.question}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Input */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask FiFi anything about money..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isTyping}
              className="px-4 py-2 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 text-white rounded-lg transition-colors disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default FiFiAssistant; 
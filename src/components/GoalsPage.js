import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Calendar, X, Edit3 } from 'lucide-react';
import FiFiCharacter from './FiFiCharacter';

function GoalsPage() {
  const { state, actions } = useUser();
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    targetAmount: '',
    deadline: '',
    priority: 'medium',
    category: 'savings'
  });

  const categories = [
    { value: 'savings', label: 'Savings', icon: '💰' },
    { value: 'travel', label: 'Travel', icon: '✈️' },
    { value: 'debt', label: 'Debt Repayment', icon: '💳' },
    { value: 'investment', label: 'Investment', icon: '📈' },
    { value: 'education', label: 'Education', icon: '🎓' },
    { value: 'home', label: 'Home', icon: '🏠' },
    { value: 'other', label: 'Other', icon: '🎯' }
  ];

  const priorities = [
    { value: 'high', label: 'High Priority', color: 'text-danger-600 bg-danger-50' },
    { value: 'medium', label: 'Medium Priority', color: 'text-warning-600 bg-warning-50' },
    { value: 'low', label: 'Low Priority', color: 'text-success-600 bg-success-50' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingGoal) {
      actions.updateGoal({ ...editingGoal, ...formData });
      setEditingGoal(null);
    } else {
      actions.addGoal({
        ...formData,
        targetAmount: parseFloat(formData.targetAmount),
        currentAmount: 0,
        createdAt: new Date().toISOString()
      });
    }
    setFormData({
      name: '',
      targetAmount: '',
      deadline: '',
      priority: 'medium',
      category: 'savings'
    });
    setShowAddGoal(false);
  };

  const handleEdit = (goal) => {
    setEditingGoal(goal);
    setFormData({
      name: goal.name,
      targetAmount: goal.targetAmount.toString(),
      deadline: goal.deadline,
      priority: goal.priority,
      category: goal.category
    });
    setShowAddGoal(true);
  };

  const getProgressColor = (progress) => {
    if (progress >= 100) return 'bg-success-500';
    if (progress >= 75) return 'bg-warning-500';
    if (progress >= 50) return 'bg-primary-500';
    return 'bg-gray-300';
  };

  const getCategoryIcon = (category) => {
    return categories.find(cat => cat.value === category)?.icon || '🎯';
  };

  const getPriorityInfo = (priority) => {
    return priorities.find(p => p.value === priority);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-2xl font-bold text-gray-900 mb-2">My Financial Goals</h1>
        <p className="text-gray-600">Track your progress and stay motivated</p>
      </motion.div>

      {/* Add Goal Button */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mb-6"
      >
        <button
          onClick={() => setShowAddGoal(true)}
          className="w-full fifi-button py-4 flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add New Goal
        </button>
      </motion.div>

      {/* Goals List */}
      <div className="space-y-4">
        <AnimatePresence>
          {state.goals.map((goal, index) => (
            <motion.div
              key={goal.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
              className="fifi-card"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{getCategoryIcon(goal.category)}</span>
                  <div>
                    <h3 className="font-semibold text-gray-900">{goal.name}</h3>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityInfo(goal.priority)?.color}`}>
                        {getPriorityInfo(goal.priority)?.label}
                      </span>
                      {goal.deadline && (
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Calendar className="w-3 h-3" />
                          {new Date(goal.deadline).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(goal)}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-3">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Progress</span>
                  <span>${goal.currentAmount.toLocaleString()} / ${goal.targetAmount.toLocaleString()}</span>
                </div>
                <div className="progress-bar">
                  <div
                    className={`progress-fill ${getProgressColor((goal.currentAmount / goal.targetAmount) * 100)}`}
                    style={{ width: `${Math.min((goal.currentAmount / goal.targetAmount) * 100, 100)}%` }}
                  ></div>
                </div>
                <div className="text-right mt-1">
                  <span className="text-sm font-medium text-gray-700">
                    {((goal.currentAmount / goal.targetAmount) * 100).toFixed(1)}%
                  </span>
                </div>
              </div>

              {/* FiFi's Tip */}
              <div className="bg-primary-50 rounded-lg p-3 border-l-4 border-primary-500">
                <div className="flex items-start gap-2">
                  <FiFiCharacter 
                    mood={goal.currentAmount >= goal.targetAmount ? 'happy' : 'sad'} 
                    size="small" 
                  />
                  <p className="text-sm text-gray-700">
                    {goal.currentAmount >= goal.targetAmount 
                      ? "🎉 Congratulations! You've reached your goal!"
                      : `Want to reach this goal faster? Consider cutting back on ${goal.category === 'travel' ? 'entertainment' : 'dining out'} expenses.`
                    }
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Add/Edit Goal Modal */}
      <AnimatePresence>
        {showAddGoal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowAddGoal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl p-6 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  {editingGoal ? 'Edit Goal' : 'Add New Goal'}
                </h2>
                <button
                  onClick={() => setShowAddGoal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Goal Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="e.g., Vacation to Hawaii"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Target Amount ($)
                  </label>
                  <input
                    type="number"
                    value={formData.targetAmount}
                    onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="2000"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Deadline (Optional)
                  </label>
                  <input
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    {categories.map(category => (
                      <option key={category.value} value={category.value}>
                        {category.icon} {category.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priority
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    {priorities.map(priority => (
                      <option key={priority.value} value={priority.value}>
                        {priority.label}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full fifi-button py-3"
                >
                  {editingGoal ? 'Update Goal' : 'Create Goal'}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default GoalsPage; 
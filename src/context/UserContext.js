import React, { createContext, useContext, useReducer, useEffect } from 'react';

const UserContext = createContext();

const initialState = {
  user: {
    name: '',
    email: '',
    userType: '',
    emergencyFundTarget: 0,
    emergencyFundCurrent: 0,
    monthlyBudget: 0,
    currentSavings: 0,
    debtAmount: 0,
    monthlyIncome: 0,
    monthlyExpenses: 0,
    experience: '',
    riskTolerance: '',
    primaryGoals: [],
    employment: '',
    age: '',
    streak: 0,
    level: 1,
    selectedContentCreator: null,
  },
  spending: {
    currentMonth: 0,
    categories: {
      food: { spent: 0, budget: 0, status: 'safe' },
      transport: { spent: 0, budget: 0, status: 'safe' },
      entertainment: { spent: 0, budget: 0, status: 'safe' },
      utilities: { spent: 0, budget: 0, status: 'safe' },
      shopping: { spent: 0, budget: 0, status: 'safe' },
      healthcare: { spent: 0, budget: 0, status: 'safe' },
      other: { spent: 0, budget: 0, status: 'safe' }
    }
  },
  goals: [],
  subscriptions: [],
  notifications: []
};

function userReducer(state, action) {
  switch (action.type) {
    case 'UPDATE_SPENDING':
      return {
        ...state,
        spending: {
          ...state.spending,
          ...action.payload
        }
      };
    
    case 'ADD_GOAL':
      return {
        ...state,
        goals: [...state.goals, action.payload]
      };
    
    case 'UPDATE_GOAL':
      return {
        ...state,
        goals: state.goals.map(goal => 
          goal.id === action.payload.id ? { ...goal, ...action.payload } : goal
        )
      };
    
    case 'UPDATE_EMERGENCY_FUND':
      return {
        ...state,
        user: {
          ...state.user,
          emergencyFundCurrent: action.payload
        }
      };
    
    case 'UPDATE_STREAK':
      return {
        ...state,
        user: {
          ...state.user,
          streak: action.payload
        }
      };
    
    case 'SET_CONTENT_CREATOR':
      return {
        ...state,
        user: {
          ...state.user,
          selectedContentCreator: action.payload
        }
      };
    
    case 'SET_USER_PROFILE':
      if (Object.keys(action.payload).length === 0) {
        // Logout - reset to initial state
        return initialState;
      }
      
      // Calculate emergency fund current based on user's current savings
      const emergencyFundCurrent = action.payload.currentSavings || 0;
      
      return {
        ...state,
        user: {
          ...state.user,
          ...action.payload,
          emergencyFundCurrent
        },
        spending: {
          ...state.spending,
          budget: action.payload.monthlyBudget || 0,
          remaining: (action.payload.monthlyBudget || 0) - state.spending.currentMonth
        }
      };
    
    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [action.payload, ...state.notifications]
      };
    
    case 'MARK_NOTIFICATION_READ':
      return {
        ...state,
        notifications: state.notifications.map(notif => 
          notif.id === action.payload ? { ...notif, read: true } : notif
        )
      };
    
    default:
      return state;
  }
}

export function UserProvider({ children }) {
  const [state, dispatch] = useReducer(userReducer, initialState);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate spending updates
      const randomCategory = Object.keys(state.spending.categories)[
        Math.floor(Math.random() * Object.keys(state.spending.categories).length)
      ];
      
      if (Math.random() > 0.7) {
        dispatch({
          type: 'UPDATE_SPENDING',
          payload: {
            categories: {
              ...state.spending.categories,
              [randomCategory]: {
                ...state.spending.categories[randomCategory],
                spent: state.spending.categories[randomCategory].spent + Math.floor(Math.random() * 20)
              }
            }
          }
        });
      }
    }, 30000); // Every 30 seconds

    return () => clearInterval(interval);
  }, [state.spending.categories]);

  const value = {
    state,
    dispatch,
      actions: {
    updateSpending: (payload) => dispatch({ type: 'UPDATE_SPENDING', payload }),
    addGoal: (goal) => dispatch({ type: 'ADD_GOAL', payload: { ...goal, id: Date.now() } }),
    updateGoal: (payload) => dispatch({ type: 'UPDATE_GOAL', payload }),
    updateEmergencyFund: (amount) => dispatch({ type: 'UPDATE_EMERGENCY_FUND', payload: amount }),
    updateStreak: (streak) => dispatch({ type: 'UPDATE_STREAK', payload: streak }),
    setContentCreator: (creator) => dispatch({ type: 'SET_CONTENT_CREATOR', payload: creator }),
    setUserProfile: (profile) => dispatch({ type: 'SET_USER_PROFILE', payload: profile }),
    addNotification: (notification) => dispatch({ 
      type: 'ADD_NOTIFICATION', 
      payload: { ...notification, id: Date.now(), timestamp: new Date().toISOString(), read: false }
    }),
    markNotificationRead: (id) => dispatch({ type: 'MARK_NOTIFICATION_READ', payload: id })
  }
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
} 
import React from 'react';
import { motion } from 'framer-motion';

function FiFiCharacter({ mood = 'happy', size = 'medium', className = '' }) {
  const getFiFiImage = (mood) => {
    switch (mood) {
      case 'happy':
        return '/fifi-happy.png';
      case 'sad':
        return '/fifi-sad.png';
      case 'crying':
        return '/fifi-crying.png';
      default:
        return '/fifi-happy.png';
    }
  };

  const getSizeClasses = (size) => {
    switch (size) {
      case 'small':
        return 'w-8 h-8';
      case 'medium':
        return 'w-12 h-12';
      case 'large':
        return 'w-20 h-20';
      case 'xl':
        return 'w-32 h-32';
      default:
        return 'w-12 h-12';
    }
  };

  const getAnimation = (mood) => {
    switch (mood) {
      case 'happy':
        return {
          initial: { scale: 0.8, rotate: -5 },
          animate: { scale: 1, rotate: 0 },
          transition: { type: "spring", stiffness: 300, damping: 10 }
        };
      case 'sad':
        return {
          initial: { scale: 0.9, y: 5 },
          animate: { scale: 1, y: 0 },
          transition: { duration: 0.5 }
        };
      case 'crying':
        return {
          initial: { scale: 0.9, y: 10 },
          animate: { scale: 1, y: 0 },
          transition: { duration: 0.8, repeat: Infinity, repeatType: "reverse" }
        };
      default:
        return {
          initial: { scale: 0.8 },
          animate: { scale: 1 },
          transition: { duration: 0.3 }
        };
    }
  };

  return (
    <motion.div
      className={`${getSizeClasses(size)} ${className}`}
      {...getAnimation(mood)}
    >
      <img
        src={getFiFiImage(mood)}
        alt={`FiFi ${mood}`}
        className="w-full h-full object-contain"
        onError={(e) => {
          // Fallback to emoji if image fails to load
          e.target.style.display = 'none';
          e.target.nextSibling.style.display = 'flex';
        }}
      />
      {/* Fallback emoji */}
      <div 
        className={`${getSizeClasses(size)} hidden items-center justify-center text-2xl bg-primary-600 rounded-full text-white font-bold`}
        style={{ fontSize: size === 'small' ? '1rem' : size === 'medium' ? '1.5rem' : size === 'large' ? '2.5rem' : '4rem' }}
      >
        {mood === 'happy' ? '😊' : mood === 'sad' ? '😔' : '😢'}
      </div>
    </motion.div>
  );
}

export default FiFiCharacter; 
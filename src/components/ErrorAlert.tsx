'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, X, CheckCircle, Info, AlertTriangle } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';

export type AlertType = 'error' | 'success' | 'warning' | 'info';

interface ErrorAlertProps {
  type: AlertType;
  title: string;
  message?: string;
  dismissible?: boolean;
  onDismiss?: () => void;
  autoDismiss?: number; // Auto dismiss after X milliseconds
}

const alertConfig = {
  error: {
    icon: AlertCircle,
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-500/30',
    iconColor: 'text-red-400',
    titleColor: 'text-red-300'
  },
  success: {
    icon: CheckCircle,
    bgColor: 'bg-green-500/10',
    borderColor: 'border-green-500/30',
    iconColor: 'text-green-400',
    titleColor: 'text-green-300'
  },
  warning: {
    icon: AlertTriangle,
    bgColor: 'bg-yellow-500/10',
    borderColor: 'border-yellow-500/30',
    iconColor: 'text-yellow-400',
    titleColor: 'text-yellow-300'
  },
  info: {
    icon: Info,
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/30',
    iconColor: 'text-blue-400',
    titleColor: 'text-blue-300'
  }
};

export function ErrorAlert({ 
  type, 
  title, 
  message, 
  dismissible = true, 
  onDismiss, 
  autoDismiss 
}: ErrorAlertProps) {
  const [isVisible, setIsVisible] = useState(true);
  const config = alertConfig[type];
  const Icon = config.icon;

  const handleDismiss = useCallback(() => {
    setIsVisible(false);
    setTimeout(() => {
      onDismiss?.();
    }, 300); // Wait for animation to complete
  }, [onDismiss]);

  useEffect(() => {
    if (autoDismiss) {
      const timer = setTimeout(() => {
        handleDismiss();
      }, autoDismiss);
      return () => clearTimeout(timer);
    }
  }, [autoDismiss, handleDismiss]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className={`card ${config.bgColor} ${config.borderColor} border`}
        >
          <div className="flex items-start gap-3">
            <Icon className={`w-5 h-5 ${config.iconColor} mt-0.5 flex-shrink-0`} />
            <div className="flex-1 min-w-0">
              <h4 className={`font-medium ${config.titleColor}`}>{title}</h4>
              {message && (
                <p className="text-white/80 text-sm mt-1">{message}</p>
              )}
            </div>
            {dismissible && (
              <button
                onClick={handleDismiss}
                className="text-white/60 hover:text-white/80 transition-colors flex-shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Hook for managing alerts
export function useAlert() {
  const [alerts, setAlerts] = useState<Array<ErrorAlertProps & { id: string }>>([]);

  const addAlert = (alert: Omit<ErrorAlertProps, 'onDismiss'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newAlert = {
      ...alert,
      id,
      onDismiss: () => removeAlert(id)
    };
    setAlerts(prev => [...prev, newAlert]);
  };

  const removeAlert = (id: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  };

  const clearAlerts = () => {
    setAlerts([]);
  };

  return {
    alerts,
    addAlert,
    removeAlert,
    clearAlerts,
    showError: (title: string, message?: string) => addAlert({ type: 'error', title, message }),
    showSuccess: (title: string, message?: string) => addAlert({ type: 'success', title, message }),
    showWarning: (title: string, message?: string) => addAlert({ type: 'warning', title, message }),
    showInfo: (title: string, message?: string) => addAlert({ type: 'info', title, message })
  };
}

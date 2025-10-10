/**
 * Haptic feedback utilities for mobile PWA
 * Provides tactile responses for user interactions
 */

export const HapticFeedback = {
  /**
   * Light tap - for buttons and minor interactions
   */
  light: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(10);
    }
  },

  /**
   * Medium tap - for confirmations and selections
   */
  medium: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(20);
    }
  },

  /**
   * Heavy tap - for important actions
   */
  heavy: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(30);
    }
  },

  /**
   * Success pattern - for successful actions (points earned, uploads complete)
   */
  success: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate([10, 50, 10]);
    }
  },

  /**
   * Error pattern - for errors or failed actions
   */
  error: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate([50, 100, 50]);
    }
  },

  /**
   * Points earned pattern - celebratory pattern for earning points
   */
  pointsEarned: (points: number) => {
    if ('vibrate' in navigator) {
      // More points = more celebration
      if (points >= 100) {
        navigator.vibrate([10, 30, 10, 30, 10, 30]); // Triple burst
      } else if (points >= 50) {
        navigator.vibrate([10, 30, 10, 30]); // Double burst
      } else {
        navigator.vibrate([10, 30, 10]); // Single burst
      }
    }
  },

  /**
   * Level up or milestone pattern
   */
  milestone: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate([50, 100, 50, 100, 50]);
    }
  },

  /**
   * Notification pattern
   */
  notification: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate([15, 50, 15]);
    }
  },

  /**
   * Selection pattern - for switching tabs or options
   */
  selection: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(5);
    }
  },
};

/**
 * Check if haptic feedback is supported
 */
export const isHapticsSupported = (): boolean => {
  return 'vibrate' in navigator;
};

/**
 * Hook-based haptics for React components
 */
export const useHaptics = () => {
  return {
    ...HapticFeedback,
    isSupported: isHapticsSupported(),
  };
};


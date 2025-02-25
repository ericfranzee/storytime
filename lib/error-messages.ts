export const errorMessages = {
  auth: {
    'auth/email-already-in-use': 'This email is already registered. Please log in or use a different email.',
    'auth/invalid-email': 'Please enter a valid email address.',
    'auth/weak-password': 'Password should be at least 8 characters with numbers and symbols.',
    'auth/user-not-found': 'No account found with this email. Please sign up.',
    'auth/wrong-password': 'Incorrect password. Please try again or reset your password.',
    'auth/too-many-requests': 'Too many attempts. Please try again later.',
    'auth/network-request-failed': 'Network error. Please check your connection.',
  },
  subscription: {
    'sub/payment-failed': 'Payment processing failed. Please try again.',
    'sub/limit-reached': 'You have reached your monthly video generation limit.',
    'sub/invalid-plan': 'Selected plan is not valid. Please choose another plan.',
    'sub/already-subscribed': 'You already have an active subscription.',
  },
  video: {
    'video/generation-failed': 'Video generation failed. Please try again.',
    'video/invalid-input': 'Please check your story content and try again.',
    'video/processing-error': 'Error processing your video. Our team has been notified.',
    'video/too-long': 'Story content exceeds maximum length.',
  },
  general: {
    default: 'An unexpected error occurred. Please try again.',
    networkError: 'Connection error. Please check your internet connection.',
    serverError: 'Server error. Please try again later.',
    validationError: 'Please check your input and try again.',
  }
};

export const successMessages = {
  auth: {
    login: 'Welcome back!',
    signup: 'Account created successfully! Welcome to Story Time.',
    logout: 'You have been successfully logged out.',
    passwordReset: 'Password reset email sent. Please check your inbox.',
    passwordChange: 'Password successfully updated.',
  },
  subscription: {
    upgraded: 'Subscription upgraded successfully!',
    cancelled: 'Subscription cancelled. Active until period ends.',
    renewed: 'Subscription renewed successfully.',
  },
  video: {
    generated: 'Video generated successfully!',
    processing: "Video is being processed. We'll notify you when it's ready.",
    saved: 'Video saved successfully.',
    shared: 'Video shared successfully.',
  }
};

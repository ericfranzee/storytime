interface RateLimit {
  count: number;
  resetTime: number;
}

const userRateLimits = new Map<string, RateLimit>();

export const checkRateLimit = (userId: string, limitPerMinute: number = 5): boolean => {
  const now = Date.now();
  const userLimit = userRateLimits.get(userId);

  if (!userLimit || now > userLimit.resetTime) {
    // First request or reset time passed
    userRateLimits.set(userId, {
      count: 1,
      resetTime: now + 60000 // 1 minute from now
    });
    return true;
  }

  if (userLimit.count >= limitPerMinute) {
    return false;
  }

  // Increment count
  userLimit.count += 1;
  userRateLimits.set(userId, userLimit);
  return true;
};

export const getRemainingLimit = (userId: string): number => {
  const userLimit = userRateLimits.get(userId);
  if (!userLimit || Date.now() > userLimit.resetTime) {
    return 5;
  }
  return 5 - userLimit.count;
};

export const getResetTime = (userId: string): number => {
  const userLimit = userRateLimits.get(userId);
  if (!userLimit) return 0;
  return Math.max(0, userLimit.resetTime - Date.now());
};

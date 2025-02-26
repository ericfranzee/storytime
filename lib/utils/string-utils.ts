export const getInitials = (email: string | null | undefined): string => {
  if (!email) return '?';
  return email.charAt(0).toUpperCase();
};

export const getRandomColor = (text: string): string => {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = text.charCodeAt(i) + ((hash << 5) - hash);
  }
  const colors = [
    'bg-blue-500',
    'bg-green-500',
    'bg-yellow-500',
    'bg-red-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500',
  ];
  return colors[Math.abs(hash) % colors.length];
};

export const BLOG_CATEGORIES = [
  { id: 'technology', label: 'Technology' },
  { id: 'lifestyle', label: 'Lifestyle' },
  { id: 'news', label: 'News' },
  { id: 'children', label: 'Children' },
  { id: 'health', label: 'Health & Wellness' },
  { id: 'business', label: 'Business' }
] as const;

export type BlogCategory = typeof BLOG_CATEGORIES[number]['id'];

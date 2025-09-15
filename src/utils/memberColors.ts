// Predefined color palette for member avatars
const MEMBER_COLORS = [
  { bg: 'blue.500', color: 'white' },
  { bg: 'green.500', color: 'white' },
  { bg: 'purple.500', color: 'white' },
  { bg: 'orange.500', color: 'white' },
  { bg: 'pink.500', color: 'white' },
  { bg: 'teal.500', color: 'white' },
  { bg: 'red.500', color: 'white' },
  { bg: 'yellow.500', color: 'black' },
  { bg: 'cyan.500', color: 'white' },
  { bg: 'indigo.500', color: 'white' },
  { bg: 'lime.500', color: 'black' },
  { bg: 'emerald.500', color: 'white' },
  { bg: 'rose.500', color: 'white' },
  { bg: 'violet.500', color: 'white' },
  { bg: 'sky.500', color: 'white' },
];

/**
 * Generate a consistent color for a member based on their username
 * @param username - The member's username
 * @returns Color object with background and text color
 */
export function getMemberColor(username: string) {
  // Simple hash function to convert string to number
  let hash = 0;
  for (let i = 0; i < username.length; i++) {
    const char = username.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  // Use absolute value and modulo to get index
  const index = Math.abs(hash) % MEMBER_COLORS.length;
  return MEMBER_COLORS[index];
}

/**
 * Get the first letter of a username for avatar display
 * @param username - The member's username
 * @returns First letter in uppercase
 */
export function getMemberInitial(username: string): string {
  return username.charAt(0).toUpperCase();
}

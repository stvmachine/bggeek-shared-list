import React, { createContext, useContext, useMemo } from "react";

interface UsernameColor {
  bg: string;
  color: string;
  initial: string;
}

interface UsernameColorContextType {
  getUsernameColor: (username: string) => UsernameColor;
  getUsernameColors: (usernames: string[]) => Record<string, UsernameColor>;
}

const UsernameColorContext = createContext<
  UsernameColorContextType | undefined
>(undefined);

// Consistent color generation function
const generateUsernameColor = (username: string): UsernameColor => {
  // Use a simple hash function to ensure consistent colors
  let hash = 0;
  for (let i = 0; i < username.length; i++) {
    const char = username.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }

  // Use absolute value and modulo to get a consistent hue
  const hue = Math.abs(hash) % 360;

  return {
    bg: `hsl(${hue}, 70%, 50%)`,
    color: "white",
    initial: username.charAt(0).toUpperCase(),
  };
};

export const UsernameColorProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const getUsernameColor = useMemo(
    () => (username: string) => generateUsernameColor(username),
    []
  );

  const getUsernameColors = useMemo(
    () => (usernames: string[]) => {
      return usernames.reduce(
        (acc, username) => {
          acc[username] = generateUsernameColor(username);
          return acc;
        },
        {} as Record<string, UsernameColor>
      );
    },
    []
  );

  const value = useMemo(
    () => ({
      getUsernameColor,
      getUsernameColors,
    }),
    [getUsernameColor, getUsernameColors]
  );

  return (
    <UsernameColorContext.Provider value={value}>
      {children}
    </UsernameColorContext.Provider>
  );
};

export const useUsernameColor = (): UsernameColorContextType => {
  const context = useContext(UsernameColorContext);
  if (context === undefined) {
    throw new Error(
      "useUsernameColor must be used within a UsernameColorProvider"
    );
  }
  return context;
};

export default UsernameColorContext;

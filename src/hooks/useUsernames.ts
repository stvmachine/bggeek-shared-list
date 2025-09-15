import { useReducer, useEffect } from 'react';

type UsernameAction = 
  | { type: 'ADD'; payload: string }
  | { type: 'REMOVE'; payload: string }
  | { type: 'CLEAR' }
  | { type: 'SET'; payload: string[] };

type UsernameState = {
  usernames: string[];
};

const STORAGE_KEY = 'bggeek-usernames';

const initialState: UsernameState = {
  usernames: [],
};

function usernameReducer(state: UsernameState, action: UsernameAction): UsernameState {
  switch (action.type) {
    case 'ADD':
      if (state.usernames.includes(action.payload)) {
        return state; // Don't add duplicates
      }
      return {
        ...state,
        usernames: [...state.usernames, action.payload],
      };
    
    case 'REMOVE':
      return {
        ...state,
        usernames: state.usernames.filter(username => username !== action.payload),
      };
    
    case 'CLEAR':
      return {
        ...state,
        usernames: [],
      };
    
    case 'SET':
      return {
        ...state,
        usernames: action.payload,
      };
    
    default:
      return state;
  }
}

export function useUsernames() {
  const [state, dispatch] = useReducer(usernameReducer, initialState);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsedUsernames = JSON.parse(stored);
        if (Array.isArray(parsedUsernames)) {
          dispatch({ type: 'SET', payload: parsedUsernames });
        }
      }
    } catch (error) {
      console.error('Failed to load usernames from localStorage:', error);
    }
  }, []);

  // Save to localStorage whenever usernames change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.usernames));
    } catch (error) {
      console.error('Failed to save usernames to localStorage:', error);
    }
  }, [state.usernames]);

  const addUsername = (username: string) => {
    dispatch({ type: 'ADD', payload: username });
  };

  const removeUsername = (username: string) => {
    dispatch({ type: 'REMOVE', payload: username });
  };

  const clearUsernames = () => {
    dispatch({ type: 'CLEAR' });
  };

  const setUsernames = (usernames: string[]) => {
    dispatch({ type: 'SET', payload: usernames });
  };

  return {
    usernames: state.usernames,
    addUsername,
    removeUsername,
    clearUsernames,
    setUsernames,
  };
}

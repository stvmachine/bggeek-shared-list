import { BggCollectionItem } from './types';

export type GroupingOption = 
  | 'none' 
  | 'players' 
  | 'rating' 
  | 'bestPlayers';

export interface GroupedGames {
  [key: string]: BggCollectionItem[];
}

export const groupGamesByPlayers = (games: BggCollectionItem[]): GroupedGames => {
  const groups: GroupedGames = {};
  
  games.forEach(game => {
    const minPlayers = Number(game.stats?.minplayers) || 1;
    const maxPlayers = Number(game.stats?.maxplayers) || minPlayers;
    
    // Create a range string for the group key
    const groupKey = minPlayers === maxPlayers 
      ? `${minPlayers} Player${minPlayers === 1 ? '' : 's'}`
      : `${minPlayers}-${maxPlayers} Players`;
    
    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    groups[groupKey].push(game);
  });
  
  // Sort groups by minimum player count
  const sortedGroups: GroupedGames = {};
  Object.keys(groups)
    .sort((a, b) => {
      const aMin = parseInt(a.match(/\d+/)?.[0] || '0');
      const bMin = parseInt(b.match(/\d+/)?.[0] || '0');
      return aMin - bMin;
    })
    .forEach(key => {
      sortedGroups[key] = groups[key];
    });
  
  return sortedGroups;
};

export const groupGamesByYear = (games: BggCollectionItem[]): GroupedGames => {
  const groups: GroupedGames = {};
  
  games.forEach(game => {
    const year = game.yearpublished || 'Unknown';
    const groupKey = `${year}`;
    
    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    groups[groupKey].push(game);
  });
  
  // Sort groups by year (newest first)
  const sortedGroups: GroupedGames = {};
  Object.keys(groups)
    .sort((a, b) => {
      if (a === 'Unknown') return 1;
      if (b === 'Unknown') return -1;
      return parseInt(b) - parseInt(a);
    })
    .forEach(key => {
      sortedGroups[key] = groups[key];
    });
  
  return sortedGroups;
};

export const groupGamesByRating = (games: BggCollectionItem[]): GroupedGames => {
  const groups: GroupedGames = {
    '9.0+ (Excellent)': [],
    '8.0-8.9 (Very Good)': [],
    '7.0-7.9 (Good)': [],
    '6.0-6.9 (Average)': [],
    'Below 6.0 (Poor)': [],
    'Unrated': []
  };
  
  games.forEach(game => {
    const rating = game.stats?.rating?.average?.value || 0;
    
    if (rating === 0) {
      groups['Unrated'].push(game);
    } else if (rating >= 9.0) {
      groups['9.0+ (Excellent)'].push(game);
    } else if (rating >= 8.0) {
      groups['8.0-8.9 (Very Good)'].push(game);
    } else if (rating >= 7.0) {
      groups['7.0-7.9 (Good)'].push(game);
    } else if (rating >= 6.0) {
      groups['6.0-6.9 (Average)'].push(game);
    } else {
      groups['Below 6.0 (Poor)'].push(game);
    }
  });
  
  // Remove empty groups
  Object.keys(groups).forEach(key => {
    if (groups[key].length === 0) {
      delete groups[key];
    }
  });
  
  return groups;
};

export const groupGamesByBestPlayers = (games: BggCollectionItem[]): GroupedGames => {
  const groups: GroupedGames = {};

  games.forEach((game) => {
    const minPlayers = game.stats?.minplayers || 0;
    const maxPlayers = game.stats?.maxplayers || 0;
    
    // Calculate the "best with" player count
    // For most games, this is often the middle of the range or slightly towards the higher end
    let bestPlayerCount: number;
    
    if (minPlayers === maxPlayers) {
      bestPlayerCount = minPlayers;
    } else if (maxPlayers - minPlayers === 1) {
      // If only 1 player difference, prefer the higher count
      bestPlayerCount = maxPlayers;
    } else {
      // For larger ranges, use a heuristic: prefer the upper 2/3 of the range
      const range = maxPlayers - minPlayers;
      bestPlayerCount = Math.min(maxPlayers, minPlayers + Math.ceil(range * 0.67));
    }

    const groupName = `Best with ${bestPlayerCount} player${bestPlayerCount === 1 ? '' : 's'}`;

    if (!groups[groupName]) {
      groups[groupName] = [];
    }
    groups[groupName].push(game);
  });

  // Sort groups by player count
  const sortedGroups: GroupedGames = {};
  const sortedKeys = Object.keys(groups).sort((a, b) => {
    const aCount = parseInt(a.match(/\d+/)?.[0] || '0');
    const bCount = parseInt(b.match(/\d+/)?.[0] || '0');
    return aCount - bCount;
  });

  sortedKeys.forEach(key => {
    sortedGroups[key] = groups[key];
  });

  return sortedGroups;
};



export const groupGames = (games: BggCollectionItem[], groupBy: GroupingOption): GroupedGames => {
  switch (groupBy) {
    case 'players':
      return groupGamesByPlayers(games);
    case 'rating':
      return groupGamesByRating(games);
    case 'bestPlayers':
      return groupGamesByBestPlayers(games);
    case 'none':
    default:
      return { 'All Games': games };
  }
};

import { sortGames } from '../sorting';
import { IItem } from '../types';

// Mock game data for testing
const mockGames: IItem[] = [
  {
    objectid: '1',
    name: { text: 'Zebra Game', sortIndex: '1' },
    stats: {
      minplayers: 1,
      maxplayers: 4,
      minplaytime: 30,
      maxplaytime: 60,
      playingtime: 45,
      numowned: 100,
      rating: {
        average: { value: 8.5 },
        bayesaverage: { value: 8.2 },
        median: { value: 8.0 },
        ranks: { rank: [] },
        stddev: { value: 1.2 },
        usersrated: { value: 1000 }
      }
    },
    yearpublished: '2020',
    collid: '1',
    image: '',
    numplays: '0',
    objectype: 'boardgame' as any,
    status: {} as any,
    subtype: 'boardgame' as any,
    thumbnail: ''
  },
  {
    objectid: '2',
    name: { text: 'Alpha Game', sortIndex: '2' },
    stats: {
      minplayers: 2,
      maxplayers: 2,
      minplaytime: 20,
      maxplaytime: 30,
      playingtime: 25,
      numowned: 50,
      rating: {
        average: { value: 7.5 },
        bayesaverage: { value: 7.3 },
        median: { value: 7.0 },
        ranks: { rank: [] },
        stddev: { value: 1.0 },
        usersrated: { value: 500 }
      }
    },
    yearpublished: '2019',
    collid: '2',
    image: '',
    numplays: '0',
    objectype: 'boardgame' as any,
    status: {} as any,
    subtype: 'boardgame' as any,
    thumbnail: ''
  },
  {
    objectid: '3',
    name: { text: 'Beta Game', sortIndex: '3' },
    stats: {
      minplayers: 3,
      maxplayers: 6,
      minplaytime: 60,
      maxplaytime: 90,
      playingtime: 75,
      numowned: 200,
      rating: {
        average: { value: 9.2 },
        bayesaverage: { value: 9.0 },
        median: { value: 9.0 },
        ranks: { rank: [] },
        stddev: { value: 0.8 },
        usersrated: { value: 2000 }
      }
    },
    yearpublished: '2021',
    collid: '3',
    image: '',
    numplays: '0',
    objectype: 'boardgame' as any,
    status: {} as any,
    subtype: 'boardgame' as any,
    thumbnail: ''
  }
];

describe('Sorting Utilities', () => {
  describe('sortGames', () => {
    it('should sort by name ascending', () => {
      const result = sortGames(mockGames, 'name_asc');
      expect(result[0].name.text).toBe('Alpha Game');
      expect(result[1].name.text).toBe('Beta Game');
      expect(result[2].name.text).toBe('Zebra Game');
    });

    it('should sort by name descending', () => {
      const result = sortGames(mockGames, 'name_desc');
      expect(result[0].name.text).toBe('Zebra Game');
      expect(result[1].name.text).toBe('Beta Game');
      expect(result[2].name.text).toBe('Alpha Game');
    });

    it('should sort by rating ascending', () => {
      const result = sortGames(mockGames, 'rating_asc');
      expect(result[0].stats.rating.average.value).toBe(7.5);
      expect(result[1].stats.rating.average.value).toBe(8.5);
      expect(result[2].stats.rating.average.value).toBe(9.2);
    });

    it('should sort by rating descending', () => {
      const result = sortGames(mockGames, 'rating_desc');
      expect(result[0].stats.rating.average.value).toBe(9.2);
      expect(result[1].stats.rating.average.value).toBe(8.5);
      expect(result[2].stats.rating.average.value).toBe(7.5);
    });

    it('should sort by year ascending', () => {
      const result = sortGames(mockGames, 'year_asc');
      expect(result[0].yearpublished).toBe('2019');
      expect(result[1].yearpublished).toBe('2020');
      expect(result[2].yearpublished).toBe('2021');
    });

    it('should sort by year descending', () => {
      const result = sortGames(mockGames, 'year_desc');
      expect(result[0].yearpublished).toBe('2021');
      expect(result[1].yearpublished).toBe('2020');
      expect(result[2].yearpublished).toBe('2019');
    });

    it('should return original array for unknown sort option', () => {
      const result = sortGames(mockGames, 'unknown' as any);
      expect(result).toEqual(mockGames);
    });
  });
});

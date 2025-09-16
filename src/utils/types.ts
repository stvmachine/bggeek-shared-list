import { 
  BggThingLink, 
  BggThingItemBase
} from "bgg-xml-api-client";

declare type ZeroOrOne = 0 | 1;

export type IHotItem = {
  id: string;
  name: {
    value: string;
  };
  rank: number;
  thumbnail?: {
    value: string;
  };
  yearpublished: {
    value: number;
  };
};

// Re-export library types for convenience
export type BggLink = BggThingLink;

// Keep our existing types for compatibility with current code
export type IItem = {
  collid: string;
  image: string;
  name: {
    text: string;
    sortIndex: string;
  };
  numplays: string;
  objectid: string;
  objectype: string;
  status: {
    fortrade: ZeroOrOne;
    lastmodified: string;
    own: ZeroOrOne;
    preordered: ZeroOrOne;
    prevowned: ZeroOrOne;
    want: ZeroOrOne;
    wanttobuy: ZeroOrOne;
    wanttoplay: ZeroOrOne;
    whishlist: ZeroOrOne;
  };
  subtype: string;
  thumbnail?: string;
  yearpublished: string;
  stats: {
    maxplayers: number;
    maxplaytime: number;
    minplayers: number;
    minplaytime: number;
    numowned: number;
    playingtime: number;
    rating: {
      average: { value: number };
      bayesaverage: { value: number };
      median: { value: number };
      ranks: {
        rank: {
          bayesaverage: number;
          friendlyname: string;
          id: number;
          name: string;
          type: string;
          value: number;
        }[];
      };
      stddev: { value: number };
      usersrated: { value: number };
    };
  };
  owners?: {
    username: string;
    status: any;
    collid: string;
  }[];
  primaryFamily?: {
    id: string;
    name: string;
  };
  // Detailed game information
  categories?: BggLink[];
  mechanics?: BggLink[];
  families?: BggLink[];
  publishers?: BggLink[];
  artists?: BggLink[];
  designers?: BggLink[];
  compilations?: BggLink[];
};

export type IGame = BggThingItemBase;
export type ICollection = {
  totalitems: string;
  pubdate: string;
  termsofuse?: string;
  item?: IItem[];
  username: string;
};
export type IBgDict = {
  [prop: string]: BggThingItemBase;
};

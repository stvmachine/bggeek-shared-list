import { ThingType } from "bgg-xml-api-client";
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

export type IItem = {
  collid: string;
  image: string;
  name: {
    text: string;
    sortIndex: string;
  };
  numplays: string;
  objectid: string;
  objectype: ThingType;
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
  subtype: ThingType;
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
          type: ThingType;
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
};

export type IGame = {
  id: string;
  image: string;
  thumbnail?: string;
  description: string;
  name: {
    type: "primary" | "alternate";
    value: string;
  }[];
  [prop: string]: any;
};

export type IBgDict = {
  [prop: string]: IGame;
};

export type IPlaysByDateDict = {
  [prop: string]: IPlay[];
};

export type ICollection = {
  totalitems: string;
  pubdate: string;
  termsofuse?: string;
  item?: IItem[];
  username: string;
};

export type IPlayer = {
  color: string;
  name: "Anonymous player" | string;
  new: ZeroOrOne;
  rating: number;
  score: number;
  startposition: number;
  userid: string;
  username: string;
  win: ZeroOrOne;
};

export type IPlay = {
  id: string;
  date: string;
  incomplete: ZeroOrOne;
  item: {
    name: string;
    objectid: string;
    objecttype: ThingType;
  };
  length?: string;
  location: string;
  nowinstats?: string;
  players: IPlayer[];
  quantity: number;
};

export type IExtendedUser = {
  bggUsername: string;
  bggVerified: boolean;
};

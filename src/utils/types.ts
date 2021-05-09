import { ThingType } from "bgg-xml-api-client";
declare type ZeroOrOne = 0 | 1;

export type ItemType = {
  collid: string;
  image: string;
  name: {
    sortIndex: string;
    $t: string;
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
  thumbnail: string;
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
};

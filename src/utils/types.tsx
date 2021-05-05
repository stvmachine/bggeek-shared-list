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
};

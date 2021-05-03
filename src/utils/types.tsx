export type ItemType = {
  collid: string;
  image: string;
  name: {
    sortIndex: string;
    $t: string;
  };
  numplays: string;
  objectid: string;
  objectype: "thing";
  status: {
    fortrade: "0" | "1";
    lastmodified: string;
    own: "0" | "1";
    preordered: "0" | "1";
    prevowned: "0" | "1";
    want: "0" | "1";
    wanttobuy: "0" | "1";
    wanttoplay: "0" | "1";
    whishlist: "0" | "1";
  };
  subtype: "boardgame";
  thumbnail: string;
  yearpublished: string;
};

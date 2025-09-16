import {
  BggCollectionResponse,
  BggThingItemBase,
  BggThingLink,
} from "bgg-xml-api-client";

// Re-export library types for convenience
export type BggLink = BggThingLink;

// Define BggCollectionItem type based on the actual structure used in the app
export type BggCollectionItem =
  BggCollectionResponse["item"] extends (infer T)[]
    ? T & {
        // Additional properties that are added during data processing
        owners?: Array<{
          username: string;
          status: any;
          collid: string;
        }>;
        objectid: string; // Converted to string during processing
        // Enhanced properties from game details
        categories?: any[];
        mechanics?: any[];
        families?: any[];
        publishers?: any[];
        artists?: any[];
        designers?: any[];
        compilations?: any[];
      }
    : never;

// Collection type for simplified collection data
export type ICollection = {
  totalitems: number;
  pubdate: string;
};

// Re-export BGG types for convenience
export type IGame = BggThingItemBase;
export type IBgDict = {
  [prop: string]: BggThingItemBase;
};

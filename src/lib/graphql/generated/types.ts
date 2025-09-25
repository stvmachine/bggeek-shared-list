import { gql } from "@apollo/client";
import * as Apollo from "@apollo/client";
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
export type MakeEmpty<
  T extends { [key: string]: unknown },
  K extends keyof T,
> = { [_ in K]?: never };
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends " $fragmentName" | "__typename" ? T[P] : never;
    };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
  Date: { input: string; output: string };
  Email: { input: string; output: string };
  JSON: { input: any; output: any };
  URL: { input: string; output: string };
};

export type Address = {
  __typename?: "Address";
  city: Scalars["String"]["output"];
  isoCountry: Scalars["String"]["output"];
};

export type Artist = {
  __typename?: "Artist";
  id: Scalars["String"]["output"];
  type: Scalars["String"]["output"];
  value: Scalars["String"]["output"];
};

export type BggEntity = {
  id: Scalars["ID"]["output"];
  name: Scalars["String"]["output"];
  type: Scalars["String"]["output"];
};

export type BoardgameRank = {
  __typename?: "BoardgameRank";
  id: Scalars["ID"]["output"];
  name: Scalars["String"]["output"];
  rank: Scalars["Int"]["output"];
  type: Scalars["String"]["output"];
};

export type Category = {
  __typename?: "Category";
  id: Scalars["String"]["output"];
  type: Scalars["String"]["output"];
  value: Scalars["String"]["output"];
};

export type Collection = {
  __typename?: "Collection";
  items: Array<CollectionItem>;
  pubDate: Scalars["String"]["output"];
  totalItems: Scalars["Int"]["output"];
};

export type CollectionFiltersInput = {
  subtype?: InputMaybe<CollectionSubtype>;
};

export type CollectionItem = {
  __typename?: "CollectionItem";
  collId: Scalars["String"]["output"];
  comment: Scalars["String"]["output"];
  condition: Scalars["String"]["output"];
  conditionText: Scalars["String"]["output"];
  hasPartsList: Scalars["String"]["output"];
  image: Scalars["String"]["output"];
  lastModified: Scalars["String"]["output"];
  name: Scalars["String"]["output"];
  numPlays: Scalars["Int"]["output"];
  objectId: Scalars["ID"]["output"];
  objectType: Scalars["String"]["output"];
  preordered: Scalars["String"]["output"];
  status: Status;
  subtype: Scalars["String"]["output"];
  thumbnail: Scalars["String"]["output"];
  wantPartsList: Scalars["String"]["output"];
  yearPublished: Scalars["Int"]["output"];
};

export enum CollectionSubtype {
  Boardgame = "BOARDGAME",
  Boardgameaccessory = "BOARDGAMEACCESSORY",
  Boardgameexpansion = "BOARDGAMEEXPANSION",
  Rpgitem = "RPGITEM",
  Videogame = "VIDEOGAME",
}

export type Comment = {
  __typename?: "Comment";
  rating: Scalars["String"]["output"];
  username: Scalars["String"]["output"];
  value: Scalars["String"]["output"];
};

export type Designer = {
  __typename?: "Designer";
  id: Scalars["String"]["output"];
  type: Scalars["String"]["output"];
  value: Scalars["String"]["output"];
};

export type Expansion = {
  __typename?: "Expansion";
  id: Scalars["String"]["output"];
  image?: Maybe<Scalars["String"]["output"]>;
  name: Scalars["String"]["output"];
  thumbnail?: Maybe<Scalars["String"]["output"]>;
  type: Scalars["String"]["output"];
  yearPublished?: Maybe<Scalars["Int"]["output"]>;
};

export type Family = {
  __typename?: "Family";
  id: Scalars["String"]["output"];
  type: Scalars["String"]["output"];
  value: Scalars["String"]["output"];
};

export type Geeklist = {
  __typename?: "Geeklist";
  id: Scalars["ID"]["output"];
  items: Array<GeeklistItem>;
  lastReplyDate: Scalars["String"]["output"];
  lastReplyDateTimestamp: Scalars["String"]["output"];
  numItems: Scalars["Int"]["output"];
  postDate: Scalars["String"]["output"];
  postDateTimestamp: Scalars["String"]["output"];
  thumbs: Scalars["Int"]["output"];
  title: Scalars["String"]["output"];
  username: Scalars["String"]["output"];
};

export type GeeklistComment = {
  __typename?: "GeeklistComment";
  body: Scalars["String"]["output"];
  editDate: Scalars["String"]["output"];
  editDateTimestamp: Scalars["String"]["output"];
  postDate: Scalars["String"]["output"];
  postDateTimestamp: Scalars["String"]["output"];
  thumbs: Scalars["Int"]["output"];
  username: Scalars["String"]["output"];
};

export type GeeklistItem = {
  __typename?: "GeeklistItem";
  body: Scalars["String"]["output"];
  comments: Array<GeeklistComment>;
  editDate: Scalars["String"]["output"];
  editDateTimestamp: Scalars["String"]["output"];
  id: Scalars["ID"]["output"];
  imageId: Scalars["String"]["output"];
  objectId: Scalars["ID"]["output"];
  objectName: Scalars["String"]["output"];
  objectType: Scalars["String"]["output"];
  postDate: Scalars["String"]["output"];
  postDateTimestamp: Scalars["String"]["output"];
  thumbs: Scalars["Int"]["output"];
  username: Scalars["String"]["output"];
};

export type Guild = {
  __typename?: "Guild";
  id: Scalars["ID"]["output"];
  manager: User;
  members: Array<GuildMember>;
  name: Scalars["String"]["output"];
};

export type GuildMember = {
  __typename?: "GuildMember";
  joined: Scalars["String"]["output"];
  user: User;
};

export type Link = {
  __typename?: "Link";
  id: Scalars["String"]["output"];
  type: Scalars["String"]["output"];
  value: Scalars["String"]["output"];
};

export type Mechanic = {
  __typename?: "Mechanic";
  id: Scalars["String"]["output"];
  type: Scalars["String"]["output"];
  value: Scalars["String"]["output"];
};

export type Microbadge = {
  __typename?: "Microbadge";
  id: Scalars["ID"]["output"];
  imageSrc: Scalars["String"]["output"];
  name: Scalars["String"]["output"];
};

export type Play = {
  __typename?: "Play";
  comments: Scalars["String"]["output"];
  date: Scalars["String"]["output"];
  id: Scalars["ID"]["output"];
  incomplete: Scalars["Boolean"]["output"];
  item: PlayItem;
  length: Scalars["Int"]["output"];
  location: Scalars["String"]["output"];
  nowInStats: Scalars["Boolean"]["output"];
  players: Array<PlayPlayer>;
  quantity: Scalars["Int"]["output"];
};

export type PlayFiltersInput = {
  id?: InputMaybe<Scalars["ID"]["input"]>;
  maxdate?: InputMaybe<Scalars["String"]["input"]>;
  mindate?: InputMaybe<Scalars["String"]["input"]>;
  page?: InputMaybe<Scalars["Int"]["input"]>;
};

export type PlayItem = {
  __typename?: "PlayItem";
  name: Scalars["String"]["output"];
  objectId: Scalars["ID"]["output"];
  objectType: Scalars["String"]["output"];
  subtypes: Array<Subtype>;
};

export type PlayPlayer = {
  __typename?: "PlayPlayer";
  color?: Maybe<Scalars["String"]["output"]>;
  name?: Maybe<Scalars["String"]["output"]>;
  new?: Maybe<Scalars["Boolean"]["output"]>;
  position: Scalars["Int"]["output"];
  rating?: Maybe<Scalars["String"]["output"]>;
  score?: Maybe<Scalars["String"]["output"]>;
  userId?: Maybe<Scalars["String"]["output"]>;
  username?: Maybe<Scalars["String"]["output"]>;
  win?: Maybe<Scalars["Boolean"]["output"]>;
};

export type PlayResult = {
  __typename?: "PlayResult";
  page: Scalars["Int"]["output"];
  plays: Array<Play>;
  total: Scalars["Int"]["output"];
};

export type Poll = {
  __typename?: "Poll";
  name: Scalars["String"]["output"];
  results: Array<PollResult>;
  title: Scalars["String"]["output"];
  totalVotes: Scalars["Int"]["output"];
};

export type PollResult = {
  __typename?: "PollResult";
  level?: Maybe<Scalars["String"]["output"]>;
  numVotes: Scalars["Int"]["output"];
  players?: Maybe<Scalars["String"]["output"]>;
  value: Scalars["String"]["output"];
};

export type Publisher = {
  __typename?: "Publisher";
  id: Scalars["String"]["output"];
  type: Scalars["String"]["output"];
  value: Scalars["String"]["output"];
};

export type Query = {
  __typename?: "Query";
  geeklist?: Maybe<Geeklist>;
  geeklists: Array<Geeklist>;
  hotItems: Array<Thing>;
  search: Array<Thing>;
  thing?: Maybe<Thing>;
  things: Array<Thing>;
  user?: Maybe<User>;
  userCollection?: Maybe<Collection>;
  userPlays?: Maybe<PlayResult>;
};

export type QueryGeeklistArgs = {
  id: Scalars["ID"]["input"];
};

export type QueryGeeklistsArgs = {
  page?: InputMaybe<Scalars["Int"]["input"]>;
  username?: InputMaybe<Scalars["String"]["input"]>;
};

export type QueryHotItemsArgs = {
  type?: InputMaybe<ThingType>;
};

export type QuerySearchArgs = {
  exact?: InputMaybe<Scalars["Boolean"]["input"]>;
  query: Scalars["String"]["input"];
  type?: InputMaybe<ThingType>;
};

export type QueryThingArgs = {
  id: Scalars["ID"]["input"];
};

export type QueryThingsArgs = {
  ids: Array<Scalars["ID"]["input"]>;
};

export type QueryUserArgs = {
  username: Scalars["String"]["input"];
};

export type QueryUserCollectionArgs = {
  subtype?: InputMaybe<CollectionSubtype>;
  username: Scalars["String"]["input"];
};

export type QueryUserPlaysArgs = {
  id?: InputMaybe<Scalars["ID"]["input"]>;
  maxdate?: InputMaybe<Scalars["String"]["input"]>;
  mindate?: InputMaybe<Scalars["String"]["input"]>;
  page?: InputMaybe<Scalars["Int"]["input"]>;
  username: Scalars["String"]["input"];
};

export type Rank = {
  __typename?: "Rank";
  bayesAverage: Scalars["String"]["output"];
  friendlyName: Scalars["String"]["output"];
  id: Scalars["String"]["output"];
  name: Scalars["String"]["output"];
  type: Scalars["String"]["output"];
  value: Scalars["String"]["output"];
};

export type RatingStats = {
  __typename?: "RatingStats";
  average: Scalars["Float"]["output"];
  averageWeight: Scalars["Float"]["output"];
  bayesAverage: Scalars["Float"]["output"];
  median: Scalars["Float"]["output"];
  numComments: Scalars["Int"]["output"];
  numWeights: Scalars["Int"]["output"];
  owned: Scalars["Int"]["output"];
  ranks: Array<Rank>;
  stdDev: Scalars["Float"]["output"];
  trading: Scalars["Int"]["output"];
  usersRated: Scalars["Int"]["output"];
  wanting: Scalars["Int"]["output"];
  wishing: Scalars["Int"]["output"];
};

export type SearchInput = {
  exact?: InputMaybe<Scalars["Boolean"]["input"]>;
  query: Scalars["String"]["input"];
  type?: InputMaybe<ThingType>;
};

export type SearchResult = Thing;

export type Statistics = {
  __typename?: "Statistics";
  page: Scalars["Int"]["output"];
  ratings: RatingStats;
};

export type Status = {
  __typename?: "Status";
  forTrade: Scalars["String"]["output"];
  lastModified: Scalars["String"]["output"];
  own: Scalars["String"]["output"];
  preordered: Scalars["String"]["output"];
  prevOwned: Scalars["String"]["output"];
  want: Scalars["String"]["output"];
  wantToBuy: Scalars["String"]["output"];
  wantToPlay: Scalars["String"]["output"];
  wishlist: Scalars["String"]["output"];
};

export type Subtype = {
  __typename?: "Subtype";
  value: Scalars["String"]["output"];
};

export type Thing = {
  __typename?: "Thing";
  alternateNames: Array<Scalars["String"]["output"]>;
  artists: Array<Artist>;
  average?: Maybe<Scalars["Float"]["output"]>;
  averageWeight?: Maybe<Scalars["Float"]["output"]>;
  bayesAverage?: Maybe<Scalars["Float"]["output"]>;
  categories: Array<Category>;
  comments: Array<Comment>;
  description?: Maybe<Scalars["String"]["output"]>;
  designers: Array<Designer>;
  expansions: Array<Expansion>;
  families: Array<Family>;
  id: Scalars["ID"]["output"];
  image?: Maybe<Scalars["String"]["output"]>;
  maxPlayTime?: Maybe<Scalars["Int"]["output"]>;
  maxPlayers?: Maybe<Scalars["Int"]["output"]>;
  mechanics: Array<Mechanic>;
  minAge?: Maybe<Scalars["Int"]["output"]>;
  minPlayTime?: Maybe<Scalars["Int"]["output"]>;
  minPlayers?: Maybe<Scalars["Int"]["output"]>;
  name: Scalars["String"]["output"];
  numComments?: Maybe<Scalars["Int"]["output"]>;
  numWeights?: Maybe<Scalars["Int"]["output"]>;
  playingTime?: Maybe<Scalars["Int"]["output"]>;
  polls: Array<Poll>;
  publishers: Array<Publisher>;
  ranks: Array<Rank>;
  statistics?: Maybe<Statistics>;
  thumbnail?: Maybe<Scalars["String"]["output"]>;
  type: ThingType;
  usersOwned?: Maybe<Scalars["Int"]["output"]>;
  usersRated?: Maybe<Scalars["Int"]["output"]>;
  usersWanting?: Maybe<Scalars["Int"]["output"]>;
  usersWishing?: Maybe<Scalars["Int"]["output"]>;
  versions: Array<Version>;
  yearPublished?: Maybe<Scalars["Int"]["output"]>;
};

export enum ThingType {
  Boardgame = "BOARDGAME",
  Boardgameaccessory = "BOARDGAMEACCESSORY",
  Boardgameexpansion = "BOARDGAMEEXPANSION",
  Rpgitem = "RPGITEM",
  Videogame = "VIDEOGAME",
}

export type TopItem = {
  __typename?: "TopItem";
  boardgame: BoardgameRank;
};

export type User = {
  __typename?: "User";
  address?: Maybe<Address>;
  dateRegistered: Scalars["String"]["output"];
  designerId?: Maybe<Scalars["String"]["output"]>;
  firstName: Scalars["String"]["output"];
  guilds: Array<Guild>;
  id: Scalars["ID"]["output"];
  lastName: Scalars["String"]["output"];
  microbadges: Array<Microbadge>;
  publisherId?: Maybe<Scalars["String"]["output"]>;
  supportYears: Scalars["Int"]["output"];
  top: Array<TopItem>;
  username: Scalars["String"]["output"];
};

export type Version = {
  __typename?: "Version";
  color?: Maybe<Scalars["String"]["output"]>;
  currency?: Maybe<Scalars["String"]["output"]>;
  depth?: Maybe<Scalars["Float"]["output"]>;
  id: Scalars["String"]["output"];
  image?: Maybe<Scalars["String"]["output"]>;
  length?: Maybe<Scalars["Float"]["output"]>;
  links: Array<Link>;
  name: Scalars["String"]["output"];
  price?: Maybe<Scalars["Float"]["output"]>;
  productCode?: Maybe<Scalars["String"]["output"]>;
  size?: Maybe<Scalars["String"]["output"]>;
  thumbnail?: Maybe<Scalars["String"]["output"]>;
  type: Scalars["String"]["output"];
  weight?: Maybe<Scalars["Float"]["output"]>;
  width?: Maybe<Scalars["Float"]["output"]>;
  yearPublished: Scalars["Int"]["output"];
};

export type GetUserCollectionQueryVariables = Exact<{
  username: Scalars["String"]["input"];
}>;

export type GetUserCollectionQuery = {
  __typename?: "Query";
  userCollection?: {
    __typename?: "Collection";
    totalItems: number;
    pubDate: string;
    items: Array<{
      __typename?: "CollectionItem";
      objectId: string;
      name: string;
      thumbnail: string;
      image: string;
      yearPublished: number;
      numPlays: number;
      status: {
        __typename?: "Status";
        own: string;
        prevOwned: string;
        forTrade: string;
        want: string;
        wantToPlay: string;
        wantToBuy: string;
        wishlist: string;
        preordered: string;
        lastModified: string;
      };
    }>;
  } | null;
};

export type GetUserQueryVariables = Exact<{
  username: Scalars["String"]["input"];
}>;

export type GetUserQuery = {
  __typename?: "Query";
  user?: {
    __typename?: "User";
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    dateRegistered: string;
    supportYears: number;
    designerId?: string | null;
    publisherId?: string | null;
    address?: {
      __typename?: "Address";
      city: string;
      isoCountry: string;
    } | null;
    guilds: Array<{ __typename?: "Guild"; id: string; name: string }>;
    microbadges: Array<{
      __typename?: "Microbadge";
      id: string;
      name: string;
      imageSrc: string;
    }>;
    top: Array<{
      __typename?: "TopItem";
      boardgame: {
        __typename?: "BoardgameRank";
        rank: number;
        id: string;
        type: string;
        name: string;
      };
    }>;
  } | null;
};

export type SearchGamesQueryVariables = Exact<{
  query: Scalars["String"]["input"];
  type?: InputMaybe<ThingType>;
}>;

export type SearchGamesQuery = {
  __typename?: "Query";
  search: Array<{
    __typename?: "Thing";
    id: string;
    name: string;
    type: ThingType;
  }>;
};

export type GetGameDetailsQueryVariables = Exact<{
  id: Scalars["ID"]["input"];
}>;

export type GetGameDetailsQuery = {
  __typename?: "Query";
  thing?: {
    __typename?: "Thing";
    id: string;
    name: string;
    type: ThingType;
    yearPublished?: number | null;
    image?: string | null;
    thumbnail?: string | null;
  } | null;
};

export const GetUserCollectionDocument = gql`
  query GetUserCollection($username: String!) {
    userCollection(username: $username) {
      totalItems
      pubDate
      items {
        objectId
        name
        thumbnail
        image
        yearPublished
        numPlays
        status {
          own
          prevOwned
          forTrade
          want
          wantToPlay
          wantToBuy
          wishlist
          preordered
          lastModified
        }
      }
    }
  }
`;

/**
 * __useGetUserCollectionQuery__
 *
 * To run a query within a React component, call `useGetUserCollectionQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUserCollectionQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUserCollectionQuery({
 *   variables: {
 *      username: // value for 'username'
 *   },
 * });
 */
export function useGetUserCollectionQuery(
  baseOptions: Apollo.QueryHookOptions<
    GetUserCollectionQuery,
    GetUserCollectionQueryVariables
  > &
    (
      | { variables: GetUserCollectionQueryVariables; skip?: boolean }
      | { skip: boolean }
    )
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    GetUserCollectionQuery,
    GetUserCollectionQueryVariables
  >(GetUserCollectionDocument, options);
}
export function useGetUserCollectionLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetUserCollectionQuery,
    GetUserCollectionQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GetUserCollectionQuery,
    GetUserCollectionQueryVariables
  >(GetUserCollectionDocument, options);
}
export function useGetUserCollectionSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        GetUserCollectionQuery,
        GetUserCollectionQueryVariables
      >
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    GetUserCollectionQuery,
    GetUserCollectionQueryVariables
  >(GetUserCollectionDocument, options);
}
export type GetUserCollectionQueryHookResult = ReturnType<
  typeof useGetUserCollectionQuery
>;
export type GetUserCollectionLazyQueryHookResult = ReturnType<
  typeof useGetUserCollectionLazyQuery
>;
export type GetUserCollectionSuspenseQueryHookResult = ReturnType<
  typeof useGetUserCollectionSuspenseQuery
>;
export type GetUserCollectionQueryResult = Apollo.QueryResult<
  GetUserCollectionQuery,
  GetUserCollectionQueryVariables
>;
export const GetUserDocument = gql`
  query GetUser($username: String!) {
    user(username: $username) {
      id
      username
      firstName
      lastName
      dateRegistered
      supportYears
      designerId
      publisherId
      address {
        city
        isoCountry
      }
      guilds {
        id
        name
      }
      microbadges {
        id
        name
        imageSrc
      }
      top {
        boardgame {
          rank
          id
          type
          name
        }
      }
    }
  }
`;

/**
 * __useGetUserQuery__
 *
 * To run a query within a React component, call `useGetUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUserQuery({
 *   variables: {
 *      username: // value for 'username'
 *   },
 * });
 */
export function useGetUserQuery(
  baseOptions: Apollo.QueryHookOptions<GetUserQuery, GetUserQueryVariables> &
    ({ variables: GetUserQueryVariables; skip?: boolean } | { skip: boolean })
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetUserQuery, GetUserQueryVariables>(
    GetUserDocument,
    options
  );
}
export function useGetUserLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetUserQuery, GetUserQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetUserQuery, GetUserQueryVariables>(
    GetUserDocument,
    options
  );
}
export function useGetUserSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<GetUserQuery, GetUserQueryVariables>
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<GetUserQuery, GetUserQueryVariables>(
    GetUserDocument,
    options
  );
}
export type GetUserQueryHookResult = ReturnType<typeof useGetUserQuery>;
export type GetUserLazyQueryHookResult = ReturnType<typeof useGetUserLazyQuery>;
export type GetUserSuspenseQueryHookResult = ReturnType<
  typeof useGetUserSuspenseQuery
>;
export type GetUserQueryResult = Apollo.QueryResult<
  GetUserQuery,
  GetUserQueryVariables
>;
export const SearchGamesDocument = gql`
  query SearchGames($query: String!, $type: ThingType) {
    search(query: $query, type: $type) {
      id
      name
      type
    }
  }
`;

/**
 * __useSearchGamesQuery__
 *
 * To run a query within a React component, call `useSearchGamesQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchGamesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchGamesQuery({
 *   variables: {
 *      query: // value for 'query'
 *      type: // value for 'type'
 *   },
 * });
 */
export function useSearchGamesQuery(
  baseOptions: Apollo.QueryHookOptions<
    SearchGamesQuery,
    SearchGamesQueryVariables
  > &
    (
      | { variables: SearchGamesQueryVariables; skip?: boolean }
      | { skip: boolean }
    )
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<SearchGamesQuery, SearchGamesQueryVariables>(
    SearchGamesDocument,
    options
  );
}
export function useSearchGamesLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    SearchGamesQuery,
    SearchGamesQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<SearchGamesQuery, SearchGamesQueryVariables>(
    SearchGamesDocument,
    options
  );
}
export function useSearchGamesSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        SearchGamesQuery,
        SearchGamesQueryVariables
      >
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<SearchGamesQuery, SearchGamesQueryVariables>(
    SearchGamesDocument,
    options
  );
}
export type SearchGamesQueryHookResult = ReturnType<typeof useSearchGamesQuery>;
export type SearchGamesLazyQueryHookResult = ReturnType<
  typeof useSearchGamesLazyQuery
>;
export type SearchGamesSuspenseQueryHookResult = ReturnType<
  typeof useSearchGamesSuspenseQuery
>;
export type SearchGamesQueryResult = Apollo.QueryResult<
  SearchGamesQuery,
  SearchGamesQueryVariables
>;
export const GetGameDetailsDocument = gql`
  query GetGameDetails($id: ID!) {
    thing(id: $id) {
      id
      name
      type
      yearPublished
      image
      thumbnail
    }
  }
`;

/**
 * __useGetGameDetailsQuery__
 *
 * To run a query within a React component, call `useGetGameDetailsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetGameDetailsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetGameDetailsQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetGameDetailsQuery(
  baseOptions: Apollo.QueryHookOptions<
    GetGameDetailsQuery,
    GetGameDetailsQueryVariables
  > &
    (
      | { variables: GetGameDetailsQueryVariables; skip?: boolean }
      | { skip: boolean }
    )
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetGameDetailsQuery, GetGameDetailsQueryVariables>(
    GetGameDetailsDocument,
    options
  );
}
export function useGetGameDetailsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetGameDetailsQuery,
    GetGameDetailsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetGameDetailsQuery, GetGameDetailsQueryVariables>(
    GetGameDetailsDocument,
    options
  );
}
export function useGetGameDetailsSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        GetGameDetailsQuery,
        GetGameDetailsQueryVariables
      >
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    GetGameDetailsQuery,
    GetGameDetailsQueryVariables
  >(GetGameDetailsDocument, options);
}
export type GetGameDetailsQueryHookResult = ReturnType<
  typeof useGetGameDetailsQuery
>;
export type GetGameDetailsLazyQueryHookResult = ReturnType<
  typeof useGetGameDetailsLazyQuery
>;
export type GetGameDetailsSuspenseQueryHookResult = ReturnType<
  typeof useGetGameDetailsSuspenseQuery
>;
export type GetGameDetailsQueryResult = Apollo.QueryResult<
  GetGameDetailsQuery,
  GetGameDetailsQueryVariables
>;

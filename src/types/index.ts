import { GetUserCollectionQuery } from "../lib/graphql/generated/types";

type GraphQLCollectionItem = NonNullable<
  GetUserCollectionQuery["userCollection"]
>["items"][0];

export type GameOwner = {
  username: string;
  collid: string;
};

// Extended type that includes owners field for easier data manipulation
export type ICollectionItem = GraphQLCollectionItem & {
  stats: NonNullable<GraphQLCollectionItem["stats"]> & {
    minPlayers: NonNullable<
      NonNullable<GraphQLCollectionItem["stats"]>["minPlayers"]
    >;
    maxPlayers: NonNullable<
      NonNullable<GraphQLCollectionItem["stats"]>["maxPlayers"]
    >;
    minPlayTime: NonNullable<
      NonNullable<GraphQLCollectionItem["stats"]>["minPlayTime"]
    >;
    maxPlayTime: NonNullable<
      NonNullable<GraphQLCollectionItem["stats"]>["maxPlayTime"]
    >;
    playingTime: NonNullable<
      NonNullable<GraphQLCollectionItem["stats"]>["playingTime"]
    >;
    average: NonNullable<
      NonNullable<GraphQLCollectionItem["stats"]>["average"]
    >;
  };
  owners: Array<GameOwner>;
};

import { useQuery } from "@apollo/client/react";
import { GET_HOT_GAMES } from "../lib/graphql/queries";
import {
  GetHotGamesQuery,
  GetHotGamesQueryVariables,
} from "../lib/graphql/generated/types";

export const useHotGames = (type?: string) => {
  const { data, loading, error } = useQuery<
    GetHotGamesQuery,
    GetHotGamesQueryVariables
  >(GET_HOT_GAMES, {
    variables: { type: type as any },
    errorPolicy: "all",
  });

  return {
    data: data?.hotItems || [],
    loading,
    error,
  };
};

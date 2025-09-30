import { useQuery } from "@apollo/client/react";
import { GET_USER_COLLECTION } from "../lib/graphql/queries";
import { GetUserCollectionQuery } from "../lib/graphql/generated/types";

interface UseUserCollectionProps {
  username: string;
  skip?: boolean;
}

export function useUserCollection({
  username,
  skip = false,
}: UseUserCollectionProps) {
  const { data, loading, error } = useQuery<GetUserCollectionQuery>(
    GET_USER_COLLECTION,
    {
      variables: { username },
      skip: skip || !username,
      errorPolicy: "all",
    }
  );

  return {
    collection: data?.userCollection || [],
    boardgames: data?.userCollection?.items || [],
    loading,
    error,
    hasData: !!data?.userCollection,
  };
}

import { useQuery } from "@apollo/client/react";
import { GET_USER } from "../lib/graphql/queries";
import { GetUserQuery } from "../lib/graphql/generated/types";

export const useUserValidation = (usernames: string[]) => {
  // Use Apollo's useQuery for each username
  const userQueries = usernames.map(username =>
    useQuery<GetUserQuery>(GET_USER, {
      variables: { username },
      skip: !username, // Skip if no username
      errorPolicy: "all",
      notifyOnNetworkStatusChange: true,
    })
  );

  // Check if any query is loading
  const isLoading = userQueries.some(query => query.loading);

  // Check if any query has errors
  const hasErrors = userQueries.some(query => query.error);

  // Get validation results
  const results = userQueries.map((query, index) => ({
    username: usernames[index],
    userData: query.data?.user || null,
    error: query.error || null,
    loading: query.loading,
  }));

  // Separate valid and invalid usernames
  const validUsernames = results
    .filter(result => result.userData && !result.error)
    .map(result => result.username);

  const invalidUsernames = results
    .filter(result => result.error && !result.loading)
    .map(result => result.username);

  return {
    results,
    validUsernames,
    invalidUsernames,
    isLoading,
    hasErrors,
    // Individual query states for debugging
    queries: userQueries,
  };
};

import { useLazyQuery } from "@apollo/client/react";
import { GET_USER } from "../lib/graphql/queries";
import { GetUserQuery } from "../lib/graphql/generated/types";
import { useEffect, useState } from "react";

export const useUserValidation = (usernames: string[]) => {
  const [results, setResults] = useState<
    Record<
      string,
      {
        userData: any;
        error: any;
        loading: boolean;
      }
    >
  >({});

  const [getUser, { loading, error }] = useLazyQuery<GetUserQuery>(GET_USER, {
    errorPolicy: "all",
  });

  useEffect(() => {
    if (usernames.length === 0) {
      setResults({});
      return;
    }

    // Initialize results with loading state
    const initialResults: Record<
      string,
      { userData: any; error: any; loading: boolean }
    > = {};
    usernames.forEach(username => {
      initialResults[username] = {
        userData: null,
        error: null,
        loading: true,
      };
    });
    setResults(initialResults);

    // Fetch each user sequentially
    const fetchUsers = async () => {
      const newResults: Record<
        string,
        { userData: any; error: any; loading: boolean }
      > = {};

      for (const username of usernames) {
        try {
          const result = await getUser({
            variables: { username },
          });
          newResults[username] = {
            userData: result.data?.user || null,
            error: result.error || null,
            loading: false,
          };
        } catch (err) {
          newResults[username] = {
            userData: null,
            error: err,
            loading: false,
          };
        }
      }
      setResults(newResults);
    };

    fetchUsers();
  }, [usernames, getUser]);

  // Use Apollo's built-in states
  const isLoading =
    loading || Object.values(results).some(result => result.loading);
  const hasErrors =
    !!error || Object.values(results).some(result => result.error);

  // Separate valid and invalid usernames
  const validUsernames = Object.entries(results)
    .filter(([_, result]) => result.userData && !result.error)
    .map(([username, _]) => username);

  const invalidUsernames = Object.entries(results)
    .filter(([_, result]) => result.error && !result.loading)
    .map(([username, _]) => username);

  return {
    results,
    validUsernames,
    invalidUsernames,
    isLoading,
    hasErrors,
  };
};

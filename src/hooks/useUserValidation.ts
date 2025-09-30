import { useQuery } from "@apollo/client/react";
import { GET_USER } from "../lib/graphql/queries";
import { GetUserQuery } from "../lib/graphql/generated/types";

interface UseUserValidationProps {
  username: string;
  skip?: boolean;
}

export function useUserValidation({ username, skip = false }: UseUserValidationProps) {
  const { data, loading, error } = useQuery<GetUserQuery>(GET_USER, {
    variables: { username },
    skip: skip || !username,
    errorPolicy: "all",
  });

  return {
    user: data?.user,
    loading,
    error,
    isValid: !!data?.user,
    isInvalid: !!error || (!loading && !data?.user),
  };
}
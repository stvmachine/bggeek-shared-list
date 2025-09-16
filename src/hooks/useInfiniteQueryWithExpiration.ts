import { QueryKey, useQuery, UseQueryOptions } from "react-query";

interface InfiniteQueryWithExpirationOptions<TData, TError = unknown>
  extends Omit<
    UseQueryOptions<TData, TError, TData, QueryKey>,
    "staleTime" | "cacheTime"
  > {
  expirationTime?: number; // in milliseconds
  refreshInterval?: number; // in milliseconds
}

export function useInfiniteQueryWithExpiration<TData, TError = unknown>(
  queryKey: QueryKey,
  queryFn: () => Promise<TData>,
  options: InfiniteQueryWithExpirationOptions<TData, TError> = {}
) {
  const {
    expirationTime = 24 * 60 * 60 * 1000, // 24 hours default
    refreshInterval = 5 * 60 * 1000, // 5 minutes default
    ...queryOptions
  } = options;

  return useQuery(queryKey, queryFn, {
    ...queryOptions,
    staleTime: expirationTime,
    cacheTime: expirationTime * 2, // Keep in cache for twice the expiration time
    refetchInterval: refreshInterval,
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
}

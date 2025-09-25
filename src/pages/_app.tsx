import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { AppProps } from "next/app";
import Head from "next/head";
import { QueryClient, QueryClientProvider } from "react-query";
import { GraphQLProvider } from "../components/GraphQLProvider";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error: any) => {
        // Don't retry on 4xx errors (client errors like 404, 401, etc.)
        if (error?.response?.status >= 400 && error?.response?.status < 500) {
          return false;
        }
        // Only retry network errors and 5xx server errors once
        return failureCount < 1;
      },
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
    },
  },
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />
        <link rel="manifest" href="/site.webmanifest" />
      </Head>
      <QueryClientProvider client={queryClient}>
        <ChakraProvider value={defaultSystem}>
          <GraphQLProvider>
            <Component {...pageProps} />
          </GraphQLProvider>
        </ChakraProvider>
      </QueryClientProvider>
    </>
  );
}

export default MyApp;

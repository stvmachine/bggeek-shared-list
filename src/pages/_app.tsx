import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { AppProps } from "next/app";
import Head from "next/head";
import { GraphQLProvider } from "../components/GraphQLProvider";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Shared Shelf</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"
        />
        <link rel="manifest" href="/site.webmanifest" />
      </Head>
      <ChakraProvider value={defaultSystem}>
        <GraphQLProvider>
          <Component {...pageProps} />
        </GraphQLProvider>
      </ChakraProvider>
    </>
  );
}

export default MyApp;

import { ApolloProvider } from '@apollo/client/react';
import { apolloClient } from '../lib/graphql/client';

interface GraphQLProviderProps {
  children: React.ReactNode;
}

export const GraphQLProvider: React.FC<GraphQLProviderProps> = ({ children }) => {
  return (
    <ApolloProvider client={apolloClient}>
      {children}
    </ApolloProvider>
  );
};

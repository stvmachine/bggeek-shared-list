import { apolloClient } from "../lib/graphql/client";
import { GET_USER } from "../lib/graphql/queries";
import { GetUserQuery, User } from "../lib/graphql/generated/types";

// Use the generated User type as the response
export type BggUserResponse = User;

export const fetchUsers = async (
  usernames: string[],
  options?: any
): Promise<BggUserResponse[]> =>
  Promise.all(usernames.map(username => fetchUser(username, options)));

export const fetchUser = async (
  username: string,
  _options?: any
): Promise<BggUserResponse> => {
  try {
    console.log(`Fetching user data via GraphQL for: ${username}`);

    const { data, error } = await apolloClient.query<GetUserQuery>({
      query: GET_USER,
      variables: { username },
      errorPolicy: "all",
    });

    if (error) {
      console.error(`GraphQL errors for user ${username}:`, error);
    }

    if (!data?.user) {
      throw new Error(`User ${username} not found`);
    }

    const user = data.user;

    console.log(`GraphQL user data received for ${username}:`, {
      id: user.id,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      country: user.address?.isoCountry,
    });

    return user as BggUserResponse;
  } catch (error) {
    console.error(`Error fetching user ${username} via GraphQL:`, error);
    throw error;
  }
};

import { getBggUser, BggUserParams, BggUserResponse } from "bgg-xml-api-client";

export const fetchUsers = async (
  usernames: string[],
  options?: Partial<BggUserParams>
): Promise<BggUserResponse[]> =>
  Promise.all(usernames.map(username => fetchUser(username, options)));

export const fetchUser = async (
  username: string,
  options?: Partial<BggUserParams>
): Promise<BggUserResponse> => {
  const params: BggUserParams = {
    name: username,
    ...options,
  };

  const userResponse: BggUserResponse = await getBggUser(params, {
    maxRetries: 1,
    retryInterval: 1000,
  });

  return userResponse;
};

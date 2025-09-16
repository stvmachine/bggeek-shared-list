import { bggXmlApiClient } from "bgg-xml-api-client";

export interface BggUser {
  id: string;
  name: string;
  firstname?: string;
  lastname?: string;
  avatarlink?: string;
  yearregistered?: string;
  lastlogin?: string;
  country?: string;
  stateorprovince?: string;
  trade_rating?: string;
  [key: string]: any;
}

export const fetchUsers = async (
  usernames: string[],
  options?: any
): Promise<BggUser[]> =>
  Promise.all(usernames.map((username) => fetchUser(username, options)));

export const fetchUser = async (
  username: string,
  options?: any
): Promise<BggUser> => {
  const userResponse = await bggXmlApiClient.get(
    "user",
    {
      name: username,
      ...options,
    },
    1, // Retries
    1000 // Retry interval
  );

  const data = userResponse.data || {};

  return data;
};

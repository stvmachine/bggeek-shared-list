import { NextApiRequest, NextApiResponse } from "next";
import { apolloClient } from "../../lib/graphql/client";
import { GET_USER } from "../../lib/graphql/queries";
import { GetUserQuery } from "../../lib/graphql/generated/types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { username } = req.query;

  if (!username || typeof username !== "string") {
    return res.status(400).json({ error: "Username is required" });
  }

  try {
    console.log(`Fetching user via GraphQL for username: ${username}`);

    const { data, error } = await apolloClient.query<GetUserQuery>({
      query: GET_USER,
      variables: { username },
      errorPolicy: "all",
    });

    if (error) {
      console.error("GraphQL errors:", error);
    }

    if (!data?.user) {
      return res.status(404).json({ error: "User not found" });
    }

    console.log(`GraphQL user data received:`, {
      username: data.user.username,
      dateRegistered: data.user.dateRegistered,
    });

    // Transform GraphQL response to match the expected format
    const transformedData = {
      id: data.user.id,
      name: data.user.username,
      firstname: data.user.firstName,
      lastname: data.user.lastName,
      yearregistered: data.user.dateRegistered,
      supportyears: data.user.supportYears,
      designerid: data.user.designerId,
      publisherid: data.user.publisherId,
      address: data.user.address
        ? {
            country: data.user.address.isoCountry,
            stateorprovince: data.user.address.city,
          }
        : null,
      guilds:
        data.user.guilds?.map((guild: any) => ({
          id: guild.id,
          name: guild.name,
        })) || [],
      microbadges:
        data.user.microbadges?.map((badge: any) => ({
          id: badge.id,
          name: badge.name,
          image: badge.imageSrc,
        })) || [],
      top:
        data.user.top?.map((item: any) => ({
          boardgame: item.boardgame,
        })) || [],
    };

    res.status(200).json(transformedData);
  } catch (error) {
    console.error("Error fetching user via GraphQL:", error);
    console.error("Error details:", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    });
    res.status(500).json({ error: "Failed to fetch user data via GraphQL" });
  }
}

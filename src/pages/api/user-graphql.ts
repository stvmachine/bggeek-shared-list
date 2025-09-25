import { NextApiRequest, NextApiResponse } from "next";
import { apolloClient } from "../../lib/graphql/client";
import { GET_USER } from "../../lib/graphql/queries";

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
    
    const { data, error } = await apolloClient.query({
      query: GET_USER,
      variables: { username },
      errorPolicy: 'all',
    });

    if (error) {
      console.error("GraphQL errors:", error);
    }

    if (!data?.user) {
      return res.status(404).json({ error: "User not found" });
    }

    console.log(`GraphQL user data received:`, {
      name: data.user.name,
      yearRegistered: data.user.yearRegistered,
    });

    // Transform GraphQL response to match the expected format
    const transformedData = {
      id: data.user.id,
      name: data.user.name,
      firstname: data.user.firstName,
      lastname: data.user.lastName,
      avatar: data.user.avatar,
      yearregistered: data.user.yearRegistered,
      lastlogin: data.user.lastLogin,
      country: data.user.country,
      stateorprovince: data.user.stateOrProvince,
      traderating: data.user.tradeRating,
      traderatingtext: data.user.tradeRatingText,
      traderatingtextlong: data.user.tradeRatingTextLong,
      buddycount: data.user.buddyCount,
      guildcount: data.user.guildCount,
      microbadgecount: data.user.microbadgeCount,
      topitems: data.user.topItems?.map((item: any) => ({
        objectid: item.objectId,
        name: item.name,
        rank: item.rank,
        rating: item.rating,
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

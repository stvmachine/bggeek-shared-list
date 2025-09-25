import { NextApiRequest, NextApiResponse } from "next";
import { apolloClient } from "../../lib/graphql/client";
import { GET_USER_COLLECTION } from "../../lib/graphql/queries";
import { GetUserCollectionQuery } from "../../lib/graphql/generated/types";

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
    console.log(`Fetching collection via GraphQL for username: ${username}`);

    const { data, error } = await apolloClient.query<GetUserCollectionQuery>({
      query: GET_USER_COLLECTION,
      variables: { username },
      errorPolicy: "all",
    });

    if (error) {
      console.error("GraphQL errors:", error);
    }

    if (!data?.userCollection) {
      return res.status(404).json({ error: "Collection not found" });
    }

    console.log(`GraphQL collection data received:`, {
      totalItems: data.userCollection.totalItems,
      itemsLength: data.userCollection.items?.length,
    });

    // Transform GraphQL response to match the expected format
    const transformedData = {
      totalitems: data.userCollection.totalItems,
      pubdate: data.userCollection.pubDate,
      item:
        data.userCollection.items?.map((item: any) => ({
          objectid: item.objectId,
          name: {
            text: item.name,
          },
          thumbnail: item.thumbnail,
          image: item.image,
          yearpublished: item.yearPublished,
          minplayers: item.minPlayers,
          maxplayers: item.maxPlayers,
          playingtime: item.playingTime,
          minplaytime: item.minPlayTime,
          maxplaytime: item.maxPlayTime,
          minage: item.minAge,
          status: item.status,
          stats: item.stats,
        })) || [],
    };

    res.status(200).json(transformedData);
  } catch (error) {
    console.error("Error fetching collection via GraphQL:", error);
    console.error("Error details:", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    });
    res
      .status(500)
      .json({ error: "Failed to fetch collection data via GraphQL" });
  }
}

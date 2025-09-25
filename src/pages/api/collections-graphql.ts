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

  const { usernames } = req.query;

  if (!usernames || typeof usernames !== "string") {
    return res.status(400).json({ error: "Usernames are required" });
  }

  const usernameArray = usernames
    .split(",")
    .map(name => name.trim())
    .filter(Boolean);

  if (usernameArray.length === 0) {
    return res.status(400).json({ error: "At least one username is required" });
  }

  try {
    console.log(
      `Fetching multiple collections via GraphQL for usernames: ${usernameArray.join(", ")}`
    );

    // Fetch collections individually since the schema doesn't support multiple collections in one query
    const collections = await Promise.all(
      usernameArray.map(async username => {
        const { data, error } =
          await apolloClient.query<GetUserCollectionQuery>({
            query: GET_USER_COLLECTION,
            variables: { username },
            errorPolicy: "all",
          });

        if (error) {
          console.error(`GraphQL errors for ${username}:`, error);
        }

        return data?.userCollection;
      })
    );

    const validCollections = collections.filter(Boolean);

    if (validCollections.length === 0) {
      return res.status(404).json({ error: "No collections found" });
    }

    console.log(`GraphQL collections data received:`, {
      collectionsCount: validCollections.length,
      totalItems: validCollections.reduce(
        (sum: number, col: any) => sum + (col.totalItems || 0),
        0
      ),
    });

    // Transform GraphQL response to match the expected format
    const transformedData = validCollections.map((collection: any) => ({
      totalitems: collection.totalItems,
      pubdate: collection.pubDate,
      item:
        collection.items?.map((item: any) => ({
          objectid: item.objectId,
          name: {
            text: item.name,
          },
          thumbnail: item.thumbnail,
          image: item.image,
          yearpublished: item.yearPublished,
          numplays: item.numPlays,
          status: item.status,
        })) || [],
    }));

    res.status(200).json(transformedData);
  } catch (error) {
    console.error("Error fetching collections via GraphQL:", error);
    console.error("Error details:", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    });
    res
      .status(500)
      .json({ error: "Failed to fetch collections data via GraphQL" });
  }
}

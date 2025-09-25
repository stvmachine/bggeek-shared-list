import { NextApiRequest, NextApiResponse } from "next";

import {
  fetchCollectionsGraphQL,
  mergeCollectionsGraphQL,
} from "../../api/fetchGroupCollectionGraphQL";

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
      `Fetching group collection via GraphQL for usernames: ${usernameArray.join(", ")}`
    );

    const rawData = await fetchCollectionsGraphQL(usernameArray);
    const mergedData = mergeCollectionsGraphQL(rawData, usernameArray);

    console.log(`GraphQL group collection data received:`, {
      collectionsCount: mergedData.collections.length,
      boardgamesCount: mergedData.boardgames.length,
      totalItems: mergedData.collections.reduce(
        (sum, col) => sum + (col.totalitems || 0),
        0
      ),
    });

    res.status(200).json(mergedData);
  } catch (error) {
    console.error("Error fetching group collection via GraphQL:", error);
    console.error("Error details:", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    });
    res
      .status(500)
      .json({ error: "Failed to fetch group collection data via GraphQL" });
  }
}

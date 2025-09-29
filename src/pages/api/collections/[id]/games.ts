import { NextApiRequest, NextApiResponse } from "next";

// In-memory storage for demo (in production, use a database)
const collections = new Map<string, any>();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { id } = req.query;

  if (!id || typeof id !== "string") {
    return res.status(400).json({ error: "Collection ID is required" });
  }

  try {
    const collection = collections.get(id);

    if (!collection) {
      return res.status(404).json({ error: "Collection not found" });
    }

    // Fetch fresh game data from BGG using the stored game IDs
    const { gameIds, sessionDuration, sortMethod, filters } = collection;

    // For now, we'll return the game IDs and let the client handle fetching
    // In a real implementation, you'd fetch fresh data from BGG here
    res.status(200).json({
      success: true,
      gameIds,
      sessionDuration,
      sortMethod,
      filters,
      metadata: {
        createdAt: collection.createdAt,
        views: collection.views,
      },
    });

  } catch (error) {
    console.error("Error fetching collection games:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

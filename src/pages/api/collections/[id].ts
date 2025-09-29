import { NextApiRequest, NextApiResponse } from "next";

// In-memory storage for demo (in production, use a database)
const collections = new Map<string, any>();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (!id || typeof id !== "string") {
    return res.status(400).json({ error: "Collection ID is required" });
  }

  if (req.method === "GET") {
    try {
      const collection = collections.get(id);

      if (!collection) {
        return res.status(404).json({ error: "Collection not found" });
      }

      // Increment view count
      collection.views += 1;
      collections.set(id, collection);

      res.status(200).json({
        success: true,
        collection,
      });

    } catch (error) {
      console.error("Error fetching collection:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}


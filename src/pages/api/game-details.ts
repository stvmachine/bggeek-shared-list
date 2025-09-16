import { NextApiRequest, NextApiResponse } from "next";
import { fetchGameDetails } from "../../api/fetchGameDetails";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { gameIds } = req.query;

  if (!gameIds || typeof gameIds !== "string") {
    return res.status(400).json({ error: "Game IDs are required" });
  }

  try {
    const gameIdsArray = gameIds.split(",").filter(Boolean);
    const gameDetails = await fetchGameDetails(gameIdsArray);
    res.status(200).json(gameDetails);
  } catch (error) {
    console.error("Error fetching game details:", error);
    res.status(500).json({ error: "Failed to fetch game details" });
  }
}

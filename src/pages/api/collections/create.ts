import { NextApiRequest, NextApiResponse } from "next";
import { v4 as uuidv4 } from "uuid";

// In-memory storage for game night sessions (in production, use a database)
const gameNightSessions = new Map<string, any>();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { usernames, sessionDuration, numberOfGames, sortMethod, filters } = req.body;

    if (!usernames || !Array.isArray(usernames) || usernames.length === 0) {
      return res.status(400).json({ error: "Usernames array is required" });
    }

    if (!sessionDuration || !numberOfGames || !sortMethod) {
      return res.status(400).json({ error: "Session duration, number of games, and sort method are required" });
    }

    // Generate unique game night session ID
    const sessionId = uuidv4();
    
    // Store game night session parameters (not collections)
    const sessionData = {
      id: sessionId,
      usernames, // BGG usernames to fetch collections from
      sessionDuration,
      numberOfGames,
      sortMethod,
      filters, // Store original filters (group size, etc.)
      createdAt: new Date().toISOString(),
      views: 0,
    };

    gameNightSessions.set(sessionId, sessionData);

    // Return the shareable URL
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || req.headers.origin || 'http://localhost:3000';
    const shareUrl = `${baseUrl}/game-night/${sessionId}`;

    res.status(201).json({
      success: true,
      sessionId,
      shareUrl,
      session: sessionData,
    });

  } catch (error) {
    console.error("Error creating game night session:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

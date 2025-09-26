import { NextApiRequest, NextApiResponse } from "next";
import { fetchUser } from "../../api/fetchUser";
import { fetchCollection } from "../../api/fetchGroupCollection";

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
    // First, check if user exists
    const userData = await fetchUser(username);

    if (!userData?.id) {
      return res.status(404).json({
        error: "User not found",
        hasUser: false,
        hasCollection: false,
      });
    }

    // Then, check if user has collection data
    try {
      const collectionData = await fetchCollection(username);

      // Check if user has any board games in their collection
      const hasCollection =
        collectionData?.totalitems > 0 &&
        collectionData?.item &&
        Array.isArray(collectionData.item) &&
        collectionData.item.length > 0;

      return res.status(200).json({
        hasUser: true,
        hasCollection,
        userData: {
          id: userData.id,
          name: userData.name,
          yearregistered: userData.yearregistered,
        },
        collectionData: {
          totalitems: collectionData?.totalitems || 0,
          hasItems: hasCollection,
        },
      });
    } catch (collectionError) {
      // User exists but collection fetch failed or is empty
      return res.status(200).json({
        hasUser: true,
        hasCollection: false,
        userData: {
          id: userData.id,
          name: userData.name,
          yearregistered: userData.yearregistered,
        },
        collectionData: {
          totalitems: 0,
          hasItems: false,
        },
        collectionError:
          collectionError instanceof Error
            ? collectionError.message
            : "Collection fetch failed",
      });
    }
  } catch (error) {
    console.error("Error validating user and collection:", error);
    return res.status(500).json({
      error: "Failed to validate user and collection",
      hasUser: false,
      hasCollection: false,
    });
  }
}

import { NextApiRequest, NextApiResponse } from "next";
import { getFirebaseAdmin } from "next-firebase-auth";
import initAuth from "../../../lib/firebase/initAuth";

initAuth();

const admin = getFirebaseAdmin();
const db = admin.firestore();

const getCommunities = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { userId } = req.query;
    const communitiesRef = await db
      .collection("communities_users")
      .where("user_id", "==", userId)
      .get();

    return res.status(200).json({ communities: communitiesRef.docs });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      error: e?.errorInfo?.message || "Unexpected error",
    });
  }
};

export default getCommunities;

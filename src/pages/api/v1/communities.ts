import { NextApiRequest, NextApiResponse } from "next";
import { getFirebaseAdmin, verifyIdToken } from "next-firebase-auth";
import initAuth from "../../../lib/firebase/initAuth";

initAuth();

// const admin = getFirebaseAdmin();
// const db = admin.firestore();

const getCommunities = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { authorization: token } = req.headers;
    if (!token) {
      throw new Error("User not authenticated ");
    }
    const AuthUser = await verifyIdToken(token);
    const { id } = AuthUser;
    // const communitiesRef = db
    //   .collection("communities_users")
    //   .where("user_id", "==", id);
    // const communitiesDoc = await communitiesRef.get();
    console.log(id);
    return res.status(200).json({ communities: [] });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      error: e?.errorInfo?.message || "Unexpected error",
    });
  }
};

export default getCommunities;

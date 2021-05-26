import { NextApiRequest, NextApiResponse } from "next";
import { getFirebaseAdmin, verifyIdToken } from "next-firebase-auth";
import initAuth from "../../../../lib/firebase/initAuth";

initAuth();

const admin = getFirebaseAdmin();
const db = admin.firestore();

const getAccountOptions = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { authorization: token } = req.headers;
    if (!token) {
      throw new Error("User not authenticated ");
    }
    const AuthUser = await verifyIdToken(token);
    const { id, email, emailVerified, displayName, photoURL } = AuthUser;
    const userRef = db.collection("users").doc(id!);
    const userDoc = await userRef.get();

    const user = {
      id,
      email,
      emailVerified,
      photoURL: userDoc.exists ? userDoc.get("photoURL") : photoURL,
      displayName: userDoc.exists ? userDoc.get("displayName") : displayName,
      bggeekUsername: userDoc.exists ? userDoc.get("bggeekUsername") : "",
      bggeekVerified: userDoc.exists ? userDoc.get("bggeekVerified") : false,
    };

    return res.status(200).json({ user });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      error: e?.errorInfo?.message || "Unexpected error",
    });
  }
};

export default getAccountOptions;

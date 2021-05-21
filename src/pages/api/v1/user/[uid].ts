import { NextApiRequest, NextApiResponse } from "next";
import { getFirebaseAdmin } from "next-firebase-auth";
import initAuth from "../../../../lib/firebase/initAuth";

initAuth();

const admin = getFirebaseAdmin();
const db = admin.firestore();

const apiUser = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method === "GET") {
      const { uid } = req.query;
      const userDoc = await db.collection("users").doc(String(uid)).get();

      return res.status(200).json({
        user: userDoc.data(),
      });
    }

    if (req.method === "PATCH") {
      const { uid } = req.query;
      const params = req.body;
      await db
        .collection("users")
        .doc(String(uid))
        .set(params, { merge: true });

      return res.status(200).json({
        success: true,
      });
    }

    throw new Error("Not supported method");
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      error: e?.errorInfo?.message || "Unexpected error",
    });
  }
};

export default apiUser;

import { getBggUser } from "bgg-xml-api-client";
import { NextApiRequest, NextApiResponse } from "next";
import { getFirebaseAdmin } from "next-firebase-auth";
import initAuth from "../../../../lib/firebase/initAuth";

initAuth();

const admin = getFirebaseAdmin();
const db = admin.firestore();
const auth = admin.auth();

const apiUser = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method === "GET") {
      const { uid } = req.query;

      const userAuthDoc = await auth.getUser(String(uid));
      const userDoc = await db.collection("users").doc(String(uid)).get();
      // console.log("userAuthDoc", userAuthDoc);
      // console.log("userDoc", userDoc);

      return res.status(200).json({
        user: {
          id: userAuthDoc.uid,
          email: userAuthDoc.email,
          displayName: userAuthDoc.displayName,
          photoURL: userAuthDoc.photoURL,
          emailVerified: userAuthDoc.emailVerified,
          bggUsername: userDoc.exists ? userDoc.get("bggUsername") : "",
          bggVerified: userDoc.exists ? userDoc.get("bggVerified") : false,
        },
      });
    }

    if (req.method === "PATCH") {
      const { uid } = req.query;
      const params = req.body;

      if (params.bggUsername) {
        const userBgGeek = await getBggUser({ name: params.bggUsername });
        if (!userBgGeek.data.id) {
          throw new Error(
            "Doesn't exist that user on boardgame geek. Please try again."
          );
        }
      }

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
      error: e?.errorInfo?.message || e?.message || "Unexpected error",
    });
  }
};

export default apiUser;

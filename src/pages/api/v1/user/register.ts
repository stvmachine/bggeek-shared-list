import { NextApiRequest, NextApiResponse } from "next";
import { getFirebaseAdmin } from "next-firebase-auth";
import initAuth from "../../../../lib/firebase/initAuth";

initAuth();

const admin = getFirebaseAdmin();
const auth = admin.auth();
const db = admin.firestore();

const createUser = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { email, password, name } = req.body;
    const newAuthUser = await auth.createUser({
      email,
      password,
      displayName: name,
    });

    if (newAuthUser?.uid) {
      const userParams = {
        uid: newAuthUser.uid,
        email: newAuthUser.email,
        ...(newAuthUser?.displayName && {
          displayName: newAuthUser.displayName,
        }),
        ...(newAuthUser?.photoURL && { photoURL: newAuthUser.photoURL }),
      };
      await db.collection("users").doc(newAuthUser.uid).set(userParams);

      return res.status(200).json({
        user: userParams,
      });
    } else {
      throw new Error("The user creation attempt failed");
    }
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      error: e?.errorInfo?.message || "Unexpected error",
    });
  }
};

export default createUser;

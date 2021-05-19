import { NextApiRequest, NextApiResponse } from "next";
import { getFirebaseAdmin } from "next-firebase-auth";
import initAuth from "../../../../lib/firebase/initAuth";

initAuth();

const admin = getFirebaseAdmin();
const db = admin.database();

const updateUser = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { uid, params } = req.body;
    console.log(params)
    const ref = db.ref("users").child(uid);
    const { snapshot } = await ref.transaction((currentUser) => {
      console.log(currentUser);
    });

    return res.status(200).json({
      user: snapshot,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      error: e?.errorInfo?.message || "Unexpected error",
    });
  }
};

export default updateUser;

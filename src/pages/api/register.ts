import { NextApiRequest, NextApiResponse } from "next";
import { getFirebaseAdmin } from 'next-firebase-auth';
import firebase from 'firebase/app'
import initAuth from "../../lib/firebase/initAuth";

initAuth();

const createUser = async (req: NextApiRequest, res: NextApiResponse) => {
  try { 
    const { email, password, name } = req.body;
    const auth = getFirebaseAdmin().auth();
    const response = await auth.createUserWithEmailAndPassword(email, password);
    const newUser: firebase.User | null = response.user;
    if (newUser?.uid) {
      const responseFirestore = await getFirebaseAdmin().firestore()
        .collection("users")
        .doc(newUser.uid)
        .set({
          ...newUser,
          name,
        });
      return res.status(200).json({
        user: responseFirestore,
      });
    } else {
      throw new Error("The user creation attempt failed");
    }
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      error: "Unexpected error",
    });
  }
};

export default createUser;

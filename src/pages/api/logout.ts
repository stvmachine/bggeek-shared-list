import { unsetAuthCookies } from "next-firebase-auth";
import initAuth from "../../utils/firebase/initAuth";

initAuth();

const handler = async (req: any, res: any) => {
  try {
    await unsetAuthCookies(req, res);
  } catch (e) {
    return res.status(500).json({ error: "Unexpected error." });
  }
  return res.status(200).json({ success: true });
};

export default handler;

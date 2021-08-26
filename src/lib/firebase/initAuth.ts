import { init } from "next-firebase-auth";

const initAuth = () => {
  const privateKey = process.env.FIREBASE_PRIVATE_KEY
    ? process.env.FIREBASE_PRIVATE_KEY
    : "";

  init({
    authPageURL: "/auth",
    appPageURL: "/",
    loginAPIEndpoint: "/api/v1/login", // required
    logoutAPIEndpoint: "/api/v1/logout", // required
    firebaseAuthEmulatorHost: process.env.FIREBASE_AUTH_EMULATOR_HOST,
    // Required in most cases.
    firebaseAdminInitConfig: {
      credential: {
        projectId: "bbg-communities",
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL || "",
        privateKey, // Expected to be undefined on client side
      },
      databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL || "",
    },
    firebaseClientInitConfig: {
      apiKey: "AIzaSyBYrPSeyNFKlGnSlIe2YnDTt-T1oO0G7mo", // required
      authDomain: "bbg-communities.firebaseapp.com",
      databaseURL: "https://bbg-communities-default-rtdb.firebaseio.com/",
      projectId: "bbg-communities",
    },
    cookies: {
      name: "ExampleApp", // required
      // Keys are required unless you set `signed` to `false`.
      // The keys cannot be accessible on the client side.
      keys: [
        process.env.COOKIE_SECRET_CURRENT,
        process.env.COOKIE_SECRET_PREVIOUS,
      ],
      httpOnly: true,
      maxAge: 12 * 60 * 60 * 24 * 1000, // twelve days
      overwrite: true,
      path: "/",
      sameSite: "strict",
      secure: process.env.NEXT_PUBLIC_COOKIE_SECURE === "true", // set this to false in local (non-HTTPS) development
      signed: true,
    },
  });
};

export default initAuth;

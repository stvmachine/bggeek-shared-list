import { init } from "next-firebase-auth";

const initAuth = () => {
  init({
    authPageURL: "/auth",
    appPageURL: "/",
    loginAPIEndpoint: "/api/login", // required
    logoutAPIEndpoint: "/api/logout", // required
    firebaseAuthEmulatorHost: process.env.FIREBASE_AUTH_EMULATOR_HOST,
    // Required in most cases.
    firebaseAdminInitConfig: {
      credential: {
        projectId: process.env.FIREBASE_PROJECT_ID || "FIREBASE_PROJECT_ID",
        clientEmail:
          process.env.FIREBASE_CLIENT_EMAIL || "FIREBASE_CLIENT_EMAIL",
        privateKey: process.env.FIREBASE_PRIVATE_KEY
          ? process.env.FIREBASE_PRIVATE_KEY
          : undefined, // Expected to be undefined on client side
      },
      databaseURL: process.env.FIREBASE_DATABASE_URL || "FIREBASE_DATABASE_URL",
    },
    firebaseClientInitConfig: {
      apiKey: process.env.FIREBASE_API_KEY || "FIREBASE_API_KEY", // required
      authDomain: process.env.FIREBASE_AUTH_DOMAIN,
      databaseURL: process.env.FIREBASE_DATABASE_URL,
      projectId: process.env.FIREBASE_PROJECT_ID,
    },
    cookies: {
      name: process.env.FIREBASE_PROJECT_ID, // required
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

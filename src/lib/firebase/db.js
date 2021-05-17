export default async () => {
  const firebase = await import("firebase/app");
  await import('firebase/firestore');

  try {
    firebase.initializeApp({
      databaseURL: "https://bbg-communities-default-rtdb.firebaseio.com",
    });
  } catch (error) {
    /*
     * We skip the "already exists" message which is
     * not an actual error when we're hot-reloading.
     */
    if (!/already exists/u.test(error.message)) {
      // eslint-disable-next-line no-console
      console.error("Firebase initialization error", error.stack);
    }
  }

  return firebase.firestore();
};

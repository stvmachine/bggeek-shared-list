export default async () => {
  const firebase = await import("firebase/app");
  await import("firebase/firestore");
  await import("firebase/auth");

  try {
    firebase.initializeApp({
      apiKey: "AIzaSyBYrPSeyNFKlGnSlIe2YnDTt-T1oO0G7mo",
      authDomain: "bbg-communities.firebaseapp.com",
      databaseURL: "https://bbg-communities-default-rtdb.firebaseio.com",
      projectId: "bbg-communities",
      storageBucket: "bbg-communities.appspot.com",
      messagingSenderId: "534289391904",
      appId: "1:534289391904:web:8f0eeaaacdaa97dd3db745",
      measurementId: "G-CMZJY3DK22",
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

  const db = firebase.firestore();
  const auth = firebase.auth();

  const signOut = async () => auth.signOut();

  return firebase;
};

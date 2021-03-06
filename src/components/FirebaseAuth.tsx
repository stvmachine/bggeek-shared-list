import React from "react";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import firebase from "firebase/app";
import "firebase/auth";
import useHasMounted from "../hooks/useHasMounted";

// Note that next-firebase-auth inits Firebase for us,
// so we don't need to.

const firebaseAuthConfig = {
  signInFlow: "redirect",
  // Auth providers
  // https://github.com/firebase/firebaseui-web#configure-oauth-providers
  signInOptions: [
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
  ],
  signInSuccessUrl: "/",
  credentialHelper: "none",
  callbacks: {
    // https://github.com/firebase/firebaseui-web#signinsuccesswithauthresultauthresult-redirecturl
    signInSuccessWithAuthResult: () =>
      // Don't automatically redirect. We handle redirecting based on
      // auth state in withAuthComponent.js.
      false,
  },
  tosUrl: "/terms-of-service",
  privacyPolicyUrl: "/privacy-policy",
};

const FirebaseAuth = () => {
  // Do not SSR FirebaseUI, because it is not supported.
  // https://github.com/firebase/firebaseui-web/issues/213
  const hasMounted = useHasMounted();

  if (!hasMounted) {
    return null;
  }

  return (
    <StyledFirebaseAuth
      uiConfig={firebaseAuthConfig}
      firebaseAuth={firebase.auth()}
    />
  );
};

export default FirebaseAuth;

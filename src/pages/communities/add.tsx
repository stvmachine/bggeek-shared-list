import React from "react";
import { Box, Container } from "@chakra-ui/react";
import { NextPage } from "next";
import {
  withAuthUser,
  withAuthUserTokenSSR,
  AuthAction,
  useAuthUser,
} from "next-firebase-auth";
import Navbar from "../../components/Layout/Navbar";
import Footer from "../../components/Layout/Footer";

type MyAccountProps = {};

const MyAccount: NextPage<MyAccountProps> = () => {
  const AuthUser = useAuthUser();

  return (
    <Container height="100vh" maxWidth="100%">
      <Navbar user={AuthUser} signOut={AuthUser.signOut} />
      <Box mt={12}>Add community</Box>
      <Footer />
    </Container>
  );
};

export const getServerSideProps = withAuthUserTokenSSR({
  whenUnauthed: AuthAction.REDIRECT_TO_LOGIN,
})(async () => {
  return {
    props: {},
  };
});

export default withAuthUser<MyAccountProps>({
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
})(MyAccount);

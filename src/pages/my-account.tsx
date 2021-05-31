import React from "react";
import {
  Box,
  Container,
  Tab,
  Tabs,
  TabList,
  TabPanels,
  TabPanel,
} from "@chakra-ui/react";
import { NextPage } from "next";
import {
  withAuthUser,
  withAuthUserTokenSSR,
  AuthAction,
  useAuthUser,
} from "next-firebase-auth";
import Navbar from "../components/Layout/Navbar";
import Footer from "../components/Layout/Footer";
import BoardgameGeekProfile from "../components/Profile/BoardgameGeekProfile";
import Profile from "../components/Profile/Profile";
import { useQuery } from "react-query";
import { IExtendedUser } from "../utils/types";
import { getUserAccountOptions } from "../api/getUser";

type MyAccountProps = {
  user: IExtendedUser;
};

const MyAccount: NextPage<MyAccountProps> = (props) => {
  const AuthUser = useAuthUser();
  const { data: userData } = useQuery<any, any>(
    "user",
    async () => getUserAccountOptions(await AuthUser.getIdToken()),
    { initialData: props.user }
  );

  return (
    <Container height="100vh" maxWidth="100%">
      <Navbar user={AuthUser} signOut={AuthUser.signOut} />
      <Box mt={12}>
        <Tabs orientation="vertical" isLazy>
          <TabList>
            <Tab>Profile</Tab>
            <Tab>Boardgame Geek</Tab>
            <Tab>Billing & plans</Tab>
            <Tab>Groups</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Profile user={userData} />
            </TabPanel>
            <TabPanel>
              <BoardgameGeekProfile user={userData} />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
      <Footer />
    </Container>
  );
};

export const getServerSideProps = withAuthUserTokenSSR({
  whenUnauthed: AuthAction.REDIRECT_TO_LOGIN,
})(async ({ AuthUser }) => {
  const token = await AuthUser.getIdToken();
  const user = await getUserAccountOptions(token);
  return {
    props: {
      user,
    },
  };
});

export default withAuthUser<MyAccountProps>({
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
})(MyAccount);

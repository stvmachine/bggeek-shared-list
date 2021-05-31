import { NextPage } from "next";
import {
  Box,
  Container,
  Heading,
  Stack,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import {
  useAuthUser,
  withAuthUser,
  withAuthUserTokenSSR,
} from "next-firebase-auth";

import Footer from "../../../components/Layout/Footer";
import Navbar from "../../../components/Layout/Navbar";
import { getCommunities } from "../../../api/getCommunities";
// import { getCommunities } from "../../api/getCommunities";

type CommunitiesPageProps = {};

const GROUPS = [
  {
    id: 1,
    name: "Soutbank Boardgames",
    address: "60 Cavanagh St",
    members: ["donutgamer", "stevmachine", "Jagger84"],
  },
  {
    id: 2,
    name: "Lockdown Friends BG",
    address: "Melbourne Fortress",
    members: ["stevmachine", "Jagger84"],
  },
  {
    id: 3,
    name: "Bots Chilenos",
    address: "470 St Kilda Rd",
    members: ["stevmachine"],
  },
];

const PlaysPage: NextPage<CommunitiesPageProps> = () => {
  const AuthUser = useAuthUser();
  return (
    <Container height="100vh" maxWidth="100%">
      <Navbar user={AuthUser} signOut={AuthUser.signOut} />
      <Box mt={12}>
        {GROUPS &&
          GROUPS.map((group) => (
            <Box mt={2} key={group.id}>
              <Heading as="h3" size={"md"}>
                {group.name}
              </Heading>
              <Stack>
                <Wrap>
                  {group.members.map((memberName) => (
                    <WrapItem key={memberName}>{memberName}</WrapItem>
                  ))}
                </Wrap>
              </Stack>
            </Box>
          ))}
      </Box>
      <Footer />
    </Container>
  );
};

export const getServerSideProps = withAuthUserTokenSSR()(async ({ params }) => {
  const { uid } = params!;
  const data = await getCommunities(String(uid));
  return {
    props: {
      communities: data.communities,
    },
  };
});

export default withAuthUser<CommunitiesPageProps>()(PlaysPage);

import { NextPage } from "next";
import { Box, Container } from "@chakra-ui/react";
import {
  useAuthUser,
  withAuthUser,
  withAuthUserTokenSSR,
} from "next-firebase-auth";

import Footer from "../../components/Layout/Footer";
import Navbar from "../../components/Layout/Navbar";
import { IExtendedUser } from "../../utils/types";

type PlaysPageProps = {
  user: IExtendedUser;
};

const PlaysPage: NextPage<PlaysPageProps> = () => {
  // const router = useRouter();
  const AuthUser = useAuthUser();
  // const { uid } = router.query!;
  return (
    <Container height="100vh" maxWidth="100%">
      <Navbar user={AuthUser} signOut={AuthUser.signOut} />
      <Box mt={12}>
        {/* {plays &&
          Object.keys(plays) &&
          Object.keys(plays).map((date) => (
            <Box mt={2} key={date}>
              <Heading as="h3" size={"md"}>
                {date}
              </Heading>
              <Stack>
                <Wrap>
                  {plays[date].map(({ id, item, location, date, players }) => (
                    <WrapItem key={id}>
                      <GameCard
                        image={bgs && bgs[item.objectid].image}
                        bgName={item.name}
                        location={location}
                        date={date}
                        players={players || []}
                      />
                    </WrapItem>
                  ))}
                </Wrap>
              </Stack>
            </Box>
          ))} */}
      </Box>
      <Footer />
    </Container>
  );
};

export const getServerSideProps = withAuthUserTokenSSR()(async () => {
  return {
    props: {},
  };
});

export default withAuthUser<PlaysPageProps>()(PlaysPage);

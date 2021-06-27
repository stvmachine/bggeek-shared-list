import { NextPage } from "next";
import {
  Box,
  Container,
  Heading,
  Stack,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
// import { useRouter } from "next/router";
import {
  useAuthUser,
  withAuthUser,
  withAuthUserTokenSSR,
} from "next-firebase-auth";

import Footer from "../../../components/Layout/Footer";
import Navbar from "../../../components/Layout/Navbar";
import PlayCard from "../../../components/PlayCard";
import { IBgDict, IExtendedUser, IPlaysByDateDict } from "../../../utils/types";
import { getPlaysAndRelatedBggs } from "../../../api/fetchPlays";
import { getUser } from "../../../api/getUser";

type PlaysPageProps = {
  plays: IPlaysByDateDict;
  bgs: IBgDict;
  user: IExtendedUser;
};

const PlaysPage: NextPage<PlaysPageProps> = ({ bgs, plays }) => {
  // const router = useRouter();
  const AuthUser = useAuthUser();

  // const { uid } = router.query!;
  return (
    <Container height="100vh" maxWidth="100%">
      <Navbar user={AuthUser} signOut={AuthUser.signOut} />
      <Box mt={12}>
        {plays &&
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
                      <PlayCard
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
          ))}
      </Box>
      <Footer />
    </Container>
  );
};

export const getServerSideProps = withAuthUserTokenSSR()(async ({ params }) => {
  const { uid } = params!;
  const user = await getUser(String(uid));

  if (user.id === uid) {
    const fetchPlaysResponse = await getPlaysAndRelatedBggs(user.bggUsername);
    const { plays, bgs } = fetchPlaysResponse;

    return {
      props: {
        user,
        plays,
        bgs,
      },
    };
  } else {
    return { props: {} };
  }
});

export default withAuthUser<PlaysPageProps>()(PlaysPage);

import { NextPage } from "next";
import { Box, Container, Wrap, WrapItem } from "@chakra-ui/react";
import { useRouter } from "next/router";
import {
  useAuthUser,
  withAuthUser,
  withAuthUserTokenSSR,
  AuthUser,
} from "next-firebase-auth";
import axios from "axios";

import Footer from "../../components/Layout/Footer";
import Navbar from "../../components/Layout/Navbar";
import Comments from "../../components/Comments";
import GameCard from "../../components/GameCard";
import { IBgDict, IPlay } from "../../utils/types";
import { getPlaysAndRelatedBggs } from "../../api/fetchPlays";

type PlaysPageProps = {
  plays: IPlay[];
  bgs: IBgDict;
  user: AuthUser & { bggeekUsername: string; bggeekVerified: boolean };
};

const PlaysPage: NextPage<PlaysPageProps> = ({ bgs, plays }) => {
  const router = useRouter();
  const AuthUser = useAuthUser();

  const { uid } = router.query!;
  console.log(plays)
  return (
    <Container height="100vh" maxWidth="100%">
      <Navbar user={AuthUser} signOut={AuthUser.signOut} />
      <Box mt={12}>
        <p>Plays for: {uid}</p>
        <Wrap>
          {plays &&
            plays.map(({ id, item, location, date, players }) => (
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
      </Box>
      <Comments />
      <Footer />
    </Container>
  );
};

const API_HOST = `http://localhost:3001`;

export const getServerSideProps = withAuthUserTokenSSR()(
  async ({ AuthUser: authUser, params }) => {
    const token = await authUser.getIdToken();
    const response = await axios.get(`${API_HOST}/api/v1/user/${authUser.id}`, {
      headers: {
        Authorization: token,
      },
    });
    const { user: currentUser } = response.data;
    const { uid } = params!;
    let bggeekUsername;

    if (currentUser.id === uid || currentUser.bggeekUsername === uid) {
      bggeekUsername = currentUser.bggeekUsername;
    }

    const fetchPlaysResponse = await getPlaysAndRelatedBggs(bggeekUsername);
    const { plays, bgs } = fetchPlaysResponse;

    return {
      props: {
        user: currentUser,
        plays,
        bgs,
      },
    };
  }
);

export default withAuthUser<PlaysPageProps>()(PlaysPage);

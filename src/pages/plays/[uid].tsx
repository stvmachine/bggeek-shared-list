import { GetStaticProps, NextPage } from "next";
import { Box, Container, Wrap, WrapItem } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { getBggPlays, getBggThing } from "bgg-xml-api-client";
import { ParsedUrlQuery } from "querystring";
import { useAuthUser, withAuthUser, AuthAction } from "next-firebase-auth";

import Footer from "../../components/Layout/Footer";
import Navbar from "../../components/Layout/Navbar";
import FullPageLoader from "../../components/Layout/FullPageLoader";
import Comments from "../../components/Comments";
import GameCard from "../../components/GameCard";
import { IPlay } from "../../utils/types";

type Props = {
  [prop: string]: any;
};

interface Params extends ParsedUrlQuery {
  uid: string;
}

export const getStaticProps: GetStaticProps<Props, Params> = async (
  context
) => {
  const params = context.params!;
  const plays = await getBggPlays({ username: params.uid });
  const uniqueBgIds =
    plays?.data?.play &&
    plays.data.play
      .map((play: IPlay) => play.item.objectid)
      .filter(
        (value: string, index: number, self: string[]) =>
          self.indexOf(value) === index
      );
  const uniqueBgs = uniqueBgIds && (await getBggThing({ id: uniqueBgIds }));
  return {
    props: {
      plays: plays?.data || [],
      bgs: uniqueBgs?.data?.item || [],
    },
  };
};

export const getStaticPaths = async () => {
  let data = ["stevmachine", "Jagger84", "donutgamer"];

  const paths = data.map((member) => ({
    params: { uid: member },
  }));

  return { paths, fallback: false };
};

const Logs: NextPage<Props> = (rawData) => {
  const router = useRouter();
  const AuthUser = useAuthUser();

  const { uid } = router.query!;

  return (
    <Container height="100vh" maxWidth="100%">
      <Navbar user={AuthUser} signOut={AuthUser.signOut} />
      <Box mt={12}>
        <p>Logs for: {uid}</p>
        <Wrap>
          {rawData?.bgs &&
            rawData.bgs.map((game: any) => (
              <WrapItem key={game.id}>
                <GameCard image={game.image} />
              </WrapItem>
            ))}
        </Wrap>
      </Box>
      <Comments />
      <Footer />
    </Container>
  );
};

export default withAuthUser()(Logs);

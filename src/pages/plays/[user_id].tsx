import { GetStaticProps, NextPage } from "next";
import { useRouter } from "next/router";
import { getBggPlays, getBggThing } from "bgg-xml-api-client";
import { ParsedUrlQuery } from "querystring";
import { useQuery } from "react-query";
import { useAuthUser, withAuthUser, AuthAction } from "next-firebase-auth";
import { Box, Container } from "@chakra-ui/react";
import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";
import FullPageLoader from "../../components/FullPageLoader";
import { IPlay } from "../../utils/types";

type Props = {
  [prop: string]: any;
};

interface Params extends ParsedUrlQuery {
  user_id: string;
}

export const getStaticProps: GetStaticProps<Props, Params> = async (
  context
) => {
  const params = context.params!;
  const plays = await getBggPlays({ username: params.user_id });
  console.log(plays);
  const uniqueBgIds = plays.data?.play
    .map((play: IPlay) => play.item.objectid)
    .filter(
      (value: string, index: number, self: string[]) =>
        self.indexOf(value) === index
    );
  const uniqueBgs = await getBggThing({ id: uniqueBgIds });
  return {
    props: {
      plays: plays.data,
      bgs: uniqueBgs.data.item,
    },
  };
};

export const getStaticPaths = async () => {
  let data = ["stevmachine"];

  const paths = data.map((member) => ({
    params: { user_id: member },
  }));

  return { paths, fallback: false };
};

const Logs: NextPage<Props> = ({ plays, bgs }) => {
  const router = useRouter();
  const AuthUser = useAuthUser();

  const { user_id } = router.query!;

  const { data } = useQuery(
    "plays",
    async () => {
      const response = await getBggPlays({
        username: String(user_id),
      });
      return response.data;
    },
    {
      initialData: plays,
    }
  );
  console.log(plays, bgs);
  return (
    <Container height="100vh" maxWidth="100%">
      <Navbar user={AuthUser} signOut={AuthUser.signOut} />
      <Box mt={12}>
        <p>Logs for: {user_id}</p>
      </Box>
      <Footer />
    </Container>
  );
};

export default withAuthUser({
  whenUnauthedBeforeInit: AuthAction.SHOW_LOADER,
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
  LoaderComponent: FullPageLoader,
})(Logs);

import { GetStaticProps, NextPage } from "next";
import { useRouter } from "next/router";
import { BggPlaysResponse, getBggPlays } from "bgg-xml-api-client";
import { ParsedUrlQuery } from "querystring";
import { useQuery } from "react-query";

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
  const res = await getBggPlays({ username: params.user_id });

  return {
    props: {
      plays: res.data,
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

const Logs: NextPage<Props> = ({ plays }) => {
  const router = useRouter();
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
  console.log(data);

  return <p>Logs for: {user_id}</p>;
};

export default Logs;

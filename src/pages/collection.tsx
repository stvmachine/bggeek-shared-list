import React, { useMemo } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { NextPage } from "next";
import { Box, Container, Stack } from "@chakra-ui/react";
import { useQuery } from "react-query";

import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { IItem, ICollection } from "../utils/types";
import SearchSidebar from "../components/SearchSidebar";
import Results from "../components/Results";
import SortBar from "../components/SortBar";
import { fetchGroupCollection } from "../api/fetchGroupCollection";

const MEMBERS = ["donutgamer", "Jagger84", "stevmachine"];

type CollectionPageProps = {
  collections: ICollection[];
  boardgames: IItem[];
  members: string[];
};

export async function getStaticProps() {
  const data = await fetchGroupCollection(MEMBERS);
  const { boardgames, collections } = data;

  return {
    props: {
      boardgames,
      collections,
    },
  };
}

const Index: NextPage<CollectionPageProps> = (props) => {
  const { data } = useQuery(
    "collections",
    () => fetchGroupCollection(props.members),
    { initialData: props }
  );
  const defaultValues = useMemo(
    () => ({
      orderBy: "name_asc",
      members: MEMBERS.reduce(
        (accum, member) => ({ ...accum, [member]: true }),
        {}
      ),
    }),
    [MEMBERS]
  );
  const methods = useForm({ defaultValues });

  return (
    <Container height="100vh" maxWidth="100%">
      <Navbar />
      <Box mt={12}>
        <FormProvider {...methods}>
          <SortBar />
          <Stack direction={["column", "row"]} alignItems="flex-start">
            <SearchSidebar
              members={MEMBERS}
              collections={data?.collections || []}
            />
            <Results boardgames={data?.boardgames || []} />
          </Stack>
        </FormProvider>
      </Box>
      <Footer />
    </Container>
  );
};

export default Index;

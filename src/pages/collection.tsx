import React, { useMemo } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { NextPage } from "next";
import { Box, Container, Stack } from "@chakra-ui/react";

import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { IItem, ICollection } from "../utils/types";
import SearchSidebar from "../components/SearchSidebar";
import Results from "../components/Results";
import SortBar from "../components/SortBar";
import { fetchGroupCollection } from "../api/fetchGroupCollection";

type CollectionPageProps = {
  collections: ICollection[];
  boardgames: IItem[];
  members: string[];
};

export async function getStaticProps() {
  const members = ["donutgamer", "Jagger84", "stevmachine"];
  const data = await fetchGroupCollection(members);
  const { boardgames, collections } = data;

  return {
    props: {
      boardgames,
      collections,
      members,
    },
  };
}

const Index: NextPage<CollectionPageProps> = ({
  members,
  boardgames,
  collections,
}) => {
  const defaultValues = useMemo(
    () => ({
      orderBy: "name_asc",
      members: members.reduce(
        (accum, member) => ({ ...accum, [member]: true }),
        {}
      ),
    }),
    [members]
  );
  const methods = useForm({ defaultValues });
  return (
    <Container height="100vh" maxWidth="100%">
      <Navbar />
      <Box mt={12}>
        <FormProvider {...methods}>
          <SortBar />
          <Stack direction={["column", "row"]} alignItems="flex-start">
            <SearchSidebar members={members} collections={collections} />
            <Results members={members} boardgames={boardgames} />
          </Stack>
        </FormProvider>
      </Box>
      <Footer />
    </Container>
  );
};

export default Index;

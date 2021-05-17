import React, { useMemo } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { NextPage } from "next";
import { Box, Container, Stack } from "@chakra-ui/react";
import { useQueries } from "react-query";

import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { ICollection } from "../utils/types";
import SearchSidebar from "../components/SearchSidebar";
import Results from "../components/Results";
import SortBar from "../components/SortBar";
import {
  fetchCollections,
  fetchCollection,
  mergeCollections,
} from "../api/fetchGroupCollection";

const MEMBERS = ["donutgamer", "Jagger84", "stevmachine"];

type CollectionPageProps = {
  initialData: ICollection[];
};

export async function getStaticProps() {
  const initialData = await fetchCollections(MEMBERS);

  return {
    props: {
      initialData,
    },
  };
}

const Index: NextPage<CollectionPageProps> = ({ initialData }) => {
  const results = useQueries(
    MEMBERS.map((member, index) => ({
      queryKey: ["collection", member],
      queryFn: () => fetchCollection(member),
      initialData: initialData[index],
      refetchOnWindowFocus: false,
    }))
  );

  const data = useMemo(
    () => mergeCollections(results.map((result: any) => result?.data)),
    [results]
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

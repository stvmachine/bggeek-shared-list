import React, { useMemo } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { NextPage } from "next";
import { Box, Container, Stack } from "@chakra-ui/react";
import { getBggCollection, BggCollectionResponse } from "bgg-xml-api-client";

import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { ItemType } from "../utils/types";
import SearchSidebar from "../components/SearchSidebar";
import Results from "../components/Results";
import SortBar from "../components/SortBar";

const fetchGroupCollection = async (usernames: string[]) => {
  const collectionGroup = await Promise.all(
    usernames.map(async (username) => {
      const collectionResponse = await getBggCollection({
        own: 1,
        subtype: "boardgame",
        stats: 1,
        username,
      });
      return {
        ...collectionResponse.data,
        item: collectionResponse.data.item,
      };
    })
  );

  return collectionGroup;
};

type CollectionPageProps = {
  boardgames: ItemType[];
  members: string[];
};

export async function getStaticProps() {
  const members = ["stevmachine", "donutgamer", "Jagger84"];
  const rawData = await fetchGroupCollection(members);

  const items = rawData.reduce(
    (accum: any[], collection: BggCollectionResponse) => {
      return [...accum, ...collection.item]
        .map((item) => ({
          yearpublished: item.yearpublished,
          stats: item.stats,
          subtype: item.subtype,
          objectid: item.objectid,
          thumbnail: item.thumbnail,
          name: { ...item.name },
        }))

        .filter(
          (item, index, self) =>
            self.findIndex((i) => i.objectid == item.objectid) == index
        )
        .sort((a, b) => (a.name.text > b.name.text ? 1 : -1));
    },
    []
  );

  return {
    props: {
      boardgames: items,
      members,
    },
  };
}

const Index: NextPage<CollectionPageProps> = ({ members, boardgames }) => {
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
            <SearchSidebar members={members} />
            <Results members={members} boardgames={boardgames} />
          </Stack>
        </FormProvider>
      </Box>
      <Footer />
    </Container>
  );
};

export default Index;

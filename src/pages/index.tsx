import React from "react";
import { NextPage } from "next";
import { getBggCollection, BggCollectionResponse } from "bgg-xml-api-client";

import { Container } from "../components/Container";
import Main from "../components/Main";
import CTA from "../components/CTA";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import StatsCard from "../components/StatsCard";
import Collection from "../components/Collection";

export async function getStaticProps() {
  const results: BggCollectionResponse = await getBggCollection({
    username: "stevmachine",
    own: 1,
    minbggrating: 7,
    subtype: "boardgame",
    excludesubtype: "boardgameexpansion",
    stats: 1,
  });

  return {
    props: {
      collectionData: results.data.slice(0, 24),
    },
  };
}

type IndexPageProps = {
  collectionData: BggCollectionResponse;
};

const Index: NextPage<IndexPageProps> = ({ collectionData }) => {
  return (
    <Container height="100vh">
      <Navbar />

      <Main>
        <CTA />
        <Collection collectionData={collectionData} />
        <StatsCard />
      </Main>

      <Footer />
    </Container>
  );
};

export default Index;

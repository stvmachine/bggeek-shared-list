import { NextPage } from "next";
import React from "react";
import api from "../utils/api";

import { Container } from "../components/Container";
import Main from "../components/Main";
import CTA from "../components/CTA";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import StatsCard from "../components/StatsCard";
import Collection from "../components/Collection";
import { ItemType } from "../utils/types";

export async function getStaticProps() {
  const collectionData = await api
    .apiRequest("collection", { username: "stevmachine" })
    .then((results) => ({
      ...results,
      item: results.item.filter(
        (i: ItemType) => i.status.own === "1" && i.subtype === "boardgame"
      ),
    }));
  return {
    props: {
      collectionData,
    },
  };
}

type IndexPageProps = {
  collectionData: any[];
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

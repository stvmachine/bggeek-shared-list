import { NextPage } from "next";
import React from "react";
import api from "../utils/api";

import { Container } from "../components/Container";
import { Main } from "../components/Main";
import { DarkModeSwitch } from "../components/DarkModeSwitch";
import CTA from "../components/CTA";
import Footer from "../components/Footer";
import StatsCard from "../components/StatsCard";
import Collection from "../components/Collection";

export async function getStaticProps() {
  const collectionData = await api
    .apiRequest("collection", { username: "stevmachine" })
    .then(function (results) {
      console.log(results);
      return {
        ...results,
        item: results.item.filter((i) => i.status.own === "1"),
      };
    });
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
      <Main>
        <CTA />
        <StatsCard />
        <Collection collectionData={collectionData} />
      </Main>

      <DarkModeSwitch />
      <Footer />
    </Container>
  );
};

export default Index;

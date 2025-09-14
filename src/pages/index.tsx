import React from "react";
import { NextPage } from "next";
import { getBggHot, BggHotResponse } from "bgg-xml-api-client";

import { Container } from "../components/Container";
import Main from "../components/Layout/Main";
import Footer from "../components/Layout/Footer";
import Navbar from "../components/Layout/Navbar";
import CTA from "../components/CTA";
import HotGames from "../components/HotGames";

export async function getStaticProps() {
  try {
    const results: BggHotResponse = await getBggHot({
      type: "boardgame",
    });

    const collectionData = {
      ...results.data,
      item: results.data.item.sort(() => 0.5 - Math.random()).slice(0, 24),
    };

    return {
      props: {
        collectionData,
      },
    };
  } catch (error) {
    console.error("Error fetching hot games:", error);
    
    // Return empty data structure as fallback
    return {
      props: {
        collectionData: {
          item: [],
        },
      },
    };
  }
}

type IndexPageProps = {
  collectionData: BggHotResponse;
  [prop: string]: any;
};

const Index: NextPage<IndexPageProps> = ({ collectionData }) => {
  return (
    <Container height="100vh">
      <Navbar />
      <Main>
        <CTA />
        <HotGames collectionData={collectionData} />
      </Main>

      <Footer />
    </Container>
  );
};

export default Index;

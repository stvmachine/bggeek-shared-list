import { BggHotResponse, getBggHot } from "bgg-xml-api-client";
import { NextPage } from "next";

import { Container } from "../components/Container";
import CTA from "../components/CTA";
import HotGames from "../components/HotGames";
import Footer from "../components/Layout/Footer";
import Main from "../components/Layout/Main";
import Navbar from "../components/Layout/Navbar";

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
    <>
      <Navbar />
      <Container height="100vh">
        <Main>
          <CTA />
          <HotGames collectionData={collectionData} />
        </Main>
        <Footer />
      </Container>
    </>
  );
};

export default Index;

import React from "react";
import { NextPage } from "next";
import { getBggHot, BggHotResponse } from "bgg-xml-api-client";
import { AuthAction, useAuthUser, withAuthUser } from "next-firebase-auth";

import { Container } from "../components/Container";
import Main from "../components/Layout/Main";
import Footer from "../components/Layout/Footer";
import Navbar from "../components/Layout/Navbar";
import CTA from "../components/CTA";
import StatsCard from "../components/StatsCard";
import HotGames from "../components/HotGames";
import FullPageLoader from "../components/Layout/FullPageLoader";

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
  const AuthUser = useAuthUser();
  return (
    <Container height="100vh">
      <Navbar user={AuthUser} signOut={AuthUser?.signOut} />
      <Main>
        <CTA />
        <HotGames collectionData={collectionData} />
        <StatsCard />
      </Main>

      <Footer />
    </Container>
  );
};

export default withAuthUser<IndexPageProps>({
  whenUnauthedBeforeInit: AuthAction.SHOW_LOADER,
  LoaderComponent: FullPageLoader,
})(Index);

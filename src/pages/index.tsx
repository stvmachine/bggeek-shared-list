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
import { AuthAction, useAuthUser, withAuthUser } from "next-firebase-auth";
import FullPageLoader from "../components/FullPageLoader";

export async function getStaticProps() {
  const results: BggCollectionResponse = await getBggCollection({
    username: "stevmachine",
    own: 1,
    minbggrating: 7,
    subtype: "boardgame",
    excludesubtype: "boardgameexpansion",
    stats: 1,
  });

  const collectionData = {
    ...results.data,
    item: results.data.item.slice(0, 24),
  };

  return {
    props: {
      collectionData,
    },
  };
}

type IndexPageProps = {
  collectionData?: BggCollectionResponse;
  [prop: string]: any;
};

const Index: NextPage<IndexPageProps> = ({ collectionData }) => {
  const AuthUser = useAuthUser();
  return (
    <Container height="100vh">
      <Navbar user={AuthUser} signOut={AuthUser?.signOut} />
      <Main>
        <CTA />
        <Collection collectionData={collectionData || []} />
        <StatsCard />
      </Main>

      <Footer />
    </Container>
  );
};

export default withAuthUser({
  whenUnauthedBeforeInit: AuthAction.SHOW_LOADER,
  LoaderComponent: FullPageLoader,
})(Index);

import { NextPage } from "next";

import { Container } from "../components/Container";
import CTA from "../components/CTA";
import HotGames from "../components/HotGames";
import Footer from "../components/Layout/Footer";
import Main from "../components/Layout/Main";
import Navbar from "../components/Layout/Navbar";

export async function getStaticProps() {
  return {
    props: {},
  };
}

const Index: NextPage = () => {
  return (
    <>
      <Navbar />
      <Container height="100vh">
        <Main>
          <CTA />
          <HotGames />
        </Main>
        <Footer />
      </Container>
    </>
  );
};

export default Index;

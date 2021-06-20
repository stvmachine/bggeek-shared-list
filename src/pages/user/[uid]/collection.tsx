import React, { useMemo } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { NextPage } from "next";
import {
  Box,
  Container,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  Stack,
  useDisclosure,
} from "@chakra-ui/react";
import { useQueries } from "react-query";
import { AuthAction, useAuthUser, withAuthUser } from "next-firebase-auth";

import Footer from "../../../components/Layout/Footer";
import Navbar from "../../../components/Layout/Navbar";
import Results from "../../../components/Results";
import SearchSidebar from "../../../components/SearchSidebar";
import FullPageLoader from "../../../components/Layout/FullPageLoader";
import { ICollection } from "../../../utils/types";
import {
  fetchCollections,
  fetchCollection,
  mergeCollections,
} from "../../../api/fetchGroupCollection";

const MEMBERS = ["donutgamer", "Jagger84", "stevmachine"];

type CollectionPageProps = {
  initialData?: ICollection[];
};

export const getStaticPaths = async () => {
  return {
    paths: [], //indicates that no page needs be created at build time
    fallback: "blocking", //indicates the type of fallback
  };
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
  const AuthUser = useAuthUser();

  const results = useQueries(
    MEMBERS.map((member, index) => ({
      queryKey: ["collection", member],
      queryFn: () => fetchCollection(member),
      initialData:
        initialData && initialData[index] ? initialData[index] : null,
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

  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <FormProvider {...methods}>
      <Container height="100vh" maxWidth="100%">
        <Navbar
          user={AuthUser}
          signOut={AuthUser.signOut}
          openDrawer={onOpen}
          isOpenDrawer={isOpen}
        />

        <Box mt={12}>
          <Stack direction={["column", "row"]} alignItems="flex-start">
            <Box display={{ base: "none", md: "flex" }}>
              <SearchSidebar
                members={MEMBERS}
                collections={data?.collections || []}
              />
            </Box>

            <Results boardgames={data?.boardgames || []} />
          </Stack>
        </Box>
        <Footer />
      </Container>

      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">Filter</DrawerHeader>
          <DrawerBody>
            <SearchSidebar
              isOpenDrawer
              members={MEMBERS}
              collections={data?.collections || []}
            />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </FormProvider>
  );
};

export default withAuthUser({
  whenUnauthedBeforeInit: AuthAction.SHOW_LOADER,
  LoaderComponent: FullPageLoader,
})(Index);

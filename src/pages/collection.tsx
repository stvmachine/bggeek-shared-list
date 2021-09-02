import React, { useCallback, useMemo, useState } from "react";
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

import Footer from "../components/Layout/Footer";
import Navbar from "../components/Layout/Navbar";
import Results from "../components/Results";
import SearchSidebar from "../components/SearchSidebar";
import FullPageLoader from "../components/Layout/FullPageLoader";
import { ICollection } from "../utils/types";
import { fetchCollection, mergeCollections } from "../api/fetchGroupCollection";
import { getBggUser } from "bgg-xml-api-client";

type CollectionPageProps = {
  initialData?: ICollection[];
};

export async function getStaticProps() {
  return {
    props: {},
  };
}

const Index: NextPage<CollectionPageProps> = () => {
  const [members, setMembers] = useState<string[]>([
    "donutgamer",
    "Jagger84",
    "stevmachine",
  ]);

  const [hotSeatError, setHotSeatError] = useState<string>("");
  const addMember = useCallback(
    async (newMember) => {
      setHotSeatError("");
      if (!members.find((m) => m.toLowerCase() === newMember.toLowerCase())) {
        const user = await getBggUser({ name: newMember });
        if (user?.data?.id) {
          setMembers([...members, newMember]);
        }else{
          setHotSeatError("Username doesn't exist in BGGeek, please try again")
        }
      } else {
        setHotSeatError("Username already added to the list");
      }
    },
    [members, setMembers]
  );

  const AuthUser = useAuthUser();

  const results = useQueries(
    members.map((member) => ({
      queryKey: ["collection", member],
      queryFn: () => fetchCollection(member),
      refetchOnWindowFocus: false,
    }))
  );

  const isLoading = useMemo(
    () => results.reduce((acc, next) => next.isLoading || acc, false),
    [results]
  );

  const data = useMemo(
    () =>
      !isLoading
        ? mergeCollections(results.map((result: any) => result?.data))
        : undefined,
    [isLoading]
  );

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
            {!isLoading && data ? (
              <>
                <Box display={{ base: "none", md: "flex" }}>
                  <SearchSidebar
                    members={members}
                    addMember={addMember}
                    hotSeatError={hotSeatError}
                    collections={data.collections}
                  />
                </Box>

                <Results boardgames={data?.boardgames} />
              </>
            ) : (
              <div>loading</div>
            )}
          </Stack>
        </Box>
        <Footer />
      </Container>

      <Drawer
        placement="left"
        onClose={onClose}
        isOpen={isOpen}
        autoFocus={false}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">Filter</DrawerHeader>
          <DrawerBody>
            {data && (
              <SearchSidebar
                isOpenDrawer
                members={members}
                addMember={addMember}
                hotSeatError={hotSeatError}
                collections={data.collections}
              />
            )}
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

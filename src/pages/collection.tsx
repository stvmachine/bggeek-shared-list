import React, { useCallback, useMemo, useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { NextPage } from "next";
import { useRouter } from "next/router";
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

import Footer from "../components/Layout/Footer";
import Navbar from "../components/Layout/Navbar";
import Results from "../components/Results";
import SearchSidebar from "../components/SearchSidebar";
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
  const router = useRouter();
  const { usernames, username } = router.query;
  
  const [members, setMembers] = useState<string[]>([]);
  const [hotSeatError, setHotSeatError] = useState<string>("");

  // Initialize with usernames from query params
  useEffect(() => {
    if (usernames && typeof usernames === 'string') {
      // Handle comma-separated usernames
      const usernameList = usernames.split(',').map(u => u.trim()).filter(u => u);
      setMembers(usernameList);
    } else if (username && typeof username === 'string') {
      // Handle single username for backward compatibility
      setMembers([username]);
    }
  }, [usernames, username]);

  const addMember = useCallback(
    async (newMember: string) => {
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

export default Index;

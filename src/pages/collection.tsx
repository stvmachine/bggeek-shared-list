import React, { useCallback, useMemo, useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { NextPage } from "next";
import { useRouter } from "next/router";
import {
  Box,
  Button,
  Container,
  Drawer,
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
import { useUsernames } from "../hooks/useUsernames";
import { parseUsernamesFromUrl, generatePermalink, copyToClipboard } from "../utils/permalink";

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
  const { usernames: urlUsernames, username } = router.query;
  const { usernames, setUsernames } = useUsernames();
  
  const [members, setMembers] = useState<string[]>([]);
  const [hotSeatError, setHotSeatError] = useState<string>("");

  // Initialize with usernames from query params and sync with localStorage
  useEffect(() => {
    if (urlUsernames) {
      // Parse usernames from URL using utility function
      const usernameList = parseUsernamesFromUrl(urlUsernames);
      setMembers(usernameList);
      setUsernames(usernameList);
    } else if (username && typeof username === 'string') {
      // Handle single username for backward compatibility
      setMembers([username]);
      setUsernames([username]);
    } else if (usernames.length > 0) {
      // Use usernames from localStorage if no URL params
      setMembers(usernames);
    }
  }, [urlUsernames, username, usernames, setUsernames]);

  // Update URL when members change (for permalinks)
  useEffect(() => {
    if (members.length > 0) {
      const permalink = generatePermalink(members);
      // Update URL without triggering a page reload
      window.history.replaceState({}, '', permalink);
    }
  }, [members]);

  const addMember = useCallback(
    async (newMember: string) => {
      setHotSeatError("");
      if (!members.find((m) => m.toLowerCase() === newMember.toLowerCase())) {
        const user = await getBggUser({ name: newMember });
        if (user?.data?.id) {
          const newMembers = [...members, newMember];
          setMembers(newMembers);
          setUsernames(newMembers);
        }else{
          setHotSeatError("Username doesn't exist in BGGeek, please try again")
        }
      } else {
        setHotSeatError("Username already added to the list");
      }
    },
    [members, setMembers, setUsernames]
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

  const { open: isOpen, onOpen, onClose } = useDisclosure();

  const handleShare = async () => {
    if (members.length === 0) return;
    
    const permalink = generatePermalink(members);
    const fullUrl = `${window.location.origin}${permalink}`;
    
    const success = await copyToClipboard(fullUrl);
    
    if (success) {
      alert("Link copied! Share this link with your friends to show your collection.");
    } else {
      alert("Copy failed. Please copy the URL manually from the address bar.");
    }
  };

  return (
    <FormProvider {...methods}>
      <Container height="100vh" maxWidth="100%">
        <Navbar
          openDrawer={onOpen}
          isOpenDrawer={isOpen}
        />

        <Box mt={12}>
          {/* Share Button */}
          {members.length > 0 && (
            <Box mb={4} textAlign="center">
              <Button
                onClick={handleShare}
                colorPalette="blue"
                size="sm"
                variant="outline"
              >
                📤 Share Collection
              </Button>
            </Box>
          )}

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

      <Drawer.Root
        placement="start"
        onClose={onClose}
        open={isOpen}
        autoFocus={false}
      >
        <Drawer.Backdrop />
        <Drawer.Positioner>
          <Drawer.Content>
            <Drawer.Header borderBottomWidth="1px">Filter</Drawer.Header>
            <Drawer.Body>
              {data && (
                <SearchSidebar
                  isOpenDrawer
                  members={members}
                  addMember={addMember}
                  hotSeatError={hotSeatError}
                  collections={data.collections}
                />
              )}
            </Drawer.Body>
          </Drawer.Content>
        </Drawer.Positioner>
      </Drawer.Root>
    </FormProvider>
  );
};

export default Index;

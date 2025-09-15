import React, { useCallback, useMemo, useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { NextPage } from "next";
import { useRouter } from "next/router";
import {
  Box,
  Button,
  Container,
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
import {
  parseUsernamesFromUrl,
  generatePermalink,
  copyToClipboard,
} from "../utils/permalink";
import { MemberProvider } from "../contexts/MemberContext";

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

  const [members, setMembers] = useState<string[]>([]);
  const [hotSeatError, setHotSeatError] = useState<string>("");

  // Initialize with usernames from query params
  useEffect(() => {
    if (urlUsernames) {
      // Parse usernames from URL using utility function
      const usernameList = parseUsernamesFromUrl(urlUsernames);
      setMembers(usernameList);
    } else if (username && typeof username === "string") {
      // Handle single username for backward compatibility
      setMembers([username]);
    }
  }, [urlUsernames, username]);

  // Update URL when members change (for permalinks)
  useEffect(() => {
    if (members.length > 0) {
      const permalink = generatePermalink(members);
      // Update URL without triggering a page reload
      window.history.replaceState({}, "", permalink);
    } else {
      // If no members, redirect to home page
      window.history.replaceState({}, "", "/");
    }
  }, [members]);

  const addMember = useCallback(
    async (newMember: string) => {
      setHotSeatError("");
      if (!members.find((m) => m.toLowerCase() === newMember.toLowerCase())) {
        try {
          const user = await getBggUser({ name: newMember });
          if (user?.data?.id) {
            const newMembers = [...members, newMember];
            setMembers(newMembers);
          } else {
            setHotSeatError(
              "Username doesn't exist in BGGeek, please try again"
            );
          }
        } catch (error) {
          setHotSeatError("Error validating username, please try again");
        }
      } else {
        setHotSeatError("Username already added to the list");
      }
    },
    [members]
  );

  const removeMember = useCallback(
    (memberToRemove: string) => {
      const newMembers = members.filter(member => member !== memberToRemove);
      setMembers(newMembers);
    },
    [members]
  );

  const removeAllMembers = useCallback(() => {
    setMembers([]);
  }, []);

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
    [isLoading, results]
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
      alert(
        "Link copied! Share this link with your friends to show your collection."
      );
    } else {
      alert("Copy failed. Please copy the URL manually from the address bar.");
    }
  };

  return (
    <MemberProvider usernames={members}>
      <FormProvider {...methods}>
        <Container height="100vh" maxWidth="100%">
          <Navbar openDrawer={onOpen} isOpenDrawer={isOpen} />

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
                      removeMember={removeMember}
                      removeAllMembers={removeAllMembers}
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

        {isOpen && (
          <Box
            position="fixed"
            top={0}
            left={0}
            right={0}
            bottom={0}
            zIndex={1000}
            bg="blackAlpha.600"
            onClick={onClose}
          >
            <Box
              position="absolute"
              top={0}
              left={0}
              bottom={0}
              width="300px"
              bg="white"
              shadow="lg"
              p={4}
              onClick={(e) => e.stopPropagation()}
            >
              <Box fontSize="lg" fontWeight="bold" mb={4} borderBottom="1px" borderColor="gray.200" pb={2}>
                Filter
              </Box>
              {data && (
                <SearchSidebar
                  isOpenDrawer
                  members={members}
                  addMember={addMember}
                  removeMember={removeMember}
                  removeAllMembers={removeAllMembers}
                  hotSeatError={hotSeatError}
                  collections={data.collections}
                />
              )}
            </Box>
          </Box>
        )}
      </FormProvider>
    </MemberProvider>
  );
};

export default Index;

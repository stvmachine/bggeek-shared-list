import {
  Box,
  Container,
  Text,
  useDisclosure,
  useMediaQuery,
} from "@chakra-ui/react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { FiShare2 } from "react-icons/fi";
import { useQueries } from "react-query";

import { mergeCollectionsGraphQL } from "../api/fetchGroupCollection";
import ImprovedSearchSidebar from "../components/ImprovedSearchSidebar";
import Footer from "../components/Layout/Footer";
import Navbar from "../components/Layout/Navbar";
import Results from "../components/Results";
import { MemberProvider } from "../contexts/MemberContext";
import {
  copyToClipboard,
  generatePermalink,
  parseUsernamesFromUrl,
} from "../utils/permalink";
import { ICollection } from "../utils/types";

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
  const { open, onOpen, onClose } = useDisclosure({ defaultOpen: false });
  const [isMobile] = useMediaQuery(["(max-width: 48em)"]);
  const isHomepage = router.pathname === "/";
  const showFAB = isMobile && !isHomepage;

  const [members, setMembers] = useState<string[]>([]);
  const [pendingUsernames, setPendingUsernames] = useState<string[]>([]);
  const [isValidating, setIsValidating] = useState(false);

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
      // If no members, clear query parameters but stay on collection page
      window.history.replaceState({}, "", "/collection");
    }
  }, [members]);

  const handleSearch = useCallback((usernames: string[]) => {
    // This is called when usernames are submitted for validation
    // Set them as pending and start validation state
    setPendingUsernames(usernames);
    setIsValidating(true);
    console.log(
      "UsernameManager submitted usernames for validation:",
      usernames
    );
  }, []);

  const handleValidatedUsernames = useCallback(
    (validatedUsernames: string[]) => {
      // This is called when usernames are successfully validated
      const validNewMembers = validatedUsernames.filter(
        member =>
          member.trim() &&
          !members.find(m => m.toLowerCase() === member.toLowerCase())
      );

      if (validNewMembers.length > 0) {
        setMembers(prev => [...prev, ...validNewMembers]);
      }

      // Clear pending state and stop validation
      setPendingUsernames([]);
      setIsValidating(false);
    },
    [members]
  );

  const handleValidationError = useCallback(() => {
    // This is called when validation fails
    // Clear pending state and stop validation
    setPendingUsernames([]);
    setIsValidating(false);
  }, []);

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
    members.map(member => ({
      queryKey: ["collection", member],
      queryFn: async () => {
        const response = await fetch(
          `/api/collection-graphql?username=${encodeURIComponent(member)}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      },
      refetchOnWindowFocus: false,
    }))
  );

  const rawData = useMemo(() => {
    const isLoading = results.reduce(
      (acc, next) => next.isLoading || acc,
      false
    );
    if (isLoading) return undefined;

    const dataArray = results
      .map((result: any) => result?.data)
      .filter(Boolean);

    if (dataArray.length === 0) return undefined;

    const merged = mergeCollectionsGraphQL(dataArray, members);
    return merged;
  }, [results, members]);

  const isLoading = useMemo(
    () => results.reduce((acc, next) => next.isLoading || acc, false),
    [results]
  );

  // Use rawData directly as data
  const data = rawData;

  const defaultValues = useMemo(
    () => ({
      keyword: "",
      numberOfPlayers: "",
      playingTime: "",
      orderBy: "name_asc",
      groupBy: "none",
      members: members.reduce(
        (accum, member) => ({ ...accum, [member]: true }),
        {}
      ),
    }),
    [JSON.stringify(members)] // Use stringified members to prevent unnecessary recalculations
  );

  const methods = useForm({ defaultValues });

  // Reset form when members change
  const membersString = JSON.stringify(members);
  useEffect(() => {
    methods.reset(defaultValues);
  }, [membersString, methods, defaultValues]);

  const sidebarWidth = "300px";

  return (
    <MemberProvider usernames={members}>
      <FormProvider {...methods}>
        <Box minH="100vh" display="flex" flexDirection="column">
          <Navbar onMobileMenuOpen={onOpen} />
          <Container
            maxW="container.xl"
            flex="1"
            py={8}
            px={{ base: 0, md: 4 }}
          >
            <Box position="relative">
              {!isLoading ? (
                <>
                  {/* Desktop Sidebar */}
                  <Box
                    display={{ base: "none", md: "flex" }}
                    position="fixed"
                    width={sidebarWidth}
                    flexShrink={0}
                    pr={4}
                    height="calc(100vh - 180px)"
                    flexDirection="column"
                    css={{
                      "&": {
                        msOverflowStyle: "none",
                        scrollbarWidth: "none",
                        "&::-webkit-scrollbar": {
                          display: "none",
                        },
                      },
                    }}
                  >
                    <ImprovedSearchSidebar
                      members={members}
                      onSearch={handleSearch}
                      onValidatedUsernames={handleValidatedUsernames}
                      onValidationError={handleValidationError}
                      removeMember={removeMember}
                      removeAllMembers={removeAllMembers}
                      collections={data?.collections || []}
                      isValidating={isValidating}
                      pendingUsernames={pendingUsernames}
                    />
                  </Box>

                  {/* Mobile Sidebar */}
                  <Box display={{ base: "block", md: "none" }}>
                    <ImprovedSearchSidebar
                      members={members}
                      onSearch={handleSearch}
                      onValidatedUsernames={handleValidatedUsernames}
                      onValidationError={handleValidationError}
                      removeMember={removeMember}
                      removeAllMembers={removeAllMembers}
                      collections={data?.collections || []}
                      isValidating={isValidating}
                      pendingUsernames={pendingUsernames}
                      isMobileDrawerOpen={open}
                      onMobileDrawerToggle={onClose}
                    />
                  </Box>

                  {/* Main Content */}
                  <Box
                    ml={{ base: 0, md: sidebarWidth }}
                    pl={{ base: 4, md: 8 }}
                    pr={{ base: 4, md: 0 }}
                    width={{ base: "100%", md: `calc(100% - ${sidebarWidth})` }}
                  >
                    {data && members.length > 0 ? (
                      <Results boardgames={data.boardgames} />
                    ) : members.length === 0 ? (
                      <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        minH="400px"
                        textAlign="center"
                      >
                        <Box>
                          <Text fontSize="xl" color="gray.600" mb={4}>
                            No collectors selected
                          </Text>
                          <Text fontSize="md" color="gray.500">
                            Add some BoardGameGeek usernames to see their
                            collections
                          </Text>
                        </Box>
                      </Box>
                    ) : (
                      <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        minH="400px"
                      >
                        <Text fontSize="lg" color="gray.500">
                          Loading collections...
                        </Text>
                      </Box>
                    )}
                  </Box>
                </>
              ) : (
                <Box
                  flex="1"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  minH="400px"
                >
                  <Text fontSize="lg" color="gray.500">
                    Loading collections...
                  </Text>
                </Box>
              )}
            </Box>
          </Container>
          <Footer />

          {/* Mobile Share Button */}
          {showFAB && (
            <Box
              position="fixed"
              bottom="6"
              right="6"
              zIndex={1400}
              display={{ base: "block", md: "none" }}
            >
              <Box
                as="button"
                onClick={async () => {
                  const url = window.location.href;

                  try {
                    // Check if native share API is available and user is on mobile
                    if (isMobile && navigator.share) {
                      await navigator.share({
                        title: "My Board Game Collection",
                        text: "Check out my board game collection!",
                        url: url,
                      });
                    } else {
                      // Fallback to clipboard for desktop or browsers without share API
                      const success = await copyToClipboard(url);
                      if (success) {
                        console.log("Link copied to clipboard!");
                        alert("Link copied to clipboard!");
                      } else {
                        throw new Error("Clipboard copy failed");
                      }
                    }
                  } catch (err) {
                    console.error("Failed to share:", err);

                    // If share fails, try clipboard as fallback
                    try {
                      const success = await copyToClipboard(url);
                      if (success) {
                        alert("Link copied to clipboard!");
                      } else {
                        throw new Error("Clipboard fallback failed");
                      }
                    } catch (clipboardErr) {
                      console.error("Clipboard also failed:", clipboardErr);
                      alert(
                        "Failed to share. Please copy the URL manually: " + url
                      );
                    }
                  }
                }}
                aria-label="Share collection"
                bg="blue.500"
                color="white"
                width="56px"
                height="56px"
                borderRadius="full"
                display="flex"
                alignItems="center"
                justifyContent="center"
                boxShadow="0 4px 12px rgba(0, 0, 0, 0.15)"
                _hover={{
                  bg: "blue.600",
                  transform: "scale(1.05)",
                  transition: "all 0.2s",
                }}
                _active={{
                  bg: "blue.700",
                  transform: "scale(0.95)",
                }}
              >
                <FiShare2 size="24px" />
              </Box>
            </Box>
          )}
        </Box>
      </FormProvider>
    </MemberProvider>
  );
};

export default Index;

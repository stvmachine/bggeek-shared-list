import { Box, Container, Text } from "@chakra-ui/react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import ImprovedSearchSidebar from "../components/ImprovedSearchSidebar";
import Footer from "../components/Layout/Footer";
import Navbar from "../components/Layout/Navbar";
import Results from "../components/Results";
import { useMultiUserCollections } from "../hooks/useMultiUserCollections";
import { apolloClient } from "../lib/graphql/client";
import { GetUserCollectionQuery } from "../lib/graphql/generated/types";
import { GET_USER } from "../lib/graphql/queries";
import { generatePermalink, parseUsernamesFromUrl } from "../utils/permalink";

type CollectionPageProps = {
  initialData?: GetUserCollectionQuery["userCollection"][];
};

export async function getStaticProps() {
  return {
    props: {},
  };
}

const Index: NextPage<CollectionPageProps> = () => {
  const router = useRouter();
  const { usernames: urlUsernames, username } = router.query;

  // Simple state management
  const [usernames, setUsernames] = useState<string[]>([]);

  // Parse initial usernames from URL
  const initialUsernames = useMemo(() => {
    if (urlUsernames) {
      return parseUsernamesFromUrl(urlUsernames);
    } else if (username && typeof username === "string") {
      return [username];
    }
    return [];
  }, [urlUsernames, username]);

  // Initialize usernames from URL
  useEffect(() => {
    if (initialUsernames.length > 0) {
      setUsernames(initialUsernames);
    }
  }, [initialUsernames]);

  // Use the multi-user collections hook
  const {
    isLoading,
    errors,
    validUsers,
    invalidUsers,
    allBoardgames,
    allCollections,
    totalUsers,
    validUserCount,
  } = useMultiUserCollections({ usernames });

  // Transform collections to match expected format
  const transformedCollections = useMemo(() => {
    return allCollections.map(collection => ({
      totalitems: (collection as any)?.totalItems || 0,
      pubdate: (collection as any)?.pubDate || new Date().toISOString(),
    }));
  }, [allCollections]);

  // Add username with validation and toast notifications
  const addUsername = useCallback(
    (username: string) => {
      if (!username.trim()) return;

      const trimmedUsername = username.trim();
      if (usernames.includes(trimmedUsername)) {
        console.log(`Username ${trimmedUsername} is already in the list`);
        return;
      }

      return toast.promise(
        async () => {
          const result = await apolloClient.query({
            query: GET_USER,
            variables: { username: trimmedUsername },
            errorPolicy: "all",
          });

          // Check if there are GraphQL errors or if user doesn't exist
          if (result.error) {
            throw new Error(`User ${trimmedUsername} not found on BoardGameGeek`);
          }

          if (!result.data || !(result.data as any).user) {
            throw new Error(`User ${trimmedUsername} not found on BoardGameGeek`);
          }

          // If validation passes, add the username
          setUsernames(prev => [...prev, trimmedUsername]);
        },
        {
          loading: "Validating username...",
          success: <b>Username added successfully!</b>,
          error: err => (
            <b>{err?.message || "Username not found on BoardGameGeek"}</b>
          ),
        }
      );
    },
    [usernames]
  );

  // Remove username
  const removeUsername = useCallback((usernameToRemove: string) => {
    setUsernames(prev => prev.filter(u => u !== usernameToRemove));
  }, []);

  // Remove all usernames
  const removeAllUsernames = useCallback(() => {
    setUsernames([]);
  }, []);

  // Update URL when usernames change
  useEffect(() => {
    if (usernames.length > 0) {
      const permalink = generatePermalink(usernames);
      window.history.replaceState({}, "", permalink);
    } else {
      window.history.replaceState({}, "", "/collection");
    }
  }, [usernames]);

  const defaultValues = useMemo(
    () => ({
      keyword: "",
      numberOfPlayers: "",
      playingTime: "",
      orderBy: "name_asc",
      groupBy: "none",
      members: usernames.reduce(
        (accum, username) => ({ ...accum, [username]: true }),
        {}
      ),
    }),
    [usernames]
  );

  const methods = useForm({ defaultValues });

  // Reset form when usernames change
  useEffect(() => {
    methods.setValue(
      "members",
      usernames.reduce(
        (accum, username) => ({ ...accum, [username]: true }),
        {}
      )
    );
  }, [usernames, methods]);

  const sidebarWidth = "300px";

  return (
    <FormProvider {...methods}>
      <Box minH="100vh" display="flex" flexDirection="column">
        <Navbar />
        <Container maxW="container.xl" flex="1" py={8} px={{ base: 0, md: 4 }}>
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
                    members={usernames}
                    handleSubmit={addUsername}
                    onValidatedUsernames={() => {}}
                    onValidationError={() => {}}
                    removeMember={removeUsername}
                    removeAllMembers={removeAllUsernames}
                    collections={transformedCollections}
                    isValidating={isLoading}
                    pendingUsernames={[]}
                    validUsers={validUsers}
                    invalidUsers={invalidUsers}
                    totalUsers={totalUsers}
                    validUserCount={validUserCount}
                  />
                </Box>

                {/* Mobile Sidebar */}
                <Box display={{ base: "block", md: "none" }}>
                  <ImprovedSearchSidebar
                    members={usernames}
                    handleSubmit={addUsername}
                    onValidatedUsernames={() => {}}
                    onValidationError={() => {}}
                    removeMember={removeUsername}
                    removeAllMembers={removeAllUsernames}
                    collections={transformedCollections}
                    isValidating={isLoading}
                    pendingUsernames={[]}
                    validUsers={validUsers}
                    invalidUsers={invalidUsers}
                    totalUsers={totalUsers}
                    validUserCount={validUserCount}
                  />
                </Box>

                {/* Main Content */}
                <Box
                  ml={{ base: 0, md: sidebarWidth }}
                  pl={{ base: 4, md: 8 }}
                  pr={{ base: 4, md: 0 }}
                  width={{ base: "100%", md: `calc(100% - ${sidebarWidth})` }}
                >
                  {/* Show validation errors */}
                  {errors.length > 0 && (
                    <Box
                      mb={4}
                      p={3}
                      bg="red.50"
                      borderRadius="md"
                      border="1px solid"
                      borderColor="red.200"
                    >
                      <Text fontSize="sm" color="red.600" fontWeight="medium">
                        Validation Errors:
                      </Text>
                      {errors.map((error, index) => (
                        <Text key={index} fontSize="xs" color="red.500" mt={1}>
                          {error?.message || "Unknown error"}
                        </Text>
                      ))}
                    </Box>
                  )}

                  {/* Show invalid users */}
                  {invalidUsers.length > 0 && (
                    <Box
                      mb={4}
                      p={3}
                      bg="yellow.50"
                      borderRadius="md"
                      border="1px solid"
                      borderColor="yellow.200"
                    >
                      <Text
                        fontSize="sm"
                        color="yellow.600"
                        fontWeight="medium"
                      >
                        Invalid Users: {invalidUsers.join(", ")}
                      </Text>
                    </Box>
                  )}

                  {allBoardgames && allBoardgames.length > 0 ? (
                    <Results boardgames={allBoardgames} />
                  ) : usernames.length === 0 ? (
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
                        {isLoading
                          ? `Loading collections... (${validUserCount}/${totalUsers} users)`
                          : `No games found for ${totalUsers} user${totalUsers !== 1 ? "s" : ""}`}
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
      </Box>
    </FormProvider>
  );
};

export default Index;

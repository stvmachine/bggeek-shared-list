import {
  Box,
  Button,
  Container,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useQueries } from "react-query";

import { mergeCollections } from "../api/fetchGroupCollection";
import Footer from "../components/Layout/Footer";
import Navbar from "../components/Layout/Navbar";
import MobileDrawer from "../components/MobileDrawer";
import Results from "../components/Results";
import SearchSidebar from "../components/SearchSidebar";
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
  const {
    open: isMobileMenuOpen,
    onOpen: onMobileMenuOpen,
    onClose: onMobileMenuClose,
  } = useDisclosure();

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
      // If no members, redirect to home page
      window.history.replaceState({}, "", "/");
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
        (member) =>
          member.trim() &&
          !members.find((m) => m.toLowerCase() === member.toLowerCase())
      );

      if (validNewMembers.length > 0) {
        setMembers((prev) => [...prev, ...validNewMembers]);
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
      const newMembers = members.filter((member) => member !== memberToRemove);
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
      queryFn: async () => {
        const response = await fetch(
          `/api/collection?username=${encodeURIComponent(member)}`
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

    const merged = mergeCollections(dataArray, members);
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
      orderBy: "name_asc",
      groupBy: "none",
      members: members.reduce(
        (accum, member) => ({ ...accum, [member]: true }),
        {}
      ),
    }),
    [members]
  );
  const methods = useForm({ defaultValues });

  // Reset form when members change
  useEffect(() => {
    methods.reset(defaultValues);
  }, [members, methods, defaultValues]);

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
        <Navbar
          openDrawer={onOpen}
          isOpenDrawer={isOpen}
          onMobileMenuOpen={onMobileMenuOpen}
          onMobileMenuClose={onMobileMenuClose}
          isMobileMenuOpen={isMobileMenuOpen}
        />
        <Container height="100vh" maxWidth="100%">
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

            <Stack
              direction={["column", "row"]}
              alignItems="flex-start"
              gap={6}
            >
              {!isLoading && data ? (
                <>
                  <Box
                    display={{ base: "none", md: "flex" }}
                    position="sticky"
                    top="20px"
                    alignSelf="flex-start"
                  >
                    <SearchSidebar
                      members={members}
                      onSearch={handleSearch}
                      onValidatedUsernames={handleValidatedUsernames}
                      onValidationError={handleValidationError}
                      removeMember={removeMember}
                      removeAllMembers={removeAllMembers}
                      collections={data.collections}
                      isValidating={isValidating}
                      pendingUsernames={pendingUsernames}
                    />
                  </Box>

                  <Box flex="1" minWidth={0}>
                    <Results boardgames={data?.boardgames} />
                  </Box>
                </>
              ) : (
                <Box
                  flex="1"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  minHeight="400px"
                >
                  <Text fontSize="lg" color="gray.500">
                    Loading collections...
                  </Text>
                </Box>
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
              <Box
                fontSize="lg"
                fontWeight="bold"
                mb={4}
                borderBottom="1px"
                borderColor="gray.200"
                pb={2}
              >
                Filter
              </Box>
              {data && (
                <SearchSidebar
                  isOpenDrawer
                  members={members}
                  onSearch={handleSearch}
                  onValidatedUsernames={handleValidatedUsernames}
                  onValidationError={handleValidationError}
                  removeMember={removeMember}
                  removeAllMembers={removeAllMembers}
                  collections={data.collections}
                  isValidating={isValidating}
                  pendingUsernames={pendingUsernames}
                />
              )}
            </Box>
          </Box>
        )}

        {/* Mobile Drawer */}
        {!isLoading && data && (
          <MobileDrawer
            isOpen={isMobileMenuOpen}
            onClose={onMobileMenuClose}
            members={members}
            collections={data.collections}
            onSearch={handleSearch}
            onValidatedUsernames={handleValidatedUsernames}
            onValidationError={handleValidationError}
            removeMember={removeMember}
            removeAllMembers={removeAllMembers}
            isValidating={isValidating}
            pendingUsernames={pendingUsernames}
          />
        )}
      </FormProvider>
    </MemberProvider>
  );
};

export default Index;

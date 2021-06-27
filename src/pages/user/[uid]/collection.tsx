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
import {
  AuthAction,
  useAuthUser,
  withAuthUser,
  withAuthUserTokenSSR,
} from "next-firebase-auth";

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
import { getUser } from "../../../api/getUser";

type CollectionPageProps = {
  initialData?: ICollection[];
  members: string[];
};

const CollectionPage: NextPage<CollectionPageProps> = ({
  initialData,
  members,
}) => {
  const AuthUser = useAuthUser();

  const results = useQueries(
    members.map((member, index) => ({
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
            <Box display={{ base: "none", md: "flex" }}>
              <SearchSidebar
                members={members}
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
              members={members}
              collections={data?.collections || []}
            />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </FormProvider>
  );
};

export const getServerSideProps = withAuthUserTokenSSR()(async ({ params }) => {
  const { uid } = params!;
  const user = await getUser(String(uid));

  if (user.id === uid) {
    const initialData = await fetchCollections([user.bggUsername]);

    return {
      props: {
        initialData,
        members: [user.bggUsername],
      },
    };
  } else {
    return { props: {} };
  }
});

export default withAuthUser<CollectionPageProps>({
  whenUnauthedBeforeInit: AuthAction.SHOW_LOADER,
  LoaderComponent: FullPageLoader,
})(CollectionPage);

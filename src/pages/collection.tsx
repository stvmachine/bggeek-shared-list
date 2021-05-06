import React from "react";
import { NextPage } from "next";
import {
  Stack,
  Wrap,
  WrapItem,
  Image,
  Container,
  Heading,
  Text,
  UnorderedList,
  ListItem,
  LinkBox,
  LinkOverlay,
  Select,
  InputLeftElement,
  InputGroup,
  Input,
} from "@chakra-ui/react";

import { SearchIcon } from "@chakra-ui/icons";

import { getBggCollection, BggCollectionResponse } from "bgg-xml-api-client";

import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { ItemType } from "../utils/types";

const fetchGroupCollection = async (usernames: string[]) => {
  const collectionGroup = await Promise.all(
    usernames.map(async (username) => {
      const collectionResponse = await getBggCollection({
        own: 1,
        subtype: "boardgame",
        stats: 1,
        username,
      });
      return {
        ...collectionResponse.data,
        item: collectionResponse.data.item,
      };
    })
  );

  return collectionGroup;
};

type CollectionPageProps = {
  collectionGroupData: {
    item: ItemType[];
    totalitems: number;
  };
  members: string[];
};

export async function getStaticProps() {
  const members = ["stevmachine", "donutgamer", "Jagger84"];
  const rawData = await fetchGroupCollection(members);

  const items = rawData.reduce(
    (accum: any[], collection: BggCollectionResponse) => {
      return [...accum, ...collection.item]
        .map((item) => ({
          objectid: item.objectid,
          thumbnail: item.thumbnail,
          name: { ...item.name },
        }))

        .filter(
          (item, index, self) =>
            self.findIndex((i) => i.objectid == item.objectid) == index
        )
        .sort((a, b) => (a.name.text > b.name.text ? 1 : -1));
    },
    []
  );

  return {
    props: {
      collectionGroupData: {
        item: items,
        totalitems: items.length,
      },
      members,
    },
  };
}

const COLLECTION_STATUS = [
  "fortrade",
  "own",
  "preordered",
  "prevowned",
  "want",
  "wanttobuy",
  "wanttoplay",
  "wishlist",
];

const numberOfPlayersOptions = [
  { value: 1, name: 1 },
  { value: 2, name: 2 },
  { value: 3, name: 3 },
  { value: 4, name: 4 },
  { value: 5, name: 5 },
  { value: 6, name: 6 },
  { value: 7, name: 7 },
  { value: 8, name: 8 },
  { value: 9, name: 9 },
  { value: 10, name: 10 },
];

const playingTimeOptions = [
  { value: 1, name: "< 30 min" },
  { value: 2, name: "30min - 1h" },
  { value: 3, name: "1-2h" },
  { value: 4, name: "2-3h" },
  { value: 5, name: "3-4h" },
  { value: 6, name: ">4h" },
];

const Index: NextPage<CollectionPageProps> = ({
  members,
  collectionGroupData,
}) => {
  return (
    <Container height="100vh" maxWidth="100%">
      <Navbar />

      <InputGroup width="xs">
        <InputLeftElement
          pointerEvents="none"
          children={<SearchIcon color="gray.300" />}
        />
        <Input placeholder="Search" />
      </InputGroup>

      <Wrap>
        <Select placeholder="Number of players" width="xxs">
          {numberOfPlayersOptions &&
            numberOfPlayersOptions.map((item) => (
              <option
                value={item.value}
                key={`number_of_players_${item.value}`}
              >
                {item.name}
              </option>
            ))}
        </Select>

        <Select placeholder="Playing time" width="xxs">
          {playingTimeOptions &&
            playingTimeOptions.map((item) => (
              <option
                value={item.value}
                key={`playing_time_${item.value}`}
              >
                {item.name}
              </option>
            ))}
        </Select>
      </Wrap>

      <Container mt={10} maxWidth="80%">
        {members && (
          <Heading fontSize={"3xl"} mb={10}>
            Displaying {collectionGroupData.totalitems} games owned for the
            following members:
            <UnorderedList>
              {members.map((member, index) => (
                <ListItem key={`${member}_${index}`}>
                  <LinkBox>
                    <LinkOverlay
                      href={`https://boardgamegeek.com/user/${member}`}
                      isExternal
                    >
                      <Text color="tomato">{member}</Text>
                    </LinkOverlay>
                  </LinkBox>
                </ListItem>
              ))}
            </UnorderedList>
          </Heading>
        )}
        <Wrap>
          {collectionGroupData.totalitems > 0 &&
            collectionGroupData.item.map(
              ({ thumbnail, objectid }: ItemType, index) => (
                <WrapItem key={`${objectid}_${index}`}>
                  <LinkBox>
                    <LinkOverlay
                      href={`https://boardgamegeek.com/boardgame/${objectid}`}
                      isExternal
                    >
                      <Image
                        boxSize="180px"
                        objectFit="contain"
                        src={thumbnail}
                      />
                    </LinkOverlay>
                  </LinkBox>
                </WrapItem>
              )
            )}
        </Wrap>
      </Container>

      <Footer />
    </Container>
  );
};

export default Index;

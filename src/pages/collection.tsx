import React from "react";
import { useFuzzy } from "react-use-fuzzy";
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
  boardgames: ItemType[];
  members: string[];
};

export async function getStaticProps() {
  const members = ["stevmachine", "donutgamer", "Jagger84"];
  const rawData = await fetchGroupCollection(members);

  const items = rawData.reduce(
    (accum: any[], collection: BggCollectionResponse) => {
      return [...accum, ...collection.item]
        .map((item) => ({
          yearpublished: item.yearpublished,
          stats: item.stats,
          subtype: item.subtype,
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
      boardgames: items,
      members,
    },
  };
}

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
  { value: 1, name: "<= 30min" },
  { value: 2, name: "30min-1h" },
  { value: 3, name: "1h-2h" },
  { value: 4, name: "2h-3h" },
  { value: 5, name: "3h-4h" },
  { value: 6, name: "> 4h" },
];

const Index: NextPage<CollectionPageProps> = ({ members, boardgames }) => {
  const { result, keyword, search } = useFuzzy<ItemType>(boardgames, {
    keys: ["name.text", "yearpublished"],
  });

  const [numberOfPlayers, setNumberOfPlayers] = React.useState<number>(0);
  const [playingTime, setPlayingTime] = React.useState<number>(0);

  const filteredByNumPlayers = numberOfPlayers
    ? result.filter(
        (bg: ItemType) =>
          bg.stats.maxplayers >= numberOfPlayers &&
          bg.stats.minplayers <= numberOfPlayers
      )
    : result;

  const filteredBoardgames = playingTime
    ? filteredByNumPlayers.filter((bg: ItemType) => {
        if (playingTime == 1 && bg.stats.maxplaytime <= 30) {
          return true;
        }
        if (
          playingTime == 2 &&
          bg.stats.maxplaytime > 30 &&
          bg.stats.maxplaytime <= 60
        ) {
          return true;
        }
        if (
          playingTime == 3 &&
          bg.stats.maxplaytime > 60 &&
          bg.stats.maxplaytime <= 60 * 2
        ) {
          return true;
        }
        if (
          playingTime == 4 &&
          bg.stats.maxplaytime > 60 * 2 &&
          bg.stats.maxplaytime <= 60 * 3
        ) {
          return true;
        }
        if (
          playingTime == 5 &&
          bg.stats.maxplaytime > 60 * 3 &&
          bg.stats.maxplaytime <= 60 * 4
        ) {
          return true;
        }
        if (playingTime == 6 && bg.stats.maxplaytime > 60 * 4) {
          return true;
        }
        return false;
      })
    : filteredByNumPlayers;

  return (
    <Container height="100vh" maxWidth="100%">
      <Navbar />

      <InputGroup width="xs">
        <InputLeftElement
          pointerEvents="none"
          children={<SearchIcon color="gray.300" />}
        />
        <Input
          placeholder="Search"
          value={keyword}
          onChange={(e) => search(e.target.value)}
        />
      </InputGroup>

      <Wrap>
        <Select
          id="number_of_players_select"
          placeholder="Number of players"
          onChange={(e) => {
            setNumberOfPlayers(Number(e.target.value));
          }}
          value={numberOfPlayers}
          width="xxs"
        >
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

        <Select
          placeholder="Playing time"
          onChange={(e) => {
            setPlayingTime(Number(e.target.value));
          }}
          value={playingTime}
          width="xxs"
        >
          {playingTimeOptions &&
            playingTimeOptions.map((item) => (
              <option value={item.value} key={`playing_time_${item.value}`}>
                {item.name}
              </option>
            ))}
        </Select>
      </Wrap>

      <Container mt={10} maxWidth="80%">
        {members && (
          <Heading fontSize={"3xl"} mb={10}>
            Displaying {filteredBoardgames.length} games owned for the following
            members:
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
          {filteredBoardgames.length > 0 &&
            filteredBoardgames.map(
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

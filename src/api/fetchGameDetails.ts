import { getBggThing, BggThingParams, BggThingResponse, BggThingLink } from "bgg-xml-api-client";

export type BggLink = BggThingLink;

export interface DetailedGame {
  id: string;
  name: string;
  description: string;
  yearpublished: string;
  minplayers: number;
  maxplayers: number;
  playingtime: number;
  minage: number;
  thumbnail?: string;
  image?: string;
  links?: BggLink[];
  categories?: BggLink[];
  mechanics?: BggLink[];
  families?: BggLink[];
  publishers?: BggLink[];
  artists?: BggLink[];
  designers?: BggLink[];
  compilations?: BggLink[];
}

export const fetchGameDetails = async (
  gameIds: string[]
): Promise<DetailedGame[]> => {
  if (gameIds.length === 0) return [];

  const params: BggThingParams = {
    id: gameIds.join(","),
    stats: 1,
  };

  const response: BggThingResponse = await getBggThing(params, {
    maxRetries: 10,
    retryInterval: 10000,
  });

  const items = Array.isArray(response?.item) ? response.item : response?.item ? [response.item] : [];

  return items.map((item: any) => {
    const links = item.link || [];
    const linkMap = links.reduce((acc: any, link: any) => {
      const type = link.type;
      if (!acc[type]) {
        acc[type] = [];
      }
      acc[type].push({
        type: link.type,
        id: link.id,
        value: link.value,
      });
      return acc;
    }, {});

    return {
      id: item.id,
      name: Array.isArray(item.name) 
        ? item.name.find((n: any) => n.type === "primary")?.value || item.name[0]?.value
        : item.name?.value || "",
      description: item.description || "",
      yearpublished: item.yearpublished?.value || "",
      minplayers: parseInt(item.minplayers?.value || "0"),
      maxplayers: parseInt(item.maxplayers?.value || "0"),
      playingtime: parseInt(item.playingtime?.value || "0"),
      minage: parseInt(item.minage?.value || "0"),
      thumbnail: item.thumbnail,
      image: item.image,
      links: links,
      categories: linkMap.boardgamecategory || [],
      mechanics: linkMap.boardgamemechanic || [],
      families: linkMap.boardgamefamily || [],
      publishers: linkMap.boardgamepublisher || [],
      artists: linkMap.boardgameartist || [],
      designers: linkMap.boardgamedesigner || [],
      compilations: linkMap.boardgamecompilation || [],
    } as DetailedGame;
  });
};

export const fetchGameDetailsById = async (
  gameId: string
): Promise<DetailedGame | null> => {
  const games = await fetchGameDetails([gameId]);
  return games[0] || null;
};

import { gql } from "@apollo/client";

// Query to get a user's collection
export const GET_USER_COLLECTION = gql`
  query GetUserCollection($username: String!) {
    userCollection(username: $username) {
      totalItems
      pubDate
      items {
        objectId
        name
        thumbnail
        image
        yearPublished
        numPlays
        subtype
        stats {
          minPlayers
          maxPlayers
          minPlayTime
          maxPlayTime
          playingTime
          average
        }
      }
    }
  }
`;

// Query to get user information
export const GET_USER = gql`
  query GetUser($username: String!) {
    user(username: $username) {
      id
      username
      firstName
      lastName
      dateRegistered
      supportYears
      designerId
      publisherId
      address {
        city
        isoCountry
      }
    }
  }
`;

// Query to search for games
export const SEARCH_GAMES = gql`
  query SearchGames($query: String!, $type: ThingType) {
    search(query: $query, type: $type) {
      id
      name
      type
    }
  }
`;

// Query to get game details
export const GET_GAME_DETAILS = gql`
  query GetGameDetails($id: ID!) {
    thing(id: $id) {
      id
      name
      type
      yearPublished
      image
      thumbnail
    }
  }
`;

// Query to get hot games
export const GET_HOT_GAMES = gql`
  query GetHotGames($type: ThingType) {
    hotItems(type: $type) {
      id
      name
      type
      yearPublished
      image
      thumbnail
    }
  }
`;

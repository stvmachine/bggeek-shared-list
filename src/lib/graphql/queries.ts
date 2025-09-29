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
        status {
          own
          prevOwned
          forTrade
          want
          wantToPlay
          wantToBuy
          wishlist
          preordered
          lastModified
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

// Note: Multiple collections query doesn't exist in the schema
// We'll need to make multiple individual calls

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

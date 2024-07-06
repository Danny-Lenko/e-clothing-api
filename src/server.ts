import { ApolloServer, gql } from "apollo-server";
import { ApolloServer as ApolloServerLambda } from "apollo-server-lambda";

import { collections } from "./collections";

const typeDefs = gql`
  type Query {
    collections: [Collection!]!
    collection(id: ID!): Collection
    getCollectionsByTitle(title: String): Collection
  }

  type Collection {
    id: ID!
    title: String!
    items: [Item!]!
  }

  type Item {
    id: ID!
    name: String!
    price: Float!
    imageUrl: String!
    collection: Collection
  }
`;

const resolvers = {
  Query: {
    collections: () => collections,
    collection: (_, { id }) => collections.find((c) => c.id === id),
    getCollectionsByTitle: (_, { title }) =>
      collections.find((c) => c.title.toLowerCase() === title.toLowerCase()),
  },
  Item: {
    collection: (item) =>
      collections.find((c) => c.items.some((i) => i.id === item.id)),
  },
};

function createLambdaServer() {
  return new ApolloServerLambda({
    typeDefs,
    resolvers,
    introspection: true,
    playground: true,
  });
}

function createLocalServer() {
  return new ApolloServer({
    typeDefs,
    resolvers,
    introspection: true,
    playground: true,
  });
}

export { createLambdaServer, createLocalServer };

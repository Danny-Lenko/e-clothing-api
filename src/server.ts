import { ApolloServer, gql } from "apollo-server";
import { ApolloServer as ApolloServerLambda } from "apollo-server-lambda";
import admin from "firebase-admin";

import { collections } from "./collections";

const creds = {
  type: "service_account",
  project_id: "e-clothing-cffad",
  private_key_id: "3c32b6b49a5f521df5c06f0d6635c5237398aeb9",
  private_key:
    "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQC4dX12YG0nA9SI\nWL4ISZ00ehomb6X1QBu+RvveLip1jSD10SXtldfdr5v3NWFqWnCuSq4cat8fZ+Oo\nra3BphJBSVofy82C8dTBdN968veWlYxGakJgrPUb8IYWi61VrXGPg/ttBBZRjeYM\nNf+ov3qQSk6zCQa7LrdRxaHsMcARIRw3m9Pi8FHDb9ne5tLvSYs0s3epoqlkI768\nFyXd4Xu34V2ICZcl5PEeKPVbFETPu0IBojd1V3GiTHLqLadOVC+bP7US5j3cYUvn\nsdKy/rw7ZGPdIi9dDZhcgsZeyBy4RY6qr7V8Iwwv3S2D4JfWZmkXRtcRYBfbWNur\ngFkosiGfAgMBAAECggEADYitTmivyYuJ5gEg3EnOa4HD9mr9sbtk7baWl0wq2Fok\n/3Q7hK2YW48dcetsPNnq55baJIKg4VSFiyRHGey97SVdI/UXnJJyykjxdrtp+BX7\n51S3jxFRoJ2qsO/JpX4m1WFZKrwAiTZQmTfDDNYTv498K72vTT+Vur217jcOQRNd\nbkhGgw2oijqyokDczIYxXhA8urvR1jKBw2DmISrfT2YmgG3QXExgCWojaRkEbXDR\nCPYd1YZkv8pAI57/bPDlr8add4wjJQ1pSIfNje7XPIyoGQ3L83OhOAOyX439WaOd\njQdXhXqaxOqpnw3McnDO4dePoTu1gB54Ll2FFUNYBQKBgQDhbIDwPyySlZ5KPAoo\nc+iqRVHe4hiwqP01LdHhGl65TgJIJg4SibDPQeGOqeFCU/XgYQCd+osC6Csd0946\nZS4zT7Yi4ambOxiSwTGqunjFvM5c8CVF0n8OCzCBNb/NqLq/SmLTqqRDEEi+CbKd\nbrH/QC2dQRDxoG+R+LSK6jrPZQKBgQDReosZ+rHoIDQPhNypxO26dMrw+LPd8267\nSYDy/Cgzc8am7yEJP9JC055FHMXJ1uBtl2muy10fJsqHpPvPnoRD3aLLH3MP3dBb\nxa5Ig5AK6uFFyjOrGu/TWp23Q8rZcuNc9TBlg8Jwc9xi0ktkhkAYdNJ/zrGn4Fpu\neAJugU/GswKBgFcRUqf4rp2bfn0LvZysUERb6+hbic/KJarBnNwGFGocUFNPp4XP\neuRCfP1ebivxQ/m7XcKm/8RKqkSmDaKea/7TnfTRFnJnm/Eq/6UCyx0M9OP+uVbD\nm+FvvvdZLFEiB6dU8uDweuuQQZhtJHkcRVHilvuzIvlAz3chCZLSL47lAoGANh4F\nf7GvcnuXV4cIhud0Tx5LK5Pky+tO6R2lLaENNbWsVYYjr8MIK/GFyu8S/gEAO+/J\nArpRFXItEnwB/fJC01GX9Afs7uVsJbldPCiY9ukVR7VkQckUujKH2keuSR0QNfy2\nAxPWEL0t623OwmqYdnj/xLr+VJN2aWGhpzDLDlcCgYB219nsFn8PMOr32atWrmm8\nBqidYjuWq0BPmCn6IW1fJP3EBe4IplczHqvGaR0e7AzKtW1dLQmG4ktkDHKu/hhb\npmZ/QCNxRx/tuvbZ0ieaSBicViK67e+4Q47RDHJkVEnwrowsN2C2o1k1q3Cvk8IM\n6uSM9HzsuiK77pu46btmXQ==\n-----END PRIVATE KEY-----\n",
  client_email:
    "firebase-adminsdk-7v5is@e-clothing-cffad.iam.gserviceaccount.com",
  client_id: "116412021025477353809",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url:
    "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-7v5is%40e-clothing-cffad.iam.gserviceaccount.com",
  universe_domain: "googleapis.com",
};

admin.initializeApp({
  credential: admin.credential.cert(creds),
});

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

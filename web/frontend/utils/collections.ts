import { gql, useQuery } from "@apollo/client";

export const getCollections = () => {
  const { loading, error, data } = useQuery(COLLECTION_QUERY);
  if (loading) return "Loading...";
  if (error) return `Error! ${error.message}`;

  const colls = data.collections.edges.map((collection) => {
    return { id: collection.node.id, title: collection.node.title };
  });
  return colls;
};
const COLLECTION_QUERY = gql`
  query {
    collections(first: 5) {
      edges {
        node {
          id
          title
        }
      }
    }
  }
`;

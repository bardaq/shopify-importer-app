import { gql, useLazyQuery } from "@apollo/client";

export function useGetCollectionIdBySlug() {
  const [getId, { data, loading, error }] = useLazyQuery(FIND_CATEGORY_ID);

  const getIdFromCollection = (collectionSlug: string) => {
    getId({
      variables: {
        handle: collectionSlug,
      },
    });

    return data;
  };
  // const collectionId = await getCollectionIdFromHandle({
  //   variables: {
  //     handle: product.collectionSlug,
  //   },
  // });

  return { getIdFromCollection };
}
export const FIND_CATEGORY_ID = gql`
  query getCollectionIdFromHandle($handle: String!) {
    collectionByHandle(handle: $handle) {
      id
    }
  }
`;

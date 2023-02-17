import { gql, useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { useCollectionCreate } from "../useCollectionCreate/useCollectionCreate";
import CyrillicToTranslit from "cyrillic-to-translit-js";

export function useGetCollectionIdBySlug() {
  const [getColl, { loading, data, error }] = useLazyQuery(
    COLLECTION_QUERY_BY_HANDLE
  );
  const { createCollection, loading: loadColl } = useCollectionCreate();
  const getCollectionToJoin = async (collectionSlug: string) => {
    const collectionsToJoin: string[] = [];
    const response = await getColl({ variables: { handle: collectionSlug } });

    if (response.data.collectionByHandle != null) {
      collectionsToJoin.push(response.data.collectionByHandle.id);
    } else if (response.data.collectionByHandle == null) {
      const cyrillicTitle = CyrillicToTranslit({ preset: "uk" })
        .reverse(collectionSlug)
        .replace("иа", "я")
        .replace("-", " ");

      const newCollection = {
        title: cyrillicTitle,
        handle: collectionSlug,
      };
      const createNewCollection = await createCollection(newCollection);
      collectionsToJoin.push(createNewCollection.id);
    }
    return collectionsToJoin;
  };

  return { getCollectionToJoin };
}

const COLLECTION_QUERY_BY_HANDLE = gql`
  query getCollectionIdFromHandle($handle: String!) {
    collectionByHandle(handle: $handle) {
      id
    }
  }
`;

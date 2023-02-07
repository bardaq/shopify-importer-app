import { CollectionProps } from "../../components/CollectionCard";

export function useGetCollectionIdBySlug() {
  const getCollectionToJoin = (
    collectionsProps: CollectionProps[],
    collectionSlug: string
  ) => {
    const collectionsToJoin: string[] = [];
    collectionsProps.forEach((coll) => {
      if (coll.handle == collectionSlug) {
        collectionsToJoin.push(coll.id);
      }
    });

    return collectionsToJoin;
  };

  return { getCollectionToJoin };
}

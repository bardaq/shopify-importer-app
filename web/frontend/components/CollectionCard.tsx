import { Card, Heading, TextContainer, DisplayText } from "@shopify/polaris";
import collections from "../hooks/useCollectionCreate/mock.json";
import { useCollectionCreate } from "../hooks/useCollectionCreate/useCollectionCreate";
import { useProductCreate } from "../hooks/useProductCreate/useProductCreate";
import products from "../hooks/useProductCreate/test-mock.json";

import { useState } from "react";

export interface CollectionProps {
  handle: string;
  id: string;
}

export function CollectionCard() {
  const { createCollection, loading } = useCollectionCreate();
  const { createProduct, loadPropuct } = useProductCreate();
  const [collectionsProps, setCollectionsProps] = useState<CollectionProps[]>(
    []
  );

  const handleCollections = async () => {
    const collectionsObjects = [];
    collections.forEach(async (collection) => {
      const collWithoutParent = {
        title: collection.title,
        handle: collection.url.split("/").at(-2),
      };
      const collProps = await createCollection(collWithoutParent);
      if (collProps) {
        collectionsObjects.push(collProps);
      }
      setCollectionsProps(collectionsObjects);
    });
  };

  const handleProducts = async () => {
    for (const product of products) {
      await createProduct(product, collectionsProps);
    }
  };
  return (
    <>
      <Card
        title="COLL"
        sectioned
        primaryFooterAction={{
          content: "Create Collection",
          onAction: handleCollections,
          loading,
        }}
      >
        <TextContainer spacing="loose">
          <p>COLLECTIONS</p>
          <Heading element="h4">
            <DisplayText size="medium"></DisplayText>
          </Heading>
        </TextContainer>
      </Card>
      <Card
        title="PROD"
        sectioned
        primaryFooterAction={{
          content: "Create PROD",
          onAction: handleProducts,
          loading: loadPropuct,
        }}
      >
        <TextContainer spacing="loose">
          <p>COLLECTIONS</p>
          <Heading element="h4">
            <DisplayText size="medium"></DisplayText>
          </Heading>
        </TextContainer>
      </Card>
    </>
  );
}

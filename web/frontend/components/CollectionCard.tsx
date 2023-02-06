import { Card, Heading, TextContainer, DisplayText } from "@shopify/polaris";
import collections from "../hooks/useCollectionCreate/mock.json";
import { useCollectionCreate } from "../hooks/useCollectionCreate/useCollectionCreate";
import { useProductCreate } from "../hooks/useProductCreate/useProductCreate";
import products from "../hooks/useGetCollectionIdBySlug/test-mock.json";
import { IProductDetails } from "../types/types";
import { useState } from "react";

export interface CollectionProps {
  handle: string;
  id: string;
}

export function CollectionCard() {
  const { createCollection, loading } = useCollectionCreate();
  const { createProduct } = useProductCreate();
  const [collectionsProps, setCollectionsProps] = useState<CollectionProps[]>(
    []
  );

  const handleCollections = async () => {
    const collectionsObjects = [];
    collections.forEach(async (collection) => {
      const collProps = await createCollection(collection);
      if (collProps) {
        collectionsObjects.push(collProps);
      }
      setCollectionsProps(collectionsObjects);
    });
  };

  const handleProducts = () => {
    products.forEach((product: IProductDetails) => {
      createProduct(product, collectionsProps); //Uncaught (in promise) Error: Invalid hook call. Hooks can only be called inside of the body of a function component.
    });
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
    </>
  );
}

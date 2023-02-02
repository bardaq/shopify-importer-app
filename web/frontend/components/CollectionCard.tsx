import { Card, Heading, TextContainer, DisplayText } from "@shopify/polaris";
import collections from "../hooks/collectionCreate/mock.json";
import { useCollectionCreate } from "../hooks/collectionCreate/useCollectionCreate";

export function CollectionCard() {
  const { createCollection, loading } = useCollectionCreate();
  const handleCollections = async () => {
    collections.forEach((collection) => {
      createCollection(collection);
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
    </>
  );
}

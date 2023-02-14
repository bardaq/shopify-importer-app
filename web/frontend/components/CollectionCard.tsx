import { Card, Heading, TextContainer, DisplayText } from "@shopify/polaris";
import collections from "../hooks/useCollectionCreate/mock.json";
import { useCollectionCreate } from "../hooks/useCollectionCreate/useCollectionCreate";
import { useProductCreate } from "../hooks/useProductCreate/useProductCreate";
import products from "../hooks/useProductCreate/test-mock.json";
import { useState } from "react";
import { useEnableLocale } from "../hooks/useEnableLocale/useEnableLocale";
import { useGetTranslatableResources } from "../hooks/useGetTranslatableResources/useGetTranslatableResources";
import { useAddTranslation } from "../hooks/useAddTranslation/useAddTranslation";
import { useUpdateLocale } from "../hooks/useUpdateLocale/useUpdateLocale";

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
  const { createLocale, localeLoading } = useEnableLocale();
  const data = useGetTranslatableResources();
  const { createTranslationProduct, translationLoading } = useAddTranslation();
  const { updateLocaleShop, updatingLoading } = useUpdateLocale();

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
      try {
        const createdProd = await createProduct(product, collectionsProps);
        console.log(createdProd);
      } catch (error) {
        console.log(
          `Failed to import product:${product.title}, \n url:${product.url} \n`,
          error
        );
      }
    }
  };

  const handleLocale = async () => {
    await createLocale("ru");
  };

  const handleTranslations = async () => {
    await createTranslationProduct(
      data.resourceId,
      data.translatableContent[0],
      "ru"
    );
  };

  const handleUpdateLocale = async () => {
    await updateLocaleShop();
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
      <Card
        title="LOCALE"
        sectioned
        primaryFooterAction={{
          content: "Create LOCALE",
          onAction: handleLocale,
          loading: localeLoading,
        }}
      ></Card>
      <Card
        title="ADD TRANSLATION"
        sectioned
        primaryFooterAction={{
          content: "ADD TRANSLATION",
          onAction: handleTranslations,
          loading: translationLoading,
        }}
      ></Card>
      <Card
        title="UPDATE LOCALE"
        sectioned
        primaryFooterAction={{
          content: "UPDATE LOCALE",
          onAction: handleUpdateLocale,
          loading: updatingLoading,
        }}
      ></Card>
    </>
  );
}

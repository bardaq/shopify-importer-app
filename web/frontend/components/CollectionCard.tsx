import { Card, Heading, TextContainer, DisplayText } from "@shopify/polaris";
import { useProductCreate } from "../hooks/useProductCreate/useProductCreate";
import productsJson from "../hooks/useProductCreate/test-mock.json";

import { useGetProductByHandle } from "../hooks/useGetProductByHandle/useGetProductByHandle";
import { IProductDetails } from "../types";
import { useCreateMetafieldDefinitions } from "../hooks/useCreateMetafieldsDefinitions/useCreateMetafieldDefinitions";

export interface CollectionProps {
  handle: string;
  id: string;
}

const products = productsJson as IProductDetails[];

export function CollectionCard() {
  const { createProduct, loadPropuct } = useProductCreate();
  const { getProduct } = useGetProductByHandle();
  const upsertProducts = async () => {
    for (const product of products) {
      const existedProduct = await getProduct(product);

      if (existedProduct.data.productByHandle != null) {
        try {
          console.log("product already exists");
        } catch (error) {
          console.log(error);
        }
      } else {
        try {
          const createdProd = await createProduct(product);
          console.log(createdProd);
        } catch (error) {
          console.log(
            `Failed to import product:${product.title}, \n url:${product.url} \n`,
            error
          );
        }
      }
    }
  };

  return (
    <>
      <Card
        title="PROD"
        sectioned
        primaryFooterAction={{
          content: "Create PROD",
          onAction: upsertProducts,
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

import { useState } from "react";
import {
  Card,
  Heading,
  TextContainer,
  DisplayText,
  TextStyle,
} from "@shopify/polaris";
import { Toast } from "@shopify/app-bridge-react";
import { useProductCreate } from "../hooks/productCreate/useProductCreate";
import { useAppQuery } from "../hooks";
import { IProduct } from "../hooks/productCreate/types";
import products from "../utils/test-mock.json";
import { transformProducts } from "../utils/products";

export function ProductsCard() {
  const emptyToastProps = { content: null, error: false };
  const [toastProps, setToastProps] = useState(emptyToastProps);
  const [isLoading, setIsLoading] = useState(true);
  const { createProduct, loading } = useProductCreate();
  const transformedProducts = transformProducts(products);
  const {
    data,
    refetch: refetchProductCount,
    isLoading: isLoadingCount,
    isRefetching: isRefetchingCount,
  } = useAppQuery({
    url: "/api/products/count",
    reactQueryOptions: {
      onSuccess: () => {
        setIsLoading(false);
      },
    },
  });

  const toastMarkup = toastProps.content && !isRefetchingCount && (
    <Toast {...toastProps} onDismiss={() => setToastProps(emptyToastProps)} />
  );

  const handlePopulate = () => {
    setIsLoading(true);
    transformedProducts.forEach((product: IProduct) => {
      createProduct(product);
    });
    setToastProps({ content: "1 products created!", error: false });
  };

  return (
    <>
      {toastMarkup}
      <Card
        title="Product Counter"
        sectioned
        primaryFooterAction={{
          content: "Populate 5 products",
          onAction: handlePopulate,
          loading,
        }}
      >
        <TextContainer spacing="loose">
          <p>
            Sample products are created with a default title and price. You can
            remove them at any time.
          </p>
          <Heading element="h4">
            TOTAL PRODUCTS
            <DisplayText size="medium">
              <TextStyle variation="strong">
                {isLoadingCount ? "-" : data.count}
              </TextStyle>
            </DisplayText>
          </Heading>
        </TextContainer>
      </Card>
    </>
  );
}

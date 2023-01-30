import { useState } from "react";
import {
  Card,
  Heading,
  TextContainer,
  DisplayText,
  TextStyle,
} from "@shopify/polaris";
import { Toast } from "@shopify/app-bridge-react";
import { useAppQuery, useAuthenticatedFetch } from "../hooks";
import { testProductImage, testCategoryImage } from "../assets";
import { useMutation, gql } from "@apollo/client";

const CREATE_PRODUCT_QUERY = gql`
  mutation populateProduct($input: ProductInput!) {
    productCreate(input: $input) {
      userErrors {
        field
        message
      }
      product {
        title
        descriptionHtml
        options {
          values
        }
        metafields(first: 1) {
          edges {
            node {
              namespace
              type
              key
              value
            }
          }
        }
        variants(first: 1) {
          edges {
            node {
              price
              selectedOptions {
                value
              }
            }
          }
        }
      }
    }
  }
`;

const PRODUCT_ITEM = {
  title:
    "OXIDOM-100 (ОКСИДОМ-100) - Натуральное льняное масло-воск для дерева (масло льна с воском).",
  descriptionHtml:
    '<p style="text-align: justify;">Натуральное <strong>льняное масло с добавлением пчелиного воска&nbsp;Oxidom-100 </strong><b>(ОксиДом-</b><b>100)</b> - готовая пропитка для дерева наружного и внутреннего применения и изделий из древесины, содержит незначительное количество экстракта хвойных пород для поддержания в жидком состоянии продукта. Oxidom-100 (ОксиДом-100) отлично подходит для декорирования и защиты всех пород древесины, хорошо впитывается и имеет антисептические свойства, что способствует защите древесины от биопоражения. В смеси льняного масла с воском получаем дополнительный слой защиты дерева, который образует пленка на поверхности после высыхания, а так изделие можно натирать до блеска.</p>',

  // https://shopify.dev/api/admin-graphql/2023-04/mutations/productCreate#field-productinput-seo
  seo: {
    title: "seo title",
    description: "seo description",
  },
  options: ["Колір", "Фасування", "Блиск"],
  variants: [
    {
      price: "348",
      options: ["прозорий", "0.95 л.", "напівматовий"],
    },
    {
      price: "968",
      options: ["прозорий", "2.4 л.", "напівматовий"],
    },
  ],
  metafields: [
    {
      namespace: "productProperties",
      type: "single_line_text_field", // https://shopify.dev/apps/custom-data/metafields/types
      key: "колір",
      value: "Білий, після висихання прозорий",
    },
    {
      namespace: "productProperties",
      type: "single_line_text_field", // https://shopify.dev/apps/custom-data/metafields/types
      key: "код товару (артикул)",
      value: "31888",
    },
    {
      namespace: "productProperties",
      type: "single_line_text_field", // https://shopify.dev/apps/custom-data/metafields/types
      key: "час висихання",
      value: "2-3 години",
    },
    {
      namespace: "productProperties",
      type: "single_line_text_field", // https://shopify.dev/apps/custom-data/metafields/types
      key: "висихання від пилу",
      value: "12 годин",
    },
    {
      namespace: "productProperties",
      type: "single_line_text_field", // https://shopify.dev/apps/custom-data/metafields/types
      key: "витрата",
      value: "10-14 м²/л.",
    },
    {
      namespace: "productProperties",
      type: "multi_line_text_field", // https://shopify.dev/apps/custom-data/metafields/types
      key: "з УФ-фільтром\nзносостійкість\nводовідштовхувальні\nзміцнюючі\nводостійкість\nантисептичні\nантигрибкові\nмиється",
      value: "10-14 м²/л.",
    },
  ],
};

export function ProductsCard() {
  const [populateProduct, { loading }] = useMutation(CREATE_PRODUCT_QUERY);
  const emptyToastProps = { content: null, error: false };
  const [isLoading, setIsLoading] = useState(true);
  const [toastProps, setToastProps] = useState(emptyToastProps);
  const fetch = useAuthenticatedFetch();

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

  const handlePopulate = async () => {
    setIsLoading(true);

    const response = await populateProduct({
      variables: {
        input: PRODUCT_ITEM,
      },
    });

    if (response.errors) {
      setToastProps({
        content: response.errors[0].message,
        error: true,
      });
      return response.errors;
    }
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


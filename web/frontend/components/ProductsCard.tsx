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
import { oxidomPaintFirst, oxidomPaintSecond } from "../assets";
import { useMutation, gql } from "@apollo/client";

const PRODUCTS_QUERY = gql`
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

export function ProductsCard() {
  const [populateProduct, { loading }] = useMutation(PRODUCTS_QUERY);
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
        input: {
          title:
            "OXIDOM-100 (ОКСИДОМ-100) - Натуральное льняное масло-воск для дерева (масло льна с воском).",
          descriptionHtml:
            '<p style="text-align: justify;">Натуральное <strong>льняное масло с добавлением пчелиного воска&nbsp;Oxidom-100 </strong><b>(ОксиДом-</b><b>100)</b> - готовая пропитка для дерева наружного и внутреннего применения и изделий из древесины, содержит незначительное количество экстракта хвойных пород для поддержания в жидком состоянии продукта. Oxidom-100 (ОксиДом-100) отлично подходит для декорирования и защиты всех пород древесины, хорошо впитывается и имеет антисептические свойства, что способствует защите древесины от биопоражения. В смеси льняного масла с воском получаем дополнительный слой защиты дерева, который образует пленка на поверхности после высыхания, а так изделие можно натирать до блеска.</p>',

          options: ["Packaging", "Size", "Shine"],
          metafields: [
            {
              namespace: "keywords",
              type: "string",
              key: "meta_keywords",
              value:
                "оксидом 100, oxidom 100, льняное масло для дерева, льняное масло, масло пчелиного воска, масло льна",
            },
          ],
          variants: [
            {
              price: "257",
              options: ["no color", "0.6L", "matte"],
            },
            {
              price: "680",
              options: ["no color", "1L", "matte"],
            },
            {
              price: "1680",
              options: ["no color", "10L", "matte"],
            },
          ],
        },
      },
    });

    console.log({ response });
    if (response.errors) {
      setToastProps({
        content: response.errors[0].message,
        error: true,
      });
      return response.errors;
    }

    console.log(3);
    setToastProps({ content: "1 products created!", error: false });

    // const response = await fetch("/api/products/create");

    console.log(4);
    // if (response.ok) {
    //   await refetchProductCount();
    //   setToastProps({ content: "5 products created!", error: false });
    // } else {
    //   setIsLoading(false);
    //   setToastProps({
    //     content: "There was an error creating products",
    //     error: true,
    //   });
    // }
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

import { useState } from "react";
import { useAppQuery } from "../../hooks";
import { gql, useMutation } from "@apollo/client";

export function useProductCreate(
  setToastProps: ({
    content,
    error,
  }: {
    content: string;
    error: boolean;
  }) => void,
  products: any
) {
  const [populateProduct, { loading }] = useMutation(CREATE_PRODUCT_QUERY);
  const [isLoading, setIsLoading] = useState(true);

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

  const handlePopulate = () => {
    setIsLoading(true);
    products.forEach(async (product) => {
      const response = await populateProduct({
        variables: {
          input: product,
        },
      });
      if (response.errors) {
        setToastProps({
          content: response.errors[0].message,
          error: true,
        });
        return response.errors;
      }
      return response;
    });

    setToastProps({ content: "1 products created!", error: false });
  };

  return { handlePopulate, isLoadingCount, isRefetchingCount, loading, data };
}

export const CREATE_PRODUCT_QUERY = gql`
  mutation populateProduct($input: ProductInput!) {
    productCreate(input: $input) {
      userErrors {
        field
        message
      }
      product {
        title
        descriptionHtml
        seo {
          title
          description
        }
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

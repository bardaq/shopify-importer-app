import { gql, useMutation } from "@apollo/client";
import { IProduct } from "./types";

export function useProductCreate() {
  const [populateProduct, { loading }] = useMutation(CREATE_PRODUCT_QUERY);

  const createProduct = async (product: IProduct) => {
    const response = await populateProduct({
      variables: {
        input: product,
      },
    });
    if (response.errors) response.errors;
    return response;
  };

  return { createProduct, loading };
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
        collections(first: 10) {
          edges {
            node {
              productsCount
            }
          }
        }
        options {
          values
        }
        images(first: 10) {
          edges {
            node {
              src
            }
          }
        }
        metafields(first: 10) {
          edges {
            node {
              namespace
              type
              key
              value
            }
          }
        }
        variants(first: 10) {
          edges {
            node {
              price
              selectedOptions {
                value
              }
              image {
                url
              }
              sku
            }
          }
        }
      }
    }
  }
`;

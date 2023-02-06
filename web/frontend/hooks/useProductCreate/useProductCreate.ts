import { gql, useMutation } from "@apollo/client";
import { CollectionProps } from "../../components/CollectionCard";
import { IProductDetails } from "../../types/types";

import { transformProduct } from "./utils";

export function useProductCreate() {
  const [populateProduct, { loading }] = useMutation(CREATE_PRODUCT_QUERY);

  const createProduct = async (
    product: IProductDetails,
    collectionsProps: CollectionProps[]
  ) => {
    const transformedProduct = transformProduct(product);
    const collectionsToJoin: string[] = [];
    collectionsProps.forEach((coll) => {
      if (coll.handle == product.collectionSlug) {
        collectionsToJoin.push(coll.id);
      }
    });
    const response = await populateProduct({
      variables: {
        input: { ...transformedProduct, collectionsToJoin: collectionsToJoin },
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
        options {
          values
        }
        images(first: 20) {
          edges {
            node {
              src
            }
          }
        }
        metafields(first: 50) {
          edges {
            node {
              namespace
              type
              key
              value
            }
          }
        }
        variants(first: 30) {
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
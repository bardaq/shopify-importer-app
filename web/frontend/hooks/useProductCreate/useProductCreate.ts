import { gql, useMutation } from "@apollo/client";
import { CollectionProps } from "../../components/CollectionCard";
import { IProductDetails } from "../../types/types";
import { useGetCollectionIdBySlug } from "../useGetCollectionIdBySlug/useGetCollectionIdBySlug";

import { transformProduct } from "./utils";

export function useProductCreate() {
  const [populateProduct, { loading: loadPropuct }] =
    useMutation(CREATE_PRODUCT_QUERY);
  const { getCollectionToJoin } = useGetCollectionIdBySlug();
  const createProduct = async (
    product: IProductDetails,
    collectionsProps: CollectionProps[]
  ) => {
    const transformedProduct = transformProduct(product);
    const collectionsToJoin = getCollectionToJoin(
      collectionsProps,
      product.collectionSlug
    );

    const response = await populateProduct({
      variables: {
        input: { ...transformedProduct, collectionsToJoin: collectionsToJoin },
      },
    });
    if (response.errors) {
      console.log(response.errors);
      return;
    }
    return response.data;
  };

  return { createProduct, loadPropuct };
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
        vendor
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

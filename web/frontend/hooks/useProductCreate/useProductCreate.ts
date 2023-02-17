import { gql, useMutation } from "@apollo/client";
import { CollectionProps } from "../../components/CollectionCard";
import { IProductDetails } from "../../types/index";
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
    const collectionsToJoin = await getCollectionToJoin(product.collectionSlug);

    const response = await populateProduct({
      variables: {
        input: { ...transformedProduct, collectionsToJoin: collectionsToJoin },
      },
    });
    const userErrors = response.data.productCreate.userErrors;

    if (userErrors.length) {
      const errorsArr = userErrors.map((error) => error.message);
      const errors = errorsArr.join(`\n`);
      throw new Error(JSON.stringify(errors));
    }
    return response;
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
        handle
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
              url
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

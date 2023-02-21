import { gql, useMutation } from "@apollo/client";

import { IProductDetails } from "../../types/index";
import { useCreateMetafieldDefinitions } from "../useCreateMetafieldsDefinitions/useCreateMetafieldDefinitions";
import { useGetCollectionIdBySlug } from "../useGetCollectionIdBySlug/useGetCollectionIdBySlug";

import { transformProduct } from "./utils";

export function useProductCreate() {
  const [populateProduct, { loading: loadPropuct }] =
    useMutation(CREATE_PRODUCT_QUERY);
  const { createMetaDefinition } = useCreateMetafieldDefinitions();
  const createProduct = async (product: IProductDetails) => {
    const transformedProduct = transformProduct(product);
    console.log(transformedProduct.metafields);
    for (const meta of transformedProduct.metafields) {
      try {
        await createMetaDefinition(meta);
      } catch (error) {
        console.log(error);
      }
    }
    const response = await populateProduct({
      variables: {
        input: transformedProduct,
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

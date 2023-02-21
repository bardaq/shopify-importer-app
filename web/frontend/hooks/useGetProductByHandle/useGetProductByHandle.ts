import { gql, useLazyQuery } from "@apollo/client";
import { IProductDetails } from "../../types";

export function useGetProductByHandle() {
  const [getProductId] = useLazyQuery(QUERY_PRODUCT_BY_HANDLE);

  const getProduct = async (product: IProductDetails) => {
    const productId = await getProductId({
      variables: {
        handle: product.slug,
      },
    });
    console.log(productId);

    return productId;
  };

  return { getProduct };
}

const QUERY_PRODUCT_BY_HANDLE = gql`
  query getProductIdFromHandle($handle: String!) {
    productByHandle(handle: $handle) {
      id
      metafields(first: 40) {
        edges {
          node {
            id
            key
          }
        }
      }
    }
  }
`;

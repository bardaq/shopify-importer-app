import { gql, useLazyQuery, useMutation } from "@apollo/client";
import { IProductDetails } from "../../types";

export function useProductUpdate() {
  const [getProd] = useLazyQuery(GET_PRODUCT);
  const [updateProductCollection] = useMutation(
    UPDATE_COLLECTION_LINKS_IN_PRODUCTS
  );

  const updateProductCollectionToJoin = async (
    product: IProductDetails,
    collectionHandle: string
  ) => {
    const productObj = await getProd({
      variables: { handle: product.slug },
    });

    const res = await updateProductCollection({
      variables: {
        input: {
          id: productObj.data.productByHandle.id,
          collectionsToJoin: [collectionHandle],
        },
      },
    });

    const userErrors = res.data.productUpdate.userErrors;

    if (userErrors.length) {
      const errorsArr = userErrors.map((error) => error.message);
      const errors = errorsArr.join(`\n`);
      throw new Error(JSON.stringify(errors));
    }

    return res;
  };

  return { updateProductCollectionToJoin };
}

const UPDATE_COLLECTION_LINKS_IN_PRODUCTS = gql`
  mutation updateProductCollection($input: ProductInput!) {
    productUpdate(input: $input) {
      product {
        id
      }
      userErrors {
        message
        field
      }
    }
  }
`;

const GET_PRODUCT = gql`
  query getProductIdFromHandle($handle: String!) {
    productByHandle(handle: $handle) {
      id
    }
  }
`;

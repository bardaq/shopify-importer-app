import { gql, useMutation } from "@apollo/client";
import { ICollection } from "./types";

export function useCollectionCreate() {
  const [collectionCreate, { loading }] = useMutation(CREATE_COLLECTION_QUERY);

  const createCollection = async (collection: ICollection) => {
    const response = await collectionCreate({
      variables: {
        input: collection,
      },
    });
    if (response.errors) {
      return response.errors;
    }
    return response;
  };

  return { createCollection, loading };
}
const CREATE_COLLECTION_QUERY = gql`
  mutation collectionCreate($input: CollectionInput!) {
    collectionCreate(input: $input) {
      collection {
        title
        descriptionHtml
        handle
        image {
          src
        }
        seo {
          description
          title
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;

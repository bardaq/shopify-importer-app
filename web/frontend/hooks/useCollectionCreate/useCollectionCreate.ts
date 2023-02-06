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
      return;
    }

    if (response.data) {
      return {
        handle: response.data.collectionCreate.collection.handle as string,
        id: response.data.collectionCreate.collection.id as string,
      };
    }
  };

  return { createCollection, loading };
}
const CREATE_COLLECTION_QUERY = gql`
  mutation collectionCreate($input: CollectionInput!) {
    collectionCreate(input: $input) {
      collection {
        title
        descriptionHtml
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
      collection {
        id
        handle
      }
    }
  }
`;

import { gql, useMutation } from "@apollo/client";

export function useCollectionCreate() {
  const [collectionCreate, { loading }] = useMutation(CREATE_COLLECTION_QUERY);

  const createCollection = async (collection: any) => {
    const response = await collectionCreate({
      variables: {
        input: collection,
      },
    });
    if (response.errors) {
      return response.errors;
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
        handle
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

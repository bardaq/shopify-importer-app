import { gql, useMutation } from "@apollo/client";
import CyrillicToTranslit from "cyrillic-to-translit-js";

export function useCreateMetafieldDefinitions() {
  const [createMetafieldDefinition, { loading: metaLoading }] = useMutation(
    CREATE_METAFIELD_DEFINITION
  );

  const createMetaDefinition = async (metafield) => {
    const cyrillicToTranslit = CyrillicToTranslit({ preset: "uk" });
    const cyrillicName = cyrillicToTranslit
      .transform(metafield.key, "-")
      .toLowerCase()
      .replace("ы", "y");

    const metafieldDefinition = {
      name: cyrillicName,
      namespace: metafield.namespace,
      key: metafield.key,
      type: metafield.type,
      ownerType: "PRODUCT",
    };
    const response = await createMetafieldDefinition({
      variables: {
        definition: metafieldDefinition,
      },
    });

    const userErrors = response.data.metafieldDefinitionCreate.userErrors;

    if (userErrors.length) {
      const errorsArr = userErrors.map((error) => error.message);
      const errors = errorsArr.join(`\n`);
      throw new Error(JSON.stringify(errors));
    }

    return response;
  };
  return { createMetaDefinition, metaLoading };
}

const CREATE_METAFIELD_DEFINITION = gql`
  mutation createMetafieldDefinition($definition: MetafieldDefinitionInput!) {
    metafieldDefinitionCreate(definition: $definition) {
      createdDefinition {
        id
        name
        namespace
        key
      }
      userErrors {
        field
        message
        code
      }
    }
  }
`;

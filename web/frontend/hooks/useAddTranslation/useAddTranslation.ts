import { gql, useMutation } from "@apollo/client";

export function useAddTranslation() {
  const [createTranslation, { loading: translationLoading }] =
    useMutation(CREATE_TRANSLATION);

  const createTranslationProduct = async (
    resourceId: string,
    translatableContent: any,
    locale: string
  ) => {
    const translatedTitle = [
      {
        key: translatableContent.key,
        value: "OXIDOM-100 - RUSSSS",
        locale: locale,
        translatableContentDigest: translatableContent.digest,
      },
    ];
    const response = await createTranslation({
      variables: {
        id: resourceId,
        translations: translatedTitle,
      },
    });

    if (response.errors) return response.errors;
    if (response.data) {
      console.log({ createTranslationProduct: response.data });
      return response;
    }
  };

  return { createTranslationProduct, translationLoading };
}

const CREATE_TRANSLATION = gql`
  mutation createTranslation($id: ID!, $translations: [TranslationInput!]!) {
    translationsRegister(resourceId: $id, translations: $translations) {
      userErrors {
        message
        field
      }
      translations {
        locale
        key
        value
      }
    }
  }
`;

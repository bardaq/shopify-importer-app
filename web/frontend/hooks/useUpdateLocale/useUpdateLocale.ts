import { gql, useMutation } from "@apollo/client";

export function useUpdateLocale() {
  const [updateLocale, { loading: updatingLoading }] =
    useMutation(UPDATE_LOCALE);

  const updateLocaleShop = async () => {
    const response = await updateLocale({
      variables: {
        locale: "ru",
        shopLocale: {
          published: true,
        },
      },
    });
    if (response.errors) return response.errors;

    if (response.data) {
      console.log({ updateLocaleShop: response.data });
      return response.data;
    }
  };

  return { updateLocaleShop, updatingLoading };
}

const UPDATE_LOCALE = gql`
  mutation updateLocale($locale: String!, $shopLocale: ShopLocaleInput!) {
    shopLocaleUpdate(locale: $locale, shopLocale: $shopLocale) {
      userErrors {
        message
        field
      }
      shopLocale {
        name
        locale
        primary
        published
      }
    }
  }
`;

import { gql, useMutation } from "@apollo/client";

export function useEnableLocale() {
  const [enableLocale, { loading: localeLoading }] = useMutation(CREATE_LOCALE);

  const createLocale = async (locale: string) => {
    const response = await enableLocale({
      variables: {
        locale: locale,
      },
    });
    if (response.errors) {
      console.log(response.errors);
      return response.errors;
    }
    console.log({ createLocaLE: response.data });
    return response;
  };

  return { createLocale, localeLoading };
}

const CREATE_LOCALE = gql`
  mutation enableLocale($locale: String!) {
    shopLocaleEnable(locale: $locale) {
      shopLocale {
        locale
        name
        published
      }
    }
  }
`;

import { gql, useQuery } from "@apollo/client";

export function useGetTranslatableResources() {
  const { data, loading, error } = useQuery(QUERY_TRANSLATABLE_RESOURCES);

  if (loading) return loading;
  if (error) return error;

  const resources = data;
  return resources;
}

const QUERY_TRANSLATABLE_RESOURCES = gql`
  query {
    translatableResources(first: 5, resourceType: PRODUCT) {
      edges {
        node {
          resourceId
          translatableContent {
            key
            value
            digest
            locale
          }
        }
      }
    }
  }
`;

// const QUERY_TRANSLATABLE_RESOURCES = gql`
//   query {
//     translatableResource(resourceId: "gid://shopify/Product/7258086277260") {
//       resourceId
//       translations(locale: "ru") {
//         key
//         value
//         locale
//       }
//     }
//   }
// `;

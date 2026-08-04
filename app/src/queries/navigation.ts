import { graphql } from "@/lib/craft/graphql";

export const NavigationQuery = graphql(`
  query Navigation($handle: [QueryArgument] = ["main"]) {
    entries(section: "navigations", navigationHandle: $handle, limit: 1) {
      __typename
      ... on navigation_Entry {
        id
        title
        navigationHandle
        maxDepth
        navigationItems {
          __typename
          ... on navigationItem_Entry {
            id
            title
            typeHandle
            externalUrl
            pageLink {
              id
              title
              uri
            }
          }
        }
      }
    }
  }
`);

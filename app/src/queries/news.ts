import { graphql } from "@/lib/craft/graphql";
import { AssetImageFragment } from "./fragments/asset";

export const NewsIndexQuery = graphql(
  `
    query NewsIndex(
      $limit: Int
      $offset: Int = 0
      $orderBy: String = "postDate DESC"
    ) {
      entries(
        section: "news"
        orderBy: $orderBy
        limit: $limit
        offset: $offset
      ) {
        __typename
        id
        title
        uri
        ... on news_Entry {
          postDate
          excerpt
          image {
            ...AssetImageFragment
          }
        }
      }
    }
  `,
  [AssetImageFragment],
);

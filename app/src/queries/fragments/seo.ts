import { graphql } from "@/lib/craft/graphql";
import { AssetImageFragment } from "./asset";

export const SeoFragment = graphql(
  `
    fragment SeoFragment on page_Entry {
      seoTitle
      seoDescription
      seoImage {
        ...AssetImageFragment
      }
      ogTitle
      ogDescription
      ogImage {
        ...AssetImageFragment
      }
      noIndex
      noFollow
    }

    fragment LegalSeoFragment on legalPage_Entry {
      seoTitle
      seoDescription
      seoImage {
        ...AssetImageFragment
      }
      ogTitle
      ogDescription
      ogImage {
        ...AssetImageFragment
      }
      noIndex
      noFollow
    }

    fragment NewsSeoFragment on news_Entry {
      seoTitle
      seoDescription
      seoImage {
        ...AssetImageFragment
      }
      ogTitle
      ogDescription
      ogImage {
        ...AssetImageFragment
      }
      noIndex
      noFollow
    }
  `,
  [AssetImageFragment],
);

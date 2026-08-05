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

    fragment CollectionPageSeoFragment on collectionPage_Entry {
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

    fragment FormPageSeoFragment on formPage_Entry {
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

    fragment ExpertiseSeoFragment on expertise_Entry {
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

    fragment EventSeoFragment on event_Entry {
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

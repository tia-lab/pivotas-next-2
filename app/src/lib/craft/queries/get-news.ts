import { craftQuery } from "@/lib/craft/client";
import { NewsIndexQuery } from "@/queries";

export type NewsOrder = "newest" | "oldest" | "titleAsc" | "titleDesc";

const newsOrderBy: Record<NewsOrder, string> = {
  newest: "postDate DESC",
  oldest: "postDate ASC",
  titleAsc: "title ASC",
  titleDesc: "title DESC",
};

export const getNews = (
  limit: number | null = 12,
  order: NewsOrder = "newest",
  offset = 0,
) => {
  return craftQuery(
    NewsIndexQuery,
    { limit, offset, orderBy: newsOrderBy[order] },
    {
      tags: ["craft", "craft:entries", "craft:news", "craft:section:news"],
      revalidate: false,
    },
  );
};

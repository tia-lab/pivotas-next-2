import { getRequestEntryByUri } from "@/lib/craft/queries";
import { generateCraftMetadata } from "@/lib/craft/metadata";
import { TemplateRouter } from "@/Templates";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

const newsUri = (slug: string) => `news/${slug}`;

export const generateStaticParams = () => [];

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
  const { slug } = await params;

  return generateCraftMetadata(newsUri(slug));
};

export default async function Page({ params }: Props) {
  const { slug } = await params;

  const data = await getRequestEntryByUri(newsUri(slug));

  if (!data.entry || data.entry.__typename !== "news_Entry") {
    notFound();
  }

  return <TemplateRouter entry={data.entry} />;
}

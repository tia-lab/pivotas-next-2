import { ImageCraft, Wrapper } from "@/Components";
import { getNews } from "@/lib/craft/queries";
import { Footer } from "@/Sections/Footer";
import Link from "next/link";

const hrefFromUri = (uri?: string | null) => {
  return uri ? `/${uri}` : "#";
};

export default async function NewsIndex() {
  const data = await getNews();

  return (
    <main>
      <section>
        <Wrapper>
          <h1>News</h1>
          <div>
            {data.entries?.map((entry) => {
              if (!entry || entry.__typename !== "news_Entry") {
                return null;
              }

              const image = entry.image[0] ?? null;

              return (
                <article key={entry.id}>
                  <Link href={hrefFromUri(entry.uri)}>
                    <ImageCraft image={image} sizes="(min-width: 768px) 33vw, 100vw" />
                    <h2>{entry.title}</h2>
                  </Link>
                  {entry.postDate ? <time>{entry.postDate}</time> : null}
                  {entry.excerpt ? <p>{entry.excerpt}</p> : null}
                </article>
              );
            })}
          </div>
        </Wrapper>
      </section>
      <Footer />
    </main>
  );
}

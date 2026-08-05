import { EntryByUriQuery } from "@/queries";
import type { ResultOf } from "gql.tada";
import { CollectionTemplate } from "./Collection";
import { EventTemplate } from "./Event";
import { FormTemplate } from "./Form";
import { LegalTemplate } from "./Legal";
import { NewsTemplate } from "./News";
import { PageTemplate } from "./Page";

type Entry = NonNullable<ResultOf<typeof EntryByUriQuery>["entry"]>;

type Props = {
  entry: Entry;
};

export const TemplateRouter = ({ entry }: Props) => {
  switch (entry.__typename) {
    case "page_Entry":
      return <PageTemplate entry={entry} />;
    case "expertise_Entry":
      return <PageTemplate entry={entry} />;
    case "legalPage_Entry":
      return <LegalTemplate entry={entry} />;
    case "collectionPage_Entry":
      return <CollectionTemplate entry={entry} />;
    case "formPage_Entry":
      return <FormTemplate entry={entry} />;
    case "news_Entry":
      return <NewsTemplate entry={entry} />;
    case "event_Entry":
      return <EventTemplate entry={entry} />;
    default:
      return null;
  }
};

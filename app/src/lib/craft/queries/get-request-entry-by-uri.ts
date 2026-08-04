import { CRAFT_PREVIEW_TOKEN_COOKIE } from "@/lib/craft/preview";
import { cookies, draftMode } from "next/headers";
import { getEntryByUri, getPreviewEntryByUri } from "./get-entry-by-uri";

type GetRequestEntryOptions = {
  previewToken?: string | null;
};

export const getRequestEntryByUri = async (
  uri: string,
  options: GetRequestEntryOptions = {},
) => {
  if (options.previewToken) {
    return getPreviewEntryByUri(uri, options.previewToken);
  }

  const draft = await draftMode();

  if (draft.isEnabled) {
    const cookieStore = await cookies();
    const previewToken = cookieStore.get(CRAFT_PREVIEW_TOKEN_COOKIE)?.value;

    if (previewToken) {
      return getPreviewEntryByUri(uri, previewToken);
    }
  }

  return getEntryByUri(uri);
};

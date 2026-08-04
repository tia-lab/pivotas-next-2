import {
  CRAFT_PREVIEW_TOKEN_PARAM,
  CRAFT_PREVIEW_TOKEN_COOKIE,
  normalizePreviewUri,
  pathFromCraftUri,
} from "@/lib/craft/preview";
import { getSiteUrl } from "@/lib/site-url";
import { draftMode } from "next/headers";
import { NextResponse } from "next/server";

const previewSecret = process.env.CRAFT_PREVIEW_SECRET;

export const GET = async (request: Request) => {
  const url = new URL(request.url);
  const token = url.searchParams.get("token");
  const secret = url.searchParams.get("secret");

  if (!previewSecret) {
    return Response.json(
      { enabled: false, message: "Preview secret is not configured." },
      { status: 500 },
    );
  }

  if (secret !== previewSecret) {
    return Response.json(
      { enabled: false, message: "Invalid preview secret." },
      { status: 401 },
    );
  }

  const uri = normalizePreviewUri(url.searchParams.get("uri"));
  const redirectUrl = new URL(pathFromCraftUri(uri), getSiteUrl(url.origin));
  const draft = await draftMode();

  if (!token) {
    draft.disable();

    const response = NextResponse.redirect(redirectUrl);
    response.cookies.delete(CRAFT_PREVIEW_TOKEN_COOKIE);

    return response;
  }

  draft.enable();

  redirectUrl.searchParams.set(CRAFT_PREVIEW_TOKEN_PARAM, token);

  const response = NextResponse.redirect(redirectUrl);

  response.cookies.set(CRAFT_PREVIEW_TOKEN_COOKIE, token, {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  return response;
};

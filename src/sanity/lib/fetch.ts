import "server-only";

import type { QueryParams } from "next-sanity";
import { getSanityClient } from "@/sanity/lib/client";

export type SanityFetchOptions = {
  revalidate?: number | false;
  tags?: string[];
};

export async function fetchSanity<T>(
  query: string,
  params: QueryParams = {},
  options: SanityFetchOptions = {},
): Promise<T> {
  const { revalidate = 300, tags = [] } = options;

  return getSanityClient().fetch<T>(query, params, {
    next: { revalidate, tags },
  });
}

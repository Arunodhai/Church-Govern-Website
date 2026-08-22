type JsonLdValue = Record<string, unknown> | Record<string, unknown>[];

/** Renders trusted, server-created structured data without allowing an HTML close-tag escape. */
export function JsonLd({ data }: { data: JsonLdValue }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replaceAll("<", "\\u003c") }}
    />
  );
}


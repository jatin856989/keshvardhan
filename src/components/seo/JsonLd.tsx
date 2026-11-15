type JsonLdValue = Record<string, unknown> | Array<Record<string, unknown>>;

/**
 * Renders schema.org JSON-LD. The payload is our own, but we still escape
 * "<" so a value containing "</script>" cannot break out of the tag.
 */
export function JsonLd({ data }: { data: JsonLdValue }) {
  const json = JSON.stringify(data, (_k, v) => (v === undefined ? undefined : v)).replace(
    /</g,
    "\\u003c",
  );
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />
  );
}

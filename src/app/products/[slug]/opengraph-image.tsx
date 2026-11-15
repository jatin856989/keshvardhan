import { ImageResponse } from "next/og";
import { getProduct, products } from "@/lib/products";
import { formatINR } from "@/lib/money";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProduct(slug);
  const name = product?.name ?? "Keshsudha";
  const tagline = product?.tagline ?? "Nectar for your hair, inside and out";
  const price = product ? formatINR(product.pricePaise) : "";
  const accent = product?.color ?? "#C4653A";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#1F3D2B",
          color: "#F6F1E7",
          padding: 72,
          position: "relative",
          fontFamily: "Georgia, serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            right: -120,
            top: -120,
            width: 520,
            height: 520,
            borderRadius: 9999,
            background: accent,
            opacity: 0.25,
            display: "flex",
          }}
        />
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: "100%" }}>
          <div style={{ fontSize: 26, letterSpacing: 10, opacity: 0.8, display: "flex" }}>KESHSUDHA</div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 84, lineHeight: 1.05, display: "flex", maxWidth: 900 }}>{name}</div>
            <div style={{ fontSize: 30, marginTop: 24, opacity: 0.85, display: "flex", maxWidth: 900, fontFamily: "Arial, sans-serif" }}>
              {tagline}
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 20, fontFamily: "Arial, sans-serif" }}>
            {price ? (
              <div style={{ background: accent, color: "#fff", padding: "14px 28px", borderRadius: 999, fontSize: 32, fontWeight: 700, display: "flex" }}>
                {price}
              </div>
            ) : null}
            <div style={{ fontSize: 24, opacity: 0.8, display: "flex" }}>Free 30-day guide with every order · Ships across India</div>
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}

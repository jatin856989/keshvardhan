import { beforeAll, describe, expect, it } from "vitest";

beforeAll(() => {
  process.env.EBOOK_SIGNING_SECRET = "unit-test-secret-please-ignore";
});

describe("signed tokens", () => {
  it("round-trips a payload and rejects tampering", async () => {
    const { signToken, verifyToken } = await import("@/lib/crypto");
    const token = signToken("ebook:abc", 60);
    expect(verifyToken(token)?.payload).toBe("ebook:abc");
    expect(verifyToken(token.replace("abc", "abd"))).toBeNull();
    expect(verifyToken(token.slice(0, -1) + (token.endsWith("a") ? "b" : "a"))).toBeNull();
  });
  it("rejects expired tokens", async () => {
    const { signToken, verifyToken } = await import("@/lib/crypto");
    const token = signToken("ebook:abc", -10);
    expect(verifyToken(token)).toBeNull();
  });
  it("derives stable order access keys", async () => {
    const { orderAccessKey, verifyOrderAccessKey } = await import("@/lib/crypto");
    const key = orderAccessKey("11111111-1111-1111-1111-111111111111");
    expect(key).toHaveLength(32);
    expect(verifyOrderAccessKey("11111111-1111-1111-1111-111111111111", key)).toBe(true);
    expect(verifyOrderAccessKey("22222222-2222-2222-2222-222222222222", key)).toBe(false);
    expect(verifyOrderAccessKey("11111111-1111-1111-1111-111111111111", undefined)).toBe(false);
  });
  it("eBook tokens are scoped to orders", async () => {
    const { createEbookToken, verifyEbookToken } = await import("@/lib/ebook");
    const t = createEbookToken("order-1");
    expect(verifyEbookToken(t)).toBe("order-1");
    expect(verifyEbookToken("nope.1.2")).toBeNull();
  });
});

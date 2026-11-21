/**
 * Customer testimonials.
 *
 * Keshvardhan is pre-launch, so this list is intentionally EMPTY. Never add an invented
 * review, a paraphrase of someone else's, or a name that is not a real customer who has
 * agreed in writing to be quoted: fake testimonials breach ASCI guidelines and the
 * Consumer Protection (E-Commerce) Rules, 2020.
 *
 * To add one: get written consent (an email reply is enough, keep it), then append an
 * entry below. Only describe what the person says about their own experience; do not add
 * outcome or growth claims on their behalf. The homepage section switches from its
 * "first reviewers" message to the review cards automatically once entries exist.
 */
export interface Testimonial {
  id: string;
  /** First name and initial, as the customer agreed to be shown. */
  name: string;
  city?: string;
  /** Product slug the review is about. */
  product: "routine-bundle" | "daily-root-powder" | "root-ritual-oil";
  /** 1 to 5, as the customer rated it. */
  rating: 1 | 2 | 3 | 4 | 5;
  quote: string;
  /** True only if the order exists in the orders table. */
  verifiedPurchase: boolean;
  /** ISO date the customer gave consent and the review. */
  date: string;
}

export const testimonials: Testimonial[] = [];

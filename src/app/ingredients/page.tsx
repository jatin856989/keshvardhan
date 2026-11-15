import type { Metadata } from "next";
import { defaultOgImage } from "@/lib/site";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { PageIntro } from "@/components/ui/PageIntro";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/Reveal";
import { productBySlug } from "@/lib/products";

export const metadata: Metadata = {
  title: "Ingredients: every botanical in Keshsudha, with quantities",
  description:
    "The full ingredient list for Daily Root Powder and Root Ritual Oil: amla, bhringraj, curry leaf, moringa, hibiscus, fenugreek, black sesame, pumpkin seed, coconut, castor and rosemary, with the exact amount of each.",
  alternates: { canonical: "/ingredients" },
  openGraph: { title: "Every ingredient, with quantities | Keshsudha", description: "Nothing hidden behind a proprietary blend.", url: "/ingredients", images: [defaultOgImage] },
};

const stories = [
  { name: "Amla", botanical: "Emblica officinalis", story: "The Indian gooseberry, one of the richest natural sources of vitamin C and the first hair ingredient in almost every regional tradition. We use it in both the powder and the oil." },
  { name: "Bhringraj", botanical: "Eclipta alba", story: "Called the king of herbs for hair in Ayurveda. Traditionally infused into oils for the scalp; we also include the dried leaf in the powder." },
  { name: "Curry leaf", botanical: "Murraya koenigii", story: "A kitchen staple across South India with antioxidant compounds and a long history in hair oils." },
  { name: "Moringa", botanical: "Moringa oleifera", story: "Drumstick leaf, dense in iron, protein and micronutrients. It gives the powder its deep green." },
  { name: "Hibiscus", botanical: "Hibiscus rosa-sinensis", story: "The flower behind many traditional conditioning pastes. Mucilage from the petals softens hair." },
  { name: "Fenugreek", botanical: "Trigonella foenum-graecum", story: "Methi seeds, soaked and ground in households for generations for shedding and scalp comfort." },
  { name: "Black sesame", botanical: "Sesamum indicum", story: "Healthy fats and zinc in the powder; cold-pressed into the base of the oil, as Ayurvedic texts prescribe." },
  { name: "Pumpkin seed", botanical: "Cucurbita pepo", story: "Plant protein and zinc, and a mild nuttiness that makes the powder easy to take." },
  { name: "Coconut oil", botanical: "Cocos nucifera", story: "Cold-pressed. One of the few oils shown to penetrate the hair shaft rather than sit on it." },
  { name: "Castor oil", botanical: "Ricinus communis", story: "Thick and traditional. A small amount gives the oil body without heaviness." },
  { name: "Rosemary", botanical: "Rosmarinus officinalis", story: "Half a millilitre of essential oil per bottle, for scent and a gentle scalp stimulant." },
];

export default function IngredientsPage() {
  const powder = productBySlug["daily-root-powder"];
  const oil = productBySlug["root-ritual-oil"];
  return (
    <>
      <PageIntro
        eyebrow="Ingredients"
        title="Nothing hidden behind a proprietary blend."
        lead="Eleven plants. Two products. Every quantity printed on the label and repeated here, so you can compare, question and decide."
        crumbs={[{ name: "Ingredients", href: "/ingredients" }]}
      />
      <Container className="mt-14">
        <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {stories.map((s) => (
            <StaggerItem key={s.name} className="card p-6 transition hover:-translate-y-1 hover:shadow-lift">
              <h2 className="font-display text-2xl text-forest">{s.name}</h2>
              <p className="text-xs italic text-stone">{s.botanical}</p>
              <p className="mt-3 text-sm leading-relaxed text-ink">{s.story}</p>
            </StaggerItem>
          ))}
        </Stagger>

        <div className="mt-20 grid gap-10 lg:grid-cols-2">
          <Reveal>
            <h2 className="font-display text-3xl text-forest">
              <Link href={`/products/${powder.slug}`} className="hover:underline">{powder.name}</Link>, per 5 g serving
            </h2>
            <div className="prose-ks mt-4">
              <table>
                <thead><tr><th scope="col">Ingredient</th><th scope="col">Amount</th><th scope="col">Role</th></tr></thead>
                <tbody>
                  {powder.ingredients.map((i) => (
                    <tr key={i.name}><td className="font-semibold text-forest">{i.name}</td><td className="whitespace-nowrap">{i.amount}</td><td>{i.role}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-sm text-stone">Allergen note: contains sesame. Processed in a facility that also handles nuts.</p>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="font-display text-3xl text-forest">
              <Link href={`/products/${oil.slug}`} className="hover:underline">{oil.name}</Link>, per 100 ml
            </h2>
            <div className="prose-ks mt-4">
              <table>
                <thead><tr><th scope="col">Ingredient</th><th scope="col">Amount</th><th scope="col">Role</th></tr></thead>
                <tbody>
                  {oil.ingredients.map((i) => (
                    <tr key={i.name}><td className="font-semibold text-forest">{i.name}</td><td className="whitespace-nowrap">{i.amount}</td><td>{i.role}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-sm text-stone">Patch test on the inner arm before first use. Contains rosemary essential oil; avoid during pregnancy unless your doctor agrees.</p>
          </Reveal>
        </div>

        <Reveal className="mt-20 rounded-[2rem] bg-white p-8 sm:p-12">
          <h2 className="font-display text-3xl text-forest">How we test</h2>
          <div className="prose-ks mt-4">
            <p>
              Every batch of both products goes to an NABL-accredited laboratory before it is released. The powder is
              tested for heavy metals (lead, arsenic, cadmium, mercury), microbial load, yeast and mould, and pesticide
              residue. The oil is tested for microbial load, rancidity and heavy metals, and stability-tested for its
              18-month shelf life.
            </p>
            <p>
              Certificates of analysis are available on request for any batch number printed on your pack. Write to us
              from the <Link href="/contact">contact page</Link>.
            </p>
          </div>
        </Reveal>
      </Container>
    </>
  );
}

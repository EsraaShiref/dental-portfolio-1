export const categories = [
  "Restorative",
  "Prosthodontics",
  "Endodontics",
  "Surgery",
  "Cosmetic Dentistry",
  "Pediatric Dentistry",
] as const;
export type Category = (typeof categories)[number];
/** Visitor-facing names; internal ids (and image folders) stay unchanged. */
const categoryLabels: Partial<Record<Category, string>> = { Prosthodontics: "Fixed" };
export const categoryLabel = (c: Category) => categoryLabels[c] ?? c;
/** Cases shown before "See more" in every filter. */
export const INITIAL_VISIBLE = 6;
/** Filtered cases; "All" interleaves categories round-robin so the first cards are mixed. */
export const filterCases = (list: DentalCase[], filter: Category | "All") => {
  if (filter !== "All") return list.filter((c) => c.category === filter);
  const groups = categories.map((c) => list.filter((item) => item.category === c));
  const out: DentalCase[] = [];
  for (let i = 0; groups.some((g) => i < g.length); i++)
    for (const g of groups) { const item = g[i]; if (item) out.push(item); }
  return out;
};
type CaseBase = {
  id: number | string;
  title: string;
  category: Category;
  /** Card frame: "portrait" (4/5, default) or "square" (1/1). */
  aspect?: "portrait" | "square";
};
/** Before/after pair shown with the comparison slider. */
export type ComparisonCase = CaseBase & {
  kind: "comparison";
  before: string;
  after: string;
  /** Explicit alt text per stage; falls back to "<title> <stage> treatment". */
  alt?: { before: string; after: string };
};
/** One image (e.g. a panoramic X-ray) shown without the slider. */
export type SingleCase = CaseBase & { kind: "single"; image: string; alt: string };
export type DentalCase = ComparisonCase | SingleCase;
export const caseAlt = (dentalCase: ComparisonCase, stage: "before" | "after") =>
  dentalCase.alt?.[stage] ?? `${dentalCase.title} ${stage} treatment`;
export const caseImages = (dentalCase: DentalCase) =>
  dentalCase.kind === "single" ? [dentalCase.image] : [dentalCase.before, dentalCase.after];
export const cases: DentalCase[] = [
  {
    id: "restorative-1",
    kind: "comparison",
    title: "Restorative Case 1",
    category: "Restorative",
    aspect: "square",
    before: "/cases/restorative/restorative-1-before.jpeg",
    after: "/cases/restorative/restorative-1-after.jpeg",
    alt: {
      before: "Restorative case 1 – before treatment",
      after: "Restorative case 1 – after treatment",
    },
  },
  {
    id: "restorative-2",
    kind: "comparison",
    title: "Restorative Case 2",
    category: "Restorative",
    aspect: "square",
    before: "/cases/restorative/restorative-2-before.jpeg",
    after: "/cases/restorative/restorative-2-after.jpeg",
    alt: {
      before: "Restorative case 2 – before treatment",
      after: "Restorative case 2 – after treatment",
    },
  },
  {
    id: "restorative-3",
    kind: "comparison",
    title: "Restorative Case 3",
    category: "Restorative",
    aspect: "square",
    before: "/cases/restorative/restorative-3-before.jpeg",
    after: "/cases/restorative/restorative-3-after.jpeg",
    alt: {
      before: "Restorative case 3 – before treatment",
      after: "Restorative case 3 – after treatment",
    },
  },
  {
    id: "restorative-4",
    kind: "comparison",
    title: "Restorative Case 4",
    category: "Restorative",
    aspect: "square",
    before: "/cases/restorative/restorative-4-before.jpeg",
    after: "/cases/restorative/restorative-4-after.jpeg",
    alt: {
      before: "Restorative case 4 – before treatment",
      after: "Restorative case 4 – after treatment",
    },
  },
  {
    id: "restorative-5",
    kind: "comparison",
    title: "Restorative Case 5",
    category: "Restorative",
    aspect: "square",
    before: "/cases/restorative/restorative-5-before.jpeg",
    after: "/cases/restorative/restorative-5-after.jpeg",
    alt: {
      before: "Restorative case 5 – before treatment",
      after: "Restorative case 5 – after treatment",
    },
  },
  {
    id: "restorative-6",
    kind: "comparison",
    title: "Restorative Case 6",
    category: "Restorative",
    aspect: "square",
    before: "/cases/restorative/restorative-6-before.jpeg",
    after: "/cases/restorative/restorative-6-after.jpeg",
    alt: {
      before: "Restorative case 6 – before treatment",
      after: "Restorative case 6 – after treatment",
    },
  },
  {
    id: "fixed-2",
    kind: "comparison",
    title: "Fixed Case 1",
    category: "Prosthodontics",
    aspect: "square",
    before: "/cases/prosthodontics/fixed-2-before.jpeg",
    after: "/cases/prosthodontics/fixed-2-after.jpeg",
    alt: {
      before: "Fixed case 1 – before treatment",
      after: "Fixed case 1 – after treatment",
    },
  },
  {
    id: "fixed-3",
    kind: "comparison",
    title: "Fixed Case 2",
    category: "Prosthodontics",
    aspect: "square",
    before: "/cases/prosthodontics/fixed-3-before.jpeg",
    after: "/cases/prosthodontics/fixed-3-after.jpeg",
    alt: {
      before: "Fixed case 2 – before treatment",
      after: "Fixed case 2 – after treatment",
    },
  },
  {
    id: "fixed-4",
    kind: "comparison",
    title: "Fixed Case 3",
    category: "Prosthodontics",
    aspect: "square",
    before: "/cases/prosthodontics/fixed-4-before.jpeg",
    after: "/cases/prosthodontics/fixed-4-after.jpeg",
    alt: {
      before: "Fixed case 3 – before treatment",
      after: "Fixed case 3 – after treatment",
    },
  },
  {
    id: "fixed-5",
    kind: "comparison",
    title: "Fixed Case 4",
    category: "Prosthodontics",
    aspect: "square",
    before: "/cases/prosthodontics/fixed-5-before.jpeg",
    after: "/cases/prosthodontics/fixed-5-after.jpeg",
    alt: {
      before: "Fixed case 4 – before treatment",
      after: "Fixed case 4 – after treatment",
    },
  },
  {
    id: "fixed-6",
    kind: "comparison",
    title: "Fixed Case 5",
    category: "Prosthodontics",
    aspect: "square",
    before: "/cases/prosthodontics/fixed-6-before.jpeg",
    after: "/cases/prosthodontics/fixed-6-after.jpeg",
    alt: {
      before: "Fixed case 5 – before treatment",
      after: "Fixed case 5 – after treatment",
    },
  },
  {
    id: "fixed-7",
    kind: "comparison",
    title: "Fixed Case 6",
    category: "Prosthodontics",
    aspect: "square",
    before: "/cases/prosthodontics/fixed-7-before.jpeg",
    after: "/cases/prosthodontics/fixed-7-after.jpeg",
    alt: {
      before: "Fixed case 6 – before treatment",
      after: "Fixed case 6 – after treatment",
    },
  },
  {
    id: "fixed-8",
    kind: "comparison",
    title: "Fixed Case 7",
    category: "Prosthodontics",
    aspect: "square",
    before: "/cases/prosthodontics/fixed-8-before.jpeg",
    after: "/cases/prosthodontics/fixed-8-after.jpeg",
    alt: {
      before: "Fixed case 7 – before treatment",
      after: "Fixed case 7 – after treatment",
    },
  },
  {
    id: "endo-1",
    kind: "comparison",
    title: "Endodontic Case 1",
    category: "Endodontics",
    aspect: "square",
    before: "/cases/endodontics/endo-1-before.jpeg",
    after: "/cases/endodontics/endo-1-after.jpeg",
    alt: {
      before: "Endodontic case 1 – before treatment radiograph",
      after: "Endodontic case 1 – after treatment radiograph",
    },
  },
  {
    id: "endo-2",
    kind: "comparison",
    title: "Endodontic Case 2",
    category: "Endodontics",
    aspect: "square",
    before: "/cases/endodontics/endo-2-before.jpeg",
    after: "/cases/endodontics/endo-2-after.jpeg",
    alt: {
      before: "Endodontic case 2 – before treatment radiograph",
      after: "Endodontic case 2 – after treatment radiograph",
    },
  },
  {
    id: "endo-3",
    kind: "comparison",
    title: "Endodontic Case 3",
    category: "Endodontics",
    aspect: "square",
    before: "/cases/endodontics/endo-3-before.jpeg",
    after: "/cases/endodontics/endo-3-after.jpeg",
    alt: {
      before: "Endodontic case 3 – before treatment radiograph",
      after: "Endodontic case 3 – after treatment radiograph",
    },
  },
  {
    id: "endo-4",
    kind: "comparison",
    title: "Endodontic Case 4",
    category: "Endodontics",
    aspect: "square",
    before: "/cases/endodontics/endo-4-before.jpeg",
    after: "/cases/endodontics/endo-4-after.jpeg",
    alt: {
      before: "Endodontic case 4 – before treatment radiograph",
      after: "Endodontic case 4 – after treatment radiograph",
    },
  },
  {
    id: "endo-5",
    kind: "comparison",
    title: "Endodontic Case 5",
    category: "Endodontics",
    aspect: "square",
    before: "/cases/endodontics/endo-5-before.jpeg",
    after: "/cases/endodontics/endo-5-after.jpeg",
    alt: {
      before: "Endodontic case 5 – before treatment radiograph",
      after: "Endodontic case 5 – after treatment radiograph",
    },
  },
  {
    id: "surgery-1",
    kind: "single",
    title: "Surgery Case 1",
    category: "Surgery",
    aspect: "square",
    image: "/cases/surgery/surgery-1.jpeg",
    alt: "Surgery case 1",
  },
  {
    id: "surgery-2",
    kind: "single",
    title: "Surgery Case 2",
    category: "Surgery",
    aspect: "square",
    image: "/cases/surgery/surgery-2.jpeg",
    alt: "Surgery case 2",
  },
  {
    id: "surgery-3",
    kind: "single",
    title: "Surgery Case 3",
    category: "Surgery",
    aspect: "square",
    image: "/cases/surgery/surgery-3.jpeg",
    alt: "Surgery case 3",
  },
  {
    id: "surgery-4",
    kind: "single",
    title: "Surgery Case 4",
    category: "Surgery",
    aspect: "square",
    image: "/cases/surgery/surgery-4.jpeg",
    alt: "Surgery case 4",
  },
];
/** Only categories with at least one real case get a filter chip. */
export const activeCategories = categories.filter((c) => cases.some((item) => item.category === c));
export type DentalVideo = {
  id: number;
  title: string;
  description: string;
  src: string;
};
export const videos: DentalVideo[] = [1, 2, 3].map((id) => ({
  id,
  title: `Dental Content ${id}`,
  description: "Dental education for patients.",
  src: `/cases/Content-Creator/Video-${id}.mp4`,
}));

/** Intro splash video shown full-screen on every page load. */
export const introVideoSrc = "/cases/Content-Creator/Video-3.mp4";
export const introPosterSrc = "/cases/Content-Creator/intro-poster.jpg";

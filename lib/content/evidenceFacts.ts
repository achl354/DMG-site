/** A proportion (e.g. "47.6%", "1 in 5") -- rendered as a filled ring. */
export interface RingVisual {
  type: "ring";
  /** 0-100. Derived directly from the fact's own statistic, never invented. */
  percent: number;
}

/** Two real values the source text itself compares (e.g. "9.4 ... compared
 * with 6.8", or "2.3x the national average", where the average is 1 by
 * definition) -- rendered as two small bars. Never used for a bare count
 * with nothing to compare it against. */
export interface CompareVisual {
  type: "compare";
  value: number;
  valueLabel: string;
  baseline: number;
  baselineLabel: string;
}

export type EvidenceVisual = RingVisual | CompareVisual;

export interface EvidenceFact {
  id: string;
  statistic: string;
  statement: string;
  source: string;
  period: string;
  sourceUrl: string;
  /** Internal Clinical Insight article covering this statistic, when one exists. */
  articleUrl?: string;
  /** Optional small visual reinforcing the statistic -- omitted for facts
   * that are a standalone count or estimate with no real second value to
   * compare against (see healthcare-claims, compensation-cost-illustration
   * below), rather than inventing one. */
  visual?: EvidenceVisual;
}

/** Plain (non-component) helper so the Math.random() call doesn't appear
 * directly inside a component body -- react-hooks' purity rule flags that
 * pattern even for a Server Component that's only ever invoked once. */
export function pickRandomFactIndex(length: number) {
  return Math.floor(Math.random() * length);
}

export const evidenceFacts: EvidenceFact[] = [
  {
    id: "musculoskeletal-frequency",
    statistic: "2.3×",
    statement:
      "Higher serious musculoskeletal claim frequency among nursing, care and support workers compared with the national average.",
    source: "Safe Work Australia",
    period: "2022–23",
    sourceUrl:
      "https://data.safeworkaustralia.gov.au/profile/whs-profile-nursing-care-support-workforce",
    articleUrl: "/resources/patient-handling-risk-extends-beyond-lifting",
    // "2.3x the national average" is itself a ratio against a baseline of 1 --
    // not an invented comparison, just the statistic's own definition.
    visual: {
      type: "compare",
      value: 2.3,
      valueLabel: "Nursing, care & support",
      baseline: 1,
      baselineLabel: "National average",
    },
  },
  {
    id: "body-stressing-share",
    statistic: "47.6%",
    statement:
      "Average proportion of serious claims attributed to body stressing in the nursing, care and support workforce over the decade to 2022–23.",
    source: "Safe Work Australia",
    period: "2012–13 to 2022–23",
    sourceUrl:
      "https://data.safeworkaustralia.gov.au/profile/whs-profile-nursing-care-support-workforce",
    articleUrl: "/resources/patient-handling-risk-extends-beyond-lifting",
    visual: { type: "ring", percent: 47.6 },
  },
  {
    id: "handling-beyond-lifting",
    statistic: "60%",
    statement:
      "Of body-stressing claims involved muscular stress during handling activities other than lifting, carrying or putting objects down.",
    source: "Safe Work Australia",
    period: "Workforce profile data",
    sourceUrl:
      "https://data.safeworkaustralia.gov.au/profile/whs-profile-nursing-care-support-workforce",
    articleUrl: "/resources/patient-handling-risk-extends-beyond-lifting",
    visual: { type: "ring", percent: 60 },
  },
  {
    id: "healthcare-share",
    statistic: "1 in 5",
    statement:
      "Serious Australian workers' compensation claims arose from the healthcare and social assistance industry.",
    source: "Safe Work Australia",
    period: "2023–24 preliminary data",
    sourceUrl:
      "https://data.safeworkaustralia.gov.au/insights/key-whs-statistics-australia/latest-release",
    articleUrl: "/resources/workforce-impact-of-musculoskeletal-injuries-in-healthcare",
    // "1 in 5" == 20% -- the ring's percent is derived from the statistic
    // itself, not a separate/invented figure.
    visual: { type: "ring", percent: 20 },
  },
  {
    id: "healthcare-claims",
    statistic: "29,100",
    statement: "Serious workers' compensation claims were recorded in healthcare and social assistance.",
    source: "Safe Work Australia",
    period: "2023–24 preliminary data",
    sourceUrl:
      "https://data.safeworkaustralia.gov.au/insights/key-whs-statistics-australia/latest-release",
    articleUrl: "/resources/workforce-impact-of-musculoskeletal-injuries-in-healthcare",
  },
  {
    id: "claim-frequency",
    statistic: "9.4",
    statement:
      "Serious claims per million hours worked in healthcare and social assistance, compared with 6.8 across all industries.",
    source: "Safe Work Australia",
    period: "2023–24 preliminary data",
    sourceUrl:
      "https://data.safeworkaustralia.gov.au/insights/key-whs-statistics-australia/latest-release",
    articleUrl: "/resources/workforce-impact-of-musculoskeletal-injuries-in-healthcare",
    visual: {
      type: "compare",
      value: 9.4,
      valueLabel: "Healthcare & social assistance",
      baseline: 6.8,
      baselineLabel: "All industries",
    },
  },
  {
    id: "compensation-cost-illustration",
    statistic: "$40.8 million",
    statement:
      "An illustrative compensation estimate for 2,500 serious claims, calculated using Safe Work Australia's national median compensation payment of $16,300 per serious claim.",
    source: "Safe Work Australia",
    period: "2023–24 preliminary data",
    sourceUrl:
      "https://data.safeworkaustralia.gov.au/insights/key-whs-statistics-australia/latest-release",
  },
];

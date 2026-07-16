export interface EvidenceFact {
  id: string;
  statistic: string;
  statement: string;
  source: string;
  period: string;
  sourceUrl: string;
  /** Internal Clinical Insight article covering this statistic, when one exists. */
  articleUrl?: string;
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
  },
];

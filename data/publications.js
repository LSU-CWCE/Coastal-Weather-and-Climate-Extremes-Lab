/* ==========================================================================
   Publications
   Add a new paper by copying one block below. The site sorts by year
   (newest first) and highlights the PI's name automatically.

   Fields:
     year     (required) number
     authors  (required) as you want it printed
     title    (required)
     journal  (required)
     volume, issue, article   optional
     doi      optional — e.g. "10.1029/2024GL109202" (a DOI link is generated)
     url      optional — used instead of the DOI link if given
     pdf      optional — e.g. "assets/papers/liang2024.pdf"
     note     optional — short tag such as "In Chinese" or "Featured"
     themes   optional — research theme ids: precip, coastal, circulation, predictability
     status   optional — "in-prep" for manuscripts in preparation (no year needed);
              these appear only on the Publications page, under "In prep"
   ========================================================================== */
window.LAB_PUBLICATIONS = [
  {
    status: "in-prep",
    authors: "Liang, W., et al.",
    title: "Multidecadal internal variability shaping extreme precipitation trends in the United States since 1950",
    note: "In preparation",
    themes: ["predictability", "precip"]
  },
  {
    year: 2026,
    authors: "Liang, W., Zhao, M., Tan, Z., Knutson, T., Dong, W., & Zhang, B.",
    title: "Confronting historical precipitation trends in models with observations: Forced signal and atmospheric internal variability",
    journal: "Geophysical Research Letters",
    volume: "53", issue: "3", article: "e2025GL118712",
    doi: "10.1029/2025GL118712",
    themes: ["predictability", "precip"]
  },
  {
    year: 2024,
    authors: "Liang, W., Zhao, M., Tan, Z., Knutson, T., Dong, W., & Zhang, B.",
    title: "The direct radiative effect of CO2 increase on summer precipitation in North America",
    journal: "Geophysical Research Letters",
    volume: "51", issue: "14", article: "e2024GL109202",
    doi: "10.1029/2024GL109202",
    themes: ["circulation", "precip"]
  },
  {
    year: 2022,
    authors: "Liang, W., & Zhang, M.",
    title: "Future changes of the eddy moisture convergence in winter over coastal lands in Eastern North America and East Asia",
    journal: "Journal of Geophysical Research: Atmospheres",
    volume: "127", issue: "17", article: "e2022JD037149",
    doi: "10.1029/2022JD037149",
    themes: ["circulation", "precip", "coastal"]
  },
  {
    year: 2022,
    authors: "Liang, W., & Zhang, M.",
    title: "Transient precipitation increase during winter in the Eastern North America",
    journal: "Geophysical Research Letters",
    volume: "49", issue: "6", article: "e2022GL098188",
    doi: "10.1029/2022GL098188",
    themes: ["precip", "circulation"]
  },
  {
    year: 2022,
    authors: "Liang, W., & Zhang, M.",
    title: "Increasing future precipitation in the southwestern US in the summer and its contrasting mechanism with decreasing precipitation in the spring",
    journal: "Geophysical Research Letters",
    volume: "49", issue: "2", article: "e2021GL096283",
    doi: "10.1029/2021GL096283",
    themes: ["precip"]
  },
  {
    year: 2021,
    authors: "Liang, W., & Zhang, M.",
    title: "Summer and winter precipitation in East Asia scale with global warming at different rates",
    journal: "Communications Earth & Environment",
    volume: "2", issue: "1", article: "1–8",
    doi: "10.1038/s43247-021-00219-2",
    themes: ["precip"]
  },
  {
    year: 2016,
    authors: "Liang, W., & Wen, X.",
    title: "An overview of Paleo-AO/NAO studies",
    journal: "Advances in Earth Science",
    volume: "31", issue: "11", article: "1137–1150",
    note: "In Chinese",
    themes: ["circulation"]
  }
];

/* Name variants that should appear in bold in author lists. */
window.LAB_HIGHLIGHT_AUTHORS = ["Liang, W."];

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
    volume: "2", issue: "1", article: "150",
    doi: "10.1038/s43247-021-00219-2",
    themes: ["precip"]
  },
  {
    year: 2016,
    authors: "Liang, W., & Wen, X.",
    title: "An overview of Paleo-AO/NAO studies",
    journal: "Advances in Earth Science",
    volume: "31", issue: "11", article: "1137–1150",
    doi: "10.11867/j.issn.1001-8166.2016.11.1137",
    note: "In Chinese",
    themes: ["circulation"]
  }
];

/* ==========================================================================
   Conference presentations and theses
   Listed below the papers on the Publications page only, newest first.

   Fields:
     year     (required) number
     authors  (required) as you want it printed
     title    (required)
     meeting  (required) e.g. "AGU Fall Meeting 2025"; for a thesis, the degree
              and university, e.g. "Ph.D. dissertation, Stony Brook University"
     number   optional — abstract number, e.g. "A11A-08"
     doi      optional — a DOI link is generated
     url      optional — link to the abstract, used if there is no DOI
     type     optional — "thesis" lists it under Theses; anything else is a presentation
   ========================================================================== */
window.LAB_PRESENTATIONS = [
  {
    year: 2025,
    authors: "Liang, W., Zhao, M., Tan, Z., Knutson, T., Dong, W., & Zhang, B.",
    title: "Investigating historical precipitation trends in models and observations: Forced signals and atmospheric internal variability",
    meeting: "AGU Fall Meeting 2025",
    number: "A11A-08"
  },
  {
    year: 2025,
    authors: "Coomans, A., Gentile, E. S., Liang, W., & Zhao, M.",
    title: "A study of extratropical cyclones statistics in present-day and warmer climates",
    meeting: "105th AMS Annual Meeting",
    url: "https://ams.confex.com/ams/105ANNUAL/meetingapp.cgi/Paper/448662"
  },
  {
    year: 2024,
    authors: "Liang, W., Zhao, M., Tan, Z., Knutson, T., Dong, W., & Zhang, B.",
    title: "The direct radiative effect of CO2 increase on North American precipitation",
    meeting: "AGU Fall Meeting 2024",
    number: "A32C-08"
  },
  {
    year: 2024,
    authors: "Liang, W., & Zhao, M.",
    title: "Future precipitation changes in North America in a warmer climate",
    meeting: "EGU General Assembly 2024",
    number: "EGU24-6720",
    doi: "10.5194/egusphere-egu24-6720"
  },
  {
    year: 2023,
    authors: "Liang, W., Zhao, M., & Zhang, M.",
    title: "Future changes in extreme precipitation in North America under a warmer climate",
    meeting: "AGU Fall Meeting 2023",
    number: "A14D-02"
  },
  {
    year: 2023,
    type: "thesis",
    authors: "Liang, W.",
    title: "Regional mechanisms of future hydroclimate changes in a warmer climate",
    meeting: "Ph.D. dissertation, Stony Brook University",
    url: "https://www.proquest.com/openview/bd1defb54511672428d0aa78a1eb4c6d/1?cbl=18750&diss=y"
  },
  {
    year: 2020,
    authors: "Wen, X., & Liang, W.",
    title: "Evolution of Arctic Oscillation in the past 21,000 years: A modeling study",
    meeting: "100th AMS Annual Meeting",
    url: "https://ams.confex.com/ams/2020Annual/meetingapp.cgi/Paper/365848"
  },
  {
    year: 2019,
    authors: "Liang, W., & Zhang, M.",
    title: "Interpreting the diurnal cycle of precipitation in the Southern Great Plains using North American Regional Reanalysis",
    meeting: "AGU Fall Meeting 2019",
    number: "A41I-2767"
  }
];

/* Name variants that should appear in bold in author lists. */
window.LAB_HIGHLIGHT_AUTHORS = ["Liang, W."];

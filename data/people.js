/* ==========================================================================
   Group members — each one is shown as a profile like the PI's: photo on the
   left, details on the right, one member after another.

   Fields (only name, role and group are required):
     name       e.g. "Jane Doe"
     role       e.g. "M.S. Student", "PhD Student", "Undergraduate Researcher"
     position   optional second line, e.g. "Graduate Research Assistant"
     group      one of: "postdoc", "grad", "undergrad", "staff" (sets the order)
     photo      e.g. "assets/img/people/jane-doe.jpg" (portrait, about 3:4)
     email
     url        personal page
     bio        a short paragraph
     education  list of [years, degree, institution]
     research   one or two sentences on research or thesis work
     projects   list of short lines
     skills     one line
     interests  one line, for "Outside the lab"
   ========================================================================== */
window.LAB_MEMBERS = [
  {
    name: "Haoxin Ni",
    role: "M.S. Student",
    position: "Graduate Research Assistant",
    group: "grad",
    photo: "assets/img/people/haoxin-ni.jpg",
    email: "hni3@lsu.edu",
    bio: "Haoxin joined the lab in August 2026 as an M.S. student in Oceanography and Coastal Sciences and a graduate research assistant, advised by Dr. Wengui Liang. Haoxin works on extreme weather, in particular tracking and analyzing hurricanes, and trained in atmospheric science through the joint NUIST–University of Reading program.",
    education: [
      ["2026–", "M.S., Oceanography and Coastal Sciences", "Louisiana State University (in progress)"],
      ["2022–2026", "B.Sc. (Hons), Atmospheric Sciences", "University of Reading"],
      ["2022–2026", "B.S., Atmospheric Science", "Nanjing University of Information Science and Technology"]
    ],
    research: "Extreme weather, with a focus on tracking and analyzing hurricanes."
  },
  // Placeholders, hidden on the site until the details arrive: fill in the fields and delete `placeholder: true`.
  { name: "Member Name", role: "M.S. Student", group: "grad", bio: "Profile coming soon.", placeholder: true },
  { name: "Member Name", role: "Undergraduate Researcher", group: "undergrad", bio: "Profile coming soon.", placeholder: true }
];

/* Former members: { name, role, years, now }  e.g. now: "Postdoc at NOAA GFDL" */
window.LAB_ALUMNI = [];

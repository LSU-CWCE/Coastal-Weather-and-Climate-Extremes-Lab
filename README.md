# Coastal Weather and Climate Extremes Lab website

Live site: https://lsu-cwce.github.io/Coastal-Weather-and-Climate-Extremes-Lab/

This repository holds the lab website. Anything committed to the `main` branch appears on the live site about a minute later.

## Making a change

The easiest way is to edit right here on GitHub:

1. Open the file you want to change (see the table below).
2. Click the pencil icon, make the edit, and click **Commit changes**.
3. Wait about a minute, then reload the live site.

The repository is public, so everything in it can be seen by anyone. Don't add anything that shouldn't be public, such as phone numbers, grades, or unpublished work.

## What to edit

| To do this | Edit this |
|---|---|
| Add a paper | `data/publications.js`. Copy one `{ ... }` block and change it. Adding a `doi` creates the link; `themes` lists it under research themes on the Research page. For a manuscript in preparation, use `status: "in-prep"` instead of `year`. |
| Add a conference presentation or thesis | `data/publications.js`, in the second list (`LAB_PRESENTATIONS`). Copy one block and change it; add `type: "thesis"` for a thesis. |
| Add or update a group member | `data/people.js`. Copy an existing entry and change it. Fields you leave out are simply not shown. |
| Add a member photo | Upload it to `assets/img/people/` (portrait, about 3:4, roughly 700 px wide), then add `photo: "assets/img/people/your-name.jpg"` to the member's entry. |
| Post news | `data/news.js`, newest item first. |
| Change the PI's profile | `people.html` |
| Change the research text | `research.html` |
| Change contact details | `contact.html`, plus the footer at the bottom of each of the five pages |

The comment at the top of each file in `data/` lists every field it accepts.

## If a change doesn't show up

- Press Ctrl+F5 (Cmd+Shift+R on a Mac) to force the browser to reload. Browsers can keep an old copy for several minutes.
- If you change a file in `assets/css/` or `assets/js/`, also change the `?v=...` number after each CSS/JS link in all five pages, so returning visitors get the new file.
- A typo in a `data/` file, such as a missing comma or quotation mark, can stop that list from appearing. Compare your edit with the entry above it.

## Previewing on your own computer (optional)

To check changes before committing, download the repository, open a terminal in its folder, and run:

```bash
python serve.py
```

Then open http://localhost:5173 in a browser.

## Where things are

```
index.html, research.html, people.html, publications.html, contact.html   the five pages
data/          publications, group members, news
assets/css/    styles (colors and fonts are at the top of style.css)
assets/js/     the weather charts, the research schematics, and the scripts that fill in the data
assets/img/    photos, the site icon, and the image shown when a link is shared
```

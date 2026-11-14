# EduMinerva — Beyond the ordinary

A complete responsive society website and two standalone Skill Circle submissions. Content is based on EduMinerva’s official website; art direction is inspired by the typography, lime accents and editorial motion of Lando Norris’s site. This is an independent student assignment, not the official society website.

## Your three versions

| Location | Purpose | Technologies |
| --- | --- | --- |
| Repository root | Final site for your `main` branch and Vercel | Semantic HTML, responsive CSS, ES modules, async fetch + JSON, native dialogs, localStorage, browser file downloads |
| `week1/` | Standalone Week 1 submission | HTML + CSS only; no scripts or runtime dependencies |
| `week2/` | Standalone Week 2 submission | Full interactive site, extending Week 1 with JavaScript |

Both weekly folders include their own styles, assets and instructions. They do not depend on files in the parent folder. Keep the whole project on main. To submit a weekly branch, copy **the contents** of the relevant folder to that branch’s repository root. Creating or pushing branches is left to you as requested.

## Run locally

Use Node.js 20 or later:

```sh
npm install
npm run dev
```

Open http://localhost:3000. Week 1: http://localhost:3000/week1/. Week 2: http://localhost:3000/week2/.

Week 1 also opens directly as an HTML file. Week 2 and the final version need HTTP because the resources use `fetch()`. No API keys, database or paid services required.

## Deploy main to Vercel

1. Push the complete root project to GitHub and import it in Vercel.
2. Choose **Other** for Framework Preset and leave Root Directory at the repository root.
3. Build Command: `npm run build`. Output Directory: `dist`. These are already specified in `vercel.json`.
4. Deploy. The final site and `/week1/` and `/week2/` are included.

For a weekly branch containing only that folder’s contents, use Other, leave Build Command empty, and set Output Directory to `.`. Each week includes a minimal Vercel configuration.

## What works

- Responsive layouts from 320px upward; Grid, Flexbox, hover effects, transitions and reduced-motion support.
- Mobile navigation, theme persistence and a scroll progress indicator.
- Event category filters, search, empty states and accessible event dialogs.
- Gallery lightbox with native dialog keyboard focus handling and Escape to close.
- Original assignment videos, fetched from local JSON, with resource filters and a persistent completion checklist.
- CSS playground with live accent and roundness controls, automatic text contrast, and reset.
- Five-question quiz with answer explanations, retry and personal best score.
- Form validation, local learner-card storage, download and deletion.
- Personal learning dashboard. The actual community leaderboard is linked to the official site.
- Native HTML FAQ accordions and email/contact links.

**Data behavior:** Enrollment is a clearly labelled local demo. It saves a learner card only in the visitor’s browser; it does not reserve a place or send email. No form data is sent to a server. Event cards are archived experiences, not active registrations. Contact opens the visitor’s email application. Do not treat this project as an official event system without connecting an authorized backend.

## Edit and verify

- `index.html`: structure and copy.
- `styles.css`: base styles and responsive rules; `experience.css`: final art direction and society sections.
- `app.js`: Week 2 learning interactions; `experience.js`: events, gallery and motion.
- `data/resources.json`: supplied course links.
- `assets/`: optimized local images and favicon.

After changing the root site, update the weekly snapshots deliberately:

```sh
npm run editions
npm run build
npm run preview
npx playwright install chromium
npm test
```

The edition generator turns interactive components into static links/content in Week 1. It overwrites generated weekly files; edit the root source and generator to preserve changes. Build copies the final site and both snapshots into `dist/`. `dist/`, dependencies, screenshots and test output are excluded from Git.

## Content and credits

- Society information, department names, event topics, event/community images and contact email: [EduMinerva](https://www.eduminerva.in/), [events](https://www.eduminerva.in/events), [team](https://www.eduminerva.in/team), [contact](https://www.eduminerva.in/contact). Checked November 14, 2026. Event copy is condensed; official details remain linked.
- Visual reference: [Lando Norris](https://landonorris.com/). No Lando Norris images, logos or source code used.
- Course videos: the four links supplied in the Skill Circle assignments.
- Fonts: DM Sans, Space Grotesk and Barlow Condensed via Google Fonts; system fallbacks work if unavailable.

Images retain their owners’ rights. Confirm permission with the society before using this assignment as its official public website.

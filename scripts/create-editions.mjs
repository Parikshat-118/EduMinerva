// Root is the source of truth. Regenerate standalone submissions after changes.
import { readFile, writeFile, mkdir, cp } from 'node:fs/promises';
const root = new URL('../', import.meta.url);
const source = await readFile(new URL('index.html', root), 'utf8');
const resources = JSON.parse(await readFile(new URL('data/resources.json', root), 'utf8'));
const escape = text => String(text).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
for (const week of [1, 2]) {
  const folder = new URL(`week${week}/`, root); await mkdir(folder, { recursive: true });
  for (const file of ['styles.css', 'experience.css', 'assets']) await cp(new URL(file, root), new URL(file, folder), { recursive: true });
  let content = source.replaceAll('href="week1/"', 'href="#journey"').replaceAll('href="week2/"', `href="${week === 1 ? '#resources' : '#playground'}"`);
  content = content.replace('<body>', `<body><div class="week1-notice">WEEK ${week} SUBMISSION · ${week === 1 ? 'HTML + CSS foundations' : 'HTML + CSS + JavaScript interactions'}</div>`);
  content = content.replace('<title>EduMinerva — Beyond the ordinary.</title>', `<title>Week ${week} — EduMinerva</title>`);
  content = content.replace('Explore the Week 1 project', 'Explore the Week 1 mission').replace('Explore the Week 2 project', week === 1 ? 'Preview the Week 2 mission' : 'Try the interactive features');
  content = content.replace('<a href="#journey">Week 1 ↗</a><a href="#resources">Week 2 ↗</a>', '<a href="#journey">The missions ↗</a><a href="#resources">Learning kit ↗</a>');
  if (week === 2) {
    for (const file of ['app.js', 'experience.js', 'data']) await cp(new URL(file, root), new URL(file, folder), { recursive: true });
  } else {
    content = content.replace(/<script[^>]*>.*?<\/script>/gs, '');
    content = content.replace(/<button class="icon-button" id="theme-toggle".*?<\/button>/s, '');
    content = content.replace(/<button id="menu-toggle".*?<\/button>/s, '');
    content = content.replace(/<nav id="mobile-nav".*?<\/nav>/s, '<nav class="static-mobile-nav" aria-label="Mobile navigation"><a href="#about">About</a><a href="#events">Events</a><a href="#team">Team</a><a href="#gallery">Gallery</a><a href="#resources">Resources</a><a href="#contact">Contact</a></nav>');
    content = content.replace(/<div class="events-toolbar">.*?<div id="events-grid" class="events-grid"><\/div>/s,
      '<div class="events-grid">' + [
        ['Career Clash','career-clash.webp','Career exploration through quizzes and debates.'],
        ['Pre-Placement Boot Camp 3.0','bootcamp.webp','Practical preparation for placements and interviews.'],
        ['Skill Synergy','skill-synergy.webp','Career roadmaps and insights from alumni.'],
        ['Defence Bootcamp','defence.webp','Discover opportunities in defence careers.']
      ].map(([title,image,description]) => `<article class="event-card"><a class="event-image-button" href="https://www.eduminerva.in/events" target="_blank" rel="noopener noreferrer"><img src="assets/${image}" alt="${title}" loading="lazy"></a><span>FROM THE ARCHIVE</span><h3>${title}</h3><p>${description}</p><a class="event-more" href="https://www.eduminerva.in/events" target="_blank" rel="noopener noreferrer">Official event archive ↗</a></article>`).join('') + '</div>');
    content = content.replace(/<div class="filter-tabs" role="group" aria-label="Filter resources">.*?<\/div>/s, '');
    content = content.replace('<div class="resource-grid" id="resource-grid" aria-live="polite"></div>', '<div class="resource-grid">' + resources.filter(r => r.week === 1).map(r => `<article class="resource-card"><div class="resource-top"><span class="resource-icon ${r.color}">${escape(r.icon)}</span><span class="resource-type">${r.type}</span></div><h3>${r.title}</h3><p>${r.description}</p><a class="resource-link" href="${escape(r.url)}" target="_blank" rel="noopener noreferrer">${r.label} ↗</a></article>`).join('') + '</div>');
    content = content.replace(/<div class="resource-foot">.*?<p id="resource-error".*?<\/p>/s, '<p class="static-resource-note">The Week 1 starter kit: HTML, CSS and DevTools. Code along and experiment as you learn.</p>');
    content = content.replace(/<section id="playground".*?<\/section>/s, '<section id="playground" class="section container"><p class="eyebrow">CSS IN ACTION</p><h2>A LITTLE STYLE.<br><em>A LOT OF POSSIBILITY.</em></h2><div class="static-example"><h3>Try a little interaction.</h3><p>Hover over the button or focus it with your keyboard. This motion is pure CSS. The layout on this page uses Grid, Flexbox and media queries.</p><a class="button primary" href="#resources">Back to the building blocks ↗</a></div></section>');
    content = content.replace(/<section id="leaderboard".*?<\/section>/s, '');
    content = content.replace(/<form id="join-form".*?<\/form>/s, '<div class="join-form"><h3>Your starting line.</h3><p>This Week 1 edition is built entirely with HTML and CSS. Start with the resources, inspect the layout with DevTools, and make it your own.</p><a class="button primary" href="#resources">Explore Week 1 resources ↗</a><a class="button dark" href="mailto:eduminerva.bvcoe@gmail.com">Contact EduMinerva ↗</a></div>');
    content = content.replace('Create your local Skill Circle learner card to get started.', 'Start with HTML and CSS, then build your first responsive page.');
    content = content.replace('Preview the Week 2 mission', 'Get the learning resources');
    content = content.replace(/<dialog.*?<\/dialog>/gs, '').replace(/<noscript>.*?<\/noscript>/s, '');
    content = content.replace(/<button class="gallery-item([^" ]*)?([^\"]*)" data-gallery="([^"]+)" data-caption="[^"]*">/g, '<a class="gallery-item$1$2" href="$3" target="_blank" rel="noopener noreferrer">');
    // Gallery controls become ordinary image links in the no-JavaScript edition.
    content = content.replace(/(<a class="gallery-item[^>]*>.*?)<\/button>/gs, '$1</a>');
    content = content.replace('Five small questions on HTML, CSS and JavaScript.', 'Practice HTML and CSS at your own pace.');
    content = content.replace('Your resource checklist is saved in this browser so you can pick up where you left off.', 'Bookmark the resources and pick up where you left off.');
    await writeFile(new URL('week1.css', folder), '.static-mobile-nav{display:none}.event-card>p{font-size:12px;color:var(--muted)}.static-example{margin-top:30px;border:1px solid var(--line);padding:30px}.static-example h3{font-size:32px}.static-example p{font-size:13px}.resource-grid{grid-template-columns:repeat(3,1fr)}.join-form .button{margin-bottom:15px}.gallery-item{display:block}@media(max-width:800px){.static-mobile-nav{display:flex;gap:20px;overflow:auto;padding:12px 20px;border-top:1px solid var(--line);font-size:11px}.resource-grid{grid-template-columns:1fr}}');
    content = content.replace('</head>', '<link rel="stylesheet" href="week1.css"></head>');
  }
  await writeFile(new URL('index.html', folder), content);
  await writeFile(new URL('vercel.json', folder), JSON.stringify({ cleanUrls: true }, null, 2));
  await writeFile(new URL('README.md', folder), `# EduMinerva — Week ${week}\n\n${week === 1 ? 'Responsive HTML + CSS assignment. No JavaScript or npm dependencies. Open index.html directly or serve this directory with any static server.' : 'Interactive HTML + CSS + JavaScript assignment. Run with an HTTP server (fetch needs HTTP): python -m http.server 3000, then visit http://localhost:3000.'}\n\nThis directory is self-contained. Copy its contents to the root of your week${week} GitHub branch. On Vercel choose Other, no build command, and output directory \` . \` (current directory, without spaces). No API keys needed.\n\nContent and images adapted from https://www.eduminerva.in/. Visual direction inspired by https://landonorris.com/; no Lando Norris assets are included. This is an independent student assignment, not the official EduMinerva website.\n`);
}
console.log('Generated standalone week1/ (HTML/CSS) and week2/ (interactive).');

# Skill Circle learning notes

## Week 1 — HTML and CSS

The browser requests HTML from a server, then loads styles, images and scripts. HTML describes the document, CSS controls presentation, and JavaScript adds behavior. A backend can store shared data and enforce rules; this assignment uses browser storage for personal demo data.

Inspect `header`, `nav`, `main`, `section`, `article`, `details` and `footer` in DevTools. Semantic elements communicate purpose; heading order, form labels, image descriptions and focus indicators help people navigate.

The box model includes content, padding, border and margin. `box-sizing: border-box` includes padding and borders inside the specified width. Grid arranges the event cards, resources and section columns. Flexbox aligns navigation, buttons and toolbars. Media queries adapt these to smaller screens.

Try changing the hero font size and card gaps in DevTools. Use the device toolbar at 320px, 390px, 768px and desktop widths. Inspect hover and keyboard focus styles. Enable reduced motion in browser emulation to inspect the accessible motion alternative.

## Week 2 — JavaScript

`app.js` demonstrates variables, conditions, functions, arrays and objects. Resource objects come from JSON with async `fetch()`. An HTTP response is checked before parsing. Errors produce a visible message.

DOM selectors locate elements. Event listeners react to clicks, input, form submission and keyboard events. Resource arrays are filtered by week; event arrays are filtered by category and search query. Text from data is assigned with `textContent` to avoid interpreting it as markup.

The quiz keeps question index and score in memory. A submitted answer disables all choices so one question cannot be counted twice. The final score is compared with the stored best score.

Form validation checks the trimmed name, email validity and consent checkbox. Errors connect to fields with `aria-describedby`; focus moves to the first invalid field. A learner card can be downloaded through a Blob and object URL.

`localStorage` stores JSON under namespaced keys. Storage access can fail, so calls are guarded. This is personal browser data, not an account or shared database. Use the Application panel in DevTools to inspect or remove it.

## Try these experiments

1. Add a fifth resource to the JSON and update the displayed resource totals and validation.
2. Add another quiz question and adjust the dashboard maximum.
3. Change Grid columns or breakpoints and test keyboard navigation at each width.
4. Simulate a failed resource request in DevTools and inspect the error state.
5. Write down one bug, how you reproduced it, and what fixed it.

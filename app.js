// Week 2: DOM events, arrays/objects, validation, JSON, fetch and async/await.
const $ = (selector, parent = document) => parent.querySelector(selector);
const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];
const storage = {
  get(key, fallback) { try { return JSON.parse(localStorage.getItem(`skill-circle:${key}`)) ?? fallback; } catch { return fallback; } },
  set(key, value) { try { localStorage.setItem(`skill-circle:${key}`, JSON.stringify(value)); return true; } catch { return false; } },
  remove(key) { try { localStorage.removeItem(`skill-circle:${key}`); return true; } catch { return false; } }
};
let toastTimer;
function toast(message) { $('#toast').textContent = message; $('#toast').classList.add('visible'); clearTimeout(toastTimer); toastTimer = setTimeout(() => $('#toast').classList.remove('visible'), 3500); }
const savedTheme = storage.get('theme', null);
function setTheme(theme) {
  document.documentElement.dataset.theme = theme;
  $('#theme-toggle').setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
  $('meta[name="theme-color"]').content = theme === 'dark' ? '#141e1a' : '#f7f8f2';
}
setTheme(['dark', 'light'].includes(savedTheme) ? savedTheme : 'dark');
$('#theme-toggle').addEventListener('click', () => { const theme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'; setTheme(theme); storage.set('theme', theme); });
function closeMenu() { $('#mobile-nav').hidden = true; $('#menu-toggle').setAttribute('aria-expanded', 'false'); $('#menu-toggle').setAttribute('aria-label', 'Open navigation'); }
$('#menu-toggle').addEventListener('click', () => { const open = $('#mobile-nav').hidden; $('#mobile-nav').hidden = !open; $('#menu-toggle').setAttribute('aria-expanded', String(open)); $('#menu-toggle').setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation'); });
$$('#mobile-nav a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
matchMedia('(min-width: 801px)').addEventListener('change', event => { if (event.matches) closeMenu(); });

let resources = [];
let completed = storage.get('completed', []);
if (!Array.isArray(completed)) completed = [];
let activeFilter = 'all';
function updateProgress() {
  const count = resources.filter(resource => completed.includes(resource.id)).length;
  $('#progress-text').textContent = `${count} of ${resources.length} resources completed`;
  $('#progress-bar').style.width = `${resources.length ? count / resources.length * 100 : 0}%`;
  $('.progress-track').setAttribute('aria-valuenow', String(count));
  $('.progress-track').setAttribute('aria-valuemax', String(resources.length));
}
function renderResources() {
  $('#resource-grid').replaceChildren();
  resources.filter(resource => activeFilter === 'all' || resource.week === Number(activeFilter)).forEach(resource => {
    const card = document.createElement('article'); card.className = 'resource-card';
    // Markup is fixed; fetched text is assigned with textContent below.
    card.innerHTML = '<div class="resource-top"><span class="resource-icon"></span><span class="resource-type"></span></div><h3></h3><p></p><a class="resource-link" target="_blank" rel="noopener noreferrer"><span></span><span aria-hidden="true">↗</span></a><label class="resource-check"><input type="checkbox"><span>Mark as completed</span></label>';
    $('.resource-icon', card).classList.add(resource.color); $('.resource-icon', card).textContent = resource.icon;
    $('.resource-type', card).textContent = resource.type; $('h3', card).textContent = resource.title; $('p', card).textContent = resource.description;
    const link = $('.resource-link', card); link.href = resource.url; $('span', link).textContent = resource.label; link.setAttribute('aria-label', `${resource.label} (opens in a new tab)`);
    const checkbox = $('input', card); checkbox.checked = completed.includes(resource.id); checkbox.setAttribute('aria-label', `Mark ${resource.type} as completed`);
    checkbox.addEventListener('change', () => { completed = checkbox.checked ? [...new Set([...completed, resource.id])] : completed.filter(id => id !== resource.id); if (!storage.set('completed', completed)) toast('Progress works this session; browser storage is unavailable.'); updateProgress(); document.dispatchEvent(new Event('learning-progress')); });
    $('#resource-grid').append(card);
  });
  updateProgress();
}
async function loadResources() {
  try {
    const response = await fetch('data/resources.json');
    if (!response.ok) throw new Error('Resource request failed');
    resources = await response.json();
    if (!Array.isArray(resources) || resources.length !== 4 || !resources.every(r => typeof r.title === 'string' && /^https:\/\/youtu\.be\//.test(r.url))) throw new Error('Invalid resources');
    renderResources();
  } catch {
    $('#resource-error').hidden = false;
    $('#resource-error').textContent = 'Resources could not load. Please run this site using npm run dev and refresh, or check your connection.';
  }
}
loadResources();
$$('[data-filter]').forEach(button => button.addEventListener('click', () => { activeFilter = button.dataset.filter; $$('[data-filter]').forEach(tab => { tab.classList.toggle('active', tab === button); tab.setAttribute('aria-pressed', String(tab === button)); }); renderResources(); }));
$('#reset-progress').addEventListener('click', () => { completed = []; storage.remove('completed'); renderResources(); document.dispatchEvent(new Event('learning-progress')); toast('Fresh start. Your resource progress has been reset.'); });

function updatePlayground() {
  const color = $('#accent-input').value; const radius = $('#radius-input').value;
  $('.demo-card').style.setProperty('--accent', color); $('.demo-card').style.setProperty('--radius', `${radius}px`);
  // Maintain readable text as visitors explore any accent color.
  const rgb = [1, 3, 5].map(i => parseInt(color.slice(i, i + 2), 16) / 255).map(v => v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4);
  $('.demo-card').style.color = rgb[0] * .2126 + rgb[1] * .7152 + rgb[2] * .0722 > .179 ? '#19251e' : '#ffffff';
  $('#radius-output').value = `${radius}px`; $('#css-output').textContent = `background: ${color}; border-radius: ${radius}px;`;
}
$('#accent-input').addEventListener('input', updatePlayground); $('#radius-input').addEventListener('input', updatePlayground);
$('#reset-playground').addEventListener('click', () => { $('#accent-input').value = '#2854ed'; $('#radius-input').value = 12; updatePlayground(); });

const questions = [
  { question: 'Which element represents the main content of a page?', options: ['<main>', '<header>', '<aside>', '<footer>'], answer: 0, explanation: '<main> identifies the page’s primary content for browsers and assistive technology.' },
  { question: 'Which CSS tool is designed for a two-dimensional layout?', options: ['text-align', 'CSS Grid', 'border-radius', 'opacity'], answer: 1, explanation: 'CSS Grid lets you control rows and columns together.' },
  { question: 'How do you respond to a button click in JavaScript?', options: ['button.style()', 'button.fetch()', 'button.addEventListener("click", handler)', 'button.loop()'], answer: 2, explanation: 'addEventListener connects an event, such as a click, to a handler function.' },
  { question: 'What does an async function always return?', options: ['An HTML element', 'A string', 'Nothing', 'A Promise'], answer: 3, explanation: 'An async function returns a Promise. Use await to work with its eventual result.' },
  { question: 'Which feature adapts styles to a smaller screen?', options: ['An HTML comment', 'A CSS media query', 'JSON.parse()', 'A JavaScript array'], answer: 1, explanation: 'Media queries apply CSS based on viewport size and other device preferences.' }
];
let questionIndex = 0, score = 0;
function renderQuestion() {
  const content = $('#quiz-content'); content.replaceChildren();
  if (questionIndex === questions.length) {
    const best = storage.get('best-quiz', 0); storage.set('best-quiz', Math.max(Number.isInteger(best) ? best : 0, score)); document.dispatchEvent(new Event('learning-progress'));
    content.innerHTML = '<div class="quiz-result"></div><h2 id="quiz-title">Look at you, learning.</h2><p></p><button class="button primary" id="retry-quiz">Try again ↺</button>';
    $('.quiz-result', content).textContent = `${score} / ${questions.length}`;
    $('p', content).textContent = score === questions.length ? 'A clean sweep! Keep the momentum going and build something of your own.' : 'Every question is another chance to learn. Explore the resources and give it another go.';
    $('#retry-quiz').addEventListener('click', startQuiz); $('#retry-quiz').focus(); return;
  }
  const current = questions[questionIndex];
  content.innerHTML = '<p class="quiz-progress"></p><h2 id="quiz-title" tabindex="-1"></h2><div class="quiz-options"></div><p class="quiz-feedback" role="status"></p><button class="button primary" id="next-question" disabled>Next question →</button>';
  $('.quiz-progress', content).textContent = `QUESTION ${questionIndex + 1} OF ${questions.length}`;
  $('#quiz-title').textContent = current.question;
  current.options.forEach((option, index) => {
    const button = document.createElement('button'); button.className = 'quiz-option'; button.textContent = option;
    button.addEventListener('click', () => {
      const correct = index === current.answer; if (correct) score++;
      $$('.quiz-option').forEach((item, i) => { item.disabled = true; if (i === current.answer) item.classList.add('correct'); });
      if (!correct) button.classList.add('wrong');
      $('.quiz-feedback').textContent = `${correct ? 'That’s right!' : 'Keep going!'} ${current.explanation}`;
      $('#next-question').disabled = false; $('#next-question').focus();
    }); $('.quiz-options', content).append(button);
  });
  $('#next-question').textContent = questionIndex === questions.length - 1 ? 'See my result ↗' : 'Next question →';
  $('#next-question').addEventListener('click', () => { questionIndex++; renderQuestion(); });
  $('#quiz-title').focus();
}
function startQuiz() { questionIndex = 0; score = 0; if (!$('#quiz-dialog').open) $('#quiz-dialog').showModal(); renderQuestion(); }
$('#start-quiz').addEventListener('click', startQuiz);
$('#close-quiz').addEventListener('click', () => $('#quiz-dialog').close());
$$('dialog').forEach(dialog => dialog.addEventListener('click', event => { if (event.target === dialog) { const rect = dialog.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close(); } }));

let learner = storage.get('learner', null);
if (!learner || typeof learner.name !== 'string' || typeof learner.email !== 'string') learner = null;
function openLearner() { $('#learner-greeting').textContent = `Hey ${learner.name}, this is your starting line.`; $('#learner-dialog').showModal(); }
if (learner) {
  $('#form-status').textContent = `Welcome back, ${learner.name}. `;
  const button = document.createElement('button'); button.type = 'button'; button.className = 'inline-button'; button.textContent = 'View your learner card'; button.addEventListener('click', openLearner); $('#form-status').append(button);
}
function validateForm() {
  const name = $('#name').value.trim(), email = $('#email').value.trim();
  const errors = { name: name.length < 2 ? 'Enter a name with at least 2 characters.' : name.length > 60 ? 'Use 60 characters or fewer.' : '', email: !email || !$('#email').validity.valid || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? 'Enter a valid email address, like you@example.com.' : '', consent: !$('#consent').checked ? 'Please agree to save your card on this device.' : '' };
  Object.entries(errors).forEach(([id, error]) => { $(`#${id}-error`).textContent = error; $(`#${id}`).setAttribute('aria-invalid', String(Boolean(error))); });
  const first = Object.keys(errors).find(key => errors[key]); if (first) { $(`#${first}`).focus(); return null; }
  return { name, email, experience: $('#experience').selectedOptions[0].textContent, createdAt: new Date().toISOString() };
}
$('#join-form').addEventListener('submit', event => {
  event.preventDefault(); const result = validateForm(); if (!result) return;
  learner = result; const saved = storage.set('learner', learner);
  $('#form-status').textContent = saved ? 'Your learner card is saved on this device.' : 'Browser storage is unavailable. Download your card to keep a copy.';
  openLearner();
});
$('#close-learner').addEventListener('click', () => $('#learner-dialog').close());
$('#download-card').addEventListener('click', () => {
  if (!learner) return;
  const text = `EDUMINERVA / SKILL CIRCLE\nYour learner card\n\nName: ${learner.name}\nEmail: ${learner.email}\nStarting point: ${learner.experience}\nCreated: ${learner.createdAt}\n\nWeek 1: Build with HTML & CSS.\nWeek 2: Bring it to life with JavaScript.\n\nLocal demo card. Not an event ticket or certificate.\nLearn. Build. Belong.`;
  const url = URL.createObjectURL(new Blob([text], { type: 'text/plain;charset=utf-8' })); const link = document.createElement('a'); link.href = url; link.download = 'skill-circle-learner-card.txt'; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
});
$('#delete-card').addEventListener('click', () => { const removed = storage.remove('learner'); if (!removed) { toast('Unable to clear browser storage. Try clearing this site’s data in browser settings.'); return; } learner = null; $('#learner-dialog').close(); $('#join-form').reset(); $('#form-status').textContent = 'Your learner card has been deleted from this browser.'; toast('Learner card deleted.'); });

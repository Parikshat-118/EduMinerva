const events = [
  { title: 'Career Clash', category: 'career', image: 'career-clash.webp', tag: 'CAREER / QUIZZES & DEBATES', description: 'Career Clash: Battle of Professions explores different career paths through quizzes and debates, bringing teamwork and quick thinking into the conversation.' },
  { title: 'Pre-Placement Boot Camp 3.0', category: 'career', image: 'bootcamp.webp', tag: 'CAREER / PLACEMENT PREPARATION', description: 'An archived programme connecting technical learning with placement preparation through problem solving, interview scenarios and practical exposure.' },
  { title: 'Skill Synergy', category: 'skills', image: 'skill-synergy.webp', tag: 'SKILLS / ALUMNI INSIGHTS', description: 'A programme for third-year students exploring IT placements, with career roadmaps and perspectives from alumni.' },
  { title: 'Defence Bootcamp', category: 'career', image: 'defence.webp', tag: 'CAREER / EXPLORE NEW PATHS', description: 'An archived experience exploring defence careers through speaker sessions, mock interviews, group discussions and guidance on defence examinations.' }
];
const grid = document.querySelector('#events-grid');
let eventFilter = 'all';
function openEvent(event) {
  document.querySelector('#event-title').textContent = event.title;
  document.querySelector('#event-description').textContent = event.description;
  const image = document.querySelector('#event-image'); image.src = `assets/${event.image}`; image.alt = `${event.title} event image from EduMinerva`;
  document.querySelector('#event-dialog').showModal();
}
function renderEvents() {
  const query = document.querySelector('#event-search').value.trim().toLowerCase();
  const filtered = events.filter(event => (eventFilter === 'all' || event.category === eventFilter) && `${event.title} ${event.description}`.toLowerCase().includes(query));
  grid.replaceChildren();
  filtered.forEach(event => {
    const article = document.createElement('article'); article.className = 'event-card';
    article.innerHTML = '<button class="event-image-button"><img loading="lazy"></button><span></span><h3></h3><button class="event-more">Explore experience <span>↗</span></button>';
    const image = article.querySelector('img'); image.src = `assets/${event.image}`; image.alt = event.title;
    article.querySelector('.event-image-button').setAttribute('aria-label', `View ${event.title}`);
    article.querySelector('article > span').textContent = event.tag;
    article.querySelector('h3').textContent = event.title;
    article.querySelectorAll('button').forEach(button => button.addEventListener('click', () => openEvent(event)));
    grid.append(article);
  });
  document.querySelector('#events-empty').hidden = filtered.length > 0;
}
renderEvents();
document.querySelectorAll('[data-event-filter]').forEach(button => button.addEventListener('click', () => {
  eventFilter = button.dataset.eventFilter;
  document.querySelectorAll('[data-event-filter]').forEach(tab => { tab.classList.toggle('active', tab === button); tab.setAttribute('aria-pressed', String(tab === button)); });
  renderEvents();
}));
document.querySelector('#event-search').addEventListener('input', renderEvents);
document.querySelectorAll('[data-gallery]').forEach(button => button.addEventListener('click', () => {
  const image = document.querySelector('#gallery-image'); image.src = button.dataset.gallery; image.alt = button.dataset.caption;
  document.querySelector('#gallery-caption').textContent = button.dataset.caption;
  document.querySelector('#gallery-dialog').showModal();
}));
document.querySelectorAll('[data-close-dialog]').forEach(button => button.addEventListener('click', () => document.getElementById(button.dataset.closeDialog).close()));

function updateStats() {
  try {
    const completed = JSON.parse(localStorage.getItem('skill-circle:completed')) || [];
    const count = Array.isArray(completed) ? ['html', 'css', 'devtools', 'javascript'].filter(id => completed.includes(id)).length : 0;
    const score = JSON.parse(localStorage.getItem('skill-circle:best-quiz'));
    document.querySelector('#stat-resources').textContent = `${count} / 4`;
    document.querySelector('#stat-quiz').textContent = `${Number.isInteger(score) && score >= 0 && score <= 5 ? score : '—'} / 5`;
  } catch { /* The rest of the experience also works without browser storage. */ }
}
document.addEventListener('learning-progress', updateStats); window.addEventListener('storage', updateStats); updateStats();
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
if (!reducedMotion.matches && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.remove('reveal-wait'); observer.unobserve(entry.target); } }), { threshold: .07 });
  document.querySelectorAll('.section-heading,.about-grid,.department-grid,.week-grid,.playground-grid').forEach(element => { element.classList.add('reveal', 'reveal-wait'); observer.observe(element); });
}
let ticking = false;
function updateScroll() {
  const maxScroll = document.documentElement.scrollHeight - innerHeight;
  document.querySelector('.scroll-progress').style.width = `${maxScroll > 0 ? scrollY / maxScroll * 100 : 0}%`;
  ticking = false;
}
addEventListener('scroll', () => { if (!ticking) { requestAnimationFrame(updateScroll); ticking = true; } }, { passive: true });
updateScroll();

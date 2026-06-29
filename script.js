// Loader
window.addEventListener('load', () => {
  setTimeout(() => document.getElementById('loader').classList.add('hidden'), 350);
});
 
// Nav scroll state
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
});
 
// Reveal on scroll
const revealEls = document.querySelectorAll('.reveal, .reveal-stagger');
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if(e.isIntersecting){ e.target.classList.add('is-visible'); io.unobserve(e.target); }
  });
}, {threshold:0.15});
revealEls.forEach(el => io.observe(el));
 
// Counter animation
function animateCounter(el, target, duration=1400){
  const start = performance.now();
  function tick(now){
    const progress = Math.min((now - start)/duration, 1);
    const eased = 1 - Math.pow(1-progress, 3);
    el.textContent = Math.round(eased * target);
    if(progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}
const counters = document.querySelectorAll('.node-counter');
const cIo = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if(e.isIntersecting){
      animateCounter(e.target, parseInt(e.target.dataset.target,10));
      cIo.unobserve(e.target);
    }
  });
}, {threshold:0.4});
counters.forEach(c => cIo.observe(c));
 
// Position orbit nodes around the rings
function positionOrbitNodes(){
  const wrap = document.getElementById('orbitWrap');
  if(!wrap) return;
  const w = wrap.offsetWidth;
  const nodes = [
    {el: document.getElementById('n1'), angle: -40, radiusFactor: 0.5},
    {el: document.getElementById('n2'), angle: 150, radiusFactor: 0.44},
    {el: document.getElementById('n3'), angle: 70, radiusFactor: 0.44},
  ];
  nodes.forEach(n => {
    const r = w * n.radiusFactor;
    const rad = n.angle * Math.PI/180;
    const x = w/2 + r * Math.cos(rad);
    const y = w/2 + r * Math.sin(rad);
    n.el.style.left = (x - n.el.offsetWidth/2) + 'px';
    n.el.style.top = (y - n.el.offsetHeight/2) + 'px';
  });
}
window.addEventListener('resize', positionOrbitNodes);
window.addEventListener('load', positionOrbitNodes);
setTimeout(positionOrbitNodes, 100);
 
// Subtle parallax on orbit per mouse move (desktop only)
const orbitWrap = document.getElementById('orbitWrap');
if(window.matchMedia('(pointer:fine)').matches){
  document.querySelector('.hero').addEventListener('mousemove', (e) => {
    const rect = document.querySelector('.hero').getBoundingClientRect();
    const x = (e.clientX - rect.left)/rect.width - 0.5;
    const y = (e.clientY - rect.top)/rect.height - 0.5;
    orbitWrap.style.transform = `translate(${x*14}px, ${y*14}px)`;
  });
}
 
// Form submit
const form = document.getElementById('leadForm');
const success = document.getElementById('formSuccess');
form.addEventListener('submit', (e) => {
  e.preventDefault();
  form.style.display = 'none';
  success.classList.add('show');
});
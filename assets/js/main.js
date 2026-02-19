document.addEventListener('DOMContentLoaded',function(){
  const navToggle = document.getElementById('navToggle');
  const mainNav = document.getElementById('mainNav');
  if(navToggle){
    // accessibility: link toggle to the menu and keep state in aria attributes
    navToggle.setAttribute('aria-controls', 'mainNav');
    navToggle.setAttribute('aria-expanded', 'false');
    if(mainNav) mainNav.setAttribute('aria-hidden', 'true');

    navToggle.addEventListener('click', ()=>{
      if(!mainNav) return;
      const isOpen = mainNav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      mainNav.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
    });
  }

  // simple reveal on scroll for non-critical items
  const obs = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting) e.target.style.animationPlayState = 'running';
    });
  },{threshold:.12});

  document.querySelectorAll('.section, .hero').forEach(el=>{
    el.style.animationPlayState = 'paused';
    obs.observe(el);
  });

  // Page enter animation
  document.documentElement.classList.add('page-enter');
  requestAnimationFrame(()=>{
    document.documentElement.classList.remove('page-enter');
    document.documentElement.classList.add('page-enter-active');
    setTimeout(()=>document.documentElement.classList.remove('page-enter-active'),700);
  });

  // Add ripple effect to buttons
  document.addEventListener('click', (e)=>{
    const btn = e.target.closest('.btn');
    if(!btn) return;
    const rect = btn.getBoundingClientRect();
    const circle = document.createElement('span');
    circle.className = 'ripple';
    const size = Math.max(rect.width,rect.height);
    circle.style.width = circle.style.height = size + 'px';
    circle.style.left = (e.clientX - rect.left - size/2) + 'px';
    circle.style.top = (e.clientY - rect.top - size/2) + 'px';
    btn.appendChild(circle);
    requestAnimationFrame(()=>{ circle.style.transform = 'scale(1)'; circle.style.opacity = '1'; });
    setTimeout(()=>{ circle.style.transition = 'opacity 360ms ease, transform 360ms ease'; circle.style.opacity = '0'; circle.style.transform='scale(1.6)'; },200);
    setTimeout(()=>{ if(circle && circle.parentNode) circle.parentNode.removeChild(circle); },900);
  });

 
  document.addEventListener('click', (e)=>{
    const a = e.target.closest('a');
    if(!a) return;
    const href = a.getAttribute('href');
    if(!href) return;

    if(href.startsWith('http') || href.startsWith('mailto:') || a.target === '_blank') return;
    e.preventDefault();
 
    let overlay = document.querySelector('.page-transition-overlay');
    if(!overlay){ overlay = document.createElement('div'); overlay.className = 'page-transition-overlay'; document.body.appendChild(overlay); }
    
    requestAnimationFrame(()=> overlay.classList.remove('page-hidden'));
    setTimeout(()=>{ window.location.href = href; }, 320);
  });
  
 
  // keep the poster visible; hide poster when iframe appears.
  (function(){
    const tiktokWrap = document.querySelector('.tiktok-embed-wrap');
    if(!tiktokWrap) return;
    const fallback = tiktokWrap.querySelector('.embed-fallback');
    const checkIframe = ()=>{
      const iframe = tiktokWrap.querySelector('iframe');
      if(iframe){
        fallback && fallback.classList.add('hidden');
      } else {
        fallback && fallback.classList.remove('hidden');
      }
    };
    // initial check after embed script has time to execute
    setTimeout(checkIframe, 900);
    // observe DOM changes to detect iframe insertion
    const mo = new MutationObserver(checkIframe);
    mo.observe(tiktokWrap, {childList:true, subtree:true});
  })();
  // end DOMContentLoaded handlers
});

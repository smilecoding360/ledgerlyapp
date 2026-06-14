document.addEventListener('DOMContentLoaded', function(){
  const track = document.querySelector('.screenshots-track');
  const dots = Array.from(document.querySelectorAll('.s-dot'));
  let index = 0;
  const total = track ? track.children.length : 0;
  let width = 252; // item width + gap
  let timer = null;

  function update() {
    if(!track || !total) return;
    const x = -index * width;
    track.style.transform = `translateX(${x}px)`;
    dots.forEach((d,i)=>d.classList.toggle('active', i===index));
  }

  function restartTimer() {
    if(timer) clearInterval(timer);
    if(total <= 1) return;
    timer = setInterval(()=>{
      index = (index + 1) % total;
      update();
    }, 3500);
  }

  // dot controls
  dots.forEach((d,i)=> d.addEventListener('click', ()=>{
    index = i;
    update();
    restartTimer();
  }));

  // make responsive: recalc width
  function recalc(){
    const item = track ? track.querySelector('.s-item') : null;
    if(item && track) {
      const computed = window.getComputedStyle(track);
      const gap = parseFloat(computed.columnGap || computed.gap || '0');
      width = item.getBoundingClientRect().width + gap;
    }
    if(index >= total) index = 0;
    update();
  }

  window.addEventListener('resize', recalc);

  if(track) {
    track.addEventListener('mouseenter', ()=> timer && clearInterval(timer));
    track.addEventListener('mouseleave', restartTimer);
  }

  restartTimer();
  recalc();

  const heroCarousel = document.querySelector('.hero-carousel');
  if (heroCarousel) {
    const heroSlides = Array.from(heroCarousel.querySelectorAll('.hero-slide'));
    const positionClasses = ['hero-slide--center', 'hero-slide--right', 'hero-slide--back', 'hero-slide--left'];

    // Keep each slide bound to one image so rotation only changes position classes.
    const heroImages = heroSlides
      .map((slide) => slide.querySelector('img'))
      .filter(Boolean)
      .map((img) => img.getAttribute('src'));

    if (heroSlides.length === 4 && heroImages.length === 4) {
      let centerIndex = heroSlides.findIndex((slide) => slide.classList.contains('hero-slide--center'));
      if (centerIndex < 0) centerIndex = 0;

      function renderHeroCarousel() {
        heroSlides.forEach((slide, slideIndex) => {
          slide.classList.remove('hero-slide--center', 'hero-slide--right', 'hero-slide--back', 'hero-slide--left');
          const offset = (slideIndex - centerIndex + heroSlides.length) % heroSlides.length;
          slide.classList.add(positionClasses[offset]);
        });
      }

      function rotateHeroCarousel() {
        centerIndex = (centerIndex + 1) % heroSlides.length;
        renderHeroCarousel();
      }

      renderHeroCarousel();
      setInterval(rotateHeroCarousel, 3500);
    }
  }

});

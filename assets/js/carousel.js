const carouselTrack = document.getElementById('carousel-track');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const cards = Array.from(carouselTrack.children);

let currentIndex = 0;
let isDragging = false;
let startX = 0, startY = 0, baseTranslate = 0, currentTranslate = 0;
let touchStartedAt = 0;

function getNumVisibleCards() {
  return window.innerWidth < 768 ? 1 : 3;
}
function getMaxIndex() {
  return Math.max(0, cards.length - getNumVisibleCards());
}
function getTargetOffsetForIndex(idx) {
  return cards[idx]?.offsetLeft || 0;
}
function setTransition(enabled) {
  carouselTrack.style.transition = enabled ? 'transform 300ms ease' : 'none';
}
function applyTranslate(x) {
  currentTranslate = x;
  carouselTrack.style.transform = `translateX(${x}px)`;
}
function updateButtons() {
  const maxIndex = getMaxIndex();
  const atStart = currentIndex <= 0;
  const atEnd = currentIndex >= maxIndex;
  prevBtn.disabled = atStart;
  nextBtn.disabled = atEnd;
  prevBtn.setAttribute('aria-disabled', String(atStart));
  nextBtn.setAttribute('aria-disabled', String(atEnd));
  // styling hook
  prevBtn.classList.toggle('diabled', atStart);
  nextBtn.classList.toggle('diabled', atEnd);
}
function updateCarousel() {
  const maxIndex = getMaxIndex();
  currentIndex = Math.min(Math.max(currentIndex, 0), maxIndex);
  const targetOffset = getTargetOffsetForIndex(currentIndex);
  applyTranslate(-targetOffset);
  updateButtons();
}

// Button navigation (no wrap)
nextBtn.addEventListener('click', () => {
  const maxIndex = getMaxIndex();
  if (currentIndex < maxIndex) {
    currentIndex += 1;
    setTransition(true);
    updateCarousel();
  }
});
prevBtn.addEventListener('click', () => {
  if (currentIndex > 0) {
    currentIndex -= 1;
    setTransition(true);
    updateCarousel();
  }
});

// Better touch interactions
carouselTrack.style.touchAction = 'pan-y';

carouselTrack.addEventListener('touchstart', (e) => {
  if (!cards.length) return;
  touchStartedAt = performance.now();
  startX = e.touches[0].clientX;
  startY = e.touches[0].clientY;
  baseTranslate = -getTargetOffsetForIndex(currentIndex);
  isDragging = true;
  setTransition(false);
}, { passive: true });

carouselTrack.addEventListener('touchmove', (e) => {
  if (!isDragging) return;
  const currX = e.touches[0].clientX;
  const currY = e.touches[0].clientY;
  const dx = currX - startX;
  const dy = currY - startY;

  // Only handle when horizontal intent is clear
  if (Math.abs(dx) > Math.abs(dy)) {
    e.preventDefault(); // allow vertical page scroll otherwise
    const maxOffset = getTargetOffsetForIndex(getMaxIndex());
    const minTranslate = -maxOffset; // furthest left (negative)
    const maxTranslate = 0;          // start position
    const nextTranslate = baseTranslate + dx;

    // clamp with a tiny resistance near edges
    const overPull = 0.35;
    let clamped = nextTranslate;
    if (nextTranslate > maxTranslate) {
      clamped = maxTranslate + (nextTranslate - maxTranslate) * overPull;
    } else if (nextTranslate < minTranslate) {
      clamped = minTranslate + (nextTranslate - minTranslate) * overPull;
    }
    applyTranslate(clamped);
  }
}, { passive: false });

carouselTrack.addEventListener('touchend', (e) => {
  if (!isDragging) return;
  isDragging = false;
  const endX = e.changedTouches[0].clientX;
  const dx = endX - startX;
  const dt = Math.max(1, performance.now() - touchStartedAt);

  // Adaptive threshold: 15% of card width, min 30px
  const cardWidth = cards[0]?.offsetWidth || 300;
  const distThreshold = Math.max(30, Math.round(cardWidth * 0.15));
  const velocity = Math.abs(dx) / dt; // px per ms

  let moved = false;
  const maxIndex = getMaxIndex();

  // Fast swipe shortcut
  if (velocity > 0.7 || Math.abs(dx) > distThreshold) {
    if (dx < 0 && currentIndex < maxIndex) {        // swipe left -> next
      currentIndex += 1;
      moved = true;
    } else if (dx > 0 && currentIndex > 0) {        // swipe right -> prev
      currentIndex -= 1;
      moved = true;
    }
  }

  setTransition(true);
  updateCarousel();

}, { passive: true });

// Resize: re-align without animating, then restore transition
window.addEventListener('resize', () => {
  setTransition(false);
  updateCarousel();
  // next frame restore transition
  requestAnimationFrame(() => setTransition(true));
});

// Initial setup
window.addEventListener('load', () => {
  setTransition(false);
  updateCarousel();
  requestAnimationFrame(() => setTransition(true));
});
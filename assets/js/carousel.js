const carouselTrack = document.getElementById('carousel-track');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const cards = Array.from(carouselTrack.children);

let currentIndex = 0;
let startX, startY, endX;
const swipeThreshold = 50; // Minimum distance to register a swipe
const gap = 16; // 1rem in px

function getNumVisibleCards() {
  return window.innerWidth < 768 ? 1 : 3;
}

function getMaxIndex() {
  return Math.max(0, cards.length - getNumVisibleCards());
}

function updateButtons() {
  const maxIndex = getMaxIndex();
  const atStart = currentIndex <= 0;
  const atEnd = currentIndex >= maxIndex;

  prevBtn.disabled = atStart;
  nextBtn.disabled = atEnd;

  prevBtn.setAttribute('aria-disabled', String(atStart));
  nextBtn.setAttribute('aria-disabled', String(atEnd));

  // Add/remove styling hook class when disabled
  prevBtn.classList.toggle('diabled', atStart);
  nextBtn.classList.toggle('diabled', atEnd);
}

// Function to update the carousel position
function updateCarousel() {
  const cardWidth = cards[0].offsetWidth;
  const maxIndex = getMaxIndex();

  // Clamp to bounds (no looping)
  currentIndex = Math.min(Math.max(currentIndex, 0), maxIndex);

  const translateValue = -(currentIndex * (cardWidth + gap));
  carouselTrack.style.transform = `translateX(${translateValue}px)`;

  updateButtons();
}

// Click listeners for navigation buttons (no wrap)
nextBtn.addEventListener('click', () => {
  const maxIndex = getMaxIndex();
  if (currentIndex < maxIndex) {
    currentIndex += 1;
    updateCarousel();
  }
});

prevBtn.addEventListener('click', () => {
  if (currentIndex > 0) {
    currentIndex -= 1;
    updateCarousel();
  }
});

// Touch event listeners for swiping
carouselTrack.addEventListener('touchstart', (e) => {
  startX = e.touches[0].clientX;
  startY = e.touches[0].clientY;
});

carouselTrack.addEventListener('touchmove', (e) => {
  const dx = Math.abs(e.touches[0].clientX - startX);
  const dy = Math.abs(e.touches[0].clientY - startY);
  if (dx > dy) {
    e.preventDefault(); // prevent vertical scroll only on horizontal swipe
  }
});

carouselTrack.addEventListener('touchend', (e) => {
  endX = e.changedTouches[0].clientX;
  const deltaX = endX - startX;

  if (deltaX > swipeThreshold) {
    prevBtn.click();
  } else if (deltaX < -swipeThreshold) {
    nextBtn.click();
  }
});

// Update carousel on window resize
window.addEventListener('resize', updateCarousel);

// Initial setup
window.addEventListener('load', updateCarousel);
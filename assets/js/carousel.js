const carouselTrack = document.getElementById('carousel-track');
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        const cards = Array.from(carouselTrack.children);

        let currentIndex = 0;
        let startX, endX;
        const swipeThreshold = 50; // Minimum distance to register a swipe

        // Function to update the carousel position
        function updateCarousel() {
            const isMobile = window.innerWidth < 768;
            const cardWidth = cards[0].offsetWidth;
            const gap = 16; // 1rem in px
            const numVisibleCards = isMobile ? 1 : 3;

            // Calculate the total width to translate by
            let translateValue = -(currentIndex * (cardWidth + gap));
            
            // Adjust for edge cases and looping
            const totalCards = cards.length;
            if (currentIndex >= totalCards) {
                currentIndex = 0; // Loop back to start
            } else if (currentIndex < 0) {
                currentIndex = totalCards - 1; // Loop back to end
            }
            
            // Re-calculate after potential index change
            translateValue = -(currentIndex * (cardWidth + gap));

            carouselTrack.style.transform = `translateX(${translateValue}px)`;
        }

        // Click listeners for navigation buttons
        nextBtn.addEventListener('click', () => {
            const isMobile = window.innerWidth < 768;
            currentIndex = (currentIndex + 1) % cards.length;
            updateCarousel();
        });

        prevBtn.addEventListener('click', () => {
            const isMobile = window.innerWidth < 768;
            currentIndex = (currentIndex - 1 + cards.length) % cards.length;
            updateCarousel();
        });

        // Touch event listeners for swiping
        carouselTrack.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        });

        carouselTrack.addEventListener('touchmove', (e) => {
            // Prevent scrolling while swiping horizontally
            if (Math.abs(e.touches[0].clientX - startX) > Math.abs(e.touches[0].clientY - e.touches[0].clientY)) {
                e.preventDefault();
            }
        });

        carouselTrack.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            const deltaX = endX - startX;

            if (deltaX > swipeThreshold) {
                // Swipe right (previous)
                prevBtn.click();
            } else if (deltaX < -swipeThreshold) {
                // Swipe left (next)
                nextBtn.click();
            }
        });

        // Update carousel on window resize
        window.addEventListener('resize', () => {
            updateCarousel();
        });
        
        // Initial setup
        window.addEventListener('load', () => {
             updateCarousel();
        });
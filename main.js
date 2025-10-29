

// Preloader
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    const loaderAnimation = document.querySelector('.loader-animation');
    const finalLogo = document.querySelector('.preloader-logo');

    if (preloader && loaderAnimation && finalLogo) {
        // After a short "scanning" period, switch to the checkmark
        const scanDuration = 2200;
        const pauseDuration = 800;
        const zoomDuration = 1200;

        setTimeout(() => {
            loaderAnimation.style.display = 'none';
            finalLogo.style.display = 'flex';

            // After a pause, add the zooming class to start the zoom animation
            setTimeout(() => {
                finalLogo.classList.add('zooming');
            }, pauseDuration);

        }, scanDuration);

        setTimeout(() => {
            preloader.classList.add('preloader-hidden');
        }, scanDuration + pauseDuration + zoomDuration);
    }
});

const burger = document.querySelector('.burger');
const nav = document.querySelector('.nav-links');
const navLinks = document.querySelectorAll('.nav-links li');

burger.addEventListener('click', () => {
    nav.classList.toggle('nav-active');
    navLinks.forEach((link, index) => {
        if (link.style.animation) {
            link.style.animation = '';
        } else {
            link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
        }
    });
    burger.classList.toggle('toggle');
});

// Close nav when a link is clicked (for mobile)
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (nav.classList.contains('nav-active')) {
            nav.classList.remove('nav-active');
            burger.classList.remove('toggle');
            navLinks.forEach(item => item.style.animation = ''); // Reset animation
        }
    });
});

// Close nav when clicking on the main content (prevents UI-spoofing)
const contentAreas = document.querySelectorAll('main, footer');

function closeMobileNav() {
    if (nav.classList.contains('nav-active')) {
        nav.classList.remove('nav-active');
        burger.classList.remove('toggle');
        navLinks.forEach(item => item.style.animation = ''); // Reset animation
    }
}

if (contentAreas.length > 0) {
    contentAreas.forEach(area => area.addEventListener('click', closeMobileNav));
}

// Scoped Tab functionality for multiple components
const tabContainers = document.querySelectorAll('.accomplishments-container, .about-tabs-container, .skills-container');

tabContainers.forEach(container => {
    const tabs = container.querySelectorAll('.tab-btn');
    const contentPanels = container.querySelectorAll('.content-panel');

    // Specific logic for the skills container
    if (container.classList.contains('skills-container')) {
        const activeTab = container.querySelector('.tab-btn.active');
        const iconDisplay = container.querySelector('.category-icon');
        const nameDisplay = container.querySelector('.category-name');
        
        iconDisplay.innerHTML = activeTab.querySelector('i').outerHTML;
        nameDisplay.textContent = activeTab.title;
    }

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetId = tab.dataset.target;
            const targetPanel = container.querySelector('#' + targetId);

            // Deactivate tabs and panels within the current container
            tabs.forEach(t => t.classList.remove('active'));
            contentPanels.forEach(p => p.classList.remove('active'));

            // Activate the clicked tab and its corresponding panel
            tab.classList.add('active');
            if (targetPanel) targetPanel.classList.add('active');

            // Update the title if we are in the skills container
            if (container.classList.contains('skills-container')) {
                const iconDisplay = container.querySelector('.category-icon');
                const nameDisplay = container.querySelector('.category-name');

                iconDisplay.innerHTML = tab.querySelector('i').outerHTML;
                nameDisplay.textContent = tab.title;
            }
        });
    });
});


// Contact Form submission using Formspree
const form = document.querySelector(".contact-form");

if (form) {
    async function handleSubmit(event) {
        event.preventDefault();
        const status = document.getElementById("form-status");
        const data = new FormData(event.target);
        try {
            const response = await fetch(event.target.action, {
                method: form.method,
                body: data,
                headers: {
                    'Accept': 'application/json'
                }
            });
            if (response.ok) {
                status.textContent = "Thanks for your submission!";
                form.reset();
            } else {
                status.textContent = "Oops! There was a problem submitting your form.";
            }
        } catch (error) {
            status.textContent = "Oops! There was a problem submitting your form.";
        }
    }
    form.addEventListener("submit", handleSubmit);
}

// Project Carousel
const carouselWrapper = document.querySelector('.projects-carousel-wrapper');
if (carouselWrapper) {
    const grid = carouselWrapper.querySelector('.projects-grid');
    const prevBtn = carouselWrapper.querySelector('.carousel-btn.prev');
    const nextBtn = carouselWrapper.querySelector('.carousel-btn.next');
    let autoScrollInterval;

    const updateButtons = () => {
        const scrollLeft = grid.scrollLeft;
        const maxScrollLeft = grid.scrollWidth - grid.clientWidth;
        
        prevBtn.disabled = scrollLeft <= 0;
        nextBtn.disabled = scrollLeft >= maxScrollLeft - 1; // -1 for precision
    };

    const scrollCarousel = (direction) => {
        const cardWidth = grid.querySelector('.project-card').offsetWidth;
        const scrollAmount = (cardWidth + 30) * direction; // 30 is the gap
        grid.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    };

    const stopAutoScroll = () => {
        clearInterval(autoScrollInterval);
    };

    const startAutoScroll = () => {
        stopAutoScroll(); // Prevent multiple intervals
        autoScrollInterval = setInterval(() => {
            const maxScrollLeft = grid.scrollWidth - grid.clientWidth;
            // If near the end, scroll to start. Otherwise, scroll to next.
            if (grid.scrollLeft >= maxScrollLeft - 1) {
                grid.scrollTo({ left: 0, behavior: 'smooth' });
            } else {
                scrollCarousel(1);
            }
        }, 3000); // Auto-scroll every 3 seconds
    };

    prevBtn.addEventListener('click', () => {
        stopAutoScroll();
        scrollCarousel(-1);
    });
    nextBtn.addEventListener('click', () => {
        stopAutoScroll();
        scrollCarousel(1);
    });

    // Use a timeout to ensure grid is fully rendered before checking scroll state
    grid.addEventListener('scroll', () => {
        // Use a debounce/throttle mechanism in a real-world scenario for performance
        setTimeout(updateButtons, 200);
    });

    // Pause on hover, resume on mouse leave
    carouselWrapper.addEventListener('mouseenter', stopAutoScroll);
    carouselWrapper.addEventListener('mouseleave', startAutoScroll);

    // Initial check
    window.addEventListener('load', () => setTimeout(updateButtons, 100));
    window.addEventListener('resize', () => setTimeout(updateButtons, 100));
    startAutoScroll(); // Start the auto-scroll initially
}

// Animated Timeline in Hero Section
const animatedTimeline = document.getElementById('animated-timeline');

if (animatedTimeline && animatedTimeline.querySelector('.timeline-milestones-wrapper')) {
    const wrapper = animatedTimeline.querySelector('.timeline-milestones-wrapper');
    const milestones = Array.from(animatedTimeline.querySelectorAll('.timeline-milestone'));
    const milestoneHeight = 90; // Must match the CSS height
    const visibleItems = 3;
    let currentIndex = 0;
    let autoScrollInterval;

    // Clone items to create a seamless loop
    for (let i = 0; i < visibleItems; i++) {
        if (milestones[i]) {
            const clone = milestones[i].cloneNode(true);
            wrapper.appendChild(clone);
        }
    }
    const allMilestones = Array.from(wrapper.querySelectorAll('.timeline-milestone'));

    function updateTimeline() {
        // Move the wrapper
        wrapper.style.transition = 'transform 0.8s ease-in-out';
        wrapper.style.transform = `translateY(${-currentIndex * milestoneHeight}px)`;

        // Update active/inactive classes for visual feedback after a short delay to sync with transition
        allMilestones.forEach((milestone, index) => {
            const activeIndex = currentIndex + Math.floor(visibleItems / 2); // The middle item is active
            if (index === activeIndex) {
                milestone.classList.remove('inactive');
            } else {
                milestone.classList.add('inactive');
            }
        });
        
        currentIndex++;

        // Reset to the beginning for a seamless loop
        if (currentIndex >= milestones.length) {
            // When the animation to the first cloned item finishes,
            // instantly jump back to the real first item without a transition.
            wrapper.addEventListener('transitionend', function resetLoop() {
                currentIndex = 0;
                wrapper.style.transition = 'none';
                wrapper.style.transform = 'translateY(0px)';
                // Remove the listener so it only runs once per loop
                wrapper.removeEventListener('transitionend', resetLoop);
            });
        }
    }

    function startTimelineScroll() {
        stopTimelineScroll(); // Ensure no multiple intervals are running
        autoScrollInterval = setInterval(updateTimeline, 3000); // Scroll every 3 seconds
    }

    function stopTimelineScroll() {
        clearInterval(autoScrollInterval);
    }

    function initializeTimeline() {
        // 1. Set the initial position to center the LAST item.
        const lastItemOriginalIndex = milestones.length - 1;
        const activeIndexInView = Math.floor(visibleItems / 2);
        const initialOffset = (lastItemOriginalIndex - activeIndexInView) * -milestoneHeight;
        wrapper.style.transition = 'none';
        wrapper.style.transform = `translateY(${initialOffset}px)`;

        // 2. Set the active state for the centered (last) item.
        allMilestones.forEach((milestone, index) => {
            milestone.classList.toggle('inactive', index !== lastItemOriginalIndex);
        });

        // 3. Start the animation loop after a brief pause.
        // Set the currentIndex to the last item's position so the next
        // updateTimeline() call correctly moves to the start of the loop.
        currentIndex = milestones.length;
        startTimelineScroll();
    }

    initializeTimeline();

    // Optional: Pause on hover
    animatedTimeline.addEventListener('mouseenter', stopTimelineScroll);
    animatedTimeline.addEventListener('mouseleave', startTimelineScroll);
}

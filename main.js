

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

// Scoped Tab functionality for multiple components
const tabContainers = document.querySelectorAll('.accomplishments-container, .about-tabs-container');

tabContainers.forEach(container => {
    const tabs = container.querySelectorAll('.tab-btn');
    const contentPanels = container.querySelectorAll('.content-panel');

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

if (animatedTimeline) {
    const wrapper = animatedTimeline.querySelector('.timeline-milestones-wrapper');
    const milestones = Array.from(animatedTimeline.querySelectorAll('.timeline-milestone'));
    const milestoneHeight = 90; // Must match the CSS height
    const visibleItems = 3;
    let currentIndex = 0;
    let autoScrollInterval;

    function updateTimeline() {
        // Calculate the offset to move the wrapper
        const offset = -currentIndex * milestoneHeight;
        wrapper.style.transform = `translateY(${offset}px)`;

        // Update active/inactive classes for visual feedback
        milestones.forEach((milestone, index) => {
            // The middle item of the visible set is considered the "most active"
            const activeIndex = currentIndex + Math.floor(visibleItems / 2);
            if (index === activeIndex) {
                milestone.classList.remove('inactive');
            } else {
                milestone.classList.add('inactive');
            }
        });

        // Increment index for the next scroll
        currentIndex++;
        // If we reach the end, loop back to the start
        if (currentIndex > milestones.length - visibleItems) {
            currentIndex = 0;
        }
    }

    function startTimelineScroll() {
        stopTimelineScroll(); // Ensure no multiple intervals are running
        autoScrollInterval = setInterval(updateTimeline, 2500); // Scroll every 2.5 seconds
    }

    function stopTimelineScroll() {
        clearInterval(autoScrollInterval);
    }

    // Initial call and start the interval
    updateTimeline();
    startTimelineScroll();

    // Optional: Pause on hover
    animatedTimeline.addEventListener('mouseenter', stopTimelineScroll);
    animatedTimeline.addEventListener('mouseleave', startTimelineScroll);
}

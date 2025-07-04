// =============== MOBILE MENU - ADDITIONAL EVENT LISTENERS ===============
// Setup additional event listeners when page loads (function already defined in HTML head)
document.addEventListener('DOMContentLoaded', function() {
    console.log('Setting up mobile menu handlers...');
    
    // Get elements
    const toggle = document.getElementById('nav-toggle');
    const menu = document.getElementById('nav-menu');
    
    if (!toggle || !menu) {
        console.error('Required elements missing:', { toggle: !!toggle, menu: !!menu });
        return;
    }
    
    // Add click handler to hamburger (backup to inline)
    toggle.addEventListener('click', function(e) {
        e.preventDefault();
        console.log('Event listener: Hamburger clicked!');
        window.toggleMobileMenu();
    });
    
    // Close menu when nav links are clicked - IMPROVED VERSION
    const navLinks = menu.querySelectorAll('.nav-link');
    console.log('Found nav links:', navLinks.length);
    
    navLinks.forEach(function(link, index) {
        link.addEventListener('click', function(e) {
            console.log('Nav link clicked:', link.textContent, 'Menu is open:', menu.classList.contains('show'));
            
            // Always close the menu when any nav link is clicked
            if (menu.classList.contains('show')) {
                console.log('Closing menu after nav link click');
                // Small delay to ensure smooth transition
                setTimeout(function() {
                    window.toggleMobileMenu();
                }, 100);
            }
        });
        console.log('Added click handler to nav link:', index + 1, link.textContent);
    });
    
    console.log('Mobile menu setup complete! Menu will close when navigation links are clicked.');
});

// =============== ACTIVE LINK ON SCROLL ===============
const sections = document.querySelectorAll('section[id]');

function scrollActive() {
    const scrollY = window.pageYOffset;
    const headerHeight = 80; // Account for fixed header

    // Remove active from all links first
    document.querySelectorAll('.nav-link').forEach(navLink => {
        navLink.classList.remove('active');
    });

    // Check which section is currently in view
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - headerHeight - 50;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
            currentSection = sectionId;
        }
    });

    // If we're at the very top, highlight Home
    if (scrollY < 100) {
        currentSection = 'home';
    }

    // Add active class to the current section's nav link
    if (currentSection) {
        const activeLink = document.querySelector(`.nav-menu a[href="#${currentSection}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
    }
}

// Initialize on page load and add scroll listener
window.addEventListener('scroll', scrollActive);
window.addEventListener('load', scrollActive);

// =============== HEADER SHADOW ON SCROLL ===============
const header = document.getElementById('header');

function scrollHeader() {
    if (window.scrollY >= 50) {
        header.classList.add('scroll');
    } else {
        header.classList.remove('scroll');
    }
}

window.addEventListener('scroll', scrollHeader);

// =============== SHOW SCROLL TOP ===============
const scrollTop = document.getElementById('scroll-top');

function showScrollTop() {
    if (window.scrollY >= 350) {
        scrollTop.classList.add('show');
    } else {
        scrollTop.classList.remove('show');
    }
}

window.addEventListener('scroll', showScrollTop);

// =============== SMOOTH SCROLLING FOR ANCHOR LINKS ===============
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.offsetTop;
            const offsetPosition = elementPosition - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// =============== GALLERY HORIZONTAL SCROLL (MOBILE) ===============
const gallery = document.querySelector('.gallery-container');
const galleryPrev = document.querySelector('.gallery-prev');
const galleryNext = document.querySelector('.gallery-next');

if (gallery && window.innerWidth <= 768) {
    let scrollAmount = 0;
    const scrollStep = 290; // Width of gallery item + gap

    galleryPrev?.addEventListener('click', () => {
        scrollAmount = Math.max(0, scrollAmount - scrollStep);
        gallery.scrollTo({
            left: scrollAmount,
            behavior: 'smooth'
        });
    });

    galleryNext?.addEventListener('click', () => {
        const maxScroll = gallery.scrollWidth - gallery.clientWidth;
        scrollAmount = Math.min(maxScroll, scrollAmount + scrollStep);
        gallery.scrollTo({
            left: scrollAmount,
            behavior: 'smooth'
        });
    });

    // Touch scroll indicator
    let isDown = false;
    let startX;
    let scrollLeft;

    gallery.addEventListener('mousedown', (e) => {
        isDown = true;
        gallery.style.cursor = 'grabbing';
        startX = e.pageX - gallery.offsetLeft;
        scrollLeft = gallery.scrollLeft;
    });

    gallery.addEventListener('mouseleave', () => {
        isDown = false;
        gallery.style.cursor = 'grab';
    });

    gallery.addEventListener('mouseup', () => {
        isDown = false;
        gallery.style.cursor = 'grab';
    });

    gallery.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - gallery.offsetLeft;
        const walk = (x - startX) * 2;
        gallery.scrollLeft = scrollLeft - walk;
    });
}

// =============== SCROLL ANIMATIONS ===============
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animated');
        }
    });
}, observerOptions);

// Add animation class to elements
document.querySelectorAll('.service-card').forEach(el => {
    el.classList.add('animate-on-scroll');
    observer.observe(el);
});

document.querySelectorAll('.about-feature').forEach(el => {
    el.classList.add('animate-on-scroll');
    observer.observe(el);
});

document.querySelectorAll('.gallery-item').forEach((el, index) => {
    el.classList.add('animate-on-scroll');
    el.style.transitionDelay = `${index * 0.1}s`;
    observer.observe(el);
});

// =============== NETLIFY FORM SUBMISSION ===============
const contactForm = document.getElementById('contact-form');

contactForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Add loading state
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;
    
    try {
        // Prepare form data for Netlify
        const formData = new FormData(contactForm);
        
        // Submit to Netlify
        const response = await fetch('/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams(formData).toString()
        });
        
        if (response.ok) {
            // Success - reset form and show success message
            contactForm.reset();
            submitBtn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
            submitBtn.style.background = 'var(--gradient-orange)';
            
            // Reset button after 3 seconds
            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.style.background = '';
                submitBtn.disabled = false;
            }, 3000);
        } else {
            throw new Error('Form submission failed');
        }
    } catch (error) {
        console.error('Form submission error:', error);
        
        // Show error message
        submitBtn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Error - Try Again';
        submitBtn.style.background = '#dc3545';
        
        // Reset button after 3 seconds
        setTimeout(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.style.background = '';
            submitBtn.disabled = false;
        }, 3000);
    }
});

// =============== DYNAMIC YEAR IN FOOTER ===============
const yearSpan = document.querySelector('.footer-bottom p');
if (yearSpan) {
    const currentYear = new Date().getFullYear();
    yearSpan.innerHTML = yearSpan.innerHTML.replace('2024', currentYear);
}

// =============== LOADING ANIMATION ===============
window.addEventListener('load', () => {
    // Add loaded class to body after page loads
    document.body.classList.add('loaded');
    
    // Trigger hero animations
    setTimeout(() => {
        document.querySelector('.hero-content')?.classList.add('animated');
        document.querySelector('.hero-image')?.classList.add('animated');
    }, 100);
});

// =============== RESIZE HANDLER ===============
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        // Reinitialize gallery controls for mobile/desktop switch
        if (window.innerWidth <= 768) {
            gallery?.style.cursor = 'grab';
        } else {
            gallery?.style.cursor = 'default';
        }
    }, 250);
});

// =============== PARALLAX EFFECT (DESKTOP ONLY) ===============
if (window.innerWidth > 1024) {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.hero-shape');
        
        parallaxElements.forEach((el, index) => {
            const speed = index === 0 ? 0.5 : 0.3;
            el.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });
}

// =============== TYPING EFFECT FOR HERO TITLE ===============
const heroTitle = document.querySelector('.hero-title-main');
if (heroTitle) {
    const text = heroTitle.textContent;
    heroTitle.textContent = '';
    heroTitle.style.opacity = '1';
    
    let index = 0;
    function typeWriter() {
        if (index < text.length) {
            heroTitle.textContent += text.charAt(index);
            index++;
            setTimeout(typeWriter, 50);
        }
    }
    
    setTimeout(typeWriter, 500);
}

// =============== COUNTER ANIMATION FOR STATS ===============
const stats = document.querySelectorAll('.stat-number');
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
            const target = entry.target;
            const originalContent = target.innerHTML;
            
            // Handle different types of stats
            if (originalContent.includes('fa-certificate')) {
                // Licensed certificate - just add counted class (no animation needed)
                target.classList.add('counted');
                return;
            }
            
            // Extract number for counting animation
            const textValue = target.textContent;
            const number = parseInt(textValue);
            
            if (!isNaN(number) && number > 0) {
                const hasPlus = textValue.includes('+');
                const hasPercent = textValue.includes('%');
                const increment = number / 60; // Slower animation
                let current = 0;
                
                const updateCounter = () => {
                    if (current < number) {
                        current += increment;
                        let displayValue = Math.ceil(current);
                        
                        // Add appropriate suffix
                        if (hasPlus) displayValue += '+';
                        if (hasPercent) displayValue += '%';
                        
                        target.textContent = displayValue;
                        setTimeout(updateCounter, 25);
                    } else {
                        // Ensure final value is correct
                        target.textContent = textValue;
                    }
                };
                
                // Start animation after a small delay
                setTimeout(updateCounter, 200);
            }
            
            target.classList.add('counted');
        }
    });
}, { threshold: 0.3 }); // Lower threshold for earlier trigger

stats.forEach(stat => statsObserver.observe(stat));

// =============== PRELOAD IMAGES ===============
const imageUrls = [
    'Logo-no-background.png',
    'symbol-only.png',
    'images-of-work/IMG_5236.jpg'
];

imageUrls.forEach(url => {
    const img = new Image();
    img.src = url;
}); 
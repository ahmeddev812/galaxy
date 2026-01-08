// Mobile Menu Toggle
const mobileToggle = document.getElementById('mobileToggle');
const mainNav = document.getElementById('mainNav');

if (mobileToggle && mainNav) {
    mobileToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        mainNav.classList.toggle('active');
        mobileToggle.textContent = mainNav.classList.contains('active') ? '✕' : '☰';
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.main-nav') && !e.target.closest('.mobile-toggle')) {
            mainNav.classList.remove('active');
            mobileToggle.textContent = '☰';
        }
    });

    // Close mobile menu when clicking on a NAVIGATION link (not dropdown toggle)
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // Check if this is a dropdown toggle link (has submenu)
            const parentDropdown = link.closest('.dropdown');
            
            if (parentDropdown && parentDropdown.querySelector('.submenu')) {
                // This is a dropdown toggle, don't navigate on mobile
                if (window.innerWidth <= 992) {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    // Toggle dropdown
                    parentDropdown.classList.toggle('active');
                    
                    // Close other open dropdowns
                    document.querySelectorAll('.dropdown').forEach(otherDropdown => {
                        if (otherDropdown !== parentDropdown) {
                            otherDropdown.classList.remove('active');
                        }
                    });
                }
            } else {
                // This is a regular navigation link
                if (window.innerWidth <= 992) {
                    mainNav.classList.remove('active');
                    mobileToggle.textContent = '☰';
                }
            }
        });
    });

    // Simple dropdown for mobile - only for dropdown toggles
    const initMobileDropdowns = () => {
        if (window.innerWidth <= 992) {
            const dropdownToggles = document.querySelectorAll('.dropdown > .nav-link');
            
            dropdownToggles.forEach(toggle => {
                // Remove existing event listeners by cloning
                const newToggle = toggle.cloneNode(true);
                toggle.parentNode.replaceChild(newToggle, toggle);
                
                newToggle.addEventListener('click', (e) => {
                    // Only prevent default for dropdown toggles without href or with # href
                    if (!newToggle.getAttribute('href') || newToggle.getAttribute('href') === '#') {
                        e.preventDefault();
                    }
                    
                    const parent = newToggle.closest('.dropdown');
                    
                    // Close other open dropdowns
                    dropdownToggles.forEach(otherToggle => {
                        if (otherToggle !== newToggle) {
                            otherToggle.closest('.dropdown').classList.remove('active');
                        }
                    });
                    
                    // Toggle current dropdown
                    parent.classList.toggle('active');
                });
            });
        }
    };

    // Initialize on load
    initMobileDropdowns();
    
    // Re-initialize on resize
    window.addEventListener('resize', () => {
        if (window.innerWidth > 992) {
            mainNav.classList.remove('active');
            mobileToggle.textContent = '☰';
            
            // Close all dropdowns on desktop
            document.querySelectorAll('.dropdown').forEach(dropdown => {
                dropdown.classList.remove('active');
            });
        }
        initMobileDropdowns();
    });
}

// Fix for About page mobile navigation - Add this specific fix
document.addEventListener('DOMContentLoaded', () => {
    // Fix mobile navigation for About page specifically
    const aboutPageLinks = document.querySelectorAll('.about-content-section a, .info-section a, .site-footer a');
    
    aboutPageLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // If it's a hash link or external link, don't close the menu
            if (link.getAttribute('href') && 
                (link.getAttribute('href').startsWith('#') || 
                 link.getAttribute('href').startsWith('http'))) {
                return;
            }
            
            // Close mobile menu if open
            if (window.innerWidth <= 992 && mainNav && mainNav.classList.contains('active')) {
                mainNav.classList.remove('active');
                if (mobileToggle) {
                    mobileToggle.textContent = '☰';
                }
            }
        });
    });
});

// Homepage Image Slider
const initHomepageSlider = () => {
    const slides = document.querySelectorAll('.image-slider .slider-image');
    if (slides.length === 0) return;

    let currentSlide = 0;
    let slideInterval;

    function showSlide(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        slides[index].classList.add('active');
        currentSlide = index;
    }

    function nextSlide() {
        let nextIndex = (currentSlide + 1) % slides.length;
        showSlide(nextIndex);
    }

    // Start auto-sliding
    if (slides.length > 1) {
        showSlide(0);
        slideInterval = setInterval(nextSlide, 5000);
        
        // Pause on hover
        const slider = document.querySelector('.image-slider');
        if (slider) {
            slider.addEventListener('mouseenter', () => {
                clearInterval(slideInterval);
            });

            slider.addEventListener('mouseleave', () => {
                slideInterval = setInterval(nextSlide, 5000);
            });
        }
    } else if (slides.length === 1) {
        showSlide(0);
    }
};

// Product Slider Functionality (Homepage only)
const initProductSlider = () => {
    const categoryButtons = document.querySelectorAll('.category-btn');
    const productImage = document.getElementById('productImage');
    const productTitle = document.getElementById('productTitle');
    const productDescription = document.getElementById('productDescription');
    const sliderDots = document.querySelectorAll('.slider-dot');

    if (!categoryButtons.length || !productImage) return;

    // Product Data
    const products = {
        weaving: {
            title: "Weaving Machine Spare Parts",
            description: "High-quality spare parts for all types of weaving machines including Shuttle Looms, Sulzer Projectile, Sulzer Rapier, Vamatex, and Nuovo Pignone machines. Manufactured with precision engineering for durability and performance.",
            images: [
                "./Assets/gweaving-1.jpg",
                "./Assets/gweaving-2.jpg",
                "./Assets/gweaving-3.jpg",
                "./Assets/gweaving-4.jpg"
            ]
        },
        spinning: {
            title: "Spinning Machine Spare Parts",
            description: "Premium spare parts for spinning machines including Blowroom, Carding, Draw Frame, Speed Frames, and Comber machines. Designed to enhance machine efficiency and reduce downtime.",
            images: [
                "./Assets/gspinning-1.jpg",
                "./Assets/gspinning-2.jpg",
                "./Assets/gspinning-3.jpg",
                "./Assets/gspinning-4.jpg"
            ]
        },
        plastic: {
            title: "Plastic Woven Sacks Machinery",
            description: "Complete machinery and spare parts for plastic woven sack manufacturing. From extrusion to printing and stitching, we provide reliable solutions for the packaging industry.",
            images: [
                "./Assets/gplastic-woven.jpg",
                "./Assets/gplastic-woven.jpg",
                "./Assets/gplastic-woven.jpg",
                "./Assets/gplastic-woven.jpg"
            ]
        },
        rollshop: {
            title: "Roll Shop Machines",
            description: "Advanced roll shop machinery for textile processing units. Our machines ensure precise winding, unwinding, and processing of textile rolls with maximum efficiency.",
            images: [
                "./Assets/rollshopp5.jpg",
                "./Assets/rollshopp5.jpg",
                "./Assets/rollshopp5.jpg",
                "./Assets/rollshopp5.jpg"
            ]
        }
    };

    let currentCategory = 'weaving';
    let currentImageIndex = 0;

    // Function to update product display
    function updateProductDisplay(category, imageIndex = 0) {
        const product = products[category];

        if (!product) return;

        // Update product info
        if (productTitle) productTitle.textContent = product.title;
        if (productDescription) productDescription.textContent = product.description;

        // Update image
        if (productImage) productImage.src = product.images[imageIndex];

        // Update active dots
        if (sliderDots.length) {
            sliderDots.forEach((dot, index) => {
                if (index === imageIndex) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        }
    }

    // Category button click events
    categoryButtons.forEach(button => {
        button.addEventListener('click', function () {
            // Remove active class from all buttons
            categoryButtons.forEach(btn => {
                btn.classList.remove('active');
            });

            // Add active class to clicked button
            this.classList.add('active');

            // Determine category
            const id = this.id;
            if (id === 'btnWeaving') currentCategory = 'weaving';
            else if (id === 'btnSpinning') currentCategory = 'spinning';
            else if (id === 'btnPlastic') currentCategory = 'plastic';
            else if (id === 'btnRollShop') currentCategory = 'rollshop';

            // Reset to first image
            currentImageIndex = 0;

            // Update display
            updateProductDisplay(currentCategory, currentImageIndex);
        });
    });

    // Slider dot click events
    if (sliderDots.length) {
        sliderDots.forEach(dot => {
            dot.addEventListener('click', function () {
                const index = parseInt(this.getAttribute('data-index'));
                if (!isNaN(index) && index >= 0 && index < 4) {
                    currentImageIndex = index;
                    updateProductDisplay(currentCategory, currentImageIndex);
                }
            });
        });
    }

    // Initialize with weaving products
    updateProductDisplay('weaving', 0);
};

// Form submission handling
const initEnquiryForm = () => {
    const enquiryForm = document.querySelector('.enquiry-form');
    
    if (enquiryForm) {
        enquiryForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                country: document.getElementById('country').value,
                phone: document.getElementById('phone').value,
                enquiryDetails: document.getElementById('enquiry-details').value
            };
            
            // Validate form
            if (!formData.name || !formData.email || !formData.country || !formData.phone || !formData.enquiryDetails) {
                alert('Please fill in all required fields.');
                return;
            }
            
            // Show loading state
            const submitBtn = enquiryForm.querySelector('.submit-btn');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            // Simulate API call
            setTimeout(() => {
                // Reset button
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                
                // Show success message
                alert('Thank you for your enquiry! We will get back to you within 24 hours.');
                
                // Reset form
                enquiryForm.reset();
            }, 1500);
        });
    }
};

// Card Hover Effects
const initCardHover = () => {
    const cards = document.querySelectorAll('.product-card');
    
    cards.forEach(card => {
        const cardImage = card.querySelector('.card-image img');
        
        if (cardImage) {
            card.addEventListener('mouseenter', () => {
                cardImage.style.transform = 'scale(1.05)';
            });
            
            card.addEventListener('mouseleave', () => {
                cardImage.style.transform = 'scale(1)';
            });
        }
    });
};

// About Us Button Link
const initAboutButton = () => {
    const aboutBtn = document.querySelector('.about-btn');
    
    if (aboutBtn) {
        aboutBtn.addEventListener('click', () => {
            window.location.href = './about.html';
        });
    }
};

// Initialize all functions when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initHomepageSlider();
    initProductSlider();
    initEnquiryForm();
    initCardHover();
    initAboutButton();
    
    // Update active navigation link
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.classList.remove('current');
        const href = link.getAttribute('href');
        
        // Check if this link matches the current page
        if (href === currentPage || 
            (currentPage === '' && href === './index.html') ||
            (currentPage === 'index.html' && href === './index.html') ||
            (currentPage === 'about.html' && href === './about.html') ||
            (currentPage === 'product.html' && href === './product.html') ||
            (currentPage === 'contact.html' && href === './contact.html') ||
            (href === './index.html' && currentPage.includes('index.html'))) {
            link.classList.add('current');
        }
        
        // Also check parent links
        if (href === './about.html' && currentPage === 'about.html') {
            link.classList.add('current');
        }
    });
    
    // FIXED: Handle navigation properly
    // Add click event to navigation links that should navigate
    const navigationLinks = document.querySelectorAll('.nav-list .nav-link[href]:not([href="#"])');
    
    navigationLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // If it's a dropdown toggle (has arrow), don't navigate on mobile
            const hasArrow = link.querySelector('.nav-arrow');
            const parentDropdown = link.closest('.dropdown');
            
            if (window.innerWidth <= 992 && parentDropdown && hasArrow) {
                // This is a dropdown toggle on mobile, navigation is handled elsewhere
                return;
            }
            
            // For regular navigation links, allow them to work
            const href = link.getAttribute('href');
            
            // Close mobile menu if open
            if (window.innerWidth <= 992 && mainNav && mainNav.classList.contains('active')) {
                mainNav.classList.remove('active');
                if (mobileToggle) {
                    mobileToggle.textContent = '☰';
                }
                
                // Add a small delay to allow menu to close before navigation
                setTimeout(() => {
                    if (href && !href.startsWith('javascript')) {
                        window.location.href = href;
                    }
                }, 50);
            }
        });
    });
});
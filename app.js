/**
 * ROSE'S CLEANING & JANITORIAL - BOTANICAL MOTION ENGINE
 * Created for: Rose's Cleaning and Janitorial
 * Author: AI Coding Partner & Dixie Tech Software Student
 * 
 * Student Learning Note:
 * - We have added two major motion systems here:
 *   1. Intersection Observer API: Monitors when elements enter the screen on scroll
 *      and flags them with the "reveal-active" class so CSS can slide them up.
 *   2. Scroll Parallax: Watches the global scroll position and moves floating background
 *      leaf SVGs at different rates of speed (depths) to create 3D layered space.
 * - We maintain the coordinate slider math and the estimate calculation formulas.
 */

document.addEventListener('DOMContentLoaded', () => {
  
  // ==========================================
  // 1. SCROLL REVEAL ENGINE (Intersection Observer)
  // ==========================================
  const revealElements = document.querySelectorAll('.reveal-item');

  // Options configuration for the scroll sensor
  const revealOptions = {
    root: null,          // Use the viewport as the root container
    threshold: 0.08,     // Trigger when 8% of the element is visible
    rootMargin: "0px 0px -40px 0px" // Trigger slightly before it reaches the viewport bottom
  };

  // Callback function when element enters screen
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      // If the target element is within the viewport
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-active');
        // Unobserve once animation is triggered to optimize browser performance
        observer.unobserve(entry.target);
      }
    });
  }, revealOptions);

  // Bind observer to all elements with reveal classes
  revealElements.forEach(element => {
    revealObserver.observe(element);
  });


  // ==========================================
  // 2. BOTANICAL FLOATING PARALLAX EFFECT
  // ==========================================
  const floatingLeaves = document.querySelectorAll('.floating-leaf');

  window.addEventListener('scroll', () => {
    // Current distance scrolled from the top of page
    const scrollY = window.pageYOffset;

    floatingLeaves.forEach(leaf => {
      // Fetch custom depth attribute (e.g. 0.15, 0.25)
      const depth = parseFloat(leaf.getAttribute('data-depth')) || 0.1;
      
      // Calculate offset based on scroll position and depth
      const translateY = scrollY * depth;
      // Gently rotate the leaf as scroll happens to look organic
      const rotate = scrollY * 0.03;

      // Apply 3D transform for hardware acceleration (smooth animations)
      leaf.style.transform = `translateY(${translateY}px) rotate(${rotate}deg)`;
    });
  }, { passive: true }); // passive: true improves scrolling performance on mobile


  // ==========================================
  // 3. MOBILE MENU CONTROLLER
  // ==========================================
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const mobileMenuDrawer = document.getElementById('mobile-menu-drawer');
  const mobileOverlay = document.getElementById('mobile-overlay');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  function toggleMobileMenu() {
    const isExpanded = hamburgerBtn.getAttribute('aria-expanded') === 'true';
    hamburgerBtn.setAttribute('aria-expanded', !isExpanded);
    mobileMenuDrawer.classList.toggle('active');
    mobileOverlay.classList.toggle('active');
    
    // Toggle active state classes on hamburger spans for icon morphing
    const spans = hamburgerBtn.querySelectorAll('span');
    if (!isExpanded) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(4px, -5px)';
    } else {
      spans[0].style.transform = '';
      spans[1].style.opacity = '1';
      spans[2].style.transform = '';
    }

    document.body.style.overflow = isExpanded ? 'auto' : 'hidden';
  }

  hamburgerBtn.addEventListener('click', toggleMobileMenu);
  mobileOverlay.addEventListener('click', toggleMobileMenu);

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      setTimeout(toggleMobileMenu, 250);
    });
  });


  // ==========================================
  // 4. BEFORE/AFTER AUTO-SLIDESHOW
  // ==========================================
  const baSlides = document.querySelectorAll('.ba-slide');
  const baDots = document.querySelectorAll('.ba-dot');
  let currentSlide = 0;
  let slideshowTimer;

  function goToSlide(index) {
    baSlides[currentSlide].classList.remove('active');
    baDots[currentSlide].classList.remove('active');
    currentSlide = index;
    baSlides[currentSlide].classList.add('active');
    baDots[currentSlide].classList.add('active');
  }

  function nextSlide() {
    goToSlide((currentSlide + 1) % baSlides.length);
  }

  function resetTimer() {
    clearInterval(slideshowTimer);
    slideshowTimer = setInterval(nextSlide, 4000);
  }

  baDots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      goToSlide(i);
      resetTimer();
    });
  });

  slideshowTimer = setInterval(nextSlide, 4000);


  // ==========================================
  // 5. DYNAMIC PRICING ESTIMATE CALCULATOR
  // ==========================================
  const selectService = document.getElementById('calc-service');
  const inputSize = document.getElementById('calc-size');
  const sizeValDisplay = document.getElementById('size-val');
  const selectBeds = document.getElementById('calc-beds');
  const selectBaths = document.getElementById('calc-baths');
  const outputPrice = document.getElementById('calculated-price');
  const ctaBtn = document.getElementById('calculator-cta-btn');

  inputSize.addEventListener('input', () => {
    sizeValDisplay.textContent = `${Number(inputSize.value).toLocaleString()} sq ft`;
  });

  function calculateEstimate() {
    const service = selectService.value;
    const size = parseInt(inputSize.value, 10);
    const beds = parseInt(selectBeds.value, 10);
    const baths = parseFloat(selectBaths.value);

    let basePrice = 0;
    let ratePerSqFt = 0;
    let bedModifier = 0;
    let bathModifier = 0;

    if (service === 'standard') {
      basePrice = 120;
      ratePerSqFt = 0.05;
      bedModifier = 10;
      bathModifier = 15;
    } else if (service === 'deep') {
      basePrice = 200;
      ratePerSqFt = 0.08;
      bedModifier = 20;
      bathModifier = 25;
    } else if (service === 'move-out') {
      basePrice = 250;
      ratePerSqFt = 0.10;
      bedModifier = 25;
      bathModifier = 30;
    }

    const baseSizeThreshold = 1000;
    let sizeCharge = 0;
    if (size > baseSizeThreshold) {
      sizeCharge = (size - baseSizeThreshold) * ratePerSqFt;
    }

    const baseTotal = basePrice + sizeCharge + (beds * bedModifier) + (baths * bathModifier);
    
    // Provide range output rounded to nearest $5
    const rangeLow = Math.round((baseTotal - 15) / 5) * 5;
    const rangeHigh = Math.round((baseTotal + 15) / 5) * 5;

    outputPrice.textContent = `$${rangeLow} - $${rangeHigh}`;
    
    const customMessage = `Hi Rose and Maria! I used your estimator. I'd like a quote for a ${service} cleaning of my ${size} sq ft home with ${beds} beds and ${baths} baths.`;
    ctaBtn.href = `#contact?notes=${encodeURIComponent(customMessage)}&service=${service}`;
  }

  const calculatorInputs = [selectService, inputSize, selectBeds, selectBaths];
  calculatorInputs.forEach(input => {
    input.addEventListener('input', calculateEstimate);
  });

  calculateEstimate();


  // ==========================================
  // 6. AUTO-FILL FORM FROM CALCULATOR CTA
  // ==========================================
  function parseUrlParams() {
    if (window.location.hash.includes('?')) {
      const queryString = window.location.hash.split('?')[1];
      const params = new URLSearchParams(queryString);
      
      const serviceParam = params.get('service');
      const notesParam = params.get('notes');
      
      if (serviceParam) {
        document.getElementById('contact-service').value = serviceParam;
      }
      if (notesParam) {
        document.getElementById('contact-notes').value = notesParam;
      }
    }
  }

  window.addEventListener('hashchange', parseUrlParams);
  parseUrlParams();


  // ==========================================
  // 7. FORM VALIDATION & CONFIRMATION
  // ==========================================
  const contactForm = document.getElementById('quote-contact-form');
  const successModal = document.getElementById('success-modal');
  const closeModalBtn = document.getElementById('close-modal-btn');

  function showModal() {
    successModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function hideModal() {
    successModal.classList.remove('active');
    document.body.style.overflow = 'auto';
  }

  closeModalBtn.addEventListener('click', hideModal);
  
  successModal.addEventListener('click', (e) => {
    if (e.target === successModal) {
      hideModal();
    }
  });

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;

    const nameInput = document.getElementById('contact-name');
    const emailInput = document.getElementById('contact-email');
    const phoneInput = document.getElementById('contact-phone');
    const notesInput = document.getElementById('contact-notes');
    const serviceSelect = document.getElementById('contact-service');

    const inputsToValidate = [nameInput, emailInput, phoneInput, notesInput];

    inputsToValidate.forEach(input => {
      input.style.borderColor = '';
      if (!input.value.trim()) {
        input.style.borderColor = '#c98e91';
        isValid = false;
      }
    });

    if (emailInput.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value.trim())) {
      emailInput.style.borderColor = '#c98e91';
      isValid = false;
    }

    if (isValid) {
      const serviceLabel = serviceSelect.options[serviceSelect.selectedIndex].text;
      const smsBody = `Hi Rose and Maria! My name is ${nameInput.value.trim()}. I'd like to request a ${serviceLabel}. My email: ${emailInput.value.trim()}. My number: ${phoneInput.value.trim()}. Notes: ${notesInput.value.trim()}`;
      // Opens the device's native SMS app pre-filled — customer just hits send
      window.location.href = `sms:4352659950?body=${encodeURIComponent(smsBody)}`;
    }
  });
});

// Main Script for qld.se - Clean & Optimized

// ====== Gallery Image Slider ======
let currentIndex = 0;
let galleryItems = [];

document.addEventListener("DOMContentLoaded", () => {
  galleryItems = document.querySelectorAll(".gallery-item");
  const totalItems = galleryItems.length;

  if (totalItems > 0) {
    galleryItems[currentIndex].classList.add("active");

    setInterval(() => {
      galleryItems[currentIndex].classList.remove("active");
      currentIndex = (currentIndex + 1) % totalItems;
      galleryItems[currentIndex].classList.add("active");
    }, 3000);
  }
});

// ====== Google Maps API Loader ======
window.addEventListener("load", () => {
  const script = document.createElement("script");
  script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&callback=initMap`;
  script.async = true;
  document.body.appendChild(script);
});

// ====== Sticky Navbar on Scroll ======
window.addEventListener("scroll", () => {
  const nav = document.querySelector(".fixed-nav");
  if (nav) {
    nav.classList.toggle("scrolled", window.scrollY > 50);
  }
});

// ====== Mobile Menu Toggle ======
document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");
  const overlay = document.createElement("div");
  overlay.className = "overlay";
  document.body.appendChild(overlay);

  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      navLinks.classList.toggle("active");
      menuToggle.classList.toggle("active");
      overlay.classList.toggle("active");
    });

    overlay.addEventListener("click", () => {
      navLinks.classList.remove("active");
      menuToggle.classList.remove("active");
      overlay.classList.remove("active");
    });

    document.querySelectorAll(".nav-links a").forEach(link => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("active");
        menuToggle.classList.remove("active");
        overlay.classList.remove("active");
      });
    });
  }
});

// ====== Hero Image Slider ======
let slideIndex = 0;
let slides = [];

document.addEventListener("DOMContentLoaded", () => {
  slides = document.querySelectorAll(".slide");
  function showSlides() {
    if (slides.length === 0) return;

    slides.forEach(slide => (slide.style.display = "none"));
    slideIndex = (slideIndex + 1) > slides.length ? 1 : slideIndex + 1;
    slides[slideIndex - 1].style.display = "block";

    setTimeout(showSlides, 3000);
  }
  showSlides();
});

// ====== About Us Scroll Animation ======
document.addEventListener("DOMContentLoaded", () => {
  const section = document.querySelector(".about-us-section");
  const textContent = document.querySelector(".about-us-right");

  function revealOnScroll() {
    if (section && textContent) {
      const sectionPosition = section.getBoundingClientRect().top;
      const screenPosition = window.innerHeight / 1.3;
      if (sectionPosition < screenPosition) {
        textContent.classList.add("show");
      }
    }
  }
  window.addEventListener("scroll", revealOnScroll);
});

// ====== About 3 Section Animation ======
document.addEventListener("DOMContentLoaded", () => {
  const section = document.querySelector(".about3");
  function revealSection() {
    if (!section) return;
    const sectionPosition = section.getBoundingClientRect().top;
    const screenPosition = window.innerHeight / 1.2;
    if (sectionPosition < screenPosition) {
      section.classList.add("visible");
    }
  }
  window.addEventListener("scroll", revealSection);
  revealSection();
});

// ====== Google Map Initialization ======
function initMap() {
  const stockholm = { lat: 59.3293, lng: 18.0686 };
  const map = new google.maps.Map(document.getElementById("map"), {
    center: stockholm,
    zoom: 10,
  });

  const marker = new google.maps.Marker({
    map,
    position: stockholm,
    draggable: true,
  });

  google.maps.event.addListener(map, "click", function (event) {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ location: event.latLng }, function (results, status) {
      if (status === "OK" && results[0]) {
        const address = results[0].formatted_address;
        document.getElementById("destination").value = address;
        marker.setPosition(event.latLng);
      }
    });
  });
}

// ====== Price Calculator ======
function calculatePrice() {
  const size = parseFloat(document.getElementById("size")?.value);
  const weight = parseFloat(document.getElementById("weight")?.value);
  const length = parseFloat(document.getElementById("length")?.value);
  const width = parseFloat(document.getElementById("width")?.value);
  const height = parseFloat(document.getElementById("height")?.value);

  if (size && weight && length && width && height) {
    const volume = (length * width * height) / 1000000;
    const cost = volume * 30 + weight * 7;
    const priceDisplay = document.getElementById("price-display");
    if (priceDisplay) {
      priceDisplay.innerText = `Estimated Price: ${cost.toFixed(2)} SEK`;
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("input").forEach(input => {
    input.addEventListener("input", calculatePrice);
  });
});

// ====== Payment Simulation ======
function simulatePayment() {
  const text = document.getElementById("price-display")?.innerText;
  const price = text?.split(" ")[2];
  if (price && price !== "Will" && price !== "calculated") {
    alert(`Proceeding to payment of ${price} SEK.`);
  } else {
    alert("Please fill all fields before proceeding to payment.");
  }
}


// box seaction vid 

  const containers44 = document.querySelectorAll('.video-container44');
  const overlay44 = document.getElementById('videoOverlay44');
  const expandedVideo44 = document.getElementById('expandedVideo44');
  const overlayTitle44 = document.getElementById('overlayTitle44');
  const closeBtn44 = document.getElementById('closeOverlayBtn44');

  containers44.forEach(container => {
    container.addEventListener('click', () => {
      const video = container.querySelector('video');
      const source = video.querySelector('source').src;
      const title = container.dataset.title;

      expandedVideo44.src = source;
      expandedVideo44.load();
      expandedVideo44.play();
      overlayTitle44.textContent = title;
      overlay44.classList.remove('hidden44');
    });
  });

  closeBtn44.addEventListener('click', () => {
    expandedVideo44.pause();
    expandedVideo44.src = '';
    overlay44.classList.add('hidden44');
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !overlay44.classList.contains('hidden44')) {
      closeBtn44.click();
    }
  });

let currentIndex = 0;
const galleryItems = document.querySelectorAll('.gallery-item');
const totalItems = galleryItems.length;

function showNextImage() {
    galleryItems[currentIndex].classList.remove('active');
    currentIndex = (currentIndex + 1) % totalItems;
    galleryItems[currentIndex].classList.add('active');
}
setInterval(showNextImage, 3000);

window.addEventListener('load', () => {
    // first img
    if (galleryItems[currentIndex]) {
        galleryItems[currentIndex].classList.add('active');
    }

    // Google Maps
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&callback=initMap`;
    script.async = true;
    document.body.appendChild(script);
});

// nav scroll
window.addEventListener('scroll', function() {
    const nav = document.querySelector('.fixed-nav');
    if (nav) {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    }
});

// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function () {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    document.body.appendChild(overlay);

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', function () {
            navLinks.classList.toggle('active');
            menuToggle.classList.toggle('active');
            overlay.classList.toggle('active');
        });

        overlay.addEventListener('click', function () {
            navLinks.classList.remove('active');
            menuToggle.classList.remove('active');
            overlay.classList.remove('active');
        });

        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                menuToggle.classList.remove('active');
                overlay.classList.remove('active');
            });
        });
    }
});

// Image Slider
let slideIndex = 0;
const slides = document.querySelectorAll('.slide');

function showSlides() {
    slides.forEach(slide => {
        slide.style.display = 'none';
    });
    slideIndex++;
    if (slideIndex > slides.length) slideIndex = 1;
    if (slides[slideIndex - 1]) {
        slides[slideIndex - 1].style.display = 'block';
    }
    setTimeout(showSlides, 3000);
}
showSlides();

// about-us scroll animation
document.addEventListener("DOMContentLoaded", function () {
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

// about3 section animation
document.addEventListener("DOMContentLoaded", function () {
    function revealSection() {
        let section = document.querySelector(".about3");
        if (!section) return;
        let sectionPosition = section.getBoundingClientRect().top;
        let screenPosition = window.innerHeight / 1.2;
        if (sectionPosition < screenPosition) {
            section.classList.add("visible");
        }
    }

    window.addEventListener("scroll", revealSection);
    revealSection();
});

// Google Map Initialization
function initMap() {
    const stockholm = { lat: 59.3293, lng: 18.0686 };
    const map = new google.maps.Map(document.getElementById("map"), {
        center: stockholm,
        zoom: 10,
    });

    const marker = new google.maps.Marker({
        map: map,
        position: stockholm,
        draggable: true,
    });

    google.maps.event.addListener(map, "click", function (event) {
        const lat = event.latLng.lat();
        const lng = event.latLng.lng();
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

// price
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

document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll("input").forEach(input => {
        input.addEventListener("input", calculatePrice);
    });
});

// pay
function simulatePayment() {
    const text = document.getElementById("price-display")?.innerText;
    const price = text?.split(" ")[2];
    if (price && price !== "Will" && price !== "calculated") {
        alert(`Proceeding to payment of ${price} SEK.`);
    } else {
        alert("Please fill all fields before proceeding to payment.");
    }
}

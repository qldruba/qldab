let currentIndex = 0;
const galleryItems = document.querySelectorAll('.gallery-item');
const totalItems = galleryItems.length;

function showNextImage() {
    // إخفاء الصورة الحالية
    galleryItems[currentIndex].classList.remove('active');

    // الانتقال إلى الصورة التالية
    currentIndex = (currentIndex + 1) % totalItems;

    // إظهار الصورة الجديدة
    galleryItems[currentIndex].classList.add('active');
}

// بدء التقلب التلقائي كل 3 ثواني
setInterval(showNextImage, 3000);

// إظهار الصورة الأولى عند التحميل
window.onload = () => {
    galleryItems[currentIndex].classList.add('active');
};

// Navbar Scroll Effect
window.addEventListener('scroll', function() {
    const nav = document.querySelector('.fixed-nav');
    if (window.scrollY > 50) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
});

// Mobile Menu Toggle
document.querySelector('.menu-toggle').addEventListener('click', function() {
    document.querySelector('.nav-links').classList.toggle('active');
});


// Image Slider
let slideIndex = 0;
const slides = document.querySelectorAll('.slide');

function showSlides() {
    slides.forEach((slide, index) => {
        slide.style.display = 'none';
    });
    slideIndex++;
    if (slideIndex > slides.length) {
        slideIndex = 1;
    }
    slides[slideIndex - 1].style.display = 'block';
    setTimeout(showSlides, 3000);
}
showSlides();

// abou us page 
document.addEventListener("DOMContentLoaded", function () {
    const section = document.querySelector(".about-us-section");
    const textContent = document.querySelector(".about-us-right");

    function revealOnScroll() {
        const sectionPosition = section.getBoundingClientRect().top;
        const screenPosition = window.innerHeight / 1.3;

        if (sectionPosition < screenPosition) {
            textContent.classList.add("show");
        }
    }

    window.addEventListener("scroll", revealOnScroll);
});

//abot3
document.addEventListener("DOMContentLoaded", function () {
    function revealSection() {
        let section = document.querySelector(".about3");
        if (!section) {
            console.error("العنصر .about3 غير موجود!");
            return;
        }
        let sectionPosition = section.getBoundingClientRect().top;
        let screenPosition = window.innerHeight / 1.2;

        if (sectionPosition < screenPosition) {
            section.classList.add("visible");
            console.log("تم إظهار القسم!");
        }
    }

    window.addEventListener("scroll", revealSection);
    revealSection(); // لضمان أن العنصر يظهر إذا كان بالفعل في الشاشة عند التحميل
});

        // Initialize Google Map with the location in Sweden (Stockholm as an example)
        function initMap() {
            const stockholm = { lat: 59.3293, lng: 18.0686 };  // Coordinates for Stockholm, Sweden
            const map = new google.maps.Map(document.getElementById("map"), {
                center: stockholm,
                zoom: 10,
            });

            const marker = new google.maps.Marker({
                map: map,
                position: stockholm,
                draggable: true,  // Enable dragging
            });

            // Event listener for clicking on the map to select the destination
            google.maps.event.addListener(map, "click", function (event) {
                const lat = event.latLng.lat();
                const lng = event.latLng.lng();
                const geocoder = new google.maps.Geocoder();

                geocoder.geocode({ location: event.latLng }, function (results, status) {
                    if (status === "OK" && results[0]) {
                        const address = results[0].formatted_address;
                        document.getElementById("destination").value = address;  // Update destination input
                        marker.setPosition(event.latLng);  // Update marker position
                    }
                });
            });
        }

        // Load Google Maps API
        window.onload = function() {
            const script = document.createElement('script');
            script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&callback=initMap`;
            script.async = true;
            document.body.appendChild(script);
        };

        // Calculate the estimated price based on the input
        function calculatePrice() {
            const size = parseFloat(document.getElementById("size").value);
            const weight = parseFloat(document.getElementById("weight").value);
            const length = parseFloat(document.getElementById("length").value);
            const width = parseFloat(document.getElementById("width").value);
            const height = parseFloat(document.getElementById("height").value);

            if (size && weight && length && width && height) {
                const volume = (length * width * height) / 1000000;  // Convert to cubic meters
                const cost = volume * 30 + weight * 7;  // Assume cost is based on volume and weight
                document.getElementById("price-display").innerText = `Estimated Price: ${cost.toFixed(2)} SEK`;
            }
        }

        // Attach input event listeners to recalculate price when any input changes
        document.querySelectorAll("input").forEach(input => {
            input.addEventListener("input", calculatePrice);
        });

        // Simulate Payment (for demo purposes)
        function simulatePayment() {
            const price = document.getElementById("price-display").innerText.split(" ")[2];
            if (price !== "Will" && price !== "calculated") {
                alert(`Proceeding to payment of ${price} SEK.`);
                // Here you can integrate real payment gateways like PayPal or Stripe
            } else {
                alert("Please fill all fields before proceeding to payment.");
            }
        }

// Initialize the map
let map = L.map("map").setView([51.1657, 10.4515], 6); // Centered in Germany

// Add OpenStreetMap tiles
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

// Placeholder for language translation (simple example)
const translations = {
    en: {
        start: "Starting Location",
        end: "Destination",
        button: "Find Route",
    },
    de: {
        start: "Startpunkt",
        end: "Ziel",
        button: "Route finden",
    },
    fr: {
        start: "Point de départ",
        end: "Destination",
        button: "Trouver un itinéraire",
    },
};

// Close welcome modal
function closeModal() {
    document.getElementById("welcome-modal").style.display = "none";
}

// Set language translations
function setLanguage() {
    const lang = document.getElementById("language-selector").value;
    document.getElementById("locationA").placeholder = translations[lang].start;
    document.getElementById("locationB").placeholder = translations[lang].end;
    document.querySelector(".modern-button").textContent = translations[lang].button;
}

// Calculate and display route
function calculateRoute() {
    const locationA = document.getElementById("locationA").value;
    const locationB = document.getElementById("locationB").value;

    if (!locationA || !locationB) {
        alert("Please fill out both locations!");
        return;
    }

    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${locationA}`)
        .then((response) => response.json())
        .then((dataA) => {
            if (dataA.length === 0) throw new Error("Invalid starting location.");
            const start = [dataA[0].lat, dataA[0].lon];

            fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${locationB}`)
                .then((response) => response.json())
                .then((dataB) => {
                    if (dataB.length === 0) throw new Error("Invalid destination.");
                    const end = [dataB[0].lat, dataB[0].lon];

                    // Add route to map
                    L.Routing.control({
                        waypoints: [L.latLng(start), L.latLng(end)],
                        routeWhileDragging: true,
                    }).addTo(map);
                });
        })
        .catch((error) => alert(error.message));
}

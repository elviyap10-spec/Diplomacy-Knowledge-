const map = L.map("map").setView([20, 0], 2);

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

fetch("https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson")
    .then(response => response.json())
    .then(data => {
        L.geoJSON(data, {
            style: {
                color: "#ffffff",
                weight: 1,
                fillOpacity: 0.35
            }
        }).addTo(map);
    })
    .catch(error => {
        console.error("Erreur de chargement de la carte :", error);
    });

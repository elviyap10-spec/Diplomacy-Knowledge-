const map = L.map("map").setView([20, 0], 2);

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors"
}).addTo(map);


// STYLE DES PAYS
const countryStyle = {
    color: "#8ea6ba",
    weight: 1,
    fillColor: "#19364a",
    fillOpacity: 0.65
};


// STYLE AU SURVOL
function highlightCountry(e) {
    const layer = e.target;

    layer.setStyle({
        weight: 2,
        color: "#ffffff",
        fillColor: "#315d78",
        fillOpacity: 0.85
    });

    layer.bringToFront();
}


// RETOUR AU STYLE NORMAL
function resetCountry(e) {
    countriesLayer.resetStyle(e.target);
}


// CLIC SUR UN PAYS
function selectCountry(e) {
    const country = e.target;
    const properties = country.feature.properties;

    const name =
        properties.name ||
        "Pays non identifié";

    document.getElementById("countryContent").innerHTML = `
        <h2 class="country-title">${name}</h2>

        <p class="country-meta">
            Informations géographiques
        </p>

        <div class="data-card">
            <div class="data-label">Pays</div>
            <div class="data-value">${name}</div>
        </div>

        <div class="data-card">
            <div class="data-label">Statut</div>
            <div class="data-value">État / territoire</div>
        </div>
    `;

    document.getElementById("countryPanel").classList.add("open");
}


// CRÉATION DE LA COUCHE DES PAYS
let countriesLayer;

fetch("https://raw.githubusercontent.com/datasets/geo-countries/main/data/countries.geojson")
    .then(response => {
        if (!response.ok) {
            throw new Error("Impossible de charger les frontières.");
        }

        return response.json();
    })
    .then(data => {

        countriesLayer = L.geoJSON(data, {

            style: countryStyle,

            onEachFeature: function(feature, layer) {

                layer.on({
                    mouseover: highlightCountry,
                    mouseout: resetCountry,
                    click: selectCountry
                });

            }

        }).addTo(map);

        document.getElementById("updateStatus").textContent =
            "Carte connectée";

    })
    .catch(error => {

        console.error(error);

        document.getElementById("updateStatus").textContent =
            "Données indisponibles";

    });


// FERMER LE PANNEAU
document.getElementById("closePanel").addEventListener("click", function() {

    document.getElementById("countryPanel").classList.remove("open");

});

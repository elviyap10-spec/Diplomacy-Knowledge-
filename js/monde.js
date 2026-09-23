

   // ========================================
// DIPLOMACY LAB — WORLD MAP
// VERSION STABLE
// ========================================


// ========================================
// 1. CRÉATION DE LA CARTE
// ========================================

const map = L.map("map").setView([20, 0], 2);


// Fond de carte
L.tileLayer(
    "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
        attribution: "&copy; OpenStreetMap contributors"
    }
).addTo(map);


// ========================================
// 2. STYLE DES PAYS
// ========================================

const countryStyle = {
    color: "#8ea6ba",
    weight: 1,
    fillColor: "#19364a",
    fillOpacity: 0.65
};


// ========================================
// 3. VARIABLES
// ========================================

let countriesLayer = null;


// ========================================
// 4. SURVOL D'UN PAYS
// ========================================

function highlightCountry(event) {

    const layer = event.target;

    layer.setStyle({
        weight: 2,
        color: "#ffffff",
        fillColor: "#315d78",
        fillOpacity: 0.85
    });

    layer.bringToFront();
}


// ========================================
// 5. RETOUR AU STYLE NORMAL
// ========================================

function resetCountry(event) {

    countriesLayer.resetStyle(event.target);

}


// ========================================
// 6. CLIC SUR UN PAYS
// ========================================

function selectCountry(event) {

    const layer = event.target;

    const properties =
        layer.feature.properties;

    const name =
        properties.name ||
        "Pays non identifié";

    const iso3 =
        properties["ISO3166-1-Alpha-3"];


    console.log(
        "Pays sélectionné :",
        name,
        "ISO :",
        iso3
    );


    // Ouvrir le panneau

    document
        .getElementById("countryPanel")
        .classList.add("open");


    // Afficher les informations

    document
        .getElementById("countryContent")
        .innerHTML = `

            <h2 class="country-title">
                ${name}
            </h2>

            <p class="country-meta">
                Dossier pays
            </p>

            <div class="data-card">

                <div class="data-label">
                    Code ISO
                </div>

                <div class="data-value">
                    ${iso3 || "Non disponible"}
                </div>

            </div>

            <div class="data-card">

                <div class="data-label">
                    Statut
                </div>

                <div class="data-value">
                    État / territoire
                </div>

            </div>

            <div class="data-card">

                <div class="data-label">
                    Données
                </div>

                <div class="data-value">
                    Module en construction
                </div>

            </div>

        `;

}


// ========================================
// 7. CHARGEMENT DES PAYS
// ========================================

fetch(
    "https://raw.githubusercontent.com/datasets/geo-countries/main/data/countries.geojson"
)

.then(response => {

    if (!response.ok) {

        throw new Error(
            "Impossible de charger la carte."
        );

    }

    return response.json();

})

.then(data => {

    console.log(
        "Carte chargée :",
        data.features.length,
        "pays/territoires"
    );


    countriesLayer =
        L.geoJSON(
            data,
            {

                style: countryStyle,

                onEachFeature:
                    function(feature, layer) {

                        layer.on({

                            mouseover:
                                highlightCountry,

                            mouseout:
                                resetCountry,

                            click:
                                selectCountry

                        });

                    }

            }
        ).addTo(map);


    document
        .getElementById("updateStatus")
        .textContent =
        "Carte connectée";

})

.catch(error => {

    console.error(
        "Erreur carte :",
        error
    );


    document
        .getElementById("updateStatus")
        .textContent =
        "Erreur de chargement";

});


// ========================================
// 8. FERMER LE PANNEAU
// ========================================

const closeButton =
    document.getElementById("closePanel");


if (closeButton) {

    closeButton.addEventListener(
        "click",
        function() {

            document
                .getElementById("countryPanel")
                .classList.remove("open");

        }
    );

}

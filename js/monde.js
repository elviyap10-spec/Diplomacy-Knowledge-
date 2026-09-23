const map = L.map("map").setView([20, 0], 2);

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors"
}).addTo(map);


// ==============================
// STYLE DES PAYS
// ==============================

const countryStyle = {
    color: "#8ea6ba",
    weight: 1,
    fillColor: "#19364a",
    fillOpacity: 0.65
};


// ==============================
// VARIABLES
// ==============================

let countriesLayer;
let selectedCountry = null;
let activeLayer = "political";


// ==============================
// SURVOL
// ==============================

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


// ==============================
// RETOUR AU STYLE NORMAL
// ==============================

function resetCountry(e) {

    countriesLayer.resetStyle(e.target);

}


// ==============================
// FICHE DU PAYS
// ==============================

function selectCountry(e) {

    const country = e.target;
    const properties = country.feature.properties;

    const name =
        properties.name ||
        "Pays non identifié";

    selectedCountry = {
        name: name
    };

    document.getElementById("countryPanel").classList.add("open");

    renderCountry();

}


// ==============================
// CONTENU DE LA FICHE
// ==============================

function renderCountry() {

    if (!selectedCountry) {
        return;
    }

    const name = selectedCountry.name;

    let content = "";


    // ==========================
    // POLITIQUE & DIPLOMATIE
    // ==========================

    if (activeLayer === "political") {

        content = `
            <h2 class="country-title">
                ${name}
            </h2>

            <p class="country-meta">
                Informations politiques et diplomatiques
            </p>


            <div class="data-card">
                <div class="data-label">
                    Pays
                </div>

                <div class="data-value">
                    ${name}
                </div>
            </div>


            <div class="data-card">
                <div class="data-label">
                    Statut
                </div>

                <div class="data-value">
                    État souverain
                </div>
            </div>


            <div class="data-card">
                <div class="data-label">
                    Capitale
                </div>

                <div class="data-value">
                    Donnée à compléter
                </div>
            </div>


            <div class="data-card">
                <div class="data-label">
                    Régime politique
                </div>

                <div class="data-value">
                    Donnée à compléter
                </div>
            </div>


            <div class="data-card">
                <div class="data-label">
                    Chef de l'État
                </div>

                <div class="data-value">
                    Donnée à compléter
                </div>
            </div>


            <div class="data-card">
                <div class="data-label">
                    Chef du gouvernement
                </div>

                <div class="data-value">
                    Donnée à compléter
                </div>
            </div>


            <div class="data-card">
                <div class="data-label">
                    Organisations internationales
                </div>

                <div class="data-value">
                    Données à compléter
                </div>
            </div>


            <div class="data-card">
                <div class="data-label">
                    Relations diplomatiques
                </div>

                <div class="data-value">
                    Données à compléter
                </div>
            </div>


            <div class="data-card">
                <div class="data-label">
                    Représentations diplomatiques
                </div>

                <div class="data-value">
                    Données à compléter
                </div>
            </div>


            <div class="data-card">
                <div class="data-label">
                    Source
                </div>

                <div class="data-value">
                    Diplomacy Lab
                </div>
            </div>
        `;

    }


    // ==========================
    // ÉCONOMIE
    // ==========================

    if (activeLayer === "economy") {

        content = `
            <h2 class="country-title">
                ${name}
            </h2>

            <p class="country-meta">
                Données économiques
            </p>

            <div class="data-card">
                <div class="data-label">
                    Économie
                </div>

                <div class="data-value">
                    Module en préparation
                </div>
            </div>
        `;

    }


    // ==========================
    // POPULATION
    // ==========================

    if (activeLayer === "population") {

        content = `
            <h2 class="country-title">
                ${name}
            </h2>

            <p class="country-meta">
                Données démographiques
            </p>

            <div class="data-card">
                <div class="data-label">
                    Population
                </div>

                <div class="data-value">
                    Module en préparation
                </div>
            </div>
        `;

    }


    document.getElementById("countryContent").innerHTML = content;

}


// ==============================
// BOUTONS POLITIQUE / ÉCONOMIE / POPULATION
// ==============================

document.querySelectorAll(".layer").forEach(button => {

    button.addEventListener("click", function() {

        document.querySelectorAll(".layer").forEach(btn => {
            btn.classList.remove("active");
        });

        this.classList.add("active");

        activeLayer = this.dataset.layer;

        renderCountry();

    });

});


// ==============================
// CHARGEMENT DES PAYS
// ==============================

fetch(
    "https://raw.githubusercontent.com/datasets/geo-countries/main/data/countries.geojson"
)

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


// ==============================
// FERMER LE PANNEAU
// ==============================

document.getElementById("closePanel").addEventListener("click", function() {

    document.getElementById("countryPanel").classList.remove("open");

});

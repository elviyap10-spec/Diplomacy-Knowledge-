// ============================================
// DIPLOMACY LAB — WORLD
// ============================================


// -----------------------------
// CARTE
// -----------------------------

const map = L.map("map", {
    minZoom: 2,
    maxZoom: 6,
    zoomControl: true
}).setView([20, 0], 2);


// Fond cartographique discret
L.tileLayer(
    "https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png",
    {
        attribution: '&copy; OpenStreetMap &copy; CARTO',
        subdomains: "abcd",
        maxZoom: 20
    }
).addTo(map);


// -----------------------------
// DONNÉES
// -----------------------------

let countriesLayer;

let countries = {};


// -----------------------------
// STYLE DES PAYS
// -----------------------------

function countryStyle(feature) {

    return {
        fillColor: "#24465b",

        weight: 0.8,

        color: "#6d8a9b",

        fillOpacity: 0.72
    };
}


// -----------------------------
// SURVOL
// -----------------------------

function highlightCountry(e) {

    const layer = e.target;

    layer.setStyle({
        weight: 1.5,

        color: "#d9edf7",

        fillColor: "#3d718c",

        fillOpacity: 0.9
    });

    layer.bringToFront();
}


function resetHighlight(e) {

    countriesLayer.resetStyle(e.target);
}


// -----------------------------
// CLIC
// -----------------------------

async function selectCountry(e) {

    const feature = e.target.feature;

    const props = feature.properties;

    const iso =
        props.ISO_A3 ||
        props.iso_a3 ||
        props.ADM0_A3;

    openCountryPanel(
        props.NAME ||
        props.name ||
        "Pays"
    );

    if (iso) {

        await loadCountryData(iso);
    }
}


// -----------------------------
// INTERACTIONS
// -----------------------------

function onEachCountry(feature, layer) {

    const name =
        feature.properties.NAME ||
        feature.properties.name ||
        "Pays";

    layer.bindTooltip(name, {
        sticky: true,

        direction: "top",

        className: "country-tooltip"
    });

    layer.on({
        mouseover: highlightCountry,

        mouseout: resetHighlight,

        click: selectCountry
    });
}


// -----------------------------
// CHARGEMENT GEOJSON
// -----------------------------

async function loadMap() {

    try {

        /*
         * GeoJSON Natural Earth
         * Source publique utilisée uniquement
         * pour les frontières.
         */

        const response = await fetch(
            "https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson"
        );

        const data = await response.json();


        countriesLayer = L.geoJSON(
            data,
            {
                style: countryStyle,

                onEachFeature: onEachCountry
            }
        ).addTo(map);


        document.getElementById("updateStatus").textContent =
            "Carte disponible";

    }

    catch (error) {

        console.error(error);

        document.getElementById("updateStatus").textContent =
            "Erreur de chargement";
    }
}


// -----------------------------
// PANNEAU PAYS
// -----------------------------

function openCountryPanel(countryName) {

    const panel =
        document.getElementById("countryPanel");

    const content =
        document.getElementById("countryContent");


    content.innerHTML = `

        <div class="country-title">
            ${countryName}
        </div>

        <div class="country-meta">
            Chargement des données...
        </div>

        <div class="data-card">

            <div class="data-label">
                Population
            </div>

            <div
                class="data-value"
                id="population">
                Chargement...
            </div>

        </div>

        <div class="data-card">

            <div class="data-label">
                Capitale
            </div>

            <div
                class="data-value"
                id="capital">
                Chargement...
            </div>

        </div>

        <div class="data-card">

            <div class="data-label">
                Région
            </div>

            <div
                class="data-value"
                id="region">
                Chargement...
            </div>

        </div>

        <div class="data-card">

            <div class="data-label">
                Source
            </div>

            <div class="data-value">
                Banque mondiale
            </div>

        </div>

        <div class="data-card">

            <div class="data-label">
                Dernière récupération
            </div>

            <div
                class="data-value"
                id="lastUpdate">
                —
            </div>

        </div>
    `;


    panel.classList.add("open");
}


// -----------------------------
// FERMETURE
// -----------------------------

document
    .getElementById("closePanel")
    .addEventListener("click", () => {

        document
            .getElementById("countryPanel")
            .classList.remove("open");

    });


// -----------------------------
// BANQUE MONDIALE
// -----------------------------

async function loadCountryData(iso) {

    try {

        const countryResponse =
            await fetch(
                `https://api.worldbank.org/v2/country/${iso}?format=json`
            );

        const countryJson =
            await countryResponse.json();


        if (
            !countryJson ||
            !countryJson[1] ||
            !countryJson[1][0]
        ) {
            return;
        }


        const country =
            countryJson[1][0];


        document.getElementById("capital").textContent =
            country.capitalCity || "Non disponible";


        document.getElementById("region").textContent =
            country.region?.value || "Non disponible";


        // Population
        const populationResponse =
            await fetch(
                `https://api.worldbank.org/v2/country/${iso}/indicator/SP.POP.TOTL?format=json&mrnev=1`
            );

        const populationJson =
            await populationResponse.json();


        if (
            populationJson &&
            populationJson[1] &&
            populationJson[1][0]
        ) {

            const population =
                populationJson[1][0];


            if (population.value) {

                document.getElementById(
                    "population"
                ).textContent =
                    Number(
                        population.value
                    ).toLocaleString("fr-FR");

            } else {

                document.getElementById(
                    "population"
                ).textContent =
                    "Non disponible";
            }

        }


        document.getElementById(
            "lastUpdate"
        ).textContent =
            new Date().toLocaleDateString(
                "fr-FR"
            );

    }

    catch (error) {

        console.error(
            "Erreur données pays:",
            error
        );

    }
}


// -----------------------------
// RECHERCHE
// -----------------------------

document
    .getElementById("countrySearch")
    .addEventListener("input", function () {

        const query =
            this.value.toLowerCase().trim();

        if (!countriesLayer || !query) {
            return;
        }


        countriesLayer.eachLayer(layer => {

            const name =
                (
                    layer.feature.properties.NAME ||
                    layer.feature.properties.name ||
                    ""
                ).toLowerCase();


            if (name.includes(query)) {

                map.fitBounds(
                    layer.getBounds(),
                    {
                        maxZoom: 5
                    }
                );

                layer.fire("click");

            }

        });

    });


// -----------------------------
// COUCHES
// -----------------------------

document
    .querySelectorAll(".layer")
    .forEach(button => {

        button.addEventListener(
            "click",
            function () {

                document
                    .querySelectorAll(".layer")
                    .forEach(btn =>
                        btn.classList.remove(
                            "active"
                        )
                    );

                this.classList.add("active");

                const layer =
                    this.dataset.layer;

                console.log(
                    "Couche sélectionnée:",
                    layer
                );

            }
        );

    });


// -----------------------------
// LANCEMENT
// -----------------------------

loadMap();

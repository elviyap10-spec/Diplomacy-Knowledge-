
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
// RÉCUPÉRER LES DONNÉES WORLD BANK
// ==============================

async function getWorldBankData(iso3) {

    try {

        if (!iso3 || iso3 === "-99") {
            throw new Error("Code ISO indisponible.");
        }


        // INFORMATIONS GÉNÉRALES

        const countryResponse = await fetch(
            `https://api.worldbank.org/v2/country/${iso3}?format=json`
        );

        if (!countryResponse.ok) {
            throw new Error("Erreur lors du chargement du pays.");
        }

        const countryData = await countryResponse.json();

        if (!countryData[1] || !countryData[1][0]) {
            throw new Error("Pays introuvable.");
        }

        const country = countryData[1][0];


        // INDICATEURS

        const indicatorsResponse = await fetch(
            `https://api.worldbank.org/v2/country/${iso3}/indicator/SP.POP.TOTL;NY.GDP.MKTP.CD;NY.GDP.PCAP.CD;NY.GDP.MKTP.KD.ZG;FP.CPI.TOTL.ZG?format=json&mrnev=1&per_page=100`
        );

        if (!indicatorsResponse.ok) {
            throw new Error("Erreur lors du chargement des indicateurs.");
        }

        const indicatorsData =
            await indicatorsResponse.json();


        const indicators = {};


        if (indicatorsData[1]) {

            indicatorsData[1].forEach(item => {

                if (
                    item.value !== null &&
                    !indicators[item.indicator.id]
                ) {

                    indicators[item.indicator.id] = {

                        value: item.value,

                        year: item.date

                    };

                }

            });

        }


        return {

            name: country.name,

            capital:
                country.capitalCity ||
                "Non disponible",

            region:
                country.region?.value ||
                "Non disponible",

            incomeLevel:
                country.incomeLevel?.value ||
                "Non disponible",

            population:
                indicators["SP.POP.TOTL"] ||
                null,

            gdp:
                indicators["NY.GDP.MKTP.CD"] ||
                null,

            gdpPerCapita:
                indicators["NY.GDP.PCAP.CD"] ||
                null,

            growth:
                indicators["NY.GDP.MKTP.KD.ZG"] ||
                null,

            inflation:
                indicators["FP.CPI.TOTL.ZG"] ||
                null

        };

    }

    catch (error) {

        console.error(
            "Erreur World Bank :",
            error
        );

        return null;

    }

}


// ==============================
// FORMATAGE
// ==============================

function formatNumber(value) {

    if (
        value === null ||
        value === undefined
    ) {

        return "Donnée indisponible";

    }

    return Number(value).toLocaleString(
        "fr-FR"
    );

}


function formatCurrency(value) {

    if (
        value === null ||
        value === undefined
    ) {

        return "Donnée indisponible";

    }

    return Number(value).toLocaleString(
        "fr-FR",
        {
            maximumFractionDigits: 0
        }
    ) + " $";

}


function formatPercent(value) {

    if (
        value === null ||
        value === undefined
    ) {

        return "Donnée indisponible";

    }

    return Number(value).toLocaleString(
        "fr-FR",
        {
            maximumFractionDigits: 2
        }
    ) + " %";

}


// ==============================
// CLIQUER SUR UN PAYS
// ==============================

async function selectCountry(e) {

    const country = e.target;

    const properties =
        country.feature.properties;


    const name =
        properties.name ||
        "Pays non identifié";


    const iso3 =
        properties.ISO_A3 ||
        properties.iso_a3 ||
        properties.ISO3;


    selectedCountry = {

        name: name,

        iso3: iso3,

        data: null

    };


    document
        .getElementById("countryPanel")
        .classList.add("open");


    document
        .getElementById("countryContent")
        .innerHTML = `

            <h2 class="country-title">
                ${name}
            </h2>

            <p class="country-meta">
                Chargement des données...
            </p>

        `;


    const data =
        await getWorldBankData(iso3);


    if (!data) {

        document
            .getElementById("countryContent")
            .innerHTML = `

                <h2 class="country-title">
                    ${name}
                </h2>

                <p class="country-meta">
                    Données indisponibles
                </p>

                <div class="data-card">

                    <div class="data-label">
                        Source
                    </div>

                    <div class="data-value">
                        Banque mondiale
                    </div>

                </div>

            `;

        return;

    }


    selectedCountry.data = data;

    renderCountry();

}


// ==============================
// AFFICHER LES DONNÉES
// ==============================

function renderCountry() {

    if (
        !selectedCountry ||
        !selectedCountry.data
    ) {

        return;

    }


    const data =
        selectedCountry.data;


    const name =
        data.name;


    let content = "";


    // ==========================
    // POLITIQUE
    // ==========================

    if (activeLayer === "political") {

        content = `

            <h2 class="country-title">
                ${name}
            </h2>

            <p class="country-meta">
                Informations politiques et géographiques
            </p>


            <div class="data-card">

                <div class="data-label">
                    Capitale
                </div>

                <div class="data-value">
                    ${data.capital}
                </div>

            </div>


            <div class="data-card">

                <div class="data-label">
                    Région
                </div>

                <div class="data-value">
                    ${data.region}
                </div>

            </div>


            <div class="data-card">

                <div class="data-label">
                    Niveau de revenu
                </div>

                <div class="data-value">
                    ${data.incomeLevel}
                </div>

            </div>


            <div class="data-card">

                <div class="data-label">
                    Régime politique
                </div>

                <div class="data-value">
                    À documenter
                </div>

            </div>


            <div class="data-card">

                <div class="data-label">
                    Chef de l'État
                </div>

                <div class="data-value">
                    À documenter
                </div>

            </div>


            <div class="data-card">

                <div class="data-label">
                    Chef du gouvernement
                </div>

                <div class="data-value">
                    À documenter
                </div>

            </div>


            <div class="data-card">

                <div class="data-label">
                    Organisations internationales
                </div>

                <div class="data-value">
                    À documenter
                </div>

            </div>


            <div class="data-card">

                <div class="data-label">
                    Relations diplomatiques
                </div>

                <div class="data-value">
                    À documenter
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
                    PIB
                </div>

                <div class="data-value">
                    ${formatCurrency(
                        data.gdp?.value
                    )}
                </div>

                <small>
                    Année :
                    ${data.gdp?.year || "N/A"}
                </small>

            </div>


            <div class="data-card">

                <div class="data-label">
                    PIB par habitant
                </div>

                <div class="data-value">
                    ${formatCurrency(
                        data.gdpPerCapita?.value
                    )}
                </div>

                <small>
                    Année :
                    ${data.gdpPerCapita?.year || "N/A"}
                </small>

            </div>


            <div class="data-card">

                <div class="data-label">
                    Croissance du PIB
                </div>

                <div class="data-value">
                    ${formatPercent(
                        data.growth?.value
                    )}
                </div>

                <small>
                    Année :
                    ${data.growth?.year || "N/A"}
                </small>

            </div>


            <div class="data-card">

                <div class="data-label">
                    Inflation
                </div>

                <div class="data-value">
                    ${formatPercent(
                        data.inflation?.value
                    )}
                </div>

                <small>
                    Année :
                    ${data.inflation?.year || "N/A"}
                </small>

            </div>


            <div class="data-card">

                <div class="data-label">
                    Source
                </div>

                <div class="data-value">
                    Banque mondiale
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
                    ${formatNumber(
                        data.population?.value
                    )}
                </div>

                <small>
                    Année :
                    ${data.population?.year || "N/A"}
                </small>

            </div>


            <div class="data-card">

                <div class="data-label">
                    Capitale
                </div>

                <div class="data-value">
                    ${data.capital}
                </div>

            </div>


            <div class="data-card">

                <div class="data-label">
                    Région
                </div>

                <div class="data-value">
                    ${data.region}
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

        `;

    }


    document
        .getElementById("countryContent")
        .innerHTML = content;

}


// ==============================
// BOUTONS
// ==============================

document
    .querySelectorAll(".layer")
    .forEach(button => {

        button.addEventListener(
            "click",
            function() {

                document
                    .querySelectorAll(".layer")
                    .forEach(btn => {

                        btn.classList.remove(
                            "active"
                        );

                    });


                this.classList.add(
                    "active"
                );


                activeLayer =
                    this.dataset.layer;


                renderCountry();

            }
        );

    });


// ==============================
// CHARGEMENT DE LA CARTE
// ==============================

fetch(
    "https://raw.githubusercontent.com/datasets/geo-countries/main/data/countries.geojson"
)

.then(response => {

    if (!response.ok) {

        throw new Error(
            "Impossible de charger les frontières."
        );

    }

    return response.json();

})

.then(data => {

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
        "Données connectées";

})

.catch(error => {

    console.error(error);

    document
        .getElementById("updateStatus")
        .textContent =
        "Données indisponibles";

});


// ==============================
// FERMER LE PANNEAU
// ==============================

document
    .getElementById("closePanel")
    .addEventListener(
        "click",
        function() {

            document
                .getElementById("countryPanel")
                .classList.remove(
                    "open"
                );

        }
    );

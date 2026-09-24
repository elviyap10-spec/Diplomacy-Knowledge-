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

    // Certains pays ont un code ISO cassé ("-99") dans le
    // jeu de données géographiques utilisé pour la carte.
    // On corrige les cas connus ici.
    const ISO_FIXES = {
        "France": "FRA",
        "Norway": "NOR",
        "Kosovo": "XKX",
        "Somaliland": "SOM",
        "N. Cyprus": "CYP"
    };

    let iso3 =
        properties["ISO3166-1-Alpha-3"];

    if (!iso3 || iso3 === "-99") {
        iso3 = ISO_FIXES[name] || iso3;
    }


    console.log(
        "Pays sélectionné :",
        name,
        "ISO :",
        iso3
    );


    // ========================================
    // RÉCUPÉRER LES DONNÉES POLITIQUES
    // ========================================

    const countryData =
        politicalData[iso3];


    // ========================================
    // OUVRIR LE PANNEAU
    // ========================================

    document
        .getElementById("countryPanel")
        .classList.add("open");


    // ========================================
    // SI LES DONNÉES EXISTENT
    // ========================================

    if (countryData) {

        document
            .getElementById("countryContent")
            .innerHTML = `

                <h2 class="country-title">
                    ${name}
                </h2>

                <p class="country-meta">
                    POLITIQUE
                </p>


                <!-- IDENTITÉ POLITIQUE -->

                <div class="data-section">

                    <h3 class="section-label">
                        Identité politique
                    </h3>

                    <div class="data-card">

                        <div class="data-label">
                            Nom officiel
                        </div>

                        <div class="data-value">
                            ${countryData.identity.officialName}
                        </div>

                    </div>


                    <div class="data-card">

                        <div class="data-label">
                            Capitale politique
                        </div>

                        <div class="data-value">
                            ${countryData.identity.capital}
                        </div>

                    </div>


                    <div class="data-card">

                        <div class="data-label">
                            Capitale économique
                        </div>

                        <div class="data-value">
                            ${countryData.identity.economicCapital || "—"}
                        </div>

                    </div>


                    <div class="data-card">

                        <div class="data-label">
                            Indépendance
                        </div>

                        <div class="data-value">
                            ${countryData.identity.independence || "—"}
                        </div>

                    </div>

                </div>


                <!-- SYSTÈME POLITIQUE -->

                <div class="data-section">

                    <h3 class="section-label">
                        Système politique
                    </h3>

                    <div class="data-card">

                        <div class="data-label">
                            Forme de l'État
                        </div>

                        <div class="data-value">
                            ${countryData.system.stateForm}
                        </div>

                    </div>


                    <div class="data-card">

                        <div class="data-label">
                            Régime politique
                        </div>

                        <div class="data-value">
                            ${countryData.system.regime}
                        </div>

                    </div>


                    <div class="data-card">

                        <div class="data-label">
                            Organisation territoriale
                        </div>

                        <div class="data-value">
                            ${countryData.system.territorialOrganization}
                        </div>

                    </div>


                    <div class="data-card">

                        <div class="data-label">
                            Constitution
                        </div>

                        <div class="data-value">
                            ${countryData.system.constitution}
                        </div>

                    </div>

                </div>


                <!-- POUVOIR EXÉCUTIF -->

                <div class="data-section">

                    <h3 class="section-label">
                        Pouvoir exécutif
                    </h3>

                    <div class="data-card">

                        <div class="data-label">
                            Chef de l'État
                        </div>

                        <div class="data-value">
                            ${countryData.executive.headOfState}
                        </div>

                    </div>


                    <div class="data-card">

                        <div class="data-label">
                            Chef du gouvernement
                        </div>

                        <div class="data-value">
                            ${countryData.executive.headOfGovernment}
                        </div>

                    </div>


                    <div class="data-card">

                        <div class="data-label">
                            Mode d'élection
                        </div>

                        <div class="data-value">
                            ${countryData.executive.election}
                        </div>

                    </div>


                    <div class="data-card">

                        <div class="data-label">
                            Durée du mandat
                        </div>

                        <div class="data-value">
                            ${countryData.executive.mandate}
                        </div>

                    </div>

                </div>


                <!-- POUVOIR LÉGISLATIF -->

                <div class="data-section">

                    <h3 class="section-label">
                        Pouvoir législatif
                    </h3>

                    <div class="data-card">

                        <div class="data-label">
                            Parlement
                        </div>

                        <div class="data-value">
                            ${countryData.legislative.parliament}
                        </div>

                    </div>


                    <div class="data-card">

                        <div class="data-label">
                            Structure
                        </div>

                        <div class="data-value">
                            ${countryData.legislative.structure}
                        </div>

                    </div>


                    <div class="data-card">

                        <div class="data-label">
                            Chambre basse
                        </div>

                        <div class="data-value">
                            ${countryData.legislative.lowerHouse}
                        </div>

                    </div>


                    <div class="data-card">

                        <div class="data-label">
                            Chambre haute
                        </div>

                        <div class="data-value">
                            ${countryData.legislative.upperHouse}
                        </div>

                    </div>

                </div>


                <!-- SYSTÈME ÉLECTORAL -->

                <div class="data-section">

                    <h3 class="section-label">
                        Système électoral
                    </h3>

                    <div class="data-card">

                        <div class="data-label">
                            Âge du vote
                        </div>

                        <div class="data-value">
                            ${countryData.electoral.votingAge}
                        </div>

                    </div>


                    <div class="data-card">

                        <div class="data-label">
                            Élection présidentielle
                        </div>

                        <div class="data-value">
                            ${countryData.electoral.presidentialSystem}
                        </div>

                    </div>


                    <div class="data-card">

                        <div class="data-label">
                            Élections législatives
                        </div>

                        <div class="data-value">
                            ${countryData.electoral.legislativeSystem}
                        </div>

                    </div>

                </div>


                <!-- POUVOIR JUDICIAIRE -->

                <div class="data-section">

                    <h3 class="section-label">
                        Pouvoir judiciaire
                    </h3>

                    <div class="data-card">

                        <div class="data-label">
                            Institution constitutionnelle
                        </div>

                        <div class="data-value">
                            ${countryData.judiciary.constitutionalInstitution}
                        </div>

                    </div>


                    <div class="data-card">

                        <div class="data-label">
                            Juridiction suprême
                        </div>

                        <div class="data-value">
                            ${countryData.judiciary.highestJudicialInstitution}
                        </div>

                    </div>

                </div>


                <!-- ORGANISATION TERRITORIALE -->

                <div class="data-section">

                    <h3 class="section-label">
                        Organisation territoriale
                    </h3>

                    <div class="data-card">

                        <div class="data-label">
                            Type d'État
                        </div>

                        <div class="data-value">
                            ${countryData.territory.type}
                        </div>

                    </div>


                    <div class="data-card">

                        <div class="data-label">
                            Organisation
                        </div>

                        <div class="data-value">
                            ${countryData.territory.organization}
                        </div>

                    </div>

                </div>


                <!-- POLITIQUE ÉTRANGÈRE -->

                <div class="data-section">

                    <h3 class="section-label">
                        Politique étrangère
                    </h3>

                    <div class="data-card">

                        <div class="data-label">
                            Organisations régionales
                        </div>

                        <div class="data-value">
                            ${countryData.foreignPolicy.regionalOrganizations.join(", ")}
                        </div>

                    </div>


                    <div class="data-card">

                        <div class="data-label">
                            Organisations internationales
                        </div>

                        <div class="data-value">
                            ${countryData.foreignPolicy.internationalOrganizations.join(", ")}
                        </div>

                    </div>

                </div>

            `;

    }


    // ========================================
    // SI AUCUNE DONNÉE POLITIQUE
    // ========================================

    else {

        document
            .getElementById("countryContent")
            .innerHTML = `

                <h2 class="country-title">
                    ${name}
                </h2>

                <p class="country-meta">
                    POLITIQUE
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
                        Données politiques
                    </div>

                    <div class="data-value">
                        Données en cours d'intégration.
                    </div>

                </div>

            `;

    }

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


// ========================================
// 9. RECHERCHE DE PAYS
// ========================================

const searchInput =
    document.getElementById("countrySearch");

const searchResults =
    document.getElementById("searchResults");


if (searchInput && searchResults) {

    searchInput.addEventListener(
        "input",
        function() {

            const search =
                searchInput.value
                    .trim()
                    .toLowerCase();


            searchResults.innerHTML = "";


            if (!search || !countriesLayer) {

                searchResults.style.display = "none";

                return;

            }


            const matches = [];


            countriesLayer.eachLayer(
                function(layer) {

                    const properties =
                        layer.feature.properties;

                    const name =
                        properties.name || "";


                    if (
                        name
                            .toLowerCase()
                            .includes(search)
                    ) {

                        matches.push({
                            name: name,
                            layer: layer
                        });

                    }

                }
            );


            if (matches.length === 0) {

                searchResults.innerHTML = `
                    <div class="search-no-result">
                        Aucun pays trouvé
                    </div>
                `;

                searchResults.style.display = "block";

                return;

            }


            matches
                .slice(0, 8)
                .forEach(function(match) {

                    const result =
                        document.createElement("div");


                    result.className =
                        "search-result";


                    result.textContent =
                        match.name;


                    result.addEventListener(
                        "click",
                        function() {

                            const layer =
                                match.layer;


                            map.fitBounds(
                                layer.getBounds(),
                                {
                                    padding: [50, 50],
                                    maxZoom: 5
                                }
                            );


                            selectCountry({
                                target: layer
                            });


                            searchInput.value =
                                match.name;


                            searchResults.innerHTML = "";

                            searchResults.style.display =
                                "none";

                        }
                    );


                    searchResults.appendChild(result);

                });


            searchResults.style.display = "block";

        }
    );

}

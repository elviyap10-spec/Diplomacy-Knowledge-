```javascript
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
```


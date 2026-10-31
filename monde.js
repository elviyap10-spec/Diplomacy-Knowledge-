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
// 3. VARIABLES & DICTIONNAIRES
// ========================================

let countriesLayer = null;
let selectedLayer = null;

// Corrections des codes ISO cassés (-99) dans le GeoJSON
const ISO_FIXES = {
    "France": "FRA",
    "Norway": "NOR",
    "Kosovo": "XKX",
    "Somaliland": "SOM",
    "N. Cyprus": "CYP",
    "Antarctica": "ATA"
};

// Dictionnaire des noms courants en français
const COUNTRY_NAMES_FR = {
    "AFG": "Afghanistan", "ALB": "Albanie", "DZA": "Algérie", "AND": "Andorre", "AGO": "Angola",
    "ATG": "Antigua-et-Barbuda", "ARG": "Argentine", "ARM": "Arménie", "AUS": "Australie", "AUT": "Autriche",
    "AZE": "Azerbaïdjan", "BHS": "Bahamas", "BHR": "Bahreïn", "BGD": "Bangladesh", "BRB": "Barbade",
    "BLR": "Biélorussie", "BEL": "Belgique", "BLZ": "Belize", "BEN": "Bénin", "BTN": "Bhoutan",
    "BOL": "Bolivie", "BIH": "Bosnie-Herzégovine", "BWA": "Botswana", "BRA": "Brésil", "BRN": "Brunei",
    "BGR": "Bulgarie", "BFA": "Burkina Faso", "BDI": "Burundi", "CPV": "Cap-Vert", "KHM": "Cambodge",
    "CMR": "Cameroun", "CAN": "Canada", "CAF": "Centrafrique", "TCD": "Tchad", "CHL": "Chili",
    "CHN": "Chine", "COL": "Colombie", "COM": "Comores", "COG": "Congo (Brazzaville)", "COD": "RD Congo",
    "CRI": "Costa Rica", "CIV": "Côte d'Ivoire", "HRV": "Croatie", "CUB": "Cuba", "CYP": "Chypre",
    "CZE": "Tchéquie", "DNK": "Danemark", "DJI": "Djibouti", "DMA": "Dominique", "DOM": "République dominicaine",
    "ECU": "Équateur", "EGY": "Égypte", "SLV": "Salvador", "GNQ": "Guinée équatoriale", "ERI": "Érythrée",
    "EST": "Estonie", "SWZ": "Eswatini", "ETH": "Éthiopie", "FJI": "Fidji", "FIN": "Finlande",
    "FRA": "France", "GAB": "Gabon", "GMB": "Gambie", "GEO": "Géorgie", "DEU": "Allemagne",
    "GHA": "Ghana", "GRC": "Grèce", "GRD": "Grenade", "GTM": "Guatemala", "GIN": "Guinée",
    "GNB": "Guinée-Bissau", "GUY": "Guyana", "GRL": "Groenland", "HTI": "Haïti", "HND": "Honduras", "HUN": "Hongrie",
    "ISL": "Islande", "IND": "Inde", "IDN": "Indonésie", "IRN": "Iran", "IRQ": "Irak",
    "IRL": "Irlande", "ISR": "Israël", "ITA": "Italie", "JAM": "Jamaïque", "JPN": "Japon",
    "JOR": "Jordanie", "KAZ": "Kazakhstan", "KEN": "Kenya", "KIR": "Kiribati", "PRK": "Corée du Nord",
    "KOR": "Corée du Sud", "KWT": "Koweït", "KGZ": "Kirghizistan", "LAO": "Laos", "LVA": "Lettonie",
    "LBN": "Liban", "LSO": "Lesotho", "LBR": "Libéria", "LBY": "Libye", "LIE": "Liechtenstein",
    "LTU": "Lituanie", "LUX": "Luxembourg", "MDG": "Madagascar", "MWI": "Malawi", "MYS": "Malaisie",
    "MDV": "Maldives", "MLI": "Mali", "MLT": "Malte", "MHL": "Îles Marshall", "MRT": "Mauritanie",
    "MUS": "Maurice", "MEX": "Mexique", "FSM": "Micronésie", "MDA": "Moldavie", "MCO": "Monaco",
    "MNG": "Mongolie", "MNE": "Monténégro", "MAR": "Maroc", "MOZ": "Mozambique", "MMR": "Birmanie (Myanmar)",
    "NAM": "Namibie", "NRU": "Nauru", "NPL": "Népal", "NLD": "Pays-Bas", "NZL": "Nouvelle-Zélande",
    "NIC": "Nicaragua", "NER": "Niger", "NGA": "Nigéria", "MKD": "Macédoine du Nord", "NOR": "Norvège",
    "OMN": "Oman", "PAK": "Pakistan", "PLW": "Palaos", "PSE": "Palestine", "PAN": "Panama",
    "PNG": "Papouasie-Nouvelle-Guinée", "PRY": "Paraguay", "PER": "Pérou", "PHL": "Philippines", "POL": "Pologne",
    "PRT": "Portugal", "QAT": "Qatar", "ROU": "Roumanie", "RUS": "Russie", "RWA": "Rwanda",
    "KNA": "Saint-Christophe-et-Niévès", "LCA": "Sainte-Lucie", "VCT": "Saint-Vincent-et-les-Grenadines", "WSM": "Samoa", "SMR": "Saint-Marin",
    "STP": "Sao Tomé-et-Principe", "SAU": "Arabie saoudite", "SEN": "Sénégal", "SRB": "Serbie", "SYC": "Seychelles",
    "SLE": "Sierra Leone", "SGP": "Singapour", "SVK": "Slovaquie", "SVN": "Slovénie", "SLB": "Îles Salomon",
    "SOM": "Somalie", "ZAF": "Afrique du Sud", "SSD": "Soudan du Sud", "ESP": "Espagne", "LKA": "Sri Lanka",
    "SDN": "Soudan", "SUR": "Suriname", "SWE": "Suède", "CHE": "Suisse", "SYR": "Syrie",
    "TWN": "Taïwan", "TJK": "Tadjikistan", "TZA": "Tanzanie", "THA": "Thaïlande", "TLS": "Timor oriental",
    "TGO": "Togo", "TON": "Tonga", "TTO": "Trinité-et-Tobago", "TUN": "Tunisie", "TUR": "Turquie",
    "TKM": "Turkménistan", "TUV": "Tuvalu", "UGA": "Ouganda", "UKR": "Ukraine", "ARE": "Émirats arabes unis",
    "GBR": "Royaume-Uni", "USA": "États-Unis", "URY": "Uruguay", "UZB": "Ouzbékistan", "VUT": "Vanuatu",
    "VAT": "Vatican", "VEN": "Venezuela", "VNM": "Viêt Nam", "YEM": "Yémen", "ZMB": "Zambie",
    "ZWE": "Zimbabwe", "XKX": "Kosovo", "ESH": "Sahara occidental", "NCL": "Nouvelle-Calédonie", "PYF": "Polynésie française",
    "ATA": "Antarctique", "ATF": "Terres australes et antarctiques françaises"
};

// Aliases et synonymes de recherche courants
const COUNTRY_ALIASES = {
    "USA": ["Etats-Unis", "Amérique", "America", "US", "USA", "United States"],
    "GBR": ["Angleterre", "Grande-Bretagne", "UK", "Britain", "England", "Royaume Uni"],
    "NLD": ["Hollande", "Holland", "Pays Bas", "Netherlands"],
    "ARE": ["Emirats", "UAE", "Dubai", "Dubaï", "Abou Dabi", "Abu Dhabi"],
    "DEU": ["Allemagne", "Germany", "Deutschland"],
    "RUS": ["Russie", "Russia", "URSS"],
    "MMR": ["Birmanie", "Burma", "Myanmar"],
    "KOR": ["Corée", "Corée du Sud", "South Korea"],
    "PRK": ["Corée du Nord", "North Korea"],
    "COD": ["Congo Kinshasa", "RDC", "Zaire", "Zaïre"],
    "COG": ["Congo Brazzaville"],
    "CIV": ["Cote d'Ivoire", "Ivory Coast"],
    "CAF": ["Centrafrique", "RCA"],
    "SWZ": ["Swaziland"],
    "CZE": ["République tchèque", "Tchéquie", "Czechia"],
    "MKD": ["Macédoine"],
    "TLS": ["Timor-Leste", "Timor"],
    "CPV": ["Cabo Verde", "Cap-Vert"],
    "FSM": ["Micronesie"],
    "VAT": ["Saint-Siège", "Saint Siege"],
    "GRL": ["Groenland", "Greenland", "Kalaallit Nunaat", "Nuuk"],
    "ATA": ["Antarctique", "Antarctica", "Pôle Sud", "Pole Sud", "Continent blanc", "Terre Adélie"],
    "ATF": ["TAAF", "Terres australes", "Kerguelen", "Crozet"]
};


// ========================================
// 4. SURVOL D'UN PAYS
// ========================================

function highlightCountry(event) {
    const layer = event.target;
    if (selectedLayer && layer === selectedLayer) {
        return;
    }
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
    const layer = event.target;
    if (selectedLayer && layer === selectedLayer) {
        return;
    }
    countriesLayer.resetStyle(layer);
}


// ========================================
// 6. GESTION DE LA SÉLECTION ET DES VUES
// ========================================

let currentActiveView = 'political'; // 'political' | 'economy' | 'demography'
window.currentActiveView = currentActiveView;
let currentSelectedIso3 = null;
let currentSelectedName = null;

function switchPanelView(view) {
    if (view === "population") view = "demography";
    currentActiveView = view;
    window.currentActiveView = view;

    // Synchroniser les boutons de contrôle de la carte
    document.querySelectorAll(".map-controls button.layer").forEach(function(btn) {
        const lType = btn.getAttribute("data-layer");
        const isMatch = (lType === view) || (view === "demography" && lType === "population");
        if (isMatch) {
            btn.classList.add("active");
        } else {
            btn.classList.remove("active");
        }
    });

    if (currentSelectedIso3) {
        renderCountryContent(currentSelectedIso3, currentSelectedName);
    } else {
        // Si aucun pays n'est sélectionné, ouvrir le volet latéral avec les 3 onglets et un message d'orientation
        const panel = document.getElementById("countryPanel");
        const content = document.getElementById("countryContent");
        if (panel && content) {
            panel.classList.add("open");
            const viewLabels = {
                'political': '🏛️ Mode Politique',
                'economy': '📊 Mode Économie',
                'demography': '👥 Mode Démographie'
            };
            const currentTitle = viewLabels[view] || 'Données cartographiques';
            content.innerHTML = `
                <h2 class="country-title">${currentTitle}</h2>
                <div class="panel-tabs">
                    <button class="panel-tab ${currentActiveView === 'political' ? 'active' : ''}" onclick="switchPanelView('political')">
                        🏛️ Politique
                    </button>
                    <button class="panel-tab ${currentActiveView === 'economy' ? 'active' : ''}" onclick="switchPanelView('economy')">
                        📊 Économie
                    </button>
                    <button class="panel-tab ${currentActiveView === 'demography' ? 'active' : ''}" onclick="switchPanelView('demography')">
                        👥 Démographie
                    </button>
                </div>
                <div class="data-card" style="margin-top:20px; border-left:3px solid #D9AF5E;">
                    <div class="data-label">Prêt pour l'exploration</div>
                    <div class="data-value" style="font-size:15px; line-height:1.6; margin-top:8px;">
                        👉 <strong>Cliquez sur un pays sur la carte</strong> (par exemple la France, l'Espagne, l'Allemagne, l'Italie...) pour afficher immédiatement sa fiche complète en mode ${currentTitle}.
                    </div>
                </div>
            `;
        }
    }
}
window.switchPanelView = switchPanelView;

function renderDemographyProfile(demoData, iso3, name, frenchTitle) {
    if (window.demographyLoading) {
        return `
            <p class="country-meta">DÉMOGRAPHIE</p>
            <div class="data-card" style="margin-top:20px; border-left:3px solid #D9AF5E;">
                <div class="data-label">Chargement en cours</div>
                <div class="data-value" style="font-size:15px; line-height:1.6; margin-top:8px;">
                    ⏳ Chargement des données démographiques en cours...
                </div>
            </div>
        `;
    }

    if (!demoData) {
        return `
            <p class="country-meta">DÉMOGRAPHIE</p>
            <div class="data-card" style="margin-top:20px; border-left:3px solid #D9AF5E;">
                <div class="data-label">Données en cours de déploiement</div>
                <div class="data-value" style="font-size:15px; line-height:1.6; margin-top:8px;">
                    Les données démographiques détaillées de <strong>${frenchTitle}</strong> sont en cours d'intégration.<br><br>
                    Actuellement, les profils démographiques complets sont disponibles pour l'<strong>Europe (48 entités)</strong> et l'<strong>Afrique (55 pays)</strong>.<br><br>
                    👉 <a href="javascript:void(0)" onclick="switchPanelView('political')" style="color:#D9AF5E; font-weight:bold; text-decoration:underline;">Consulter sa fiche politique →</a> ou <a href="javascript:void(0)" onclick="switchPanelView('economy')" style="color:#D9AF5E; font-weight:bold; text-decoration:underline;">sa fiche économique →</a>
                </div>
            </div>
        `;
    }

    const metropolesList = Array.isArray(demoData.urbanization.mainMetropolises)
        ? demoData.urbanization.mainMetropolises.join(" • ")
        : (demoData.urbanization.mainMetropolises || "—");

    return `
        <p class="country-meta">PROFIL DÉMOGRAPHIQUE</p>

        <!-- 1. INDICATEURS GLOBAUX -->
        <div class="data-section">
            <h3 class="section-label">Indicateurs généraux de population</h3>
            <div class="data-card">
                <div class="data-label">Population totale (Rang mondial)</div>
                <div class="data-value">${demoData.general.population} <span style="font-size:13px; color:#D9AF5E; margin-left:6px;">(${demoData.general.globalRank})</span></div>
            </div>
            <div class="data-card">
                <div class="data-label">Densité démographique</div>
                <div class="data-value">${demoData.general.density}</div>
            </div>
            <div class="data-card">
                <div class="data-label">Accroissement démographique annuel</div>
                <div class="data-value">${demoData.general.growthRate}</div>
            </div>
        </div>

        <!-- 2. FÉCONDITÉ & DYNAMIQUE NATURELLE -->
        <div class="data-section">
            <h3 class="section-label">Fécondité & Mouvements naturels</h3>
            <div class="data-card">
                <div class="data-label">Indice de fécondité</div>
                <div class="data-value">${demoData.fertilityMortality.fertilityRate}</div>
            </div>
            <div class="data-grid">
                <div class="data-card">
                    <div class="data-label">Taux de natalité</div>
                    <div class="data-value">${demoData.fertilityMortality.birthRate}</div>
                </div>
                <div class="data-card">
                    <div class="data-label">Taux de mortalité</div>
                    <div class="data-value">${demoData.fertilityMortality.deathRate}</div>
                </div>
            </div>
            <div class="data-grid">
                <div class="data-card">
                    <div class="data-label">Mortalité infantile</div>
                    <div class="data-value">${demoData.fertilityMortality.infantMortality}</div>
                </div>
                <div class="data-card">
                    <div class="data-label">Solde migratoire net</div>
                    <div class="data-value">${demoData.fertilityMortality.netMigration}</div>
                </div>
            </div>
        </div>

        <!-- 3. STRUCTURE PAR ÂGE & ESPÉRANCE DE VIE -->
        <div class="data-section">
            <h3 class="section-label">Âge & Espérance de vie</h3>
            <div class="data-card">
                <div class="data-label">Âge médian de la population</div>
                <div class="data-value">${demoData.ageStructure.medianAge}</div>
            </div>
            <div class="data-card">
                <div class="data-label">Espérance de vie à la naissance</div>
                <div class="data-value">
                    <strong>${demoData.ageStructure.lifeExpectancy.total}</strong>
                    <span style="font-size:13px; color:#8ea6ba; margin-left:8px;">(Femmes : ${demoData.ageStructure.lifeExpectancy.women} • Hommes : ${demoData.ageStructure.lifeExpectancy.men})</span>
                </div>
            </div>
            <div class="data-card">
                <div class="data-label">Répartition par grands groupes d'âge</div>
                <div class="data-value" style="display:flex; gap:12px; margin-top:6px; flex-wrap:wrap;">
                    <span class="eco-badge">0-14 ans : ${demoData.ageStructure.ageGroups.zeroToFourteen}</span>
                    <span class="eco-badge">15-64 ans : ${demoData.ageStructure.ageGroups.fifteenToSixtyFour}</span>
                    <span class="eco-badge">65+ ans : ${demoData.ageStructure.ageGroups.sixtyFivePlus}</span>
                </div>
            </div>
            <div class="data-card">
                <div class="data-label">Ratio de dépendance démographique</div>
                <div class="data-value">${demoData.ageStructure.dependencyRatio}</div>
            </div>
        </div>

        <!-- 4. URBANISATION & RÉPARTITION SPATIALE -->
        <div class="data-section">
            <h3 class="section-label">Urbanisation & Réseau urbain</h3>
            <div class="data-card">
                <div class="data-label">Taux d'urbanisation</div>
                <div class="data-value">${demoData.urbanization.urbanRate}</div>
            </div>
            <div class="data-card">
                <div class="data-label">Principales métropoles & agglomérations</div>
                <div class="data-value">${metropolesList}</div>
            </div>
        </div>

        <!-- 5. SOCIOLOGIE, LANGUES & RELIGIONS -->
        <div class="data-section">
            <h3 class="section-label">Composition socioculturelle</h3>
            <div class="data-card">
                <div class="data-label">Groupes ethniques & nationaux</div>
                <div class="data-value">${demoData.sociology.ethnicGroups}</div>
            </div>
            <div class="data-card">
                <div class="data-label">Langues parlées & officielles</div>
                <div class="data-value">${demoData.sociology.languages}</div>
            </div>
            <div class="data-card">
                <div class="data-label">Religions & croyances</div>
                <div class="data-value">${demoData.sociology.religions}</div>
            </div>
        </div>

        <!-- 6. DÉVELOPPEMENT HUMAIN & DÉFIS GÉOPOLITIQUES -->
        <div class="data-section">
            <h3 class="section-label">Développement humain & Défis d'avenir</h3>
            <div class="data-card">
                <div class="data-label">Indice de Développement Humain (IDH)</div>
                <div class="data-value">${demoData.development.hdi}</div>
            </div>
            <div class="data-card">
                <div class="data-label">Taux d'alphabétisation des adultes</div>
                <div class="data-value">${demoData.development.literacyRate}</div>
            </div>
            <div class="data-card" style="border-left:3px solid #D9AF5E;">
                <div class="data-label" style="color:#D9AF5E;">Enjeux démographiques & géopolitiques</div>
                <div class="data-value" style="margin-top:6px; line-height:1.5;">${demoData.development.keyChallenges}</div>
            </div>
        </div>
    `;
}

function renderEconomyProfile(ecoData, iso3, name, frenchTitle) {
    if (window.economyLoading) {
        return `
            <p class="country-meta">ÉCONOMIE</p>
            <div class="data-card" style="margin-top:20px; border-left:3px solid #D9AF5E;">
                <div class="data-label">Chargement en cours</div>
                <div class="data-value" style="font-size:15px; line-height:1.6; margin-top:8px;">
                    ⏳ Chargement des données économiques en cours...
                </div>
            </div>
        `;
    }

    if (!ecoData) {
        return `
            <p class="country-meta">ÉCONOMIE</p>
            <div class="data-card" style="margin-top:20px; border-left:3px solid #D9AF5E;">
                <div class="data-label">Données en cours d'intégration</div>
                <div class="data-value" style="font-size:15px; line-height:1.6; margin-top:8px;">
                    Les données économiques de <strong>${frenchTitle}</strong> sont en cours de déploiement.<br><br>
                    Actuellement, les profils économiques complets sont activés pour l'ensemble des continents du monde (<strong>Europe, Afrique, Asie, Amériques et Océanie — 202 pays et territoires</strong>).<br><br>
                    👉 <a href="javascript:void(0)" onclick="switchPanelView('political')" style="color:#D9AF5E; font-weight:bold; text-decoration:underline;">Consulter sa fiche politique complète →</a>
                </div>
            </div>
        `;
    }

    const orgsBadges = (ecoData.organizations || []).map(function(org) {
        return `<span class="eco-badge">${org}</span>`;
    }).join("");

    const topPartners = Array.isArray(ecoData.trade.topPartners)
        ? ecoData.trade.topPartners.join(", ")
        : (ecoData.trade.topPartners || "—");

    return `
        <p class="country-meta">PROFIL ÉCONOMIQUE</p>

        <!-- MONNAIE & BANQUE CENTRALE -->
        <div class="data-section">
            <h3 class="section-label">Monnaie & Système financier</h3>
            <div class="data-card">
                <div class="data-label">Monnaie officielle</div>
                <div class="data-value">${ecoData.currency.name} (${ecoData.currency.code || "—"}) ${ecoData.currency.symbol || ""}</div>
            </div>
            <div class="data-card">
                <div class="data-label">Banque centrale</div>
                <div class="data-value">${ecoData.currency.centralBank}</div>
            </div>
        </div>

        <!-- MACROÉCONOMIE -->
        <div class="data-section">
            <h3 class="section-label">Indicateurs macroéconomiques</h3>
            <div class="data-card">
                <div class="data-label">PIB nominal (Rang)</div>
                <div class="data-value">${ecoData.macro.gdpNominal} <span style="font-size:13px; color:#D9AF5E; margin-left:6px;">(${ecoData.macro.globalRank})</span></div>
            </div>
            <div class="data-card">
                <div class="data-label">PIB par habitant</div>
                <div class="data-value">${ecoData.macro.gdpPerCapita}</div>
            </div>
            <div class="data-card">
                <div class="data-label">Croissance annuelle du PIB</div>
                <div class="data-value">${ecoData.macro.growth}</div>
            </div>
            <div class="data-card">
                <div class="data-label">Taux d'inflation</div>
                <div class="data-value">${ecoData.macro.inflation}</div>
            </div>
        </div>

        <!-- STRUCTURE SECTORIELLE -->
        <div class="data-section">
            <h3 class="section-label">Structure sectorielle</h3>
            <div class="data-card">
                <div class="data-label">Répartition du PIB</div>
                <div class="data-value" style="font-size:15px; margin-top:8px; line-height:1.7;">
                    💼 Services : <strong>${ecoData.structure.services}</strong><br>
                    🏭 Industrie : <strong>${ecoData.structure.industry}</strong><br>
                    🌾 Agriculture : <strong>${ecoData.structure.agriculture}</strong>
                </div>
            </div>
            <div class="data-card">
                <div class="data-label">Pôles d'excellence & secteurs moteurs</div>
                <div class="data-value" style="font-size:15px; line-height:1.5;">${ecoData.structure.mainSectors}</div>
            </div>
        </div>

        <!-- COMMERCE EXTÉRIEUR -->
        <div class="data-section">
            <h3 class="section-label">Commerce extérieur & partenaires</h3>
            <div class="data-card">
                <div class="data-label">Principales exportations</div>
                <div class="data-value" style="font-size:15px; line-height:1.5;">${ecoData.trade.mainExports}</div>
            </div>
            <div class="data-card">
                <div class="data-label">Principales importations</div>
                <div class="data-value" style="font-size:15px; line-height:1.5;">${ecoData.trade.mainImports}</div>
            </div>
            <div class="data-card">
                <div class="data-label">Principaux partenaires commerciaux</div>
                <div class="data-value" style="font-size:15px; line-height:1.5;">${topPartners}</div>
            </div>
            <div class="data-card">
                <div class="data-label">Balance commerciale</div>
                <div class="data-value">${ecoData.trade.tradeBalance}</div>
            </div>
        </div>

        <!-- FINANCES PUBLIQUES -->
        <div class="data-section">
            <h3 class="section-label">Finances publiques</h3>
            <div class="data-card">
                <div class="data-label">Dette publique</div>
                <div class="data-value">${ecoData.publicFinance.publicDebt}</div>
            </div>
            <div class="data-card">
                <div class="data-label">Solde budgétaire</div>
                <div class="data-value">${ecoData.publicFinance.budgetBalance}</div>
            </div>
            <div class="data-card">
                <div class="data-label">Notation souveraine</div>
                <div class="data-value">${ecoData.publicFinance.sovereignRating}</div>
            </div>
        </div>

        <!-- ORGANISATIONS ÉCONOMIQUES -->
        <div class="data-section">
            <h3 class="section-label">Organisations & Intégration économique</h3>
            <div class="data-card" style="padding-bottom:12px;">
                <div style="margin-top:6px;">
                    ${orgsBadges || "—"}
                </div>
            </div>
        </div>
    `;
}

function renderCountryContent(iso3, name) {
    window.renderCountryContent = renderCountryContent;
    const polData = window.politicalData ? window.politicalData[iso3] : null;
    const ecoData = window.economyData ? window.economyData[iso3] : null;
    const demoData = window.demographyData ? window.demographyData[iso3] : null;
    const frenchTitle = COUNTRY_NAMES_FR[iso3] || (polData && polData.identity && polData.identity.officialName) || name;

    let html = `
        <h2 class="country-title">
            ${frenchTitle}
        </h2>
        <div class="panel-tabs">
            <button class="panel-tab ${currentActiveView === 'political' ? 'active' : ''}" onclick="switchPanelView('political')">
                🏛️ Politique
            </button>
            <button class="panel-tab ${currentActiveView === 'economy' ? 'active' : ''}" onclick="switchPanelView('economy')">
                📊 Économie
            </button>
            <button class="panel-tab ${currentActiveView === 'demography' || currentActiveView === 'population' ? 'active' : ''}" onclick="switchPanelView('demography')">
                👥 Démographie
            </button>
        </div>
    `;

    if (currentActiveView === 'political') {
        if (polData) {
            html += `
                <p class="country-meta">
                    ${polData.identity.officialName || "POLITIQUE"}
                </p>

                <!-- IDENTITÉ POLITIQUE -->
                <div class="data-section">
                    <h3 class="section-label">Identité politique</h3>
                    <div class="data-card">
                        <div class="data-label">Nom officiel</div>
                        <div class="data-value">${polData.identity.officialName}</div>
                    </div>
                    <div class="data-card">
                        <div class="data-label">Capitale politique</div>
                        <div class="data-value">${polData.identity.capital}</div>
                    </div>
                    <div class="data-card">
                        <div class="data-label">Capitale économique</div>
                        <div class="data-value">${polData.identity.economicCapital || "—"}</div>
                    </div>
                    <div class="data-card">
                        <div class="data-label">Indépendance</div>
                        <div class="data-value">${polData.identity.independence || "—"}</div>
                    </div>
                </div>

                <!-- SYSTÈME POLITIQUE -->
                <div class="data-section">
                    <h3 class="section-label">Système politique</h3>
                    <div class="data-card">
                        <div class="data-label">Forme de l'État</div>
                        <div class="data-value">${polData.system.stateForm}</div>
                    </div>
                    <div class="data-card">
                        <div class="data-label">Régime politique</div>
                        <div class="data-value">${polData.system.regime}</div>
                    </div>
                    <div class="data-card">
                        <div class="data-label">Organisation territoriale</div>
                        <div class="data-value">${polData.system.territorialOrganization}</div>
                    </div>
                    <div class="data-card">
                        <div class="data-label">Constitution</div>
                        <div class="data-value">${polData.system.constitution}</div>
                    </div>
                </div>

                <!-- POUVOIR EXÉCUTIF -->
                <div class="data-section">
                    <h3 class="section-label">Pouvoir exécutif</h3>
                    <div class="data-card">
                        <div class="data-label">Chef de l'État</div>
                        <div class="data-value">${polData.executive.headOfState}</div>
                    </div>
                    <div class="data-card">
                        <div class="data-label">Chef du gouvernement</div>
                        <div class="data-value">${polData.executive.headOfGovernment}</div>
                    </div>
                    <div class="data-card">
                        <div class="data-label">Mode d'élection</div>
                        <div class="data-value">${polData.executive.election}</div>
                    </div>
                    <div class="data-card">
                        <div class="data-label">Durée du mandat</div>
                        <div class="data-value">${polData.executive.mandate}</div>
                    </div>
                </div>

                <!-- POUVOIR LÉGISLATIF -->
                <div class="data-section">
                    <h3 class="section-label">Pouvoir législatif</h3>
                    <div class="data-card">
                        <div class="data-label">Parlement</div>
                        <div class="data-value">${polData.legislative.parliament}</div>
                    </div>
                    <div class="data-card">
                        <div class="data-label">Structure</div>
                        <div class="data-value">${polData.legislative.structure}</div>
                    </div>
                    <div class="data-card">
                        <div class="data-label">Chambre basse</div>
                        <div class="data-value">${polData.legislative.lowerHouse}</div>
                    </div>
                    <div class="data-card">
                        <div class="data-label">Chambre haute</div>
                        <div class="data-value">${polData.legislative.upperHouse}</div>
                    </div>
                </div>

                <!-- SYSTÈME ÉLECTORAL -->
                <div class="data-section">
                    <h3 class="section-label">Système électoral</h3>
                    <div class="data-card">
                        <div class="data-label">Âge du vote</div>
                        <div class="data-value">${polData.electoral.votingAge}</div>
                    </div>
                    <div class="data-card">
                        <div class="data-label">Élection présidentielle</div>
                        <div class="data-value">${polData.electoral.presidentialSystem}</div>
                    </div>
                    <div class="data-card">
                        <div class="data-label">Élections législatives</div>
                        <div class="data-value">${polData.electoral.legislativeSystem}</div>
                    </div>
                </div>

                <!-- POUVOIR JUDICIAIRE -->
                <div class="data-section">
                    <h3 class="section-label">Pouvoir judiciaire</h3>
                    <div class="data-card">
                        <div class="data-label">Institution constitutionnelle</div>
                        <div class="data-value">${polData.judiciary.constitutionalInstitution}</div>
                    </div>
                    <div class="data-card">
                        <div class="data-label">Juridiction suprême</div>
                        <div class="data-value">${polData.judiciary.highestJudicialInstitution}</div>
                    </div>
                </div>

                <!-- ORGANISATION TERRITORIALE -->
                <div class="data-section">
                    <h3 class="section-label">Organisation territoriale</h3>
                    <div class="data-card">
                        <div class="data-label">Type d'État</div>
                        <div class="data-value">${polData.territory.type}</div>
                    </div>
                    <div class="data-card">
                        <div class="data-label">Organisation</div>
                        <div class="data-value">${polData.territory.organization}</div>
                    </div>
                </div>

                <!-- POLITIQUE ÉTRANGÈRE -->
                <div class="data-section">
                    <h3 class="section-label">Politique étrangère</h3>
                    <div class="data-card">
                        <div class="data-label">Organisations régionales</div>
                        <div class="data-value">${polData.foreignPolicy.regionalOrganizations.join(", ")}</div>
                    </div>
                    <div class="data-card">
                        <div class="data-label">Organisations internationales</div>
                        <div class="data-value">${polData.foreignPolicy.internationalOrganizations.join(", ")}</div>
                    </div>
                </div>
            `;
        } else {
            html += `
                <p class="country-meta">POLITIQUE</p>
                <div class="data-card">
                    <div class="data-label">Code ISO</div>
                    <div class="data-value">${iso3 || "Non disponible"}</div>
                </div>
                <div class="data-card">
                    <div class="data-label">Données politiques</div>
                    <div class="data-value">Données en cours d'intégration.</div>
                </div>
            `;
        }
    } else if (currentActiveView === 'economy') {
        html += renderEconomyProfile(ecoData, iso3, name, frenchTitle);
    } else if (currentActiveView === 'demography' || currentActiveView === 'population') {
        html += renderDemographyProfile(demoData, iso3, name, frenchTitle);
    }

    document.getElementById("countryContent").innerHTML = html;
}

function extractIso3(properties) {
    if (!properties) return "";
    const name = properties.name || properties.NAME || properties.name_long || properties.admin || "";
    if (ISO_FIXES[name]) {
        return ISO_FIXES[name];
    }
    let iso3 = properties.iso_a3 || properties.ISO_A3 || properties["ISO3166-1-Alpha-3"] || properties.adm0_a3 || properties.sov_a3;
    if (!iso3 || iso3 === "-99") {
        iso3 = properties.adm0_a3 || "";
    }
    return iso3;
}

function extractCountryName(properties) {
    if (!properties) return "Pays non identifié";
    return properties.name || properties.name_long || properties.admin || properties.NAME || "Pays non identifié";
}

function selectCountry(event) {
    const layer = event.target;
    const properties = layer.feature.properties || {};
    const name = extractCountryName(properties);
    const iso3 = extractIso3(properties);

    // Mise en valeur active persistante sur la carte (contour doré)
    if (selectedLayer && selectedLayer !== layer) {
        countriesLayer.resetStyle(selectedLayer);
    }
    selectedLayer = layer;
    layer.setStyle({
        weight: 2.5,
        color: "#D9AF5E",
        fillColor: "#3d6d8d",
        fillOpacity: 0.95
    });
    layer.bringToFront();

    console.log("Pays sélectionné :", name, "ISO :", iso3);

    currentSelectedIso3 = iso3;
    currentSelectedName = name;
    window.currentSelectedIso3 = iso3;
    window.currentSelectedName = name;

    document.getElementById("countryPanel").classList.add("open");
    renderCountryContent(iso3, name);
}


// ========================================
// 7. CHARGEMENT RAPIDE DES PAYS (602 KB au lieu de 14.6 MB)
// ========================================

function loadWorldGeoJson() {
    const geoJsonSources = [
        "world.geojson",
        "data/world.geojson",
        "https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_110m_admin_0_countries.geojson",
        "https://raw.githubusercontent.com/datasets/geo-countries/main/data/countries.geojson"
    ];

    function fetchNext(index) {
        if (index >= geoJsonSources.length) {
            return Promise.reject(new Error("Aucune source cartographique accessible."));
        }
        const sourceUrl = geoJsonSources[index];
        return fetch(sourceUrl)
            .then(function(res) {
                if (!res.ok) throw new Error("HTTP " + res.status);
                return res.json();
            })
            .catch(function(err) {
                console.warn("Échec du chargement depuis " + sourceUrl + " :", err);
                return fetchNext(index + 1);
            });
    }

    return fetchNext(0);
}

loadWorldGeoJson()
    .then(data => {
        console.log("Carte mondiale chargée avec succès :", data.features.length, "pays/territoires");

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

        buildSearchIndex();

        const statusEl = document.getElementById("updateStatus");
        if (statusEl) {
            statusEl.textContent = "Carte connectée";
            statusEl.style.color = "#3ddc84";
        }
    })
    .catch(error => {
        console.error("Erreur critique chargement carte :", error);
        const statusEl = document.getElementById("updateStatus");
        if (statusEl) {
            statusEl.textContent = "Erreur de chargement";
            statusEl.style.color = "#a83d38";
        }
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

            if (selectedLayer) {
                countriesLayer.resetStyle(selectedLayer);
                selectedLayer = null;
            }
            currentSelectedIso3 = null;
            currentSelectedName = null;

        }
    );

}

// GESTION DES BOUTONS DE COUCHE (POLITIQUE / ÉCONOMIE / POPULATION)
document.querySelectorAll(".map-controls button.layer").forEach(function(button) {
    button.addEventListener("click", function() {
        const layerType = this.getAttribute("data-layer");
        if (layerType === "political" || layerType === "economy") {
            switchPanelView(layerType);
        } else if (layerType === "population" || layerType === "demography") {
            switchPanelView("demography");
        }
    });
});


// ========================================
// 9. RECHERCHE INTELLIGENTE MULTI-CRITÈRES
// ========================================

const searchInput =
    document.getElementById("countrySearch");

const searchResults =
    document.getElementById("searchResults");

const clearBtn =
    document.getElementById("clearSearch");

let searchIndex = [];
let currentMatches = [];
let selectedSearchIndex = -1;

function cleanText(str) {
    if (!str) return "";
    return str
        .toString()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/['’\-]/g, " ")
        .replace(/[^a-z0-9 ]/g, "")
        .replace(/\s+/g, " ")
        .trim();
}

function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function highlightText(text, query) {
    if (!text || !query) return text || "";
    const cleanQ = cleanText(query);
    if (!cleanQ) return text;

    const regex = new RegExp(`(${escapeRegExp(query.trim())})`, "gi");
    if (regex.test(text)) {
        return text.replace(regex, "<mark>$1</mark>");
    }
    return text;
}

function buildSearchIndex() {
    if (!countriesLayer) return;
    searchIndex = [];

    countriesLayer.eachLayer(function(layer) {
        const properties = layer.feature.properties || {};
        const engName = extractCountryName(properties);
        const iso3 = extractIso3(properties);

        const pol = (window.politicalData && iso3) ? window.politicalData[iso3] : null;
        const official = (pol && pol.identity && pol.identity.officialName) || "";
        const capital = (pol && pol.identity && pol.identity.capital) || "";
        const ecoCap = (pol && pol.identity && pol.identity.economicCapital && pol.identity.economicCapital !== "—") ? pol.identity.economicCapital : "";
        const frName = (iso3 && COUNTRY_NAMES_FR[iso3]) ? COUNTRY_NAMES_FR[iso3] : (official || engName);
        const aliases = (iso3 && COUNTRY_ALIASES[iso3]) ? COUNTRY_ALIASES[iso3] : [];

        searchIndex.push({
            layer: layer,
            iso3: iso3,
            name: frName,
            officialName: official,
            engName: engName,
            capital: capital,
            economicCapital: ecoCap,
            aliases: aliases,
            cleanName: cleanText(frName),
            cleanOfficial: cleanText(official),
            cleanEng: cleanText(engName),
            cleanCap: cleanText(capital),
            cleanEco: cleanText(ecoCap),
            cleanIso: cleanText(iso3),
            cleanAliases: aliases.map(cleanText)
        });
    });
}

function performSearch(query) {
    if (!query) {
        searchResults.innerHTML = "";
        searchResults.style.display = "none";
        if (clearBtn) clearBtn.style.display = "none";
        currentMatches = [];
        selectedSearchIndex = -1;
        return;
    }

    if (clearBtn) clearBtn.style.display = "block";

    // Si l'index n'a pas encore été construit ou si les données politiques viennent d'arriver
    if (searchIndex.length === 0 || (searchIndex.length > 0 && !searchIndex[0].officialName && window.politicalData && Object.keys(window.politicalData).length > 0)) {
        buildSearchIndex();
    }

    const cleanQ = cleanText(query);
    if (!cleanQ) {
        searchResults.style.display = "none";
        return;
    }

    const scored = [];

    searchIndex.forEach(function(item) {
        let score = 0;
        let matchedField = null;

        if (item.cleanIso === cleanQ) {
            score = 1200;
            matchedField = "iso";
        } else if (item.cleanName === cleanQ) {
            score = 1000;
            matchedField = "name";
        } else if (item.cleanName.startsWith(cleanQ)) {
            score = 850 - (item.cleanName.length - cleanQ.length);
            matchedField = "name";
        } else if (item.cleanAliases.some(a => a === cleanQ)) {
            score = 800;
            matchedField = "alias";
        } else if (item.cleanAliases.some(a => a.startsWith(cleanQ))) {
            score = 750;
            matchedField = "alias";
        } else if (item.cleanName.includes(cleanQ)) {
            score = 650;
            matchedField = "name";
        } else if (item.cleanCap && item.cleanCap.startsWith(cleanQ)) {
            score = 600;
            matchedField = "capital";
        } else if (item.cleanCap && item.cleanCap.includes(cleanQ)) {
            score = 500;
            matchedField = "capital";
        } else if (item.cleanOfficial && item.cleanOfficial.includes(cleanQ)) {
            score = 450;
            matchedField = "official";
        } else if (item.cleanEng && item.cleanEng.startsWith(cleanQ)) {
            score = 400;
            matchedField = "eng";
        } else if (item.cleanEng && item.cleanEng.includes(cleanQ)) {
            score = 300;
            matchedField = "eng";
        } else if (item.cleanEco && item.cleanEco.includes(cleanQ)) {
            score = 250;
            matchedField = "eco";
        }

        if (score > 0) {
            scored.push({
                item: item,
                score: score,
                matchedField: matchedField
            });
        }
    });

    scored.sort(function(a, b) {
        if (b.score !== a.score) return b.score - a.score;
        return a.item.name.localeCompare(b.item.name, "fr");
    });

    currentMatches = scored.slice(0, 10).map(s => s.item);
    selectedSearchIndex = currentMatches.length > 0 ? 0 : -1;

    renderSearchResults(scored.slice(0, 10), query);
}

function renderSearchResults(results, query) {
    searchResults.innerHTML = "";

    if (results.length === 0) {
        searchResults.innerHTML = `
            <div class="search-no-result">
                Aucun pays trouvé pour <strong>"${query}"</strong><br>
                <span style="display:inline-block; margin-top:6px; font-size:11.5px; color:#6f8493;">
                    Astuce : essayez en français (ex : <em>Allemagne, Japon, Côte d'Ivoire</em>), une capitale ou un code ISO (ex : <em>FRA, USA</em>).
                </span>
            </div>
        `;
        searchResults.style.display = "block";
        return;
    }

    const countHeader = document.createElement("div");
    countHeader.className = "search-count";
    countHeader.textContent = `${results.length} résultat${results.length > 1 ? "s" : ""}`;
    searchResults.appendChild(countHeader);

    results.forEach(function(res, idx) {
        const item = res.item;
        const card = document.createElement("div");
        card.className = "search-result" + (idx === selectedSearchIndex ? " selected" : "");
        card.setAttribute("data-index", idx);

        let metaText = "";
        if (item.capital) {
            metaText += `<span>🏛️ ${highlightText(item.capital, query)}</span>`;
        }
        if (item.engName && item.engName.toLowerCase() !== item.name.toLowerCase() && res.matchedField === "eng") {
            metaText += `<span>• <em>${highlightText(item.engName, query)}</em></span>`;
        }

        card.innerHTML = `
            <div class="search-result-main">
                <div class="search-result-name">${highlightText(item.name, query)}</div>
                ${metaText ? `<div class="search-result-meta">${metaText}</div>` : ""}
            </div>
            ${item.iso3 ? `<span class="search-result-badge">${item.iso3}</span>` : ""}
        `;

        card.addEventListener("click", function() {
            chooseCountry(item);
        });

        card.addEventListener("mouseenter", function() {
            selectedSearchIndex = idx;
            updateSelectedCard();
        });

        searchResults.appendChild(card);
    });

    searchResults.style.display = "block";
}

function updateSelectedCard() {
    const cards = searchResults.querySelectorAll(".search-result");
    cards.forEach(function(card, idx) {
        if (idx === selectedSearchIndex) {
            card.classList.add("selected");
            card.scrollIntoView({ block: "nearest" });
        } else {
            card.classList.remove("selected");
        }
    });
}

function chooseCountry(item) {
    if (!item || !item.layer) return;

    const layer = item.layer;

    if (map && layer.getBounds) {
        map.flyToBounds(layer.getBounds(), {
            padding: [70, 70],
            maxZoom: 6,
            duration: 1.2
        });
    }

    selectCountry({ target: layer });

    if (searchInput) searchInput.value = item.name;
    if (searchResults) {
        searchResults.innerHTML = "";
        searchResults.style.display = "none";
    }
    if (clearBtn) clearBtn.style.display = "block";
}

if (searchInput) {
    searchInput.addEventListener("input", function() {
        performSearch(searchInput.value.trim());
    });

    searchInput.addEventListener("keydown", function(e) {
        if (searchResults.style.display !== "block" || currentMatches.length === 0) {
            return;
        }

        if (e.key === "ArrowDown") {
            e.preventDefault();
            selectedSearchIndex = (selectedSearchIndex + 1) % currentMatches.length;
            updateSelectedCard();
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            selectedSearchIndex = (selectedSearchIndex - 1 + currentMatches.length) % currentMatches.length;
            updateSelectedCard();
        } else if (e.key === "Enter") {
            e.preventDefault();
            const chosen = selectedSearchIndex >= 0 ? currentMatches[selectedSearchIndex] : currentMatches[0];
            if (chosen) chooseCountry(chosen);
        } else if (e.key === "Escape") {
            searchResults.style.display = "none";
        }
    });

    searchInput.addEventListener("focus", function() {
        if (searchInput.value.trim() && currentMatches.length > 0) {
            searchResults.style.display = "block";
        }
    });
}

if (clearBtn) {
    clearBtn.addEventListener("click", function() {
        searchInput.value = "";
        searchResults.innerHTML = "";
        searchResults.style.display = "none";
        clearBtn.style.display = "none";
        searchInput.focus();
        if (selectedLayer) {
            countriesLayer.resetStyle(selectedLayer);
            selectedLayer = null;
        }
        document.getElementById("countryPanel").classList.remove("open");
    });
}

document.addEventListener("click", function(e) {
    const searchContainer = document.querySelector(".search");
    if (searchContainer && !searchContainer.contains(e.target)) {
        if (searchResults) searchResults.style.display = "none";
    }
});

// ========================================
// DIPLOMACY LAB — MODULE DÉMOGRAPHIE
// CHARGEUR DE DONNÉES MULTI-CONTINENTS RÉSILIANT
// ========================================

window.demographyData = window.demographyData || {};
window.demographyLoading = true;
window.demographyLoaded = false;

function fetchFirstAvailableDemo(paths) {
    if (!paths || paths.length === 0) {
        return Promise.reject(new Error("Aucun chemin valide"));
    }
    const path = paths[0];
    return fetch(path)
        .then(function(response) {
            if (!response.ok) {
                throw new Error("HTTP " + response.status);
            }
            return response.json();
        })
        .catch(function() {
            return fetchFirstAvailableDemo(paths.slice(1));
        });
}

// Chemins résilients pour chaque continent (priorité aux fichiers racine téléversés)
const europeDemoPaths = [
    "europe_demographie.json",
    "data/europe_demographie.json",
    "data/demographie/europe.json",
    "data/europe_demography.json"
];

const africaDemoPaths = [
    "africa_demographie.json",
    "data/africa_demographie.json",
    "data/demographie/africa.json"
];

const asiaDemoPaths = [
    "asia_demographie.json",
    "data/asia_demographie.json",
    "data/demographie/asia.json"
];

const americaDemoPaths = [
    "america_demographie.json",
    "data/america_demographie.json",
    "data/demographie/america.json"
];

const oceaniaDemoPaths = [
    "oceania_demographie.json",
    "data/oceania_demographie.json",
    "data/demographie/oceania.json"
];

function onDemoContinentLoaded(continentName, data) {
    Object.assign(window.demographyData, data);
    window.demographyLoaded = true;
    console.log("Module DÉMOGRAPHIE : " + continentName + " chargée avec succès (" + Object.keys(data).length + " pays).");
    if (typeof window.renderCountryContent === "function" && window.currentSelectedIso3) {
        window.renderCountryContent(window.currentSelectedIso3, window.currentSelectedName);
    }
}

// Lancement simultané des chargements
const demoLoads = [
    fetchFirstAvailableDemo(europeDemoPaths).then(function(data) { onDemoContinentLoaded("Europe", data); }).catch(function(e) { console.warn("Démographie Europe indisponible :", e); }),
    fetchFirstAvailableDemo(africaDemoPaths).then(function(data) { onDemoContinentLoaded("Afrique", data); }).catch(function(e) { console.warn("Démographie Afrique indisponible :", e); }),
    fetchFirstAvailableDemo(asiaDemoPaths).then(function(data) { onDemoContinentLoaded("Asie", data); }).catch(function() {}),
    fetchFirstAvailableDemo(americaDemoPaths).then(function(data) { onDemoContinentLoaded("Amériques", data); }).catch(function() {}),
    fetchFirstAvailableDemo(oceaniaDemoPaths).then(function(data) { onDemoContinentLoaded("Océanie", data); }).catch(function() {})
];

Promise.allSettled(demoLoads).then(function() {
    window.demographyLoading = false;
    console.log("Module DÉMOGRAPHIE prêt. Total pays chargés : " + Object.keys(window.demographyData).length);
});

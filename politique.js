// ========================================
// DIPLOMACY LAB — MODULE POLITIQUE
// CHARGEUR DE DONNÉES MULTI-CONTINENTS RÉSILIANT
// ========================================

window.politicalData = window.politicalData || {};
window.politicalLoading = true;
window.politicalLoaded = false;

function fetchFirstAvailablePol(paths) {
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
            return fetchFirstAvailablePol(paths.slice(1));
        });
}

// Chemins résilients pour chaque continent (priorité aux fichiers racine téléversés)
const europePolPaths = [
    "europe.json",
    "data/politique/europe.json",
    "data/europe.json",
    "europe_politique.json"
];

const africaPolPaths = [
    "africa.json",
    "data/politique/africa.json",
    "data/africa.json",
    "africa_politique.json"
];

const asiaPolPaths = [
    "asia.json",
    "data/politique/asia.json",
    "data/asia.json",
    "asia_politique.json"
];

const americaPolPaths = [
    "america.json",
    "americas.json",
    "data/politique/america.json",
    "data/america.json",
    "america_politique.json"
];

const oceaniaPolPaths = [
    "oceania.json",
    "data/politique/oceania.json",
    "data/oceania.json",
    "oceania_politique.json"
];

function onPolContinentLoaded(continentName, data) {
    Object.assign(window.politicalData, data);
    window.politicalLoaded = true;
    console.log("Module POLITIQUE : " + continentName + " chargée avec succès (" + Object.keys(data).length + " pays).");
    if (typeof window.renderCountryContent === "function" && window.currentSelectedIso3) {
        window.renderCountryContent(window.currentSelectedIso3, window.currentSelectedName);
    }
}

// Lancement simultané des chargements
const polLoads = [
    fetchFirstAvailablePol(europePolPaths).then(function(data) { onPolContinentLoaded("Europe", data); }).catch(function(e) { console.warn("Politique Europe indisponible :", e); }),
    fetchFirstAvailablePol(africaPolPaths).then(function(data) { onPolContinentLoaded("Afrique", data); }).catch(function(e) { console.warn("Politique Afrique indisponible :", e); }),
    fetchFirstAvailablePol(asiaPolPaths).then(function(data) { onPolContinentLoaded("Asie", data); }).catch(function(e) { console.warn("Politique Asie indisponible :", e); }),
    fetchFirstAvailablePol(americaPolPaths).then(function(data) { onPolContinentLoaded("Amériques", data); }).catch(function(e) { console.warn("Politique Amériques indisponible :", e); }),
    fetchFirstAvailablePol(oceaniaPolPaths).then(function(data) { onPolContinentLoaded("Océanie", data); }).catch(function(e) { console.warn("Politique Océanie indisponible :", e); })
];

Promise.allSettled(polLoads).then(function() {
    window.politicalLoading = false;
    console.log("Module POLITIQUE prêt. Total pays chargés : " + Object.keys(window.politicalData).length);
    if (typeof window.buildSearchIndex === "function") {
        window.buildSearchIndex();
    }
});

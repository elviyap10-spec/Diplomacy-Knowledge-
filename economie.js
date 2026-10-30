// ========================================
// DIPLOMACY LAB — MODULE ÉCONOMIE
// CHARGEUR DE DONNÉES MULTI-CONTINENTS RÉSILIANT
// ========================================

window.economyData = window.economyData || {};
window.economyLoading = true;
window.economyLoaded = false;

function fetchFirstAvailable(paths) {
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
            return fetchFirstAvailable(paths.slice(1));
        });
}

// Chemins résilients pour chaque continent (priorité aux fichiers racine téléversés)
const europePaths = [
    "europe_economie.json",
    "europe.json",
    "data/europe_economie.json",
    "data/economie/europe.json",
    "data/europe.json"
];

const africaPaths = [
    "africa_economie.json",
    "africa.json",
    "data/africa_economie.json",
    "data/economie/africa.json",
    "data/africa.json"
];

const asiaPaths = [
    "asia_economie.json",
    "asia.json",
    "data/asia_economie.json",
    "data/economie/asia.json",
    "data/asia.json"
];

const americaPaths = [
    "america_economie.json",
    "america.json",
    "data/america_economie.json",
    "data/economie/america.json",
    "data/america.json"
];

const oceaniaPaths = [
    "oceania_economie.json",
    "oceania.json",
    "data/oceania_economie.json",
    "data/economie/oceania.json",
    "data/oceania.json"
];

function onContinentLoaded(continentName, data) {
    Object.assign(window.economyData, data);
    window.economyLoaded = true;
    console.log("Module ÉCONOMIE : " + continentName + " chargée avec succès (" + Object.keys(data).length + " pays).");
    if (typeof window.renderCountryContent === "function" && window.currentSelectedIso3) {
        window.renderCountryContent(window.currentSelectedIso3, window.currentSelectedName);
    }
}

// Lancement simultané des chargements
const continentLoads = [
    fetchFirstAvailable(europePaths).then(function(data) { onContinentLoaded("Europe", data); }).catch(function(e) { console.warn("Économie Europe indisponible :", e); }),
    fetchFirstAvailable(africaPaths).then(function(data) { onContinentLoaded("Afrique", data); }).catch(function(e) { console.warn("Économie Afrique indisponible :", e); }),
    fetchFirstAvailable(asiaPaths).then(function(data) { onContinentLoaded("Asie", data); }).catch(function(e) { console.warn("Économie Asie indisponible :", e); }),
    fetchFirstAvailable(americaPaths).then(function(data) { onContinentLoaded("Amériques", data); }).catch(function(e) { console.warn("Économie Amériques indisponible :", e); }),
    fetchFirstAvailable(oceaniaPaths).then(function(data) { onContinentLoaded("Océanie", data); }).catch(function(e) { console.warn("Économie Océanie indisponible :", e); })
];

Promise.allSettled(continentLoads).then(function() {
    window.economyLoading = false;
    console.log("Module ÉCONOMIE prêt. Total pays chargés : " + Object.keys(window.economyData).length);
});

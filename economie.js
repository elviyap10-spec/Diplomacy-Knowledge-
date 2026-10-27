// ========================================
// DIPLOMACY LAB — MODULE ÉCONOMIE
// CHARGEUR DE DONNÉES (par continent)
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

// Emplacement prioritaire immédiat
const europePaths = [
    "data/europe_economie.json",
    "data/economie/europe.json",
    "data/europe.json",
    "europe_economie.json",
    "europe.json"
];

fetchFirstAvailable(europePaths)
    .then(function(data) {
        window.economyLoading = false;
        window.economyLoaded = true;
        Object.assign(window.economyData, data);
        console.log(
            "Module ÉCONOMIE : Europe chargée avec succès (" +
            Object.keys(data).length + " pays)."
        );
        // Si un pays est déjà ouvert dans le panneau latéral, le rafraîchir instantanément
        if (typeof window.renderCountryContent === "function" && window.currentSelectedIso3) {
            window.renderCountryContent(window.currentSelectedIso3, window.currentSelectedName);
        }
    })
    .catch(function(error) {
        window.economyLoading = false;
        console.warn("Module ÉCONOMIE : données non trouvées", error);
    });

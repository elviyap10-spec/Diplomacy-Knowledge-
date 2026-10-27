// ========================================
// DIPLOMACY LAB — MODULE ÉCONOMIE
// CHARGEUR DE DONNÉES (par continent)
// ========================================

window.economyData = window.economyData || {};

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

// Chemins pris en charge pour l'Europe (tolérance maximale d'emplacement)
const europePaths = [
    "data/economie/europe.json",
    "data/europe_economie.json",
    "data/europe.json",
    "europe_economie.json",
    "europe.json"
];

fetchFirstAvailable(europePaths)
    .then(function(data) {
        Object.assign(window.economyData, data);
        console.log(
            "Module ÉCONOMIE : Europe chargée avec succès (" +
            Object.keys(data).length + " pays)."
        );
        // Si un pays est déjà ouvert dans le panneau, rafraîchir la vue
        if (typeof window.switchPanelView === "function" && window.currentActiveView === "economy") {
            window.switchPanelView("economy");
        }
    })
    .catch(function(error) {
        console.warn("Module ÉCONOMIE : données non trouvées", error);
    });

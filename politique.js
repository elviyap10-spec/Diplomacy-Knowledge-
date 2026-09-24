// ========================================
// DIPLOMACY LAB — MODULE POLITIQUE
// CHARGEUR DE DONNÉES (par continent)
// ========================================


window.politicalData = {};


const dataFiles = [
    "data/politique/africa.json",
    "data/politique/europe.json",
    "data/politique/asia.json",
    "data/politique/americas.json",
    "data/politique/oceania.json"
];


Promise.allSettled(

    dataFiles.map(function(file) {

        return fetch(file)

            .then(function(response) {

                if (!response.ok) {

                    throw new Error(
                        "Fichier introuvable : " + file
                    );

                }

                return response.json();

            })

            .then(function(data) {

                Object.assign(
                    window.politicalData,
                    data
                );

                console.log(
                    "Chargé :",
                    file,
                    "(" + Object.keys(data).length + " pays)"
                );

            })

            .catch(function(error) {

                // Un fichier en erreur n'empêche pas les autres
                // de se charger.

                console.error(
                    "Erreur de chargement :",
                    file,
                    error
                );

            });

    })

)

.then(function() {

    console.log(
        "Module POLITIQUE chargé.",
        Object.keys(window.politicalData).length,
        "pays au total."
    );

});

// ==========================================================================
// DIPLOMACY LAB — SCRIPT PRINCIPAL COMMUN (MAIN.JS)
// Gestion du thème clair/sombre, de la navigation et de la synchronisation XP
// ==========================================================================

(function() {
  function initTheme() {
    const themeBtn = document.getElementById("themeToggle");
    const themeIcon = document.getElementById("themeIcon");
    const themeText = document.getElementById("themeText");
    const savedTheme = localStorage.getItem("diplomacy_theme") || "light";

    function applyTheme(theme) {
      if (theme === "dark") {
        document.documentElement.setAttribute("data-theme", "dark");
        if (themeIcon) themeIcon.textContent = "☀️";
        if (themeText) themeText.textContent = "Papier";
      } else {
        document.documentElement.removeAttribute("data-theme");
        if (themeIcon) themeIcon.textContent = "🌙";
        if (themeText) themeText.textContent = "Nuit";
      }
      localStorage.setItem("diplomacy_theme", theme);
    }

    applyTheme(savedTheme);

    if (themeBtn) {
      themeBtn.addEventListener("click", function() {
        const current = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
        applyTheme(current);
      });
    }
  }

  // Initialisation du suivi de lecture de concept pour XP
  function initConceptReading() {
    const pageBody = document.querySelector("[data-concept-id]");
    if (pageBody && window.ProgressManager) {
      const cId = pageBody.getAttribute("data-concept-id");
      // Attribution de +15 XP après 6 secondes de lecture
      setTimeout(function() {
        window.ProgressManager.markConceptRead(cId);
      }, 6000);
    }
  }

  document.addEventListener("DOMContentLoaded", function() {
    initTheme();
    initConceptReading();
  });
})();

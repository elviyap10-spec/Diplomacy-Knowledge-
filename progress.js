// ==========================================================================
// DIPLOMACY LAB — SYSTÈME DE PROGRESSION & GAMIFICATION (PROGRESS.JS)
// Gestion des points d'expérience (XP), concepts étudiés, quiz et badges
// Sauvegarde persistante locale via localStorage
// ==========================================================================

(function() {
  const STORAGE_KEY = "diplomacy_lab_progress_v1";

  const defaultState = {
    xp: 0,
    conceptsRead: {},
    quizzesCompleted: {},
    badges: [],
    level: 1,
    lastActive: new Date().toISOString()
  };

  const BADGE_DEFINITIONS = [
    {
      id: "premier-pas",
      title: "Premier Pas Diplomatique",
      desc: "Avoir exploré votre premier grand concept de relations internationales.",
      icon: "🌱"
    },
    {
      id: "maitre-westphalie",
      title: "Traité de Westphalie",
      desc: "Avoir validé avec succès le quiz sur la Souveraineté.",
      icon: "🏛️"
    },
    {
      id: "stratege-puissance",
      title: "Stratège Réaliste",
      desc: "Avoir validé le quiz sur la Puissance et les rapports de force.",
      icon: "⚡"
    },
    {
      id: "cent-xp",
      title: "Attaché d'Ambassade",
      desc: "Avoir accumulé plus de 100 points d'expérience (XP).",
      icon: "🎖️"
    },
    {
      id: "grand-diplomate",
      title: "Ambassadeur Plénipotentiaire",
      desc: "Avoir exploré tous les grands concepts fondamentaux.",
      icon: "🌍"
    }
  ];

  function loadState() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return Object.assign({}, defaultState, JSON.parse(saved));
      }
    } catch (e) {
      console.warn("Impossible de charger la progression :", e);
    }
    return Object.assign({}, defaultState);
  }

  function saveState(state) {
    try {
      state.lastActive = new Date().toISOString();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn("Impossible de sauvegarder la progression :", e);
    }
  }

  const ProgressManager = {
    getState: function() {
      return loadState();
    },

    getXP: function() {
      return loadState().xp;
    },

    addXP: function(amount, reason) {
      const state = loadState();
      state.xp = (state.xp || 0) + amount;
      this.checkBadges(state);
      saveState(state);
      this.syncHeaderXP();
      console.log(`[Diplomacy Lab] +${amount} XP accordés (${reason}). Total : ${state.xp} XP`);
      return state.xp;
    },

    markConceptRead: function(conceptId) {
      const state = loadState();
      if (!state.conceptsRead[conceptId]) {
        state.conceptsRead[conceptId] = new Date().toISOString();
        state.xp = (state.xp || 0) + 15; // +15 XP première lecture
        this.checkBadges(state);
        saveState(state);
        this.syncHeaderXP();
      }
    },

    saveQuizResult: function(conceptId, score, maxScore, earnedXP) {
      const state = loadState();
      const previous = state.quizzesCompleted[conceptId] || { bestScore: 0 };
      const isNewBest = score > previous.bestScore;

      state.quizzesCompleted[conceptId] = {
        lastScore: score,
        maxScore: maxScore,
        bestScore: Math.max(previous.bestScore, score),
        date: new Date().toISOString()
      };

      if (earnedXP > 0) {
        state.xp = (state.xp || 0) + earnedXP;
      }

      this.checkBadges(state, conceptId, score, maxScore);
      saveState(state);
      this.syncHeaderXP();

      return {
        bestScore: state.quizzesCompleted[conceptId].bestScore,
        totalXP: state.xp
      };
    },

    checkBadges: function(state, lastConcept, lastScore, lastMax) {
      state.badges = state.badges || [];

      // Badge 1 : Premier pas
      if (Object.keys(state.conceptsRead).length >= 1 && !state.badges.includes("premier-pas")) {
        state.badges.push("premier-pas");
      }

      // Badge 2 : Westphalie
      if (lastConcept === "souverainete" && lastScore >= (lastMax * 0.7) && !state.badges.includes("maitre-westphalie")) {
        state.badges.push("maitre-westphalie");
      }

      // Badge 3 : Puissance
      if (lastConcept === "puissance" && lastScore >= (lastMax * 0.7) && !state.badges.includes("stratege-puissance")) {
        state.badges.push("stratege-puissance");
      }

      // Badge 4 : 100 XP
      if (state.xp >= 100 && !state.badges.includes("cent-xp")) {
        state.badges.push("cent-xp");
      }

      // Badge 5 : Tous les concepts
      const coreConcepts = ["souverainete", "puissance", "interet-national", "anarchie-internationale", "interdependance"];
      const allRead = coreConcepts.every(c => state.conceptsRead[c]);
      if (allRead && !state.badges.includes("grand-diplomate")) {
        state.badges.push("grand-diplomate");
      }
    },

    getEarnedBadges: function() {
      const state = loadState();
      return BADGE_DEFINITIONS.filter(b => (state.badges || []).includes(b.id));
    },

    syncHeaderXP: function() {
      const state = loadState();
      const elements = document.querySelectorAll(".user-xp-count, #headerXP");
      elements.forEach(el => {
        el.textContent = `${state.xp} XP`;
      });
    }
  };

  window.ProgressManager = ProgressManager;

  // Synchronisation automatique au chargement de la page
  document.addEventListener("DOMContentLoaded", function() {
    ProgressManager.syncHeaderXP();
  });
})();

/**
 * DIPLOMACY LAB — COMMAND PALETTE & RECHERCHE GLOBALE (CTRL + K)
 * Moteur de recherche instantané et modal interactif pour parcourir l'ensemble
 * des 10 concepts, dossiers, traités, penseurs majeurs et pays de l'Atlas.
 */

(function () {
  "use strict";

  // 1. BASE DE DONNÉES ACADÉMIQUE DE RECHERCHE
  const SEARCH_INDEX = [
    // --- 10 CONCEPTS FONDAMENTAUX ---
    {
      type: "concept",
      badge: "Concept 01",
      title: "La Souveraineté",
      desc: "Autorité suprême de l'État, traités de Westphalie (1648), Jean Bodin, non-ingérence et souveraineté partagée.",
      url: "souverainete.html",
      keywords: "souverainete westphalie bodin krasner etat territoire non-ingerence independance droit"
    },
    {
      type: "concept",
      badge: "Concept 02",
      title: "La Puissance",
      desc: "Capacité d'orienter les comportements, Hard Power, Soft Power de Joseph Nye, Smart Power et puissance structurelle de Susan Strange.",
      url: "puissance.html",
      keywords: "puissance power hard soft smart nye strange coercition influence armement pib"
    },
    {
      type: "concept",
      badge: "Concept 03",
      title: "L'Intérêt National",
      desc: "Boussole de l'action extérieure, réalisme de Hans Morgenthau, raison d'État, intérêts vitaux et constructivisme.",
      url: "interet-national.html",
      keywords: "interet national morgenthau raison d etat survie wendt securite politique etrangere"
    },
    {
      type: "concept",
      badge: "Concept 04",
      title: "L'Anarchie Internationale",
      desc: "Absence de gouvernement mondial, self-help de Kenneth Waltz, état de nature de Hobbes et société anarchique d'Hedley Bull.",
      url: "anarchie-internationale.html",
      keywords: "anarchie waltz bull hobbes structure self-help ordre systemique sans juge"
    },
    {
      type: "concept",
      badge: "Concept 05",
      title: "L'Interdépendance",
      desc: "Dépendances réciproques, interdépendance complexe de Keohane & Nye, vulnérabilité et Weaponized Interdependence.",
      url: "interdependance.html",
      keywords: "interdependance keohane nye farrell newman reseaux mondialisation flux commerce swift"
    },
    {
      type: "concept",
      badge: "Concept 06",
      title: "L'Équilibre des Puissances",
      desc: "Balance of Power, David Hume, Concert européen (1815), balancing vs bandwagoning (Walt) et stabilité multipolaire.",
      url: "equilibre-des-puissances.html",
      keywords: "equilibre balance power hume waltz walt mearsheimer alliances concert vienne multipolarite"
    },
    {
      type: "concept",
      badge: "Concept 07",
      title: "Le Dilemme de Sécurité",
      desc: "Spirale d'insécurité collective involontaire, John Herz (1950), Robert Jervis (1978), avantage offensif/défensif et missiles hypersoniques.",
      url: "dilemme-de-securite.html",
      keywords: "dilemme securite herz jervis butterfield course aux armements escalade cuba hypersonique"
    },
    {
      type: "concept",
      badge: "Concept 08",
      title: "L'Hégémonie & Biens Publics",
      desc: "Théorie de la stabilité hégémonique (Kindleberger, Gilpin), approche néo-gramscienne de Cox, Pax Americana et piège de Kindleberger.",
      url: "hegemonie.html",
      keywords: "hegemonie stabilite kindleberger gilpin cox ikenberry biens publics bretton woods piege thucydide"
    },
    {
      type: "concept",
      badge: "Concept 09",
      title: "La Géopolitique & les Espaces",
      desc: "Heartland de Mackinder, Sea Power de Mahan, Rimland de Spykman, géopolitique critique d'Yves Lacoste et chokepoints maritimes.",
      url: "geopolitique.html",
      keywords: "geopolitique mackinder mahan spykman lacoste herodote detroits malacca suez arctique terre mer"
    },
    {
      type: "concept",
      badge: "Concept 10",
      title: "Le Multilatéralisme & Diplomatie",
      desc: "Principes généralisés, indivisibilité et réciprocité diffuse selon John Ruggie, crise du veto onusien, blocage OMC et minilatéralisme.",
      url: "multilateralisme.html",
      keywords: "multilateralisme ruggie barnett finnemore onu omc conference consensus minilateralisme quad aukus"
    },

    // --- GRANDS DOSSIERS GÉOPOLITIQUES ---
    {
      type: "dossier",
      badge: "Dossier M1–M2",
      title: "Ukraine & Sécurité Européenne",
      desc: "Guerre d'usure de haute intensité, faillite du veto au Conseil de sécurité, élargissement nordique de l'OTAN et géoéconomie pétrolière.",
      url: "dossier-ukraine.html",
      keywords: "ukraine russie guerre otan poutine zelensky crimée donbass budapest flotte fantome mer noire"
    },
    {
      type: "dossier",
      badge: "Dossier M1–M2",
      title: "Taïwan & Géoéconomie des Semi-conducteurs",
      desc: "Détroit de Taïwan, bouclier de silicium de TSMC, machines ASML, blocus gris et militarisation des chaînes de valeur technologiques.",
      url: "dossier-taiwan.html",
      keywords: "taiwan chine tsmc asml semi-conducteurs puces detroit chips act silicium premier chaine iles"
    },
    {
      type: "dossier",
      badge: "Dossier Comparatif",
      title: "Dossier Général de Référence",
      desc: "Synthèse comparative et tableau croisé des 10 concepts fondamentaux de relations internationales.",
      url: "dossier.html",
      keywords: "dossier comparatif synthese reference grille examen concours relations internationales"
    },

    // --- TRAITÉS & TEXTES DOCTRINAUX ---
    {
      type: "traite",
      badge: "Traité 1961",
      title: "Convention de Vienne sur les relations diplomatiques",
      desc: "Texte fondamental régissant l'immunité diplomatique, l'inviolabilité des ambassades et la valise diplomatique.",
      url: "convention-vienne-1961.html",
      keywords: "vienne 1961 diplomatie immunite ambassade consulat valise diplomatique persona non grata"
    },
    {
      type: "traite",
      badge: "Traité 1648",
      title: "Traités de Westphalie (Münster & Osnabrück)",
      desc: "Naissance du système des États souverains, égalité juridique et principe de non-ingérence cujus regio, ejus religio.",
      url: "souverainete.html#doctrine",
      keywords: "westphalie 1648 paix munster osnabruck bodin souverainete non-ingerence"
    },
    {
      type: "traite",
      badge: "Traité 1945",
      title: "Charte des Nations Unies & Chapitre VII",
      desc: "Fondement de la sécurité collective, interdiction de la force (Article 2§4) et droit de veto des 5 membres permanents (Article 27§3).",
      url: "multilateralisme.html#theorie",
      keywords: "charte onu 1945 san francisco article 2 4 chapitre 7 veto p5 securite collective"
    },
    {
      type: "traite",
      badge: "Accord 1944",
      title: "Accords de Bretton Woods",
      desc: "Création du FMI, de la Banque mondiale, étalon de change-or sur le dollar et fondation de l'ordre économique libéral.",
      url: "hegemonie.html#cas-pratiques",
      keywords: "bretton woods 1944 fmi banque mondiale dollar or gatt monnaie reserve"
    },
    {
      type: "traite",
      badge: "Traité 1982",
      title: "Convention des Nations Unies sur le droit de la mer (Montego Bay)",
      desc: "Régulation des eaux territoriales (12 milles), Zones Économiques Exclusives (200 milles ZEE), et liberté de navigation dans les détroits.",
      url: "geopolitique.html#theorie",
      keywords: "montego bay unclos mer zee eaux territoriales detroits passage inoffensif plateau continental"
    },
    {
      type: "traite",
      badge: "Accord 2015",
      title: "Accord de Paris sur le Climat (COP21)",
      desc: "Architecture multilatérale hybride fondée sur les contributions nationales déterminées (NDC) et la pression par les pairs (pledge and review).",
      url: "multilateralisme.html#cas-pratiques",
      keywords: "accord paris cop21 2015 climat ndc rechauffement pledge review soft law"
    },

    // --- AUTEURS & PENSEURS MAJEURS ---
    {
      type: "auteur",
      badge: "Théorie Réaliste",
      title: "Hans J. Morgenthau (1904–1980)",
      desc: "Père fondateur du réalisme classique en relations internationales, auteur de 'Politics Among Nations' (1948) : la politique comme lutte pour la puissance.",
      url: "interet-national.html#doctrine",
      keywords: "morgenthau realisme classique puissance interet national lutte animus dominandi"
    },
    {
      type: "auteur",
      badge: "Néoréalisme",
      title: "Kenneth Waltz (1924–2013)",
      desc: "Fondateur du néoréalisme structural, auteur de 'Theory of International Politics' (1979) : l'anarchie façonne mécaniquement le comportement des États.",
      url: "anarchie-internationale.html#doctrine",
      keywords: "waltz neorealisme structural systeme anarchie polarite bipolarite multipolarite balance of power"
    },
    {
      type: "auteur",
      badge: "Libéralisme Institutionnel",
      title: "Robert O. Keohane & Joseph S. Nye",
      desc: "Penseurs de 'Power and Interdependence' (1977), fondateurs des concepts d'interdépendance complexe, de Soft Power et de régimes internationaux.",
      url: "interdependance.html#theorie",
      keywords: "keohane nye soft power hard power interdependance complexe regimes internationaux"
    },
    {
      type: "auteur",
      badge: "Économie Politique",
      title: "Charles P. Kindleberger (1910–2003)",
      desc: "Auteur de 'The World in Depression' (1973) et théoricien de la stabilité hégémonique : l'économie mondiale a besoin d'un stabilisateur unique.",
      url: "hegemonie.html#doctrine",
      keywords: "kindleberger stabilite hegemonique crise 1929 preteur dernier ressort biens publics"
    },
    {
      type: "auteur",
      badge: "Géopolitique Classique",
      title: "Halford J. Mackinder (1861–1947)",
      desc: "Théoricien du Heartland ('The Geographical Pivot of History', 1904) : qui contrôle l'Europe orientale commande le cœur du monde.",
      url: "geopolitique.html#doctrine",
      keywords: "mackinder heartland pivot geographique chemin de fer eurasie ile-monde"
    },
    {
      type: "auteur",
      badge: "Géopolitique Critique",
      title: "Yves Lacoste (1929–)",
      desc: "Fondateur de la revue 'Hérodote' et auteur de 'La géographie, ça sert, d'abord, à faire la guerre' (1976) : l'étude des rivalités de pouvoir sur des territoires.",
      url: "geopolitique.html#theorie",
      keywords: "lacoste herodote geographie guerre representations multiscalarite pouvoir territoires"
    },
    {
      type: "auteur",
      badge: "Psychologie Stratégique",
      title: "Robert Jervis (1940–2021)",
      desc: "Auteur de 'Cooperation Under the Security Dilemma' (1978) : modélisation de la différenciation attaque/défense et perceptions erronées.",
      url: "dilemme-de-securite.html#doctrine",
      keywords: "jervis dilemme securite perception attaque defense armes offensives defensives"
    },

    // --- ATLAS MONDIAL & PAYS CLÉS ---
    {
      type: "atlas",
      badge: "Atlas Mondial",
      title: "L'Atlas Mondial Interactif (203 pays)",
      desc: "Carte vectorielle Leaflet haute performance avec profils géopolitiques, PIB, population, chefs d'État et régimes politiques.",
      url: "monde.html",
      keywords: "atlas monde carte pays carte du monde interactif donnees pib population capitale"
    },
    {
      type: "atlas",
      badge: "Fiche Pays",
      title: "États-Unis d'Amérique (USA)",
      desc: "Superpuissance globale, membre permanent du Conseil de sécurité, PIB de 28 000 Mds$, privilège exorbitant du dollar.",
      url: "monde.html?iso3=USA",
      keywords: "etats-unis usa washington amerique dollar otan superpuissance"
    },
    {
      type: "atlas",
      badge: "Fiche Pays",
      title: "République Populaire de Chine (CHN)",
      desc: "Deuxième économie mondiale, membre permanent de l'ONU, projet des Nouvelles Routes de la Soie (BRI) et rivalité systémique.",
      url: "monde.html?iso3=CHN",
      keywords: "chine beijing pekin pib brics bri armee populaire malacca taiwan"
    },
    {
      type: "atlas",
      badge: "Fiche Pays",
      title: "Fédération de Russie (RUS)",
      desc: "Première puissance nucléaire par ogives déployées, membre permanent du Conseil de sécurité, profondeur eurasienne et hydrocarbures.",
      url: "monde.html?iso3=RUS",
      keywords: "russie moscou poutine kremlin nucleaire energie gaz petrole ocs brics"
    },
    {
      type: "atlas",
      badge: "Fiche Pays",
      title: "France (FRA)",
      desc: "Puissance nucléaire dotée d'un siège permanent à l'ONU, membre moteur de l'UE et de l'OTAN, deuxième domaine maritime mondial (ZEE).",
      url: "monde.html?iso3=FRA",
      keywords: "france paris ue union europeenne zee diplomatie dissuasion nucleaire quai d orsay"
    }
  ];

  // 2. INJECTION DES STYLES CSS DU MODAL
  const MODAL_CSS = `
    /* SEARCH PALETTE MODAL */
    .dl-search-overlay {
      position: fixed;
      inset: 0;
      background: rgba(12, 20, 36, 0.65);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      z-index: 99999;
      display: flex;
      align-items: flex-start;
      justify-content: center;
      padding: clamp(40px, 8vh, 100px) 16px 20px;
      opacity: 0;
      visibility: hidden;
      transition: opacity 0.2s ease, visibility 0.2s ease;
    }
    .dl-search-overlay.active {
      opacity: 1;
      visibility: visible;
    }
    .dl-search-modal {
      width: min(680px, 100%);
      background: var(--paper-card, #ffffff);
      color: var(--ink, #141c2e);
      border: 1px solid var(--line, #dedbd3);
      border-radius: 12px;
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.25);
      overflow: hidden;
      transform: translateY(-16px) scale(0.98);
      transition: transform 0.22s cubic-bezier(0.16, 1, 0.3, 1);
      display: flex;
      flex-direction: column;
      max-height: calc(88vh - 40px);
      font-family: var(--font-body, "Plus Jakarta Sans", sans-serif);
    }
    .dl-search-overlay.active .dl-search-modal {
      transform: translateY(0) scale(1);
    }
    .dl-search-head {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px 20px;
      border-bottom: 1px solid var(--line, #dedbd3);
      background: var(--paper, #f8f7f4);
    }
    .dl-search-icon {
      font-size: 18px;
      color: var(--gold, #b18a51);
      flex-shrink: 0;
    }
    .dl-search-input {
      flex: 1;
      border: none;
      background: transparent;
      font-family: inherit;
      font-size: 15px;
      font-weight: 600;
      color: var(--ink, #141c2e);
      outline: none;
    }
    .dl-search-input::placeholder {
      color: var(--muted, #647084);
      font-weight: 500;
    }
    .dl-search-close {
      background: transparent;
      border: 1px solid var(--line, #dedbd3);
      border-radius: 4px;
      padding: 4px 8px;
      font-size: 11px;
      font-weight: 700;
      color: var(--muted, #647084);
      cursor: pointer;
      transition: all 0.15s ease;
    }
    .dl-search-close:hover {
      color: var(--ink, #141c2e);
      border-color: var(--gold, #b18a51);
    }

    /* FILTRES RAPIDES */
    .dl-search-filters {
      display: flex;
      gap: 6px;
      padding: 10px 20px;
      border-bottom: 1px solid var(--line, #dedbd3);
      overflow-x: auto;
      scrollbar-width: none;
    }
    .dl-search-filters::-webkit-scrollbar { display: none; }
    .dl-filter-chip {
      background: var(--paper, #f8f7f4);
      border: 1px solid var(--line, #dedbd3);
      color: var(--muted, #647084);
      font-size: 11px;
      font-weight: 700;
      padding: 4px 10px;
      border-radius: 14px;
      cursor: pointer;
      white-space: nowrap;
      transition: all 0.15s ease;
    }
    .dl-filter-chip:hover, .dl-filter-chip.active {
      background: var(--ink, #141c2e);
      color: #ffffff;
      border-color: var(--ink, #141c2e);
    }

    /* RESULTATS */
    .dl-search-results {
      padding: 10px 12px;
      overflow-y: auto;
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .dl-search-item {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      padding: 10px 14px;
      border-radius: 8px;
      text-decoration: none;
      color: inherit;
      transition: background 0.12s ease;
      cursor: pointer;
    }
    .dl-search-item:hover, .dl-search-item.highlighted {
      background: rgba(177, 138, 81, 0.12);
    }
    .dl-item-badge {
      font-size: 10px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: .05em;
      padding: 3px 7px;
      border-radius: 4px;
      background: var(--paper, #f8f7f4);
      border: 1px solid var(--line, #dedbd3);
      color: var(--gold, #b18a51);
      white-space: nowrap;
      flex-shrink: 0;
      margin-top: 2px;
    }
    .dl-item-body {
      flex: 1;
      min-width: 0;
    }
    .dl-item-title {
      font-size: 14px;
      font-weight: 700;
      color: var(--ink, #141c2e);
      margin-bottom: 3px;
    }
    .dl-item-desc {
      font-size: 12px;
      color: var(--muted, #647084);
      line-height: 1.45;
      margin: 0;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    .dl-item-arrow {
      color: var(--gold, #b18a51);
      font-weight: 800;
      font-size: 14px;
      margin-left: 6px;
      align-self: center;
      opacity: 0;
      transition: opacity 0.15s ease;
    }
    .dl-search-item:hover .dl-item-arrow, .dl-search-item.highlighted .dl-item-arrow {
      opacity: 1;
    }

    /* EMPTY STATE */
    .dl-search-empty {
      padding: 40px 20px;
      text-align: center;
      color: var(--muted, #647084);
      font-size: 13.5px;
    }

    /* FOOTER */
    .dl-search-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      padding: 10px 20px;
      background: var(--paper, #f8f7f4);
      border-top: 1px solid var(--line, #dedbd3);
      font-size: 11px;
      color: var(--muted, #647084);
    }
    .dl-footer-hints {
      display: flex;
      gap: 14px;
      align-items: center;
    }
    .dl-footer-hints kbd {
      background: var(--paper-card, #ffffff);
      border: 1px solid var(--line, #dedbd3);
      border-radius: 3px;
      padding: 1px 5px;
      font-size: 10px;
      font-family: inherit;
      color: var(--ink, #141c2e);
      font-weight: 700;
    }

    /* BOUTON DÉCLENCHEUR DANS LA NAVBAR / TOPLINE */
    .search-trigger-btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 5px 12px;
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid rgba(255, 255, 255, 0.18);
      border-radius: 20px;
      color: #f6f2e9;
      font-family: inherit;
      font-size: 11px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .search-trigger-btn:hover {
      background: rgba(255, 255, 255, 0.16);
      border-color: var(--gold-bright, #d9af5e);
      color: #ffffff;
    }
    .search-trigger-btn .search-kbd {
      font-size: 9.5px;
      background: rgba(0, 0, 0, 0.35);
      border: 1px solid rgba(255, 255, 255, 0.25);
      border-radius: 3px;
      padding: 1px 5px;
      color: #e7cda7;
      font-weight: 800;
    }
  `;

  // 3. INJECTION DU DOM
  function initSearchPalette() {
    // Injecter CSS
    const styleEl = document.createElement("style");
    styleEl.textContent = MODAL_CSS;
    document.head.appendChild(styleEl);

    // Injecter Overlay HTML
    const overlay = document.createElement("div");
    overlay.className = "dl-search-overlay";
    overlay.id = "dlSearchOverlay";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("aria-label", "Recherche globale Diplomacy Lab");

    overlay.innerHTML = `
      <div class="dl-search-modal">
        <div class="dl-search-head">
          <span class="dl-search-icon" aria-hidden="true">🔍</span>
          <input type="text" class="dl-search-input" id="dlSearchInput" placeholder="Rechercher un concept, dossier, traité, auteur ou pays... (Ctrl + K)" autocomplete="off" spellcheck="false">
          <button class="dl-search-close" id="dlSearchCloseBtn" type="button" aria-label="Fermer la recherche">Échap</button>
        </div>
        <div class="dl-search-filters">
          <button class="dl-filter-chip active" data-filter="all">Tous</button>
          <button class="dl-filter-chip" data-filter="concept">10 Concepts</button>
          <button class="dl-filter-chip" data-filter="dossier">Grands Dossiers</button>
          <button class="dl-filter-chip" data-filter="traite">Traités & Textes</button>
          <button class="dl-filter-chip" data-filter="auteur">Auteurs Cardinaux</button>
          <button class="dl-filter-chip" data-filter="atlas">Atlas Mondial</button>
        </div>
        <div class="dl-search-results" id="dlSearchResults"></div>
        <div class="dl-search-footer">
          <div class="dl-footer-hints">
            <span><kbd>↑</kbd> <kbd>↓</kbd> Naviguer</span>
            <span><kbd>↵</kbd> Ouvrir</span>
            <span><kbd>Échap</kbd> Fermer</span>
          </div>
          <div>Diplomacy Lab · 2026</div>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);

    // Éléments du modal
    const input = document.getElementById("dlSearchInput");
    const resultsContainer = document.getElementById("dlSearchResults");
    const closeBtn = document.getElementById("dlSearchCloseBtn");
    const filterChips = overlay.querySelectorAll(".dl-filter-chip");

    let currentFilter = "all";
    let highlightedIndex = 0;
    let filteredData = [];

    // Rendu des résultats
    function renderResults() {
      const q = input.value.trim().toLowerCase();
      
      filteredData = SEARCH_INDEX.filter(item => {
        const matchesFilter = currentFilter === "all" || item.type === currentFilter;
        if (!matchesFilter) return false;
        if (!q) return true; // Si vide, affiche les suggestions
        const hay = (item.title + " " + item.desc + " " + item.keywords).toLowerCase();
        return hay.includes(q);
      });

      if (filteredData.length === 0) {
        resultsContainer.innerHTML = `
          <div class="dl-search-empty">
            <p>Aucun résultat trouvé pour « <strong>${escapeHTML(q)}</strong> ».</p>
            <p style="font-size: 12px; margin-top: 6px;">Essayez avec un mot-clé comme <em>Waltz</em>, <em>Souveraineté</em>, <em>Ukraine</em>, <em>Vienne</em> ou <em>Chine</em>.</p>
          </div>
        `;
        return;
      }

      highlightedIndex = Math.min(highlightedIndex, filteredData.length - 1);
      if (highlightedIndex < 0) highlightedIndex = 0;

      let html = "";
      filteredData.forEach((item, idx) => {
        const isHighlight = idx === highlightedIndex ? "highlighted" : "";
        html += `
          <a href="${item.url}" class="dl-search-item ${isHighlight}" data-idx="${idx}">
            <span class="dl-item-badge">${item.badge}</span>
            <div class="dl-item-body">
              <div class="dl-item-title">${item.title}</div>
              <p class="dl-item-desc">${item.desc}</p>
            </div>
            <span class="dl-item-arrow" aria-hidden="true">→</span>
          </a>
        `;
      });
      resultsContainer.innerHTML = html;

      // Click event
      resultsContainer.querySelectorAll(".dl-search-item").forEach(el => {
        el.addEventListener("mouseenter", () => {
          highlightedIndex = parseInt(el.dataset.idx, 10);
          updateHighlight();
        });
      });
    }

    function updateHighlight() {
      resultsContainer.querySelectorAll(".dl-search-item").forEach((el, idx) => {
        el.classList.toggle("highlighted", idx === highlightedIndex);
      });
    }

    function openModal() {
      overlay.classList.add("active");
      document.body.style.overflow = "hidden";
      input.value = "";
      highlightedIndex = 0;
      renderResults();
      setTimeout(() => input.focus(), 60);
    }

    function closeModal() {
      overlay.classList.remove("active");
      document.body.style.overflow = "";
    }

    // Gestion des filtres
    filterChips.forEach(chip => {
      chip.addEventListener("click", () => {
        filterChips.forEach(c => c.classList.remove("active"));
        chip.classList.add("active");
        currentFilter = chip.dataset.filter;
        highlightedIndex = 0;
        renderResults();
      });
    });

    // Événements de saisie et clavier
    input.addEventListener("input", () => {
      highlightedIndex = 0;
      renderResults();
    });

    closeBtn.addEventListener("click", closeModal);
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) closeModal();
    });

    // Navigation clavier dans le modal
    window.addEventListener("keydown", (e) => {
      // Raccourci d'ouverture : Ctrl + K ou Cmd + K ou / (hors champ de saisie)
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (overlay.classList.contains("active")) {
          closeModal();
        } else {
          openModal();
        }
        return;
      }

      if (!overlay.classList.contains("active")) {
        // Appui sur '/' pour ouvrir si pas déjà dans un input
        if (e.key === "/" && !["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)) {
          e.preventDefault();
          openModal();
        }
        return;
      }

      // Clavier quand modal ouvert
      if (e.key === "Escape") {
        e.preventDefault();
        closeModal();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        if (highlightedIndex < filteredData.length - 1) {
          highlightedIndex++;
          updateHighlight();
          scrollHighlightedIntoView();
        }
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        if (highlightedIndex > 0) {
          highlightedIndex--;
          updateHighlight();
          scrollHighlightedIntoView();
        }
      } else if (e.key === "Enter") {
        if (filteredData[highlightedIndex]) {
          e.preventDefault();
          window.location.href = filteredData[highlightedIndex].url;
        }
      }
    });

    function scrollHighlightedIntoView() {
      const activeEl = resultsContainer.querySelector(".dl-search-item.highlighted");
      if (activeEl) {
        activeEl.scrollIntoView({ block: "nearest", behavior: "smooth" });
      }
    }

    function escapeHTML(str) {
      return str.replace(/[&<>'"]/g, tag => ({
        "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;"
      }[tag] || tag));
    }

    // Connecter tous les boutons ou déclencheurs avec data-search-trigger ou id openSearchBtn
    document.querySelectorAll("#openSearchBtn, [data-search-trigger]").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        openModal();
      });
    });

    // Exposer l'ouverture globale sur window
    window.openDiplomacySearch = openModal;
  }

  // Initialisation au chargement du DOM
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initSearchPalette);
  } else {
    initSearchPalette();
  }
})();

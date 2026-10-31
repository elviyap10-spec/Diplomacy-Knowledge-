// ==========================================================================
// DIPLOMACY LAB — MOTEUR DE QUIZ UNIFIÉ & RÉUTILISABLE (QUIZ-ENGINE.JS)
// Mécaniques inspirées de Duolingo : progression steppée, rétroaction immédiate,
// attributions de points d'expérience (XP) et scénarios diplomatiques interactifs
// ==========================================================================

(function() {
  function DiplomacyQuiz(config) {
    this.container = document.getElementById(config.containerId);
    if (!this.container) {
      console.error("Quiz container not found:", config.containerId);
      return;
    }
    this.conceptId = config.conceptId || "general";
    this.conceptTitle = config.conceptTitle || "Quiz Diplomatique";
    this.questions = config.questions || [];
    this.currentIndex = 0;
    this.score = 0;
    this.selectedOption = null;
    this.earnedXP = 0;

    this.init();
  }

  DiplomacyQuiz.prototype.init = function() {
    this.currentIndex = 0;
    this.score = 0;
    this.earnedXP = 0;
    this.selectedOption = null;
    this.renderQuestion();
  };

  DiplomacyQuiz.prototype.renderQuestion = function() {
    if (this.currentIndex >= this.questions.length) {
      this.renderResults();
      return;
    }

    const q = this.questions[this.currentIndex];
    const progressPercent = ((this.currentIndex) / this.questions.length) * 100;
    const qNum = this.currentIndex + 1;
    const total = this.questions.length;

    this.container.innerHTML = `
      <div class="quiz-engine-wrapper" id="quizInner">
        <div class="quiz-top-bar">
          <div class="quiz-progress-track" title="Progression : ${qNum}/${total}">
            <div class="quiz-progress-fill" style="width: ${progressPercent}%;"></div>
          </div>
          <div class="quiz-xp-indicator">
            <span>⚡</span> <span>+10 XP / question</span>
          </div>
        </div>

        <div class="quiz-scenario-tag">${q.tag || "Question " + qNum + " sur " + total}</div>
        <h3 class="quiz-prompt">${q.prompt}</h3>

        <div class="quiz-options-grid" id="quizOptionsList">
          ${q.options.map((opt, i) => `
            <button type="button" class="quiz-option-btn" data-index="${i}">
              <span class="quiz-option-key">${String.fromCharCode(65 + i)}</span>
              <span>${opt}</span>
            </button>
          `).join("")}
        </div>

        <div class="quiz-feedback-drawer" id="quizFeedbackDrawer">
          <div class="feedback-headline" id="feedbackHeadline"></div>
          <div class="feedback-explanation" id="feedbackExplanation"></div>
          <button type="button" class="quiz-primary-btn" id="feedbackNextBtn">Continuer →</button>
        </div>

        <div class="quiz-actions" id="quizActionRow">
          <button type="button" class="quiz-primary-btn" id="quizValidateBtn" disabled>Vérifier la réponse</button>
        </div>
      </div>
    `;

    this.bindEvents();
  };

  DiplomacyQuiz.prototype.bindEvents = function() {
    const self = this;
    const optionBtns = this.container.querySelectorAll(".quiz-option-btn");
    const validateBtn = this.container.getElementById("quizValidateBtn");
    const drawer = this.container.getElementById("quizFeedbackDrawer");
    const headline = this.container.getElementById("feedbackHeadline");
    const explanation = this.container.getElementById("feedbackExplanation");
    const nextBtn = this.container.getElementById("feedbackNextBtn");
    const actionRow = this.container.getElementById("quizActionRow");

    optionBtns.forEach(btn => {
      btn.addEventListener("click", function() {
        if (self.answered) return;
        optionBtns.forEach(b => b.classList.remove("selected"));
        this.classList.add("selected");
        self.selectedOption = parseInt(this.getAttribute("data-index"), 10);
        validateBtn.disabled = false;
      });
    });

    validateBtn.addEventListener("click", function() {
      if (self.selectedOption === null || self.answered) return;
      self.answered = true;
      const q = self.questions[self.currentIndex];
      const isCorrect = (self.selectedOption === q.correctIndex);

      optionBtns.forEach((btn, idx) => {
        btn.disabled = true;
        if (idx === q.correctIndex) {
          btn.classList.add("correct");
        } else if (idx === self.selectedOption && !isCorrect) {
          btn.classList.add("wrong");
        }
      });

      actionRow.style.display = "none";
      drawer.style.display = "block";

      if (isCorrect) {
        self.score++;
        self.earnedXP += 10;
        drawer.className = "quiz-feedback-drawer success";
        headline.innerHTML = "✓ Excellent raisonnement diplomatique !";
        explanation.textContent = q.explanation;
      } else {
        drawer.className = "quiz-feedback-drawer error";
        headline.innerHTML = "✕ Point de doctrine incorrect";
        explanation.textContent = q.explanation;
      }

      nextBtn.focus();
    });

    nextBtn.addEventListener("click", function() {
      self.answered = false;
      self.selectedOption = null;
      self.currentIndex++;
      self.renderQuestion();
    });
  };

  DiplomacyQuiz.prototype.renderResults = function() {
    const total = this.questions.length;
    const ratio = this.score / total;
    let title = "Évaluation terminée";
    let message = "";
    let crown = "🎖️";

    if (ratio === 1) {
      crown = "👑";
      title = "Maîtrise Parfaite !";
      message = `Félicitations, vous maîtrisez avec rigueur toutes les dimensions du concept de ${this.conceptTitle}.`;
      this.earnedXP += 15; // Bonus sans-faute
    } else if (ratio >= 0.6) {
      crown = "🏅";
      title = "Compétence Validée";
      message = `Solide compréhension des enjeux fondamentaux. Quelques nuances théoriques restent à consolider.`;
    } else {
      crown = "📖";
      title = "Notions à consolider";
      message = `Nous vous conseillons de relire la section "L'essentiel" du cours avant de retenter l'évaluation.`;
    }

    // Enregistrement dans le gestionnaire de progression
    let savedSummary = { totalXP: this.earnedXP };
    if (window.ProgressManager) {
      savedSummary = window.ProgressManager.saveQuizResult(
        this.conceptId,
        this.score,
        total,
        this.earnedXP
      );
    }

    this.container.innerHTML = `
      <div class="quiz-engine-wrapper">
        <div class="quiz-result-card">
          <div class="result-crown">${crown}</div>
          <h3>${title}</h3>
          <p>${message}</p>

          <div class="result-stats-row">
            <div class="result-stat-box">
              <div class="result-stat-num">${this.score} / ${total}</div>
              <div class="result-stat-label">Score obtenu</div>
            </div>
            <div class="result-stat-box">
              <div class="result-stat-num">+${this.earnedXP} XP</div>
              <div class="result-stat-label">Gain d'expérience</div>
            </div>
            <div class="result-stat-box">
              <div class="result-stat-num">${savedSummary.totalXP || this.earnedXP} XP</div>
              <div class="result-stat-label">Total compte</div>
            </div>
          </div>

          <div style="display:flex; justify-content:center; gap:14px; flex-wrap:wrap;">
            <button type="button" class="quiz-primary-btn" id="retryQuizBtn">Recommencer l'évaluation</button>
            <a href="#introduction" class="quiz-primary-btn" style="background:var(--paper); color:var(--ink); border:1px solid var(--line);">Relire le cours</a>
          </div>
        </div>
      </div>
    `;

    const self = this;
    const retryBtn = this.container.getElementById("retryQuizBtn");
    if (retryBtn) {
      retryBtn.addEventListener("click", function() {
        self.init();
      });
    }
  };

  window.DiplomacyQuiz = DiplomacyQuiz;
})();

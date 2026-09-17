
const CONFIG = {
  whatsappNumber: "5571981305976", 
  formspreeEndpoint: "", // <-- opcional
};

/* ESTADO */
const state = {
  dietaryProfile: {
    hasRestrictions: false,
    restrictionsList: [],
    notes: "",
  },
  vibeAnswer: null, // "casa" | "explorar" | null
  selectedIds: [], // ids de EXPERIENCES selecionados (1, ou 2 durante desempate)
  customIdeaText: "",
  selectedDate: null, // { iso: "2026-09-20", label: "Sábado, 20 de set" } | null
};

const SCREEN_ORDER = ["welcome", "thermometer", "menu", "calendar", "confirm"];

// Quantos fins de semana à frente mostrar no calendário
const WEEKENDS_TO_SHOW = 4;

/*NAVEGAÇÃO ENTRE TELAS */
function showScreen(name) {
  document.querySelectorAll(".screen").forEach((el) => {
    el.classList.toggle("is-active", el.dataset.screen === name);
  });
  updateProgressDots(name);
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function updateProgressDots(name) {
  const currentIndex = SCREEN_ORDER.indexOf(name);
  document.querySelectorAll(".dot").forEach((dot) => {
    const dotIndex = SCREEN_ORDER.indexOf(dot.dataset.step);
    dot.classList.toggle("is-active", dotIndex === currentIndex);
    dot.classList.toggle("is-done", dotIndex !== -1 && dotIndex < currentIndex);
  });
}

/* 1. TELA DE BOAS-VINDAS / CHECK-IN */
function initWelcomeScreen() {
  const chipRow = document.getElementById("dietary-chips");
  chipRow.addEventListener("click", (e) => {
    const chip = e.target.closest(".chip");
    if (!chip) return;
    chip.classList.toggle("is-selected");
  });

  document.getElementById("btn-to-thermometer").addEventListener("click", () => {
    const selectedChips = [...chipRow.querySelectorAll(".chip.is-selected")].map(
      (c) => c.dataset.value
    );
    const notes = document.getElementById("dietary-notes").value.trim();

    state.dietaryProfile = {
      hasRestrictions: selectedChips.length > 0 || notes.length > 0,
      restrictionsList: selectedChips,
      notes,
    };

    showScreen("thermometer");
  });
}

/*  2. TERMÔMETRO DO CLIMA */
function initThermometerScreen() {
  document.getElementById("thermometer-question").textContent =
    THERMOMETER_QUESTION.question;

  const wrap = document.getElementById("vibe-options");
  wrap.innerHTML = "";

  THERMOMETER_QUESTION.options.forEach((opt) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "vibe-option";
    btn.dataset.value = opt.value;
    btn.innerHTML = `<span class="vibe-emoji">${opt.emoji}</span>${opt.label}`;
    btn.addEventListener("click", () => {
      state.vibeAnswer = opt.value;
      renderExperienceCards();
      showScreen("menu");
    });
    wrap.appendChild(btn);
  });

  document.getElementById("btn-skip-thermometer").addEventListener("click", () => {
    state.vibeAnswer = null;
    renderExperienceCards();
    showScreen("menu");
  });
}

/* 3. MENU DE EXPERIÊNCIAS */
function renderExperienceCards() {
  const grid = document.getElementById("cards-grid");
  grid.innerHTML = "";

  // Se houver resposta do termômetro, mostra primeiro as experiências com a vibe correspondente, mas sem esconder as outras.
  const sorted = [...EXPERIENCES].sort((a, b) => {
    if (!state.vibeAnswer) return 0;
    const aMatch = a.vibe === state.vibeAnswer ? 0 : 1;
    const bMatch = b.vibe === state.vibeAnswer ? 0 : 1;
    return aMatch - bMatch;
  });

  sorted.forEach((exp) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "exp-card";
    card.dataset.id = exp.id;
    card.setAttribute("aria-pressed", "false");

    card.innerHTML = `
      <span class="exp-emoji">${exp.emoji}</span>
      <span>
        <span class="exp-title">${exp.title}</span>
        <p class="exp-desc">${exp.description}</p>
        ${exp.isMystery ? `<span class="exp-mystery-tag">🎲 Encontro surpresa</span>` : ""}
      </span>
    `;

    card.addEventListener("click", () => toggleCardSelection(exp.id, card));
    grid.appendChild(card);
  });

  refreshMenuControls();
}

function toggleCardSelection(id, cardEl) {
  const isSelected = state.selectedIds.includes(id);

  if (isSelected) {
    state.selectedIds = state.selectedIds.filter((x) => x !== id);
  } else {
    // Permite no máximo 2 selecionadas (para a roleta de desempate)
    if (state.selectedIds.length >= 2) {
      state.selectedIds.shift();
    }
    state.selectedIds.push(id);
  }

  document.querySelectorAll(".exp-card").forEach((el) => {
    const selected = state.selectedIds.includes(el.dataset.id);
    el.classList.toggle("is-selected", selected);
    el.setAttribute("aria-pressed", String(selected));
  });

  refreshMenuControls();
}

function refreshMenuControls() {
  const tieBreak = document.getElementById("tie-break");
  const continueBtn = document.getElementById("btn-menu-continue");

  tieBreak.hidden = state.selectedIds.length !== 2;
  continueBtn.disabled = state.selectedIds.length === 0;
}

function initMenuScreen() {
  document.getElementById("btn-tie-break").addEventListener("click", runTieBreakRoulette);

  document.getElementById("btn-menu-continue").addEventListener("click", () => {
    state.customIdeaText = "";
    renderCalendar();
    showScreen("calendar");
  });

  document.getElementById("btn-to-blank").addEventListener("click", () => {
    showScreen("blank");
  });
}

/* ROLETA DE DESEMPATE */
function runTieBreakRoulette() {
  const overlay = document.getElementById("roulette-overlay");
  const wheel = document.getElementById("roulette-wheel");
  const status = document.getElementById("roulette-status");

  overlay.hidden = false;
  status.textContent = "Girando o destino...";

  const emojis = ["🎲", "🎯", "🎡", "✨", "🕯️"];
  let tick = 0;
  const spinInterval = setInterval(() => {
    wheel.textContent = emojis[tick % emojis.length];
    tick++;
  }, 120);

  setTimeout(() => {
    clearInterval(spinInterval);
    const winnerId = state.selectedIds[Math.floor(Math.random() * state.selectedIds.length)];
    const winner = EXPERIENCES.find((e) => e.id === winnerId);

    wheel.textContent = winner.emoji;
    status.textContent = `O destino escolheu: ${winner.title}`;

    setTimeout(() => {
      overlay.hidden = true;
      state.selectedIds = [winnerId];
      document.querySelectorAll(".exp-card").forEach((el) => {
        const selected = state.selectedIds.includes(el.dataset.id);
        el.classList.toggle("is-selected", selected);
        el.setAttribute("aria-pressed", String(selected));
      });
      refreshMenuControls();
    }, 1400);
  }, 1800);
}

/*  4. CAIXA EM BRANCO */
function initBlankScreen() {
  document.getElementById("btn-blank-continue").addEventListener("click", () => {
    const text = document.getElementById("custom-idea").value.trim();
    if (!text) return;
    state.customIdeaText = text;
    state.selectedIds = [];
    renderCalendar();
    showScreen("calendar");
  });

  document.getElementById("btn-back-to-menu").addEventListener("click", () => {
    showScreen("menu");
  });
}

/* ========5. CALENDÁRIO / DISPONIBILIDADE */
const DAY_NAMES = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
const MONTH_NAMES = [
  "jan", "fev", "mar", "abr", "mai", "jun",
  "jul", "ago", "set", "out", "nov", "dez",
];

function toIsoDate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function formatDayLabel(date) {
  return `${DAY_NAMES[date.getDay()]}, ${date.getDate()} de ${MONTH_NAMES[date.getMonth()]}`;
}

function formatShortLabel(date) {
  return `${date.getDate()} de ${MONTH_NAMES[date.getMonth()]}`;
}

/**
 * Gera os próximos N fins de semana a partir de hoje.
 * Retorna array de { saturday: Date, sunday: Date }.
 */
function getUpcomingWeekends(count) {
  const weekends = [];
  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);

  // Avança até o próximo sábado (se hoje já for sábado, considera hoje)
  while (cursor.getDay() !== 6) {
    cursor.setDate(cursor.getDate() + 1);
  }

  for (let i = 0; i < count; i++) {
    const saturday = new Date(cursor);
    const sunday = new Date(cursor);
    sunday.setDate(sunday.getDate() + 1);
    weekends.push({ saturday, sunday });
    cursor.setDate(cursor.getDate() + 7);
  }

  return weekends;
}

function renderCalendar() {
  const list = document.getElementById("weekend-list");
  list.innerHTML = "";

  const weekends = getUpcomingWeekends(WEEKENDS_TO_SHOW);

  weekends.forEach(({ saturday, sunday }) => {
    const group = document.createElement("div");
    group.className = "weekend-group";
    group.innerHTML = `
      <div class="weekend-group-label">Fim de semana de ${formatShortLabel(saturday)} a ${formatShortLabel(sunday)}</div>
      <div class="weekend-days"></div>
    `;

    const daysWrap = group.querySelector(".weekend-days");
    [saturday, sunday].forEach((date) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "day-btn";
      btn.dataset.iso = toIsoDate(date);
      const [dayName, dayDate] = formatDayLabel(date).split(", ");
      btn.innerHTML = `<span class="day-name">${dayName}</span><span class="day-date">${dayDate}</span>`;

      btn.addEventListener("click", () => {
        state.selectedDate = { iso: btn.dataset.iso, label: formatDayLabel(date) };
        document.querySelectorAll(".day-btn").forEach((el) => {
          el.classList.toggle("is-selected", el.dataset.iso === state.selectedDate.iso);
        });
        document.getElementById("btn-calendar-continue").disabled = false;
      });

      daysWrap.appendChild(btn);
    });

    list.appendChild(group);
  });
}

function initCalendarScreen() {
  document.getElementById("btn-calendar-continue").addEventListener("click", () => {
    showScreen("confirm");
    renderSummary();
  });

  document.getElementById("btn-skip-calendar").addEventListener("click", () => {
    state.selectedDate = null;
    document.querySelectorAll(".day-btn").forEach((el) => el.classList.remove("is-selected"));
    showScreen("confirm");
    renderSummary();
  });

  document.getElementById("btn-calendar-back").addEventListener("click", () => {
    showScreen(state.customIdeaText ? "blank" : "menu");
  });
}

/* 6. CONFIRMAÇÃO / RESUMO */
function renderSummary() {
  const box = document.getElementById("summary-box");
  const chosenExp = EXPERIENCES.find((e) => e.id === state.selectedIds[0]);

  let choiceHtml = "";
  if (chosenExp) {
    choiceHtml = `${chosenExp.emoji} ${chosenExp.title}`;
  } else if (state.customIdeaText) {
    choiceHtml = `💭 ${escapeHtml(state.customIdeaText)}`;
  }

  const restrictionsText = state.dietaryProfile.hasRestrictions
    ? [
        ...state.dietaryProfile.restrictionsList,
        state.dietaryProfile.notes,
      ]
        .filter(Boolean)
        .join(", ")
    : "Nenhuma";

  const dateText = state.selectedDate ? state.selectedDate.label : "A combinar";

  box.innerHTML = `
    <dl>
      <dt>Escolha</dt>
      <dd>${choiceHtml}</dd>
      <dt>Fim de semana</dt>
      <dd>${escapeHtml(dateText)}</dd>
      <dt>Restrições / preferências</dt>
      <dd>${escapeHtml(restrictionsText)}</dd>
    </dl>
  `;
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

function initConfirmScreen() {
  document.getElementById("btn-edit").addEventListener("click", () => {
    renderCalendar();
    if (state.selectedDate) {
      // Re-marca o dia já escolhido ao voltar pra tela de calendário
      requestAnimationFrame(() => {
        document.querySelectorAll(".day-btn").forEach((el) => {
          el.classList.toggle("is-selected", el.dataset.iso === state.selectedDate.iso);
        });
        document.getElementById("btn-calendar-continue").disabled = false;
      });
    }
    showScreen("calendar");
  });

  document.getElementById("btn-send").addEventListener("click", sendRsvp);
}

/*  7. ENVIO DO RSVP  */
function buildDateRequest() {
  const chosenExp = EXPERIENCES.find((e) => e.id === state.selectedIds[0]);
  return {
    selectedExperienceId: chosenExp ? chosenExp.id : null,
    selectedExperienceTitle: chosenExp ? chosenExp.title : null,
    customIdeaText: state.customIdeaText || null,
    dietaryProfile: state.dietaryProfile,
    selectedDate: state.selectedDate, // { iso, label } | null
    timestamp: new Date().toISOString(),
  };
}

function buildMessageText(request) {
  const lines = ["Escolha do convite:", ""];

  if (request.selectedExperienceTitle) {
    lines.push(`Opção escolhida: ${request.selectedExperienceTitle}`);
  } else if (request.customIdeaText) {
    lines.push(`Sugestão dela: ${request.customIdeaText}`);
  }

  lines.push(`Fim de semana: ${request.selectedDate ? request.selectedDate.label : "a combinar"}`);

  if (request.dietaryProfile.hasRestrictions) {
    const details = [
      ...request.dietaryProfile.restrictionsList,
      request.dietaryProfile.notes,
    ]
      .filter(Boolean)
      .join(", ");
    lines.push(`Restrições: ${details}`);
  } else {
    lines.push("Restrições: nenhuma");
  }

  return lines.join("\n");
}

async function sendRsvp() {
  const request = buildDateRequest();
  const message = buildMessageText(request);

  // Guarda uma cópia local (sempre funciona, mesmo sem configurar nada)
  try {
    localStorage.setItem("dateRequest", JSON.stringify(request));
  } catch (e) {
    /* localStorage pode falhar em modo privado; sem problema, seguimos */
  }

  // Envia por Formspree, se configurado
  if (CONFIG.formspreeEndpoint) {
    try {
      await fetch(CONFIG.formspreeEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(request),
      });
    } catch (e) {
      console.error("Falha ao enviar via Formspree:", e);
    }
  }

  // Abre o WhatsApp com a mensagem pronta, se configurado
  if (CONFIG.whatsappNumber) {
    const url = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  }

  showScreen("done");
}

/* INICIALIZAÇÃO */
document.addEventListener("DOMContentLoaded", () => {
  initWelcomeScreen();
  initThermometerScreen();
  initMenuScreen();
  initBlankScreen();
  initCalendarScreen();
  initConfirmScreen();
  showScreen("welcome");
});

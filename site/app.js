const API_BASE_URL = "https://api.gge-tracker.com/api/v1/";
const ALLIANCE_PAGES_TO_LOAD = 5;
const MAX_VISIBLE_ALLIANCES = 80;
const MAX_VISIBLE_BUILDINGS = 80;
const THEME_STORAGE_KEY = "empireBirds.theme";
const WATCHTOWER_SESSION_CACHE_KEY = "empireBirds.watchtowerResultsByAlliance";
const BOT_LOOT_STREAK_HOURS = 15;
const LOOT_STREAK_MIN_INTERVAL_HOURS = 0.75;
const LOOT_STREAK_MAX_INTERVAL_HOURS = 1.5;
const BUILDING_GROUPS_TO_SCAN = new Set(["Building", "Tower", "Gate", "Defence", "Moat", "FixedPositionBuilding"]);
const DEFENSIVE_PUBLIC_ORDER_EFFECTS = new Map([
  ["370", { label: "Strength in courtyard when defending", type: "yardPercent", cap: 130 }],
  ["620", { label: "Strength in courtyard when defending", type: "yardPercent", cap: 130 }],
  ["12108", { label: "Strength in courtyard when defending", type: "yardPercent", cap: 130 }],
  ["12306", { label: "Strength in courtyard when defending", type: "yardPercent", cap: 130 }],
  ["12510", { label: "Strength in courtyard when defending", type: "yardPercent", cap: 130 }],
  ["387", { label: "Bonus to wall defense troop capacity", type: "wallPercent", cap: 160 }],
  ["618", { label: "Bonus to wall defense troop capacity", type: "wallPercent", cap: 160 }],
  ["12107", { label: "Bonus to wall defense troop capacity", type: "wallPercent", cap: 160 }],
  ["12305", { label: "Bonus to wall defense troop capacity", type: "wallPercent", cap: 160 }],
  ["12509", { label: "Bonus to wall defense troop capacity", type: "wallPercent", cap: 160 }],
  ["420", { label: "Flat wall defense troop capacity", type: "flatWall", cap: 37500 }],
  ["371", { label: "Flat defense troop capacity", type: "flatDefense", cap: 37500 }],
  ["619", { label: "Defensive combat strength", type: "defensePercent", cap: 130 }],
  ["12109", { label: "Defensive combat strength", type: "defensePercent", cap: 130 }],
]);
const DEFENSIVE_CONSTRUCTION_ITEM_KEYWORDS = [
  "defense",
  "defence",
  "defensive",
  "defend",
  "defender",
  "defending",
  "wall",
  "gate",
  "moat",
  "courtyard",
  "castellan",
  "unitwall",
  "wallcount",
  "keepunitwallcount",
];
const NON_DEFENSIVE_CONSTRUCTION_ITEM_KEYWORDS = [
  "offensive",
  "offense",
  "offence",
  "attack",
  "attacker",
  "attacking",
  "flank",
  "research",
  "production",
  "resource",
  "loot",
  "quarry",
];
const CASTLE_TYPE_LABELS = new Map([
  [1, "Main castle"],
  [3, "Capital"],
  [4, "Outpost"],
  [12, "Realm castle"],
  [22, "Trade city"],
  [23, "Royal tower"],
  [26, "Monument"],
  [28, "Laboratory"],
]);

const SERVERS = [
  "US1",
  "WORLD1",
  "INT1",
  "INT2",
  "INT3",
  "GB1",
  "AU1",
  "DE1",
  "FR1",
  "NL1",
  "IT1",
  "ES1",
  "PT1",
  "PL1",
  "BR1",
  "TR1",
  "RO1",
  "CZ1",
  "HU1",
  "HU2",
  "SK1",
  "GR1",
  "AE1",
  "EG1",
  "SA1",
  "IN1",
  "ASIA",
  "JP1",
  "CN1",
  "HANT1",
  "RU1",
];

const state = {
  alliances: [],
  filteredAlliances: [],
  currentAlliance: null,
  activeAllianceIndex: -1,
  allianceMenuOpen: false,
  lastBirdCount: 0,
  players: [],
  server: localStorage.getItem("empireBirds.server") || "US1",
  theme: getInitialTheme(),
  tickHandle: null,
  buildingCatalog: [],
  filteredBuildingCatalog: [],
  filteredLevelBuildingCatalog: [],
  buildingItemByWod: new Map(),
  constructionItemById: new Map(),
  selectedBuildingKeys: new Set(JSON.parse(localStorage.getItem("empireBirds.buildingFilters") || "[]")),
  selectedLevelBuildingKey: localStorage.getItem("empireBirds.levelBuildingKey") || "",
  activeBuildingIndex: -1,
  activeLevelBuildingIndex: -1,
  buildingMenuOpen: false,
  levelBuildingMenuOpen: false,
  buildingScanRows: [],
  buildingLoadingPlayerIds: new Set(),
  targetLoadingPlayerIds: new Set(),
  expandedBuildingPlayerIds: new Set(),
  activePlayerDetailModes: new Map(),
  collapsedBuildingCastleKeys: new Set(),
  openTargetCastleKeys: new Set(),
  openPublicOrderCastleKeys: new Set(),
  openConstructionItemCastleKeys: new Set(),
  targetEvaluations: new Map(),
  lootActivityByPlayerKey: new Map(),
  lootActivityLoading: false,
  lootActivityRequestId: 0,
  watchtowerSelectedPlayerIds: new Set(),
  watchtowerLoadingPlayerIds: new Set(),
  watchtowerResults: new Map(),
  watchtowerResultsByAlliance: loadWatchtowerSessionCache(),
  watchtowerScanActive: false,
  watchtowerScanId: 0,
  activeAttackScoreCastleKey: "",
  activeRosterTab: "roster",
  rosterSort: {
    key: "timeLeft",
    direction: "asc",
    timeMode: "least",
  },
};

const elements = {
  form: document.querySelector("#alliance-form"),
  themeToggle: document.querySelector("#theme-toggle"),
  themeToggleLabel: document.querySelector("#theme-toggle-label"),
  serverSelect: document.querySelector("#server-select"),
  allianceInput: document.querySelector("#alliance-input"),
  toggleAlliances: document.querySelector("#toggle-alliances"),
  allianceMenu: document.querySelector("#alliance-menu"),
  allianceList: document.querySelector("#alliance-list"),
  allianceMenuCount: document.querySelector("#alliance-menu-count"),
  allianceMenuServer: document.querySelector("#alliance-menu-server"),
  allianceMenuFooter: document.querySelector("#alliance-menu-footer"),
  formHint: document.querySelector("#form-hint"),
  selectedAlliance: document.querySelector("#selected-alliance"),
  playerCount: document.querySelector("#player-count"),
  birdCount: document.querySelector("#bird-count"),
  activeMemberCount: document.querySelector("#active-member-count"),
  playersTable: document.querySelector("#players-table"),
  playerFilter: document.querySelector("#player-filter"),
  buildingInput: document.querySelector("#building-input"),
  buildingLevelInput: document.querySelector("#building-level-input"),
  toggleLevelBuildings: document.querySelector("#toggle-level-buildings"),
  buildingLevelMenu: document.querySelector("#building-level-menu"),
  buildingLevelList: document.querySelector("#building-level-list"),
  buildingLevelMenuMeta: document.querySelector("#building-level-menu-meta"),
  buildingLevelSummary: document.querySelector("#building-level-summary"),
  toggleBuildings: document.querySelector("#toggle-buildings"),
  buildingMenu: document.querySelector("#building-menu"),
  buildingList: document.querySelector("#building-list"),
  clearBuildingFilters: document.querySelector("#clear-building-filters"),
  selectedBuildings: document.querySelector("#selected-buildings"),
  watchtowerInlineStatus: document.querySelector(".watchtower-inline-status"),
  buildingFilter: document.querySelector("#building-filter"),
  buildingFilterSummary: document.querySelector("#building-filter-summary"),
  watchtowerStatus: document.querySelector("#watchtower-status"),
  watchtowerChart: document.querySelector("#watchtower-chart"),
  watchtowerSelectCount: document.querySelector("#watchtower-select-count"),
  scanWatchtowers: document.querySelector("#scan-watchtowers"),
  rosterView: document.querySelector("#roster-view"),
  attackScoreChart: document.querySelector("#attack-score-chart"),
  attackScoreView: document.querySelector("#attack-score-view"),
  watchtowerView: document.querySelector("#watchtower-view"),
};

function init() {
  applyTheme(state.theme);
  const params = new URLSearchParams(window.location.search);
  const serverFromUrl = params.get("server");
  if (serverFromUrl && SERVERS.includes(serverFromUrl.toUpperCase())) {
    state.server = serverFromUrl.toUpperCase();
    localStorage.setItem("empireBirds.server", state.server);
  }

  populateServers();
  bindEvents();
  renderThemeControls();
  const choicesPromise = loadAllianceChoices();
  void loadBuildingCatalog();
  renderScanResultViews();

  const savedAlliance = params.get("alliance") || localStorage.getItem("empireBirds.alliance");
  if (savedAlliance) {
    elements.allianceInput.value = savedAlliance;
    void choicesPromise.finally(() => loadAlliance(savedAlliance));
  }
}

function populateServers() {
  elements.serverSelect.innerHTML = SERVERS.map((server) => {
    const selected = server === state.server ? " selected" : "";
    return `<option value="${escapeHtml(server)}"${selected}>${escapeHtml(server)}</option>`;
  }).join("");
}

function getInitialTheme() {
  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
  if (savedTheme === "dark" || savedTheme === "light") return savedTheme;

  const documentTheme = document.documentElement.dataset.theme;
  if (documentTheme === "dark" || documentTheme === "light") return documentTheme;

  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function setTheme(theme) {
  state.theme = theme === "dark" ? "dark" : "light";
  localStorage.setItem(THEME_STORAGE_KEY, state.theme);
  applyTheme(state.theme);
  syncThemeUrlParam();
  renderThemeControls();
}

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme === "dark" ? "dark" : "light";
}

function renderThemeControls() {
  if (!elements.themeToggle) return;
  const darkMode = state.theme === "dark";
  elements.themeToggle.setAttribute("aria-pressed", darkMode ? "true" : "false");
  elements.themeToggle.setAttribute("aria-label", darkMode ? "Switch to light mode" : "Switch to dark mode");
  if (elements.themeToggleLabel) {
    elements.themeToggleLabel.textContent = darkMode ? "Light mode" : "Dark mode";
  }
}

function syncThemeUrlParam() {
  const url = new URL(window.location.href);
  if (!url.searchParams.has("theme")) return;
  url.searchParams.set("theme", state.theme);
  window.history.replaceState(null, "", url);
}

function bindEvents() {
  elements.themeToggle?.addEventListener("click", () => {
    setTheme(state.theme === "dark" ? "light" : "dark");
  });

  elements.form.addEventListener("submit", (event) => {
    event.preventDefault();
    const alliance = elements.allianceInput.value.trim();
    if (!alliance) {
      showToast("Choose or type an alliance first.");
      return;
    }
    void loadAlliance(alliance);
  });

  elements.serverSelect.addEventListener("change", () => {
    cacheCurrentWatchtowerResults();
    state.server = elements.serverSelect.value;
    state.currentAlliance = null;
    state.players = [];
    state.buildingScanRows = [];
    state.buildingLoadingPlayerIds = new Set();
    state.targetLoadingPlayerIds = new Set();
    state.expandedBuildingPlayerIds = new Set();
    state.activePlayerDetailModes = new Map();
    state.collapsedBuildingCastleKeys = new Set();
    state.openTargetCastleKeys = new Set();
    state.openPublicOrderCastleKeys = new Set();
    state.openConstructionItemCastleKeys = new Set();
    state.targetEvaluations = new Map();
    state.lootActivityByPlayerKey = new Map();
    state.lootActivityLoading = false;
    state.lootActivityRequestId += 1;
    resetWatchtowerScanState();
    closeAllianceMenu();
    closeBuildingMenu();
    localStorage.setItem("empireBirds.server", state.server);
    elements.playerFilter.disabled = true;
    renderAllianceData();
    renderScanResultViews();
    void loadAllianceChoices();
  });

  elements.toggleAlliances.addEventListener("click", () => {
    if (state.allianceMenuOpen) {
      closeAllianceMenu();
    } else {
      openAllianceMenu();
    }
  });

  elements.allianceInput.addEventListener("focus", () => {
    openAllianceMenu();
  });

  elements.allianceInput.addEventListener("input", () => {
    state.activeAllianceIndex = -1;
    renderAllianceMenu();
    openAllianceMenu();
  });

  elements.allianceInput.addEventListener("keydown", (event) => {
    handleAllianceInputKeydown(event);
  });

  document.addEventListener("click", (event) => {
    if (!document.querySelector("#alliance-picker").contains(event.target)) {
      closeAllianceMenu();
    }
  });

  elements.playerFilter.addEventListener("input", () => {
    keepViewportStable(elements.playerFilter, () => {
      elements.playersTable.classList.add("is-live-filtering");
      renderRosterTable();
    });
  });

  document.querySelectorAll("[data-roster-sort]").forEach((button) => {
    button.addEventListener("click", () => {
      setRosterSort(button.dataset.rosterSort);
    });
  });

  document.querySelectorAll("[data-roster-tab]").forEach((button) => {
    button.addEventListener("click", () => {
      setRosterTab(button.dataset.rosterTab);
    });
  });

  elements.scanWatchtowers.addEventListener("click", () => {
    void scanSelectedWatchtowers();
  });

  elements.toggleLevelBuildings?.addEventListener("click", () => {
    if (state.levelBuildingMenuOpen) {
      closeLevelBuildingMenu();
    } else {
      openLevelBuildingMenu();
    }
  });

  elements.buildingLevelInput?.addEventListener("focus", () => {
    openLevelBuildingMenu();
  });

  elements.buildingLevelInput?.addEventListener("input", () => {
    state.activeLevelBuildingIndex = -1;
    if (state.levelBuildingMenuOpen) {
      renderBuildingLevelSelect();
    } else {
      openLevelBuildingMenu();
    }
  });

  elements.buildingLevelInput?.addEventListener("keydown", (event) => {
    handleLevelBuildingInputKeydown(event);
  });

  elements.toggleBuildings.addEventListener("click", () => {
    if (state.buildingMenuOpen) {
      closeBuildingMenu();
    } else {
      openBuildingMenu();
    }
  });

  elements.buildingInput.addEventListener("focus", () => {
    openBuildingMenu();
  });

  elements.buildingInput.addEventListener("input", () => {
    state.activeBuildingIndex = -1;
    renderBuildingMenu();
    openBuildingMenu();
  });

  elements.buildingInput.addEventListener("keydown", (event) => {
    handleBuildingInputKeydown(event);
  });

  elements.clearBuildingFilters.addEventListener("click", () => {
    state.selectedBuildingKeys = new Set();
    persistBuildingFilters();
    renderBuildingFilters();
    renderWatchtowerStatus();
    renderRosterTable();
  });

  document.addEventListener("click", (event) => {
    if (!document.querySelector("#building-picker").contains(event.target)) {
      closeBuildingMenu();
    }
    if (!document.querySelector("#building-level-picker")?.contains(event.target)) {
      closeLevelBuildingMenu();
    }
  });

}

async function loadAllianceChoices() {
  setHint(`Loading top ${ALLIANCE_PAGES_TO_LOAD * 15} alliances...`);
  try {
    const pages = await Promise.all(
      Array.from({ length: ALLIANCE_PAGES_TO_LOAD }, (_, index) => {
        const page = index + 1;
        return apiFetch(`alliances?page=${page}&orderBy=might_current&orderType=DESC`);
      }),
    );
    const alliancesById = new Map();
    pages.flatMap((page) => page.alliances || []).forEach((alliance) => {
      alliancesById.set(String(alliance.alliance_id), alliance);
    });
    state.alliances = [...alliancesById.values()];
    renderAllianceMenu();
    setHint(`Loaded ${state.alliances.length} alliances for ${state.server}. Search the menu or type an exact name.`);
  } catch (error) {
    setHint("Could not load alliances. You can still type an exact alliance name.");
    state.alliances = [];
    renderAllianceMenu();
    showToast(error.message);
  }
}

async function loadBuildingCatalog() {
  elements.buildingFilterSummary.textContent = "Loading building catalog...";
  try {
    const items = await apiFetch("assets/items");
    const buildings = Array.isArray(items.buildings) ? items.buildings : [];
    const constructionItems = Array.isArray(items.constructionItems) ? items.constructionItems : [];
    state.buildingItemByWod = new Map(buildings.map((building) => [Number(building.wodID), building]));
    state.constructionItemById = new Map(constructionItems.map((item) => [Number(item.constructionItemID), item]));
    state.buildingCatalog = buildBuildingCatalog(buildings);
    state.selectedBuildingKeys = new Set(
      [...state.selectedBuildingKeys].filter((key) => state.buildingCatalog.some((building) => building.key === key)),
    );
    elements.buildingInput.disabled = false;
    elements.toggleBuildings.disabled = false;
    syncSelectedLevelBuildingKey();
    renderBuildingLevelSelect();
    renderBuildingMenu();
    renderBuildingFilters();
    renderWatchtowerChart();
  } catch (error) {
    elements.buildingFilterSummary.textContent = "Building catalog could not be loaded.";
    renderBuildingLevelSelect();
    showToast(error.message || "Could not load building catalog.");
  }
}

function buildBuildingCatalog(buildings) {
  const families = new Map();
  buildings.forEach((building) => {
    const group = String(building.group || "");
    const name = String(building.name || "");
    const level = Number(building.level || 0);
    if (!name || !BUILDING_GROUPS_TO_SCAN.has(group) || level <= 0) return;

    const key = `${name}|${group}`;
    const existing = families.get(key) || {
      key,
      name,
      group,
      displayName: formatBuildingName(name, group),
      wodIds: [],
      levels: [],
      sample: building,
      maxLevel: 0,
    };
    existing.wodIds.push(Number(building.wodID));
    existing.levels.push(level);
    if (level > existing.maxLevel) {
      existing.maxLevel = level;
      existing.sample = building;
    }
    families.set(key, existing);
  });

  return [...families.values()]
    .map((family) => ({
      ...family,
      wodIds: [...new Set(family.wodIds)],
      levels: [...new Set(family.levels)].sort((a, b) => a - b),
      iconUrl: getBuildingAssetUrl(family.sample),
    }))
    .sort((a, b) => a.displayName.localeCompare(b.displayName));
}

function renderBuildingMenu() {
  const query = elements.buildingInput.value.trim().toLowerCase();
  const selectedKeys = state.selectedBuildingKeys;
  const filtered = state.buildingCatalog
    .filter((building) => {
      return !query || building.displayName.toLowerCase().includes(query) || building.group.toLowerCase().includes(query);
    })
    .slice(0, MAX_VISIBLE_BUILDINGS);

  state.filteredBuildingCatalog = filtered;

  if (state.buildingCatalog.length === 0) {
    elements.buildingList.innerHTML = `<div class="alliance-empty">No buildings loaded yet.</div>`;
    return;
  }

  if (filtered.length === 0) {
    elements.buildingList.innerHTML = `<div class="alliance-empty">No building matches that search.</div>`;
    return;
  }

  elements.buildingList.innerHTML = filtered.map((building, index) => {
    const active = index === state.activeBuildingIndex ? " is-active" : "";
    const selected = selectedKeys.has(building.key) ? " is-selected" : "";
    return `
      <button type="button" class="building-option${active}${selected}" role="option" data-index="${index}" aria-selected="${index === state.activeBuildingIndex}">
        <img src="${escapeHtml(building.iconUrl)}" alt="" loading="lazy">
        <span>
          <span class="building-option__name">${escapeHtml(building.displayName)}</span>
          <span class="building-option__meta">${escapeHtml(building.group)} - ${building.levels.length} levels</span>
        </span>
      </button>
    `;
  }).join("");

  elements.buildingList.querySelectorAll(".building-option").forEach((option) => {
    option.addEventListener("click", () => {
      selectBuildingOption(Number(option.dataset.index), true);
    });
  });
}

function renderBuildingFilters() {
  const selected = getSelectedBuildingFilters();
  elements.clearBuildingFilters.disabled = selected.length === 0;
  elements.buildingFilterSummary.textContent =
    selected.length === 0
      ? `${state.buildingCatalog.length || 0} building families loaded. Scanned players show all building families.`
      : `${selected.length} building filters selected.`;

  if (selected.length === 0) {
    elements.selectedBuildings.innerHTML = `<span class="filter-empty">No building filters selected.</span>`;
    return;
  }

  elements.selectedBuildings.innerHTML = selected.map((building) => {
    return `
      <button type="button" class="building-chip" data-remove-building="${escapeHtml(building.key)}" title="Remove ${escapeHtml(building.displayName)}">
        <img src="${escapeHtml(building.iconUrl)}" alt="" loading="lazy">
        <span>${escapeHtml(building.displayName)}</span>
        <b aria-hidden="true">x</b>
      </button>
    `;
  }).join("");

  elements.selectedBuildings.querySelectorAll("[data-remove-building]").forEach((button) => {
    button.addEventListener("click", () => {
      state.selectedBuildingKeys.delete(button.dataset.removeBuilding);
      persistBuildingFilters();
      renderBuildingFilters();
      renderBuildingMenu();
      renderWatchtowerStatus();
      renderRosterTable();
    });
  });
}

function openBuildingMenu() {
  renderBuildingMenu();
  state.buildingMenuOpen = true;
  elements.buildingMenu.hidden = false;
  elements.buildingInput.setAttribute("aria-expanded", "true");
}

function closeBuildingMenu() {
  state.buildingMenuOpen = false;
  elements.buildingMenu.hidden = true;
  elements.buildingInput.setAttribute("aria-expanded", "false");
}

function selectBuildingOption(index, shouldAdd) {
  const building = state.filteredBuildingCatalog[index];
  if (!building) return;

  state.activeBuildingIndex = index;
  elements.buildingInput.value = building.displayName;
  renderBuildingMenu();

  if (shouldAdd) {
    addBuildingFilter(building);
  }
}

function handleBuildingInputKeydown(event) {
  if (!state.buildingMenuOpen && ["ArrowDown", "ArrowUp"].includes(event.key)) {
    openBuildingMenu();
    event.preventDefault();
    return;
  }

  if (event.key === "Escape") {
    closeBuildingMenu();
    return;
  }

  if (!state.buildingMenuOpen || state.filteredBuildingCatalog.length === 0) return;

  if (event.key === "ArrowDown") {
    state.activeBuildingIndex = Math.min(state.activeBuildingIndex + 1, state.filteredBuildingCatalog.length - 1);
    renderBuildingMenu();
    event.preventDefault();
  }

  if (event.key === "ArrowUp") {
    state.activeBuildingIndex = Math.max(state.activeBuildingIndex - 1, 0);
    renderBuildingMenu();
    event.preventDefault();
  }

  if (event.key === "Enter") {
    const index = state.activeBuildingIndex >= 0 ? state.activeBuildingIndex : 0;
    selectBuildingOption(index, true);
    event.preventDefault();
  }
}

function addBuildingFilter(building) {
  state.selectedBuildingKeys.add(building.key);
  persistBuildingFilters();
  elements.buildingInput.value = "";
  state.activeBuildingIndex = -1;
  closeBuildingMenu();
  renderBuildingMenu();
  renderBuildingFilters();
  renderWatchtowerStatus();
  renderRosterTable();
}

function persistBuildingFilters() {
  localStorage.setItem("empireBirds.buildingFilters", JSON.stringify([...state.selectedBuildingKeys]));
}

function syncSelectedLevelBuildingKey() {
  if (state.buildingCatalog.some((building) => building.key === state.selectedLevelBuildingKey)) return;
  const watchtower = state.buildingCatalog.find((building) => {
    return cleanAssetPart(building.name) === "watchtower" && cleanAssetPart(building.group) === "building";
  });
  state.selectedLevelBuildingKey = watchtower?.key || state.buildingCatalog[0]?.key || "";
  if (state.selectedLevelBuildingKey) {
    localStorage.setItem("empireBirds.levelBuildingKey", state.selectedLevelBuildingKey);
  }
}

function renderBuildingLevelSelect() {
  if (!elements.buildingLevelInput || !elements.buildingLevelList) return;
  if (state.buildingCatalog.length === 0) {
    elements.buildingLevelInput.disabled = true;
    if (elements.toggleLevelBuildings) elements.toggleLevelBuildings.disabled = true;
    if (elements.buildingLevelSummary) elements.buildingLevelSummary.textContent = "Loading building catalog...";
    elements.buildingLevelList.innerHTML = `<div class="alliance-empty">No buildings loaded yet.</div>`;
    if (elements.buildingLevelMenuMeta) elements.buildingLevelMenuMeta.textContent = "No buildings loaded";
    return;
  }

  syncSelectedLevelBuildingKey();
  const selectedBuilding = getSelectedLevelBuilding();
  const query = state.levelBuildingMenuOpen ? elements.buildingLevelInput.value.trim().toLowerCase() : "";
  const filtered = getLevelBuildingOptions(query).slice(0, MAX_VISIBLE_BUILDINGS);
  state.filteredLevelBuildingCatalog = filtered;

  elements.buildingLevelInput.disabled = false;
  if (elements.toggleLevelBuildings) elements.toggleLevelBuildings.disabled = false;
  if (!state.levelBuildingMenuOpen) {
    elements.buildingLevelInput.value = selectedBuilding?.displayName || "";
  }
  if (elements.buildingLevelSummary) {
    elements.buildingLevelSummary.textContent = selectedBuilding
      ? `${selectedBuilding.group} - ${selectedBuilding.levels.length} known levels`
      : `${state.buildingCatalog.length} building families loaded`;
  }
  if (elements.buildingLevelMenuMeta) {
    elements.buildingLevelMenuMeta.textContent = `${filtered.length} of ${state.buildingCatalog.length} buildings`;
  }

  if (filtered.length === 0) {
    elements.buildingLevelList.innerHTML = `<div class="alliance-empty">No building matches that search.</div>`;
    return;
  }

  elements.buildingLevelList.innerHTML = filtered.map((building, index) => {
    const active = index === state.activeLevelBuildingIndex ? " is-active" : "";
    const selected = building.key === state.selectedLevelBuildingKey ? " is-selected" : "";
    return `
      <button type="button" class="building-option${active}${selected}" role="option" data-level-building-index="${index}" aria-selected="${building.key === state.selectedLevelBuildingKey}">
        <img src="${escapeHtml(building.iconUrl)}" alt="" loading="lazy">
        <span>
          <span class="building-option__name">${escapeHtml(building.displayName)}</span>
          <span class="building-option__meta">${escapeHtml(building.group)} - ${building.levels.length} known levels</span>
        </span>
      </button>
    `;
  }).join("");

  elements.buildingLevelList.querySelectorAll("[data-level-building-index]").forEach((option) => {
    option.addEventListener("click", () => {
      selectLevelBuildingOption(Number(option.dataset.levelBuildingIndex));
    });
  });
}

function getLevelBuildingOptions(query) {
  const normalizedQuery = String(query || "").trim().toLowerCase();
  if (!normalizedQuery) return state.buildingCatalog;
  const compactQuery = normalizedQuery.replaceAll(/[^a-z0-9]+/g, "");
  return state.buildingCatalog.map((building) => {
    const searchText = [
      building.displayName,
      building.name,
      building.group,
      ...building.levels.map((level) => `level ${level} l${level}`),
    ].join(" ").toLowerCase();
    const compactText = searchText.replaceAll(/[^a-z0-9]+/g, "");
    const displayName = building.displayName.toLowerCase();
    const compactName = displayName.replaceAll(/[^a-z0-9]+/g, "");
    const matches = searchText.includes(normalizedQuery) || compactText.includes(compactQuery);
    if (!matches) return null;
    const score = displayName === normalizedQuery || compactName === compactQuery
      ? 0
      : displayName.startsWith(normalizedQuery) || compactName.startsWith(compactQuery)
        ? 1
        : building.group.toLowerCase().includes(normalizedQuery)
          ? 3
          : 2;
    return { building, score };
  }).filter(Boolean).sort((a, b) => {
    if (a.score !== b.score) return a.score - b.score;
    return a.building.displayName.localeCompare(b.building.displayName);
  }).map((entry) => entry.building);
}

function openLevelBuildingMenu() {
  if (!elements.buildingLevelMenu || !elements.buildingLevelInput) return;
  state.levelBuildingMenuOpen = true;
  state.activeLevelBuildingIndex = -1;
  elements.buildingLevelInput.value = "";
  renderBuildingLevelSelect();
  elements.buildingLevelMenu.hidden = false;
  elements.buildingLevelInput.setAttribute("aria-expanded", "true");
}

function closeLevelBuildingMenu() {
  if (!elements.buildingLevelMenu || !elements.buildingLevelInput) return;
  state.levelBuildingMenuOpen = false;
  state.activeLevelBuildingIndex = -1;
  elements.buildingLevelMenu.hidden = true;
  elements.buildingLevelInput.setAttribute("aria-expanded", "false");
  renderBuildingLevelSelect();
}

function selectLevelBuildingOption(index) {
  const building = state.filteredLevelBuildingCatalog[index];
  if (!building) return;
  state.selectedLevelBuildingKey = building.key;
  localStorage.setItem("empireBirds.levelBuildingKey", state.selectedLevelBuildingKey);
  closeLevelBuildingMenu();
  renderWatchtowerChart();
}

function handleLevelBuildingInputKeydown(event) {
  if (!state.levelBuildingMenuOpen && ["ArrowDown", "ArrowUp"].includes(event.key)) {
    openLevelBuildingMenu();
    event.preventDefault();
    return;
  }

  if (event.key === "Escape") {
    closeLevelBuildingMenu();
    return;
  }

  if (!state.levelBuildingMenuOpen || state.filteredLevelBuildingCatalog.length === 0) return;

  if (event.key === "ArrowDown") {
    state.activeLevelBuildingIndex = Math.min(state.activeLevelBuildingIndex + 1, state.filteredLevelBuildingCatalog.length - 1);
    renderBuildingLevelSelect();
    event.preventDefault();
  }

  if (event.key === "ArrowUp") {
    state.activeLevelBuildingIndex = Math.max(state.activeLevelBuildingIndex - 1, 0);
    renderBuildingLevelSelect();
    event.preventDefault();
  }

  if (event.key === "Enter") {
    const index = state.activeLevelBuildingIndex >= 0 ? state.activeLevelBuildingIndex : 0;
    selectLevelBuildingOption(index);
    event.preventDefault();
  }
}

function renderAllianceMenu() {
  const query = elements.allianceInput.value.trim().toLowerCase();
  const filtered = state.alliances
    .filter((alliance) => {
      return !query || alliance.alliance_name.toLowerCase().includes(query);
    })
    .slice(0, MAX_VISIBLE_ALLIANCES);

  state.filteredAlliances = filtered;
  elements.allianceMenuServer.textContent = state.server;
  elements.allianceMenuCount.textContent = `${filtered.length} of ${state.alliances.length} shown`;

  if (state.alliances.length === 0) {
    elements.allianceList.innerHTML = `<div class="alliance-empty">No alliances loaded yet.</div>`;
    elements.allianceMenuFooter.textContent = "Type an exact alliance name and press Load.";
    return;
  }

  if (filtered.length === 0) {
    elements.allianceList.innerHTML = `<div class="alliance-empty">No loaded alliance matches that search.</div>`;
    elements.allianceMenuFooter.textContent = "Press Load to search the exact alliance name through the API.";
    return;
  }

  elements.allianceList.innerHTML = filtered.map((alliance, index) => {
    const active = index === state.activeAllianceIndex ? " is-active" : "";
    return `
      <button type="button" class="alliance-option${active}" role="option" data-index="${index}" aria-selected="${index === state.activeAllianceIndex}">
        <span>
          <span class="alliance-option__name">${escapeHtml(alliance.alliance_name)}</span>
          <span class="alliance-option__stats">
            <span>${formatNumber(alliance.player_count)} players</span>
            <span>${formatNumber(alliance.active_player_count)} active</span>
          </span>
        </span>
        <span class="alliance-option__might">${formatCompactNumber(alliance.might_current)} might</span>
      </button>
    `;
  }).join("");

  elements.allianceList.querySelectorAll(".alliance-option").forEach((option) => {
    option.addEventListener("click", () => {
      selectAllianceOption(Number(option.dataset.index), true);
    });
  });

  elements.allianceMenuFooter.textContent =
    state.alliances.length >= ALLIANCE_PAGES_TO_LOAD * 15
      ? "Showing the strongest loaded alliances. Type an exact name for anything else."
      : "Type an exact alliance name if it is not listed.";
}

function openAllianceMenu() {
  renderAllianceMenu();
  state.allianceMenuOpen = true;
  elements.allianceMenu.hidden = false;
  elements.allianceInput.setAttribute("aria-expanded", "true");
}

function closeAllianceMenu() {
  state.allianceMenuOpen = false;
  elements.allianceMenu.hidden = true;
  elements.allianceInput.setAttribute("aria-expanded", "false");
}

function selectAllianceOption(index, shouldLoad) {
  const alliance = state.filteredAlliances[index];
  if (!alliance) return;

  state.activeAllianceIndex = index;
  elements.allianceInput.value = alliance.alliance_name;
  renderAllianceMenu();
  closeAllianceMenu();

  if (shouldLoad) {
    void loadAlliance(String(alliance.alliance_id));
  }
}

function handleAllianceInputKeydown(event) {
  if (!state.allianceMenuOpen && ["ArrowDown", "ArrowUp"].includes(event.key)) {
    openAllianceMenu();
    event.preventDefault();
    return;
  }

  if (event.key === "Escape") {
    closeAllianceMenu();
    return;
  }

  if (!state.allianceMenuOpen || state.filteredAlliances.length === 0) return;

  if (event.key === "ArrowDown") {
    state.activeAllianceIndex = Math.min(state.activeAllianceIndex + 1, state.filteredAlliances.length - 1);
    renderAllianceMenu();
    event.preventDefault();
  }

  if (event.key === "ArrowUp") {
    state.activeAllianceIndex = Math.max(state.activeAllianceIndex - 1, 0);
    renderAllianceMenu();
    event.preventDefault();
  }

  if (event.key === "Enter" && state.activeAllianceIndex >= 0) {
    selectAllianceOption(state.activeAllianceIndex, true);
    event.preventDefault();
  }
}

async function loadAlliance(value) {
  cacheCurrentWatchtowerResults();
  closeAllianceMenu();
  setLoading(true);
  try {
    const alliance = await resolveAlliance(value);
    const data = await apiFetch(`alliances/id/${encodeURIComponent(alliance.alliance_id)}?playerNameForDistance=`);
    if (data.error) throw new Error(data.error);
    const players = Array.isArray(data.players) ? data.players : [];

    state.currentAlliance = {
      alliance_id: alliance.alliance_id,
      alliance_name: data.alliance_name || alliance.alliance_name,
      active_player_count: getAllianceActivePlayerCount(alliance, data, players),
    };
    state.players = players;
    state.buildingScanRows = [];
    state.buildingLoadingPlayerIds = new Set();
    state.targetLoadingPlayerIds = new Set();
    state.expandedBuildingPlayerIds = new Set();
    state.activePlayerDetailModes = new Map();
    state.collapsedBuildingCastleKeys = new Set();
    state.openTargetCastleKeys = new Set();
    state.openPublicOrderCastleKeys = new Set();
    state.openConstructionItemCastleKeys = new Set();
    state.targetEvaluations = new Map();
    state.lootActivityByPlayerKey = new Map();
    state.lootActivityLoading = true;
    const lootActivityRequestId = state.lootActivityRequestId + 1;
    state.lootActivityRequestId = lootActivityRequestId;
    resetWatchtowerScanState({ restoreResults: true });

    localStorage.setItem("empireBirds.alliance", state.currentAlliance.alliance_name);
    elements.allianceInput.value = state.currentAlliance.alliance_name;
    updateUrl();
    elements.playerFilter.disabled = false;
    setHint(`Showing ${state.currentAlliance.alliance_name} on ${state.server}.`);
    renderAllianceData();
    renderScanResultViews();
    startClock();
    void loadRosterLootActivity(lootActivityRequestId);
  } catch (error) {
    state.lootActivityLoading = false;
    state.lootActivityRequestId += 1;
    showToast(error.message || "Alliance could not be loaded.");
    setHint("Try selecting from the list or entering the exact alliance name.");
    renderAllianceData();
    renderScanResultViews();
  } finally {
    setLoading(false);
  }
}

async function resolveAlliance(value) {
  const selected = state.alliances.find((alliance) => {
    return alliance.alliance_name.toLowerCase() === value.toLowerCase() || String(alliance.alliance_id) === value;
  });

  if (selected) return selected;

  if (/^\d+$/.test(value)) {
    return { alliance_id: value, alliance_name: value };
  }

  const data = await apiFetch(`alliances/name/${encodeURIComponent(value)}`);
  if (data.error) throw new Error(data.error);
  return data;
}

function getAllianceActivePlayerCount(alliance, data, players) {
  const rawCount = alliance?.active_player_count ?? data?.active_player_count;
  if (rawCount !== undefined && rawCount !== null && rawCount !== "") {
    return Math.max(0, Math.trunc(parseNumeric(rawCount)));
  }
  return countActiveRosterPlayers(players);
}

function getActiveMemberCount() {
  if (!state.currentAlliance) return 0;
  const rawCount = state.currentAlliance.active_player_count;
  if (rawCount !== undefined && rawCount !== null && rawCount !== "") {
    return Math.max(0, Math.trunc(parseNumeric(rawCount)));
  }
  return countActiveRosterPlayers(state.players);
}

function countActiveRosterPlayers(players) {
  return (players || []).filter((player) => parseNumeric(player.loot_current) > 0).length;
}

async function apiFetch(path) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "gge-server": state.server,
    },
  });

  let data;
  try {
    data = await response.json();
  } catch {
    data = {};
  }

  if (!response.ok) {
    throw new Error(data.error ? `HTTP ${response.status}: ${data.error}` : `API request failed with HTTP ${response.status}.`);
  }

  return data;
}

function renderAllianceData(renderRoster = true, renderWatchtowerStatusText = true) {
  const protectedPlayers = getProtectedPlayers();

  elements.selectedAlliance.textContent = state.currentAlliance?.alliance_name || "None yet";
  elements.playerCount.textContent = formatNumber(state.players.length);
  elements.birdCount.textContent = formatNumber(protectedPlayers.length);
  elements.activeMemberCount.textContent = formatNumber(getActiveMemberCount());
  elements.playerFilter.disabled = state.players.length === 0;
  if (renderWatchtowerStatusText) {
    renderWatchtowerStatus();
  }
  state.lastBirdCount = protectedPlayers.length;
  if (renderRoster) renderRosterTable();
  renderWatchtowerControls();
}

async function loadRosterLootActivity(requestId) {
  const players = [...state.players];
  try {
    const allianceId = state.currentAlliance?.alliance_id;
    if (!allianceId || players.length === 0) {
      if (requestId !== state.lootActivityRequestId) return;
      state.lootActivityByPlayerKey = new Map();
      return;
    }

    const response = await safeApiFetch(`statistics/alliance/${encodeURIComponent(allianceId)}`);
    if (requestId !== state.lootActivityRequestId) return;

    if (response.error) {
      state.lootActivityByPlayerKey = new Map(players.map((player) => [
        getPlayerKey(player),
        { status: "unknown", error: response.error },
      ]));
      return;
    }

    const lootActivityByPlayer = getAllianceLootActivityByPlayer(response.data);
    const results = players.map((player) => {
      const playerKey = getPlayerKey(player);
      const activity = lootActivityByPlayer.get(playerKey) || {};
      const latestPositiveDate = activity.latestPositiveDate || null;
      return [playerKey, {
        status: latestPositiveDate ? "known" : "stale",
        latestPositiveDate,
        botLikeLootStreak: activity.botLikeLootStreak || buildEmptyLootStreak(),
      }];
    });

    state.lootActivityByPlayerKey = new Map(results);
  } finally {
    if (requestId === state.lootActivityRequestId) {
      state.lootActivityLoading = false;
      renderRosterTable();
    }
  }
}

function renderRosterTable() {
  renderRosterSortHeaders();
  const filter = elements.playerFilter.value.trim().toLowerCase();
  const showClearOnly = state.rosterSort.key === "timeLeft" && getTimeLeftSortMode() === "clear";
  const players = getOrderedRoster().filter((player) => {
    const matchesName = !filter || player.player_name.toLowerCase().includes(filter);
    const matchesBirdMode = !showClearOnly || !isProtected(player.peace_disabled_at);
    return matchesName && matchesBirdMode;
  });

  if (players.length === 0) {
    const message = getRosterEmptyMessage(showClearOnly);
    elements.playersTable.innerHTML = `<tr class="empty-row"><td colspan="7">${message}</td></tr>`;
    return;
  }

  elements.playersTable.innerHTML = players.map((player) => {
    const protectedUntil = isProtected(player.peace_disabled_at);
    const birdClass = protectedUntil ? "pill--bird" : "pill--clear";
    const remaining = protectedUntil ? formatRemainingTime(player.peace_disabled_at) : "Clear";
    const playerKey = getPlayerKey(player);
    const hasBuildingRows = hasCachedBuildingRowsForPlayer(playerKey);
    const hasTargetEvaluation = state.targetEvaluations.has(playerKey);
    const expanded = state.expandedBuildingPlayerIds.has(playerKey) && (hasBuildingRows || hasTargetEvaluation);

    return `
      <tr class="player-row${expanded ? " has-open-details" : ""}">
        <td class="player-action-cell">${renderPlayerActions(player)}</td>
        <td class="player-name-cell">${renderPlayerName(player)}</td>
        <td>${renderRankCell(player)}</td>
        <td>${renderLastLootCell(player)}</td>
        <td class="number">${formatNumber(player.might_current)}</td>
        <td class="number">${formatNumber(player.loot_current)}</td>
        <td><span class="pill ${birdClass}" data-countdown-for="${escapeHtml(String(player.player_id || ""))}">${remaining}</span></td>
      </tr>
      ${expanded ? renderPlayerBuildingDetailsRow(player) : ""}
    `;
  }).join("");

  elements.playersTable.querySelectorAll("[data-watchtower-select]").forEach((button) => {
    button.addEventListener("click", () => {
      toggleWatchtowerSelection(button.dataset.watchtowerSelect);
    });
  });

  elements.playersTable.querySelectorAll("[data-building-toggle]").forEach((button) => {
    button.addEventListener("click", () => {
      togglePlayerBuildingDetails(button.dataset.buildingToggle);
    });
  });

  elements.playersTable.querySelectorAll("[data-castle-toggle]").forEach((button) => {
    button.addEventListener("click", () => {
      toggleCastleBuildingDetails(button.dataset.castleToggle);
    });
  });

  elements.playersTable.querySelectorAll("[data-target-castle-toggle]").forEach((button) => {
    button.addEventListener("click", () => {
      toggleTargetCastleDetails(button.dataset.targetCastleToggle);
    });
  });

  elements.playersTable.querySelectorAll("[data-public-order-toggle]").forEach((button) => {
    button.addEventListener("click", () => {
      togglePublicOrderDetails(button.dataset.publicOrderToggle);
    });
  });

  elements.playersTable.querySelectorAll("[data-construction-item-toggle]").forEach((button) => {
    button.addEventListener("click", () => {
      toggleConstructionItemDetails(button.dataset.constructionItemToggle);
    });
  });
}

function setRosterSort(key) {
  if (!["player", "rank", "lastLoot", "might", "loot", "timeLeft"].includes(key)) return;

  if (key === "timeLeft") {
    setTimeLeftSortMode();
    renderRosterTable();
    return;
  }

  if (state.rosterSort.key === key) {
    state.rosterSort.direction = state.rosterSort.direction === "asc" ? "desc" : "asc";
  } else {
    state.rosterSort = {
      key,
      direction: getDefaultRosterSortDirection(key),
    };
  }

  renderRosterTable();
}

function setTimeLeftSortMode() {
  if (state.rosterSort.key !== "timeLeft") {
    state.rosterSort = {
      key: "timeLeft",
      direction: "asc",
      timeMode: "least",
    };
    return;
  }

  const currentMode = getTimeLeftSortMode();
  const nextMode = currentMode === "least" ? "most" : currentMode === "most" ? "clear" : "least";
  state.rosterSort = {
    key: "timeLeft",
    direction: nextMode === "most" ? "desc" : "asc",
    timeMode: nextMode,
  };
}

function getTimeLeftSortMode() {
  if (state.rosterSort.key !== "timeLeft") return "least";
  if (["least", "most", "clear"].includes(state.rosterSort.timeMode)) return state.rosterSort.timeMode;
  return state.rosterSort.direction === "desc" ? "most" : "least";
}

function getRosterEmptyMessage(showClearOnly) {
  if (!state.players.length) return "No roster loaded.";
  return showClearOnly ? "No non-birded players match that filter." : "No players match that filter.";
}

function getDefaultRosterSortDirection(key) {
  if (key === "player" || key === "rank" || key === "timeLeft") return "asc";
  return "desc";
}

function renderRosterSortHeaders() {
  const timeMode = getTimeLeftSortMode();
  document.querySelectorAll("[data-roster-sort-cell]").forEach((cell) => {
    const key = cell.dataset.rosterSortCell;
    const active = key === state.rosterSort.key;
    const ariaSort = active && !(key === "timeLeft" && timeMode === "clear")
      ? (state.rosterSort.direction === "asc" ? "ascending" : "descending")
      : "none";
    cell.setAttribute("aria-sort", ariaSort);
  });

  document.querySelectorAll("[data-roster-sort]").forEach((button) => {
    const key = button.dataset.rosterSort;
    const active = key === state.rosterSort.key;
    button.classList.toggle("is-active", active);
    button.classList.toggle("is-clear-filter", active && key === "timeLeft" && timeMode === "clear");
    button.setAttribute("aria-label", getRosterSortAriaLabel(key, active));
  });

  document.querySelectorAll("[data-sort-arrow]").forEach((arrow) => {
    const active = arrow.dataset.sortArrow === state.rosterSort.key;
    const clearMode = active && arrow.dataset.sortArrow === "timeLeft" && timeMode === "clear";
    arrow.classList.toggle("is-clear", clearMode);
    arrow.classList.toggle("is-asc", active && !clearMode && state.rosterSort.direction === "asc");
    arrow.classList.toggle("is-desc", !active || (!clearMode && state.rosterSort.direction === "desc"));
  });

  document.querySelectorAll("[data-time-sort-mode-label]").forEach((label) => {
    label.textContent = getTimeLeftModeLabel(timeMode);
  });
}

function getRosterSortLabel(key) {
  return {
    player: "player",
    rank: "rank",
    lastLoot: "last looted",
    might: "might",
    loot: "loot",
    timeLeft: "time left",
  }[key] || "column";
}

function getRosterSortAriaLabel(key, active) {
  if (key !== "timeLeft") {
    return `Sort by ${getRosterSortLabel(key)} ${active && state.rosterSort.direction === "asc" ? "descending" : "ascending"}`;
  }

  if (!active || getTimeLeftSortMode() === "clear") return "Show shortest bird time first";
  if (getTimeLeftSortMode() === "least") return "Show longest bird time first";
  return "Show non-birded players";
}

function getTimeLeftModeLabel(mode) {
  return {
    least: "Least",
    most: "Most",
    clear: "Clear",
  }[mode] || "Least";
}

function renderPlayerName(player) {
  const playerName = player.player_name || "-";
  return `
    <span class="player-identity">
      <span class="player-name">
        <strong>${escapeHtml(playerName)}</strong>
      </span>
    </span>
  `;
}

function renderPlayerActions(player) {
  return `
    <span class="player-row-actions">
      ${renderWatchtowerSelectButton(player)}
      ${renderBuildingToggleButton(player)}
    </span>
  `;
}

function renderWatchtowerSelectButton(player) {
  const view = getWatchtowerSelectButtonView(player);
  return `
    <button type="button" class="${escapeHtml(view.className)}" data-watchtower-select="${escapeHtml(view.playerKey)}" title="${escapeHtml(view.label)}" aria-label="${escapeHtml(view.label)}" aria-pressed="${view.selected ? "true" : "false"}"${view.isLoading ? " disabled" : ""}>
      <img src="assets/eye-watchtower.svg" alt="">
    </button>
  `;
}

function getWatchtowerSelectButtonView(player) {
  const playerName = player.player_name || "player";
  const playerKey = getPlayerKey(player);
  const selected = state.watchtowerSelectedPlayerIds.has(playerKey);
  const isLoading = state.watchtowerLoadingPlayerIds.has(playerKey);
  const hasScannedWatchtowers = state.watchtowerResults.has(playerKey);
  const label = isLoading
    ? `Evaluating ${playerName}`
    : selected
      ? `Remove ${playerName} from player evaluation`
      : hasScannedWatchtowers
        ? `${playerName} already evaluated; select to re-evaluate`
        : `Select ${playerName} for player evaluation`;
  return {
    playerKey,
    selected,
    isLoading,
    hasScannedWatchtowers,
    label,
    className: [
      "player-action-btn",
      "player-action-btn--watchtower",
      hasScannedWatchtowers ? "is-scanned" : "",
      selected ? "is-selected" : "",
      isLoading ? "is-loading" : "",
    ].filter(Boolean).join(" "),
  };
}

function syncWatchtowerSelectionButtons() {
  elements.playersTable.querySelectorAll("[data-watchtower-select]").forEach((button) => {
    const playerKey = String(button.dataset.watchtowerSelect || "");
    const player = state.players.find((item) => getPlayerKey(item) === playerKey);
    if (!player) return;
    const view = getWatchtowerSelectButtonView(player);
    button.className = view.className;
    button.title = view.label;
    button.setAttribute("aria-label", view.label);
    button.setAttribute("aria-pressed", view.selected ? "true" : "false");
    button.disabled = view.isLoading;
  });
}

function renderRankCell(player) {
  return `
    <span class="rank-cell">
      ${renderRankIcon(player.alliance_rank)}
      <span>${escapeHtml(renderRank(player.alliance_rank))}</span>
    </span>
  `;
}

function renderRankIcon(rank) {
  if (rank === null || rank === undefined || rank === "") return "";
  const rankNumber = clampNumber(Math.trunc(Number(rank) || 0), 0, 9);
  const label = renderRank(rank);
  return `
    <span class="rank-icon" title="${escapeHtml(label)}" aria-label="${escapeHtml(label)}" role="img">
      <img src="../gge-tracker/gge-tracker-frontend/src/assets/alliance_ranks/${rankNumber}.png" alt="">
    </span>
  `;
}

function renderLastLootCell(player) {
  const playerKey = getPlayerKey(player);
  const activity = state.lootActivityByPlayerKey.get(playerKey);
  const status = getLootActivityStatus(activity);
  const label = getLootActivityLabel(activity, status);
  const mainText = getLastLootCellMainText(activity, status);
  const metaText = getLastLootCellMetaText(activity, status);
  return `
    <span class="last-loot-cell">
      ${renderLootActivityIndicator(player)}
      ${renderBotActivityIndicator(activity, status)}
      <span class="last-loot-cell__copy" title="${escapeHtml(label)}">
        <strong>${escapeHtml(mainText)}</strong>
        <small>${escapeHtml(metaText)}</small>
      </span>
    </span>
  `;
}

function renderLootActivityIndicator(player) {
  const playerKey = getPlayerKey(player);
  const activity = state.lootActivityByPlayerKey.get(playerKey);
  const status = getLootActivityStatus(activity);
  const label = getLootActivityLabel(activity, status);
  return `
    <span class="loot-activity loot-activity--${escapeHtml(status)}" title="${escapeHtml(label)}" aria-label="${escapeHtml(label)}" role="img">
      <span class="loot-activity__icon" aria-hidden="true"></span>
    </span>
  `;
}

function renderBotActivityIndicator(activity, status) {
  const flagged = Boolean(activity?.botLikeLootStreak?.isFlagged);
  const label = getBotActivityLabel(activity, status);
  const modifier = status === "loading" ? "loading" : flagged ? "flagged" : "quiet";
  return `
    <span class="bot-activity bot-activity--${escapeHtml(modifier)}" title="${escapeHtml(label)}" aria-label="${escapeHtml(label)}" role="img">
      <span class="bot-activity__icon" aria-hidden="true"></span>
    </span>
  `;
}

function getLastLootCellMainText(activity, status) {
  if (status === "loading") return "Loading";
  if (activity?.error) return "Unavailable";
  if (!activity?.latestPositiveDate) return "No recent loot";
  return `${formatDurationSince(activity.latestPositiveDate)} ago`;
}

function getLastLootCellMetaText(activity, status) {
  if (status === "loading") return "Checking activity";
  if (activity?.error) return "Loot history failed";
  if (!activity?.latestPositiveDate) return "No gain in 30 days";
  return formatDateTime(activity.latestPositiveDate);
}

function getLootActivityStatus(activity) {
  if (!activity && state.lootActivityLoading) return "loading";
  if (!activity || activity.error || !activity.latestPositiveDate) return "stale";

  const hours = (Date.now() - activity.latestPositiveDate.getTime()) / 36e5;
  if (hours <= 3) return "green";
  if (hours <= 6) return "yellow";
  if (hours <= 24) return "red";
  return "stale";
}

function getLootActivityLabel(activity, status) {
  if (status === "loading") return "Loading loot activity...";
  if (activity?.error) return "Loot history could not be loaded.";
  if (!activity?.latestPositiveDate) return "No loot increase found in the last 30 days.";
  return `Last looted ${formatDurationSince(activity.latestPositiveDate)} ago (${formatDateTime(activity.latestPositiveDate)})`;
}

function getBotActivityLabel(activity, status) {
  if (status === "loading") return "Checking continuous loot streaks...";
  if (activity?.error) return "Bot-like loot check could not be loaded.";
  const streak = activity?.botLikeLootStreak || buildEmptyLootStreak();
  if (!streak.isFlagged) return `No ${BOT_LOOT_STREAK_HOURS}-hour continuous loot-change streak found in the available history.`;
  return `Bot-like loot signal: ${formatStreakHours(streak.hours)} of consecutive hourly loot increases (${formatDateTime(streak.startDate)} to ${formatDateTime(streak.endDate)}).`;
}

function renderBuildingToggleButton(player) {
  const playerKey = getPlayerKey(player);
  const buildingRows = getBuildingRowsForPlayer(playerKey);
  const hasCachedBuildingRows = hasCachedBuildingRowsForPlayer(playerKey);
  const evaluation = state.targetEvaluations.get(playerKey);
  if (!hasCachedBuildingRows && !evaluation) return "";

  const expanded = state.expandedBuildingPlayerIds.has(playerKey);
  const count = countPlayerBuildingInstances(buildingRows);
  const mode = getPlayerDetailMode(playerKey);
  const label = mode === "target"
    ? `${expanded ? "Hide" : "Show"} attack risk evaluation for ${player.player_name || "player"}`
    : `${expanded ? "Hide" : "Show"} ${count} building ${count === 1 ? "detail" : "details"} for ${player.player_name || "player"}`;
  return `
    <button type="button" class="player-action-btn player-action-btn--toggle${expanded ? " is-expanded" : ""}" data-building-toggle="${escapeHtml(playerKey)}" title="${escapeHtml(label)}" aria-label="${escapeHtml(label)}" aria-expanded="${expanded}">
      <span aria-hidden="true"></span>
    </button>
  `;
}

function togglePlayerBuildingDetails(playerKey) {
  if (!playerKey) return;
  if (state.expandedBuildingPlayerIds.has(playerKey)) {
    state.expandedBuildingPlayerIds.delete(playerKey);
  } else {
    state.expandedBuildingPlayerIds.add(playerKey);
  }
  renderRosterTable();
}

function toggleCastleBuildingDetails(castleKey) {
  if (!castleKey) return;
  if (state.collapsedBuildingCastleKeys.has(castleKey)) {
    state.collapsedBuildingCastleKeys.delete(castleKey);
  } else {
    state.collapsedBuildingCastleKeys.add(castleKey);
  }
  renderRosterTable();
}

function toggleTargetCastleDetails(castleKey) {
  if (!castleKey) return;
  if (state.openTargetCastleKeys.has(castleKey)) {
    state.openTargetCastleKeys.delete(castleKey);
  } else {
    state.openTargetCastleKeys.add(castleKey);
  }
  renderRosterTable();
}

function togglePublicOrderDetails(castleKey) {
  if (!castleKey) return;
  if (state.openPublicOrderCastleKeys.has(castleKey)) {
    state.openPublicOrderCastleKeys.delete(castleKey);
  } else {
    state.openPublicOrderCastleKeys.add(castleKey);
  }
  renderRosterTable();
  renderAttackScoreChart();
}

function toggleConstructionItemDetails(castleKey) {
  if (!castleKey) return;
  if (state.openConstructionItemCastleKeys.has(castleKey)) {
    state.openConstructionItemCastleKeys.delete(castleKey);
  } else {
    state.openConstructionItemCastleKeys.add(castleKey);
  }
  renderRosterTable();
  renderAttackScoreChart();
}

function renderPlayerBuildingDetailsRow(player) {
  const playerKey = getPlayerKey(player);
  const rows = getBuildingRowsForPlayer(playerKey);
  const evaluation = state.targetEvaluations.get(playerKey);
  const mode = getPlayerDetailMode(playerKey);
  const showingTarget = mode === "target" && evaluation;
  const castleSections = showingTarget
    ? evaluation.castles.map((target) => renderTargetCastleSection(target)).join("")
    : getCastleBuildingGroups(rows, null).map((group) => renderCastleBuildingSection(group)).join("");

  const scannedCastles = new Set(rows.map((row) => `${row.castleName}|${row.kingdomId}`)).size;
  const foundCount = countPlayerBuildingInstances(rows);
  const summary = showingTarget
    ? `${evaluation.castles.length} castle ${evaluation.castles.length === 1 ? "risk profile" : "risk profiles"} scored independently. Castle tabs are closed by default.`
    : foundCount > 0
      ? `${foundCount} building ${foundCount === 1 ? "detail" : "details"} across ${scannedCastles} ${scannedCastles === 1 ? "castle" : "castles"}`
      : "No matching building details found.";
  const panelLabel = showingTarget ? "Attack risk evaluation" : "Building details";

  return `
    <tr class="building-details-row">
      <td colspan="7">
        <section class="player-building-panel" aria-label="${escapeHtml(panelLabel)} for ${escapeHtml(player.player_name || "player")}">
          <div class="player-building-panel__header">
            <div>
              <span class="label">${escapeHtml(panelLabel)}</span>
              <strong>${escapeHtml(player.player_name || "Player")}</strong>
              <p>${escapeHtml(summary)}</p>
            </div>
            <button type="button" class="details-close-btn" data-building-toggle="${escapeHtml(playerKey)}">Close</button>
          </div>
          ${showingTarget ? renderTargetEvaluationSummary(evaluation) : ""}
          ${
            castleSections
              ? `<div class="castle-section-list">${castleSections}</div>`
              : `<div class="building-empty-state">${showingTarget ? "No castle risk profiles were returned." : "Try a different building filter, or scan again after changing filters."}</div>`
          }
        </section>
      </td>
    </tr>
  `;
}

function getPlayerDetailMode(playerKey) {
  const mode = state.activePlayerDetailModes.get(playerKey);
  if (mode) return mode;
  if (state.targetEvaluations.has(playerKey)) return "target";
  return "building";
}

function renderTargetEvaluationSummary(evaluation) {
  const bestCastleText = evaluation.bestCastle
    ? `${evaluation.bestCastle.castleName} - ${getKingdomName(evaluation.bestCastle.kingdomId)} - ${getCastleTypeName(evaluation.bestCastle.castleType)}`
    : "No recommended castle";
  const warningItems = evaluation.warnings.slice(0, 4);
  const noteItems = evaluation.notes.slice(0, Math.max(0, 5 - warningItems.length));
  return `
    <div class="target-evaluation-summary">
      <div class="target-verdict-card target-verdict-card--${escapeHtml(evaluation.verdictClass)}">
        <span class="label">Risk assessment</span>
        <strong>${escapeHtml(evaluation.verdict)}</strong>
        <span>${evaluation.score}/100 strength score</span>
      </div>
      <div class="target-summary-grid">
        <div>
          <span class="label">Confidence</span>
          <strong>${escapeHtml(evaluation.confidence)}</strong>
        </div>
        <div>
          <span class="label">Weakest castle</span>
          <strong>${escapeHtml(bestCastleText)}</strong>
        </div>
      </div>
      <div class="target-breakdown" aria-label="Strength score breakdown">
        ${renderTargetBreakdownItem(evaluation.categories.defense)}
      </div>
      ${
        warningItems.length > 0 || noteItems.length > 0
          ? `<div class="target-notes">
              ${warningItems.map((note) => `<span class="is-warning">${escapeHtml(note)}</span>`).join("")}
              ${noteItems.map((note) => `<span>${escapeHtml(note)}</span>`).join("")}
            </div>`
          : ""
      }
    </div>
  `;
}

function renderTargetBreakdownItem(category) {
  return `
    <div class="target-breakdown__item">
      <span>${escapeHtml(category.label)}</span>
      <strong>${Math.round(category.score)}/100</strong>
      <small>Final strength score</small>
    </div>
  `;
}

function renderScoreInsights(categories, label, target = null) {
  const ordered = ["defense"]
    .map((key) => categories?.[key])
    .filter(Boolean);
  if (ordered.length === 0) return "";

  return `
    <div class="score-insights" aria-label="${escapeHtml(label)}">
      <div class="score-insights__header">
        <span class="label">${escapeHtml(label)}</span>
        <strong>Strength math transparency</strong>
      </div>
      <div class="score-insight-grid">
        ${ordered.map((category) => renderScoreInsightCard(category, target)).join("")}
      </div>
    </div>
  `;
}

function renderScoreInsightCard(category, target = null) {
  const rows = category.details.length > 0
    ? category.details
    : [{ label: "Assumption", value: "No detail", score: category.score, note: "Category score used with no finer endpoint detail." }];
  const publicOrderDetails = target && category.label === "Defense strength" && state.openPublicOrderCastleKeys.has(target.key)
    ? renderDefensivePublicOrderDetails(target)
    : "";
  const constructionItemDetails = target && category.label === "Defense strength" && state.openConstructionItemCastleKeys.has(target.key)
    ? renderDefensiveConstructionItemDetails(target)
    : "";
  return `
    <article class="score-insight-card">
      <div class="score-insight-card__header">
        <div>
          <span>${escapeHtml(category.label)}</span>
          <strong>${Math.round(category.score)}/100</strong>
        </div>
        <small>Final strength score</small>
      </div>
      <div class="score-insight-card__rows">
        ${rows.map((detail) => renderScoreInsightRow(detail, target)).join("")}
      </div>
      ${publicOrderDetails}
      ${constructionItemDetails}
    </article>
  `;
}

function renderScoreInsightRow(detail, target = null) {
  const score = Math.round(clampNumber(detail.score, 0, 100));
  const tone = getScoreInsightTone(score);
  const content = `
    <span class="score-insight-row__body">
      <strong>${escapeHtml(detail.label)}</strong>
      <span>${escapeHtml(detail.value)}</span>
    </span>
    <b>${score}</b>
    <span class="score-insight-row__note">${escapeHtml(detail.note || "")}</span>
  `;
  if (detail.action === "publicOrder" && target) {
    const expanded = state.openPublicOrderCastleKeys.has(target.key);
    return `
      <button type="button" class="score-insight-row score-insight-row--button score-insight-row--${tone}" data-public-order-toggle="${escapeHtml(target.key)}" aria-expanded="${expanded}" title="Show placed defense-enhancing public order">
        ${content}
      </button>
    `;
  }
  if (detail.action === "constructionItems" && target) {
    const expanded = state.openConstructionItemCastleKeys.has(target.key);
    return `
      <button type="button" class="score-insight-row score-insight-row--button score-insight-row--${tone}" data-construction-item-toggle="${escapeHtml(target.key)}" aria-expanded="${expanded}" title="Show defensive buildings with build items">
        ${content}
      </button>
    `;
  }

  return `
    <div class="score-insight-row score-insight-row--${tone}">
      ${content}
    </div>
  `;
}

function getScoreInsightTone(score) {
  if (score <= 34) return "low";
  if (score <= 67) return "medium";
  return "high";
}

function renderCastleBuildingSection(group) {
  const collapsed = state.collapsedBuildingCastleKeys.has(group.key);
  const cards = group.instances.map(({ row, instance }) => renderBuildingInstanceCard(row, instance)).join("");
  const meta = group.target
    ? `
        <span class="castle-building-section__meta">
          <strong>${group.target.score}/100</strong>
          <span>${escapeHtml(group.target.verdict)}</span>
        </span>
      `
    : "";

  return `
    <section class="castle-building-section${collapsed ? " is-collapsed" : ""}">
      <button type="button" class="castle-building-section__header" data-castle-toggle="${escapeHtml(group.key)}" aria-expanded="${!collapsed}">
        <span class="castle-building-section__icon">
          ${group.castleIconUrl ? `<img src="${escapeHtml(group.castleIconUrl)}" alt="" loading="lazy">` : ""}
        </span>
        <span class="castle-building-section__title">
          <strong>${escapeHtml(group.castleName)}</strong>
          <span>${escapeHtml(getKingdomName(group.kingdomId))} - ${escapeHtml(getCastleTypeName(group.castleType))}</span>
        </span>
        ${meta}
        <span class="castle-building-section__chevron" aria-hidden="true"></span>
      </button>
      ${
        collapsed
          ? ""
          : `
            ${group.target ? renderCastleTargetSummary(group.target) : ""}
            ${cards ? `<div class="building-card-grid">${cards}</div>` : `<div class="building-empty-state">No matching building cards for this castle.</div>`}
          `
      }
    </section>
  `;
}

function renderTargetCastleSection(target) {
  const expanded = state.openTargetCastleKeys.has(target.key);
  return `
    <section class="castle-building-section${expanded ? "" : " is-collapsed"} castle-building-section--target">
      <button type="button" class="castle-building-section__header" data-target-castle-toggle="${escapeHtml(target.key)}" aria-expanded="${expanded}">
        <span class="castle-building-section__icon">
          ${target.castleIconUrl ? `<img src="${escapeHtml(target.castleIconUrl)}" alt="" loading="lazy">` : ""}
        </span>
        <span class="castle-building-section__title">
          <strong>${escapeHtml(target.castleName)}</strong>
          <span>${escapeHtml(getKingdomName(target.kingdomId))} - ${escapeHtml(getCastleTypeName(target.castleType))}</span>
        </span>
        <span class="castle-building-section__meta">
          <strong>${target.score}/100</strong>
          <span>${escapeHtml(target.verdict)}</span>
        </span>
        <span class="castle-building-section__chevron" aria-hidden="true"></span>
      </button>
      ${expanded ? renderCastleTargetSummary(target) : ""}
    </section>
  `;
}

function renderCastleTargetSummary(target) {
  const score = Math.round(clampNumber(target.score, 0, 100));
  const defenseScore = Math.round(target.categories?.defense?.score || score);
  const noteHtml = [
    ...target.notes.slice(0, 4).map((note) => `<span>${escapeHtml(note)}</span>`),
    ...target.warnings.slice(0, 3).map((warning) => `<span class="is-warning">${escapeHtml(warning)}</span>`),
  ].join("");

  return `
    <div class="castle-target-summary castle-target-summary--${escapeHtml(target.verdictClass || "unknown")}">
      <div class="castle-score-overview">
        <div class="castle-score-meter" style="--score: ${score}">
          <strong>${score}</strong>
          <span>/100</span>
        </div>
        <div class="castle-score-copy">
          <span class="label">Strength score</span>
          <strong>${score}/100 - ${escapeHtml(target.verdict)}</strong>
          <p>${escapeHtml(getCastleTargetNarrative(target))}</p>
        </div>
        <div class="castle-score-highlights" aria-label="Castle score highlights">
          <span>
            <small>Defense</small>
            <strong>${defenseScore}/100</strong>
          </span>
          <span>
            <small>Signals</small>
            <strong>${target.notes.length + target.warnings.length}</strong>
          </span>
          <span>
            <small>PO pieces</small>
            <strong>${Array.isArray(target.publicOrderItems) ? target.publicOrderItems.length : 0}</strong>
          </span>
          <span>
            <small>Build items</small>
            <strong>${countTargetConstructionItems(target)}</strong>
          </span>
        </div>
      </div>
      <div class="castle-target-summary__notes">
        ${noteHtml || "<span>No urgent scoring notes found.</span>"}
      </div>
      ${renderScoreInsights(target.categories, "Castle scoring assumptions", target)}
    </div>
  `;
}

function getCastleTargetNarrative(target) {
  const score = Math.round(clampNumber(target.score, 0, 100));
  if (score <= 24) return "Defenses look light. Confirm the weak points below before choosing this castle.";
  if (score <= 49) return "Some defenses are online, but the scan found exploitable gaps in the setup.";
  if (score <= 74) return "Several defensive layers are present. Review the highest scoring assumptions before committing.";
  return "This castle has a stacked defensive profile. Look for weaker castles first unless the attack is intentional.";
}

function countTargetConstructionItems(target) {
  const rows = Array.isArray(target.constructionItemRows) ? target.constructionItemRows : [];
  return rows.reduce((sum, row) => {
    return sum + row.instances.reduce((instanceSum, instance) => instanceSum + (instance.constructionItems?.length || 0), 0);
  }, 0);
}

function renderDefensivePublicOrderDetails(target) {
  const items = Array.isArray(target.publicOrderItems) ? target.publicOrderItems : [];
  if (items.length === 0) {
    return `
      <div class="public-order-details">
        <div class="public-order-details__header">
          <span class="label">Defense strength stat detail</span>
          <strong>No defense-enhancing PO found</strong>
        </div>
        <p class="public-order-empty">No placed public-order pieces with recognized defensive perks were found in this castle.</p>
      </div>
    `;
  }

  return `
    <div class="public-order-details">
      <div class="public-order-details__header">
        <span class="label">Defense strength stat detail</span>
        <strong>${formatNumber(target.publicOrderTotal)} PO across ${items.length} ${items.length === 1 ? "piece" : "pieces"}</strong>
      </div>
      <div class="public-order-grid">
        ${items.map((item) => renderDefensivePublicOrderCard(item)).join("")}
      </div>
    </div>
  `;
}

function renderDefensivePublicOrderCard(item) {
  return `
    <article class="public-order-card">
      <div class="public-order-card__art">
        ${item.iconUrl ? `<img src="${escapeHtml(item.iconUrl)}" alt="" loading="lazy">` : ""}
        <span>${escapeHtml(item.size)}</span>
      </div>
      <div class="public-order-card__body">
        <div>
          <strong>${escapeHtml(item.name)}</strong>
          <span>${formatNumber(item.publicOrder)} public order</span>
        </div>
        <ul>
          ${item.effects.map((effect) => `<li><b>${escapeHtml(effect.valueLabel)}</b><span>${escapeHtml(effect.label)}</span></li>`).join("")}
        </ul>
      </div>
    </article>
  `;
}

function renderDefensiveConstructionItemDetails(target) {
  const rows = Array.isArray(target.constructionItemRows) ? target.constructionItemRows : [];
  const itemCount = rows.reduce((sum, row) => {
    return sum + row.instances.reduce((instanceSum, instance) => instanceSum + (instance.constructionItems?.length || 0), 0);
  }, 0);

  if (rows.length === 0) {
    return `
      <div class="construction-building-details">
        <div class="construction-building-details__header">
          <span class="label">Defense strength stat detail</span>
          <strong>No defensive build items found</strong>
        </div>
        <p class="construction-building-empty">No defensive buildings with equipped build items were found in this castle.</p>
      </div>
    `;
  }

  return `
    <div class="construction-building-details">
      <div class="construction-building-details__header">
        <span class="label">Defense strength stat detail</span>
        <strong>${rows.length} ${rows.length === 1 ? "building" : "buildings"} with ${itemCount} ${itemCount === 1 ? "build item" : "build items"}</strong>
      </div>
      <div class="building-card-grid building-card-grid--compact">
        ${rows.map((row) => row.instances.map((instance) => renderBuildingInstanceCard(row, instance)).join("")).join("")}
      </div>
    </div>
  `;
}

function renderBuildingInstanceCard(row, instance) {
  return `
    <article class="building-card">
      <div class="building-card__art">
        ${row.buildingIconUrl ? `<img src="${escapeHtml(row.buildingIconUrl)}" alt="" loading="lazy">` : ""}
        <span class="building-card__level">Level ${escapeHtml(instance.level || "-")}</span>
      </div>
      <div class="building-card__content">
        <div class="building-card__title">
          <strong>${escapeHtml(row.buildingName)}</strong>
          <span>${escapeHtml(row.buildingGroup || "Building")}</span>
        </div>
        ${renderConstructionItemLoadout(instance)}
      </div>
    </article>
  `;
}

function renderConstructionItemLoadout(instance) {
  const items = Array.isArray(instance.constructionItems) ? instance.constructionItems : [];
  if (items.length === 0) {
    return `
      <div class="construction-loadout construction-loadout--empty">
        <span class="construction-loadout__label">Build items</span>
        <strong>No build items equipped</strong>
        <small>ID ${escapeHtml(instance.objectID || "-")}</small>
      </div>
    `;
  }

  return `
    <div class="construction-loadout">
      <span class="construction-loadout__label">Build items</span>
      <div class="construction-item-list">
        ${items.map((item) => renderConstructionItemCard(item)).join("")}
      </div>
    </div>
  `;
}

function renderConstructionItemCard(item) {
  return `
    <div class="construction-item-card" style="--item-rarity:${escapeHtml(item.rarityColor)}">
      <div class="construction-item-card__visual" style="background-image:url('${escapeHtml(item.boxUrl)}')">
        ${item.iconUrl ? `<img src="${escapeHtml(item.iconUrl)}" alt="" loading="lazy">` : ""}
        <span>${escapeHtml(String(item.level || "-"))}</span>
      </div>
      <div class="construction-item-card__body">
        <div>
          <strong>${escapeHtml(item.displayName)}</strong>
          <span>${escapeHtml(item.slotName)} - ${escapeHtml(item.rarityName)}</span>
        </div>
        <p>${escapeHtml(item.effectText)}</p>
      </div>
    </div>
  `;
}

function getCastleBuildingGroups(rows, evaluation) {
  const groups = new Map();
  rows
    .filter((row) => !row.missing && row.instances.length > 0)
    .forEach((row) => {
      const key = getCastleBuildingKey(row);
      const group = groups.get(key) || {
        key,
        castleName: row.castleName,
        castleType: row.castleType,
        castleIconUrl: row.castleIconUrl,
        kingdomId: row.kingdomId,
        displayIndex: row.displayIndex,
        instances: [],
      };
      row.instances.forEach((instance) => {
        group.instances.push({ row, instance });
      });
      groups.set(key, group);
    });

  if (evaluation) {
    evaluation.castles.forEach((castleTarget) => {
      const group = groups.get(castleTarget.key) || {
        key: castleTarget.key,
        castleName: castleTarget.castleName,
        castleType: castleTarget.castleType,
        castleIconUrl: castleTarget.castleIconUrl,
        kingdomId: castleTarget.kingdomId,
        displayIndex: castleTarget.displayIndex,
        instances: [],
      };
      group.target = castleTarget;
      groups.set(castleTarget.key, group);
    });
  }

  return [...groups.values()].sort((a, b) => {
    const castleSort = sortScanResultCastles(a, b);
    if (castleSort !== 0) return castleSort;
    return a.castleName.localeCompare(b.castleName);
  });
}

function getCastleTargetKey(playerKey, castle) {
  return [
    playerKey,
    castle.id || castle.name,
    castle.kingdomId,
    castle.type,
  ].map((part) => String(part || "")).join("|");
}

function getCastleBuildingKey(row) {
  return [
    row.playerKey,
    row.castleId || row.castleName,
    row.kingdomId,
    row.castleType,
  ].map((part) => String(part || "")).join("|");
}

function getBuildingRowsForPlayer(playerKey) {
  const rows = state.buildingScanRows.filter((row) => row.playerKey === String(playerKey || ""));
  if (state.selectedBuildingKeys.size === 0) return rows;
  return rows.filter((row) => row.missing || state.selectedBuildingKeys.has(row.buildingKey));
}

function hasCachedBuildingRowsForPlayer(playerKey) {
  return state.buildingScanRows.some((row) => row.playerKey === String(playerKey || ""));
}

function countPlayerBuildingInstances(rows) {
  return rows.reduce((total, row) => total + (row.missing ? 0 : row.instances.length), 0);
}

function updateCountdownCells() {
  elements.playersTable.querySelectorAll("[data-countdown-for]").forEach((cell) => {
    const player = state.players.find((item) => String(item.player_id) === cell.dataset.countdownFor);
    if (!player) return;

    const protectedUntil = isProtected(player.peace_disabled_at);
    cell.textContent = protectedUntil ? formatRemainingTime(player.peace_disabled_at) : "Clear";
    cell.classList.toggle("pill--bird", protectedUntil);
    cell.classList.toggle("pill--clear", !protectedUntil);
  });
}

function getOrderedRoster() {
  return state.players
    .map((player, index) => ({ ...player, originalIndex: index }))
    .sort(compareRosterPlayers);
}

function compareRosterPlayers(a, b) {
  const direction = state.rosterSort.direction === "desc" ? -1 : 1;
  let result = 0;

  if (state.rosterSort.key === "timeLeft") {
    result = compareRosterTimeLeft(a, b);
    return result === 0 ? a.originalIndex - b.originalIndex : result;
  } else if (state.rosterSort.key === "lastLoot") {
    result = compareRosterLastLoot(a, b);
    return result === 0 ? a.originalIndex - b.originalIndex : result;
  } else if (state.rosterSort.key === "rank") {
    result = compareRosterRank(a, b);
    return result === 0 ? a.originalIndex - b.originalIndex : result;
  } else if (state.rosterSort.key === "player") {
    result = String(a.player_name || "").localeCompare(String(b.player_name || ""), undefined, { sensitivity: "base" });
  } else if (state.rosterSort.key === "might") {
    result = parseNumeric(a.might_current) - parseNumeric(b.might_current);
  } else if (state.rosterSort.key === "loot") {
    result = parseNumeric(a.loot_current) - parseNumeric(b.loot_current);
  }

  if (result === 0) return a.originalIndex - b.originalIndex;
  return result * direction;
}

function compareRosterTimeLeft(a, b) {
  const timeMode = getTimeLeftSortMode();
  if (timeMode === "clear") {
    const aClear = !isProtected(a.peace_disabled_at);
    const bClear = !isProtected(b.peace_disabled_at);

    if (aClear !== bClear) return aClear ? -1 : 1;
    return a.originalIndex - b.originalIndex;
  }

  const aEnd = getProtectionEndTime(a);
  const bEnd = getProtectionEndTime(b);
  const aProtected = Number.isFinite(aEnd);
  const bProtected = Number.isFinite(bEnd);

  if (aProtected !== bProtected) return aProtected ? -1 : 1;
  if (!aProtected) return a.originalIndex - b.originalIndex;

  return timeMode === "most" ? bEnd - aEnd : aEnd - bEnd;
}

function compareRosterLastLoot(a, b) {
  const aLootTime = getLastLootTime(a);
  const bLootTime = getLastLootTime(b);
  const aKnown = Number.isFinite(aLootTime);
  const bKnown = Number.isFinite(bLootTime);

  if (aKnown !== bKnown) return aKnown ? -1 : 1;
  if (!aKnown) return a.originalIndex - b.originalIndex;

  return state.rosterSort.direction === "desc" ? bLootTime - aLootTime : aLootTime - bLootTime;
}

function compareRosterRank(a, b) {
  const aRank = getRankSortValue(a);
  const bRank = getRankSortValue(b);
  const aKnown = Number.isFinite(aRank);
  const bKnown = Number.isFinite(bRank);

  if (aKnown !== bKnown) return aKnown ? -1 : 1;
  if (!aKnown) return a.originalIndex - b.originalIndex;

  return state.rosterSort.direction === "desc" ? bRank - aRank : aRank - bRank;
}

function getProtectionEndTime(player) {
  if (!isProtected(player.peace_disabled_at)) return Number.POSITIVE_INFINITY;
  const endTime = new Date(player.peace_disabled_at).getTime();
  return Number.isFinite(endTime) ? endTime : Number.POSITIVE_INFINITY;
}

function getLastLootTime(player) {
  const activity = state.lootActivityByPlayerKey.get(getPlayerKey(player));
  const timestamp = activity?.latestPositiveDate instanceof Date
    ? activity.latestPositiveDate.getTime()
    : new Date(activity?.latestPositiveDate || "").getTime();
  return Number.isFinite(timestamp) ? timestamp : Number.NEGATIVE_INFINITY;
}

function getRankSortValue(player) {
  const rank = Number(player.alliance_rank);
  return Number.isFinite(rank) ? rank : Number.POSITIVE_INFINITY;
}

async function scanBuildingPlayer(playerId) {
  const player = state.players.find((item) => getPlayerKey(item) === String(playerId || ""));
  if (!player) {
    showToast("That player is not in the current roster.");
    return;
  }
  if (state.buildingItemByWod.size === 0) {
    showToast("Building catalog is still loading. Try again in a moment.");
    return;
  }

  const playerKey = getPlayerKey(player);
  if (state.buildingLoadingPlayerIds.has(playerKey)) return;

  state.buildingLoadingPlayerIds.add(playerKey);
  renderRosterTable();
  renderWatchtowerStatus(`Fetching castles for ${player.player_name}...`);

  try {
    const rows = await fetchBuildingScanRows(player);
    storePlayerBuildingRows(playerKey, rows);
    openPlayerDetails(playerKey, "building");

    renderWatchtowerStatus();
    renderScanResultViews();
  } catch (error) {
    showToast(error.message || "Could not fetch building details.");
    renderWatchtowerStatus(`Building scan failed for ${player.player_name}. Try again in a moment.`);
  } finally {
    state.buildingLoadingPlayerIds.delete(playerKey);
    renderRosterTable();
    renderAllianceData(false, false);
  }
}

async function scanTargetPlayer(playerId) {
  const player = state.players.find((item) => getPlayerKey(item) === String(playerId || ""));
  if (!player) {
    showToast("That player is not in the current roster.");
    return;
  }

  const playerKey = getPlayerKey(player);
  if (state.targetLoadingPlayerIds.has(playerKey)) return;

  state.targetLoadingPlayerIds.add(playerKey);
  renderRosterTable();
  renderWatchtowerStatus(`Starting attack evaluation for ${player.player_name}...`);

  try {
    const scanData = await fetchPlayerScanData(player);
    state.targetEvaluations.set(playerKey, buildTargetEvaluation(player, scanData));
    openPlayerDetails(playerKey, "target");

    renderWatchtowerStatus();
    renderScanResultViews();
  } catch (error) {
    showToast(error.message || "Could not evaluate target.");
    renderWatchtowerStatus(`Attack evaluation failed for ${player.player_name}. Try again in a moment.`);
  } finally {
    state.targetLoadingPlayerIds.delete(playerKey);
    renderRosterTable();
    renderAllianceData(false, false);
  }
}

function toggleWatchtowerSelection(playerId) {
  const playerKey = String(playerId || "");
  if (!state.players.some((player) => getPlayerKey(player) === playerKey)) return;

  if (state.watchtowerSelectedPlayerIds.has(playerKey)) {
    state.watchtowerSelectedPlayerIds.delete(playerKey);
  } else if (state.watchtowerSelectedPlayerIds.size >= 5) {
    return;
  } else {
    state.watchtowerSelectedPlayerIds.add(playerKey);
  }

  syncWatchtowerSelectionButtons();
  renderWatchtowerControls();
}

async function scanSelectedWatchtowers() {
  if (state.watchtowerScanActive) return;
  const scanCacheKey = getWatchtowerAllianceCacheKey();
  const selectedPlayers = [...state.watchtowerSelectedPlayerIds]
    .map((playerKey) => state.players.find((player) => getPlayerKey(player) === playerKey))
    .filter(Boolean)
    .slice(0, 5);

  if (selectedPlayers.length === 0) {
    showToast("Select up to 5 players to evaluate.");
    return;
  }

  if (state.buildingItemByWod.size === 0) {
    showToast("Building catalog is still loading. Try again in a moment.");
    return;
  }

  state.watchtowerScanActive = true;
  const scanId = state.watchtowerScanId + 1;
  state.watchtowerScanId = scanId;
  selectedPlayers.forEach((player) => state.watchtowerLoadingPlayerIds.add(getPlayerKey(player)));
  setRosterTab("watchtowers");
  renderRosterTable();
  renderScanResultViews();
  renderWatchtowerStatus(`Evaluating ${selectedPlayers.length} selected ${selectedPlayers.length === 1 ? "player" : "players"}...`);

  try {
    const results = await mapLimit(selectedPlayers, 2, async (player, index) => {
      renderWatchtowerStatus(`Evaluating player ${index + 1}/${selectedPlayers.length}: ${player.player_name}`);
      return fetchPlayerWatchtowerRow(player);
    });

    const cachedResults = scanCacheKey === getWatchtowerAllianceCacheKey()
      ? cloneWatchtowerResults(state.watchtowerResults)
      : cloneWatchtowerResults(state.watchtowerResultsByAlliance.get(scanCacheKey) || new Map());
    results.forEach((result) => {
      cachedResults.set(result.playerKey, result);
    });
    cacheWatchtowerResultsForAllianceKey(scanCacheKey, cachedResults);

    if (scanId === state.watchtowerScanId && scanCacheKey === getWatchtowerAllianceCacheKey()) {
      state.watchtowerResults = cloneWatchtowerResults(cachedResults);
      results.forEach((result) => {
        storePlayerBuildingRows(result.playerKey, result.buildingRows || []);
      });
      state.watchtowerSelectedPlayerIds = new Set();
      renderWatchtowerStatus();
    }
  } catch (error) {
    if (scanId === state.watchtowerScanId) {
      showToast(error.message || "Could not evaluate players.");
      renderWatchtowerStatus("Evaluation failed. Try again in a moment.");
    }
  } finally {
    if (scanId === state.watchtowerScanId) {
      selectedPlayers.forEach((player) => state.watchtowerLoadingPlayerIds.delete(getPlayerKey(player)));
      state.watchtowerScanActive = false;
      renderRosterTable();
      renderScanResultViews();
      renderAllianceData(false, false);
    }
  }
}

async function fetchPlayerWatchtowerRow(player) {
  const playerKey = getPlayerKey(player);
  let castles = [];
  let searchError = null;
  try {
    castles = normalizeCastleSearchResponse(await apiFetchWithRetry(`castle/search/${encodeURIComponent(player.player_name)}`));
  } catch (error) {
    searchError = error;
  }

  if (searchError) {
    return {
      playerKey,
      playerName: player.player_name || "-",
      rank: player.alliance_rank,
      scannedAt: new Date(),
      unavailableCount: 0,
      errorCount: 1,
      searchError,
      castles: [],
      targetCastles: [],
      buildingRows: [],
    };
  }

  const availableCastles = castles.filter((castle) => castle.isAvailable);
  const unavailableCount = castles.length - availableCastles.length;

  const castleResults = await mapLimit(availableCastles, 3, async (castle, index) => {
    try {
      const castleData = await apiFetchWithRetry(
        `castle/analysis/${encodeURIComponent(castle.id)}?kingdomId=${encodeURIComponent(castle.kingdomId || 0)}`,
      );
      return mapWatchtowerScanCastleResult(player, playerKey, castle, castleData, null, index);
    } catch (error) {
      return mapWatchtowerScanCastleResult(player, playerKey, castle, null, error, index);
    }
  });

  return {
    playerKey,
    playerName: player.player_name || "-",
    rank: player.alliance_rank,
    scannedAt: new Date(),
    unavailableCount,
    errorCount: castleResults.filter((result) => result.watchtower.error || result.target.error).length,
    searchError: null,
    castles: castleResults.map((result) => result.watchtower).sort(sortScanResultCastles),
    targetCastles: castleResults.map((result) => result.target).sort(sortScanResultCastles),
    buildingRows: castleResults.flatMap((result) => result.buildingRows || []).sort(sortBuildingRows),
  };
}

function mapWatchtowerScanCastleResult(player, playerKey, castle, castleData, error, displayIndex = 0) {
  const structures = error ? [] : extractCastleStructures(castleData);
  const targetResult = {
    castle,
    castleData,
    structures,
    rows: [],
    error,
  };
  return {
    watchtower: mapWatchtowerCastleResult(castle, castleData, error, structures, displayIndex),
    target: mapAttackScoreCastleResult(scoreCastleTarget(player, { playerKey }, castle, targetResult), error, displayIndex),
    buildingRows: error ? [] : mapBuildingRows(player, castle, castleData, [], displayIndex),
  };
}

function mapWatchtowerCastleResult(castle, castleData, error, structures = null, displayIndex = 0) {
  const castleStructures = structures || (error ? [] : extractCastleStructures(castleData));
  const watchtowers = castleStructures.filter((structure) => {
    return structure.group === "building" && ["watchtower", "factionwatchtower"].includes(structure.name);
  });
  const levels = watchtowers.map((structure) => Number(structure.level || 0)).filter((level) => level > 0);
  return {
    castleId: castle.id || "",
    castleName: castle.name || castleData?.castleName || "Unnamed castle",
    castleType: Number(castle.type || castleData?.castleType || 0),
    castleIconUrl: getCastleIconUrl(castle),
    kingdomId: Number(castle.kingdomId || 0),
    displayIndex,
    level: levels.length > 0 ? Math.max(...levels) : null,
    count: watchtowers.length,
    error,
  };
}

function mapAttackScoreCastleResult(target, error, displayIndex = 0) {
  return {
    ...target,
    key: target.key || "",
    displayIndex,
    error: error ? true : null,
  };
}

function sortScanResultCastles(a, b) {
  const bucketSort = getCastleDisplaySortBucket(a) - getCastleDisplaySortBucket(b);
  if (bucketSort !== 0) return bucketSort;
  const indexSort = Number(a.displayIndex ?? 999) - Number(b.displayIndex ?? 999);
  if (indexSort !== 0) return indexSort;
  return String(a.castleName || "").localeCompare(String(b.castleName || ""), undefined, { sensitivity: "base" });
}

function getCastleDisplaySortBucket(castle) {
  const type = Number(castle?.castleType || 0);
  const kingdom = Number(castle?.kingdomId || 0);
  if (kingdom === 0 && type === 1) return 0;
  if (kingdom === 0 && type === 4) return 10;
  if (kingdom === 2) return 20;
  if (kingdom === 1) return 30;
  if (kingdom === 3) return 40;
  return 100 + kingdom * 10 + type;
}

function storePlayerBuildingRows(playerKey, rows) {
  state.buildingScanRows = [
    ...state.buildingScanRows.filter((row) => row.playerKey !== playerKey),
    ...rows,
  ].sort(sortBuildingRows);

  const watchtowerResult = state.watchtowerResults.get(playerKey);
  if (watchtowerResult) {
    watchtowerResult.buildingRows = rows;
    state.watchtowerResults.set(playerKey, watchtowerResult);
    cacheCurrentWatchtowerResults();
  }
}

function openPlayerDetails(playerKey, mode = "building") {
  state.collapsedBuildingCastleKeys = new Set(
    [...state.collapsedBuildingCastleKeys].filter((key) => !key.startsWith(`${playerKey}|`)),
  );
  state.openTargetCastleKeys = new Set(
    [...state.openTargetCastleKeys].filter((key) => !key.startsWith(`${playerKey}|`)),
  );
  state.openPublicOrderCastleKeys = new Set(
    [...state.openPublicOrderCastleKeys].filter((key) => !key.startsWith(`${playerKey}|`)),
  );
  state.openConstructionItemCastleKeys = new Set(
    [...state.openConstructionItemCastleKeys].filter((key) => !key.startsWith(`${playerKey}|`)),
  );
  state.activePlayerDetailModes.set(playerKey, mode);
  state.expandedBuildingPlayerIds.add(playerKey);
}

async function fetchBuildingScanRows(player) {
  const playerKey = getPlayerKey(player);
  const castles = normalizeCastleSearchResponse(await apiFetchWithRetry(`castle/search/${encodeURIComponent(player.player_name)}`));
  const availableCastles = castles.filter((castle) => castle.isAvailable);

  if (availableCastles.length === 0) {
    return [{
      playerKey,
      playerName: player.player_name,
      castleName: "No available castles",
      castleId: "",
      castleIconUrl: "",
      castleType: 0,
      kingdomId: 0,
      displayIndex: 0,
      buildingName: "No castles",
      buildingIconUrl: "",
      count: 0,
      maxLevel: 0,
      levels: [],
      instances: [],
      missing: true,
    }];
  }

  renderWatchtowerStatus(`Scanning all building data for ${availableCastles.length} castles owned by ${player.player_name}...`);

  const castleRows = await mapLimit(availableCastles, 3, async (castle, index) => {
    renderWatchtowerStatus(`Scanning castle ${index + 1}/${availableCastles.length}: ${castle.name || player.player_name}`);
    try {
      const castleData = await apiFetchWithRetry(
        `castle/analysis/${encodeURIComponent(castle.id)}?kingdomId=${encodeURIComponent(castle.kingdomId || 0)}`,
      );
      return mapBuildingRows(player, castle, castleData, [], index);
    } catch {
      return [{
        playerKey,
        playerName: player.player_name,
        castleName: castle.name || "Unavailable castle",
        castleId: castle.id || "",
        castleType: Number(castle.type || 0),
        castleIconUrl: getCastleIconUrl(castle),
        kingdomId: Number(castle.kingdomId || 0),
        displayIndex: index,
        buildingName: "Castle unavailable",
        buildingIconUrl: "",
        count: 0,
        maxLevel: 0,
        levels: [],
        instances: [],
        missing: true,
      }];
    }
  });

  return castleRows.flat();
}

async function fetchPlayerScanData(player) {
  const playerKey = getPlayerKey(player);
  const castles = normalizeCastleSearchResponse(await apiFetchWithRetry(`castle/search/${encodeURIComponent(player.player_name)}`));
  const availableCastles = castles.filter((castle) => castle.isAvailable);

  if (availableCastles.length === 0) {
    return {
      player,
      playerKey,
      castles,
      availableCastles,
      castleResults: [],
      rows: [],
    };
  }

  renderWatchtowerStatus(`Evaluating attack risk for ${availableCastles.length} castles owned by ${player.player_name}...`);

  const castleResults = await mapLimit(availableCastles, 3, async (castle, index) => {
    renderWatchtowerStatus(`Scanning castle ${index + 1}/${availableCastles.length}: ${castle.name || player.player_name}`);
    try {
      const castleData = await apiFetchWithRetry(
        `castle/analysis/${encodeURIComponent(castle.id)}?kingdomId=${encodeURIComponent(castle.kingdomId || 0)}`,
      );
      return {
        castle,
        castleData,
        structures: extractCastleStructures(castleData),
        rows: [],
        error: null,
      };
    } catch (error) {
      return {
        castle,
        castleData: null,
        structures: [],
        rows: [],
        error,
      };
    }
  });

  return {
    player,
    playerKey,
    castles,
    availableCastles,
    castleResults,
    rows: castleResults.flatMap((result) => result.rows),
  };
}

function sortBuildingRows(a, b) {
  if (a.playerName !== b.playerName) return a.playerName.localeCompare(b.playerName);
  const castleSort = sortScanResultCastles(a, b);
  if (castleSort !== 0) return castleSort;
  if (a.missing !== b.missing) return a.missing ? 1 : -1;
  if (b.maxLevel !== a.maxLevel) return b.maxLevel - a.maxLevel;
  return a.buildingName.localeCompare(b.buildingName);
}

function mapBuildingRows(player, castle, castleData, selectedFilters = [], displayIndex = 0) {
  const allStructures = [
    ...(castleData?.data?.buildings || []),
    ...(castleData?.data?.gates || []),
    ...(castleData?.data?.defenses || []),
    ...(castleData?.data?.towers || []),
  ].map((building) => {
    const item = state.buildingItemByWod.get(Number(building.wodID));
    if (!item) return null;
    const key = getBuildingKey(item);
    const catalogItem = state.buildingCatalog.find((filter) => filter.key === key);
    if (!catalogItem) return null;
    return { raw: building, item, catalogItem };
  }).filter(Boolean);

  const filterKeys = selectedFilters.length > 0 ? selectedFilters.map((filter) => filter.key) : [
    ...new Set(allStructures.map((entry) => entry.catalogItem.key)),
  ];

  if (filterKeys.length === 0) {
    return [buildMissingBuildingRow(player, castle, castleData, {
      key: "none",
      displayName: "No matching buildings",
      iconUrl: "",
      group: "",
    }, displayIndex)];
  }

  return filterKeys.map((key) => {
    const filter = state.buildingCatalog.find((building) => building.key === key);
    const matches = allStructures.filter((entry) => entry.catalogItem.key === key);
    if (!filter || matches.length === 0) {
      return buildMissingBuildingRow(player, castle, castleData, filter || {
        key,
        displayName: key,
        iconUrl: "",
        group: "",
      }, displayIndex);
    }

    const levels = matches.map((entry) => Number(entry.item.level || 0)).sort((a, b) => a - b);
    return {
      playerKey: getPlayerKey(player),
      playerName: player.player_name,
      castleName: castle.name || castleData?.castleName || "Unnamed castle",
      castleId: castle.id || castleData?.castleId || "",
      castleType: Number(castle.type || castleData?.castleType || 0),
      castleIconUrl: getCastleIconUrl(castle),
      kingdomId: Number(castle.kingdomId || 0),
      displayIndex,
      buildingKey: filter.key,
      buildingName: filter.displayName,
      buildingGroup: filter.group,
      buildingIconUrl: filter.iconUrl,
      count: matches.length,
      maxLevel: Math.max(...levels),
      levels,
      instances: matches.map((entry) => ({
        objectID: entry.raw.objectID,
        wodID: entry.raw.wodID,
        level: Number(entry.item.level || 0),
        positionX: entry.raw.positionX,
        positionY: entry.raw.positionY,
        hitPoints: Number(entry.raw.hitPoints || 0),
        efficiency: Number(entry.raw.efficiency || 0),
        buildingState: Number(entry.raw.buildingState || 0),
        damageFactor: Number(entry.raw.damageFactor || 0),
        constructionItems: getConstructionItemsForBuilding(castleData, entry.raw.objectID),
      })),
      missing: false,
    };
  });
}

function getConstructionItemsForBuilding(castleData, objectID) {
  const rawItems = castleData?.constructionItems?.[String(objectID)] || [];
  if (!Array.isArray(rawItems)) return [];

  return rawItems.map((entry) => {
    const itemId = Array.isArray(entry) ? Number(entry[0]) : Number(entry?.constructionItemID || entry?.id || entry);
    const item = state.constructionItemById.get(itemId);
    if (!item) {
      return {
        id: itemId,
        name: `Construction item ${itemId || "-"}`,
        displayName: `Construction item ${itemId || "-"}`,
        slotTypeID: 0,
        slotName: "Appearance",
        level: "-",
        rarityName: "Unknown",
        rarityColor: "#6b746d",
        iconUrl: "",
        boxUrl: getConstructionItemBoxUrl(0, 0),
        effectText: "No catalog data available.",
      };
    }
    return normalizeConstructionItem(item);
  }).sort((a, b) => {
    const order = { 1: 0, 0: 1, 2: 2 };
    return (order[a.slotTypeID] ?? 9) - (order[b.slotTypeID] ?? 9);
  });
}

function normalizeConstructionItem(item) {
  const slotTypeID = Number(item.slotTypeID || 0);
  const rarityId = Number(item.rarenessID || 0);
  const level = slotTypeID === 0 ? 1 : Number(item.level || 0);
  return {
    id: Number(item.constructionItemID || 0),
    name: String(item.name || ""),
    displayName: formatConstructionItemName(item),
    slotTypeID,
    slotName: getConstructionItemSlotName(slotTypeID),
    level,
    rarityName: getConstructionItemRarityName(rarityId),
    rarityColor: getConstructionItemRarityColor(rarityId),
    iconUrl: getConstructionItemIconUrl(item),
    boxUrl: getConstructionItemBoxUrl(slotTypeID, rarityId),
    effectText: getConstructionItemEffectText(item),
    comment: formatConstructionComment(item.comment2 || item.comment1 || ""),
  };
}

function buildMissingBuildingRow(player, castle, castleData, filter, displayIndex = 0) {
  return {
    playerKey: getPlayerKey(player),
    playerName: player.player_name,
    castleName: castle.name || castleData?.castleName || "Unnamed castle",
    castleId: castle.id || castleData?.castleId || "",
    castleType: Number(castle.type || castleData?.castleType || 0),
    castleIconUrl: getCastleIconUrl(castle),
    kingdomId: Number(castle.kingdomId || 0),
    displayIndex,
    buildingKey: filter.key,
    buildingName: filter.displayName,
    buildingGroup: filter.group,
    buildingIconUrl: filter.iconUrl,
    count: 0,
    maxLevel: 0,
    levels: [],
    instances: [],
    missing: true,
  };
}

function extractCastleStructures(castleData) {
  return [
    ...(castleData?.data?.buildings || []),
    ...(castleData?.data?.gates || []),
    ...(castleData?.data?.defenses || []),
    ...(castleData?.data?.towers || []),
  ].map((building) => {
    const item = state.buildingItemByWod.get(Number(building.wodID));
    if (!item) return null;
    const key = getBuildingKey(item);
    const catalogItem = state.buildingCatalog.find((filter) => filter.key === key);
    return {
      raw: building,
      item,
      catalogItem,
      key,
      name: cleanAssetPart(item.name),
      group: cleanAssetPart(item.group),
      level: Number(item.level || 0),
      constructionItems: getConstructionItemsForBuilding(castleData, building.objectID),
    };
  }).filter(Boolean);
}

function buildTargetEvaluation(player, scanData) {
  const castleTargets = scanData.availableCastles.map((castle) => {
    const result = scanData.castleResults.find((item) => String(item.castle.id) === String(castle.id));
    return scoreCastleTarget(player, scanData, castle, result);
  });
  const bestCastle = castleTargets.length > 0
    ? castleTargets.reduce((best, castle) => (castle.score < best.score ? castle : best), castleTargets[0])
    : null;
  const confidenceScore = scoreTargetConfidence(scanData, castleTargets);
  const warnings = [];
  const notes = [];

  if (scanData.castles.length > scanData.availableCastles.length) {
    warnings.push(`${scanData.castles.length - scanData.availableCastles.length} castle ${scanData.castles.length - scanData.availableCastles.length === 1 ? "was" : "were"} unavailable.`);
  }

  const score = bestCastle ? bestCastle.score : 0;
  const verdict = confidenceScore < 35 ? "Insufficient data" : getTargetVerdict(score);

  return {
    player,
    playerKey: scanData.playerKey,
    scanData,
    score,
    verdict,
    verdictClass: getTargetVerdictClass(verdict),
    confidence: getConfidenceLabel(confidenceScore),
    confidenceScore,
    bestCastle,
    breakdown: bestCastle?.breakdown || { defense: 0 },
    categories: bestCastle?.categories || {
      defense: makeScoreCategory("Defense strength", 0, [], ["No castle defense data was available."]),
    },
    warnings,
    notes,
    castles: castleTargets,
  };
}

function scoreCastleTarget(player, scanData, castle, result) {
  const defense = scoreDefenseStrength(castle, result?.structures || []);
  const publicOrder = scoreDefensivePublicOrder(result?.castleData);
  const constructionItemRows = mapDefensiveConstructionItemRows(player, castle, result?.structures || []);
  const defenseScore = Math.round(defense.score * 0.8 + publicOrder.score * 0.2);
  const categories = {
    defense: makeScoreCategory("Defense strength", defenseScore, [...defense.details, ...publicOrder.details], [...defense.notes, ...publicOrder.notes]),
  };
  const breakdown = {
    defense: categories.defense.score,
  };
  const score = categories.defense.score;
  const warnings = [];
  if (result?.error) warnings.push("Castle analysis failed; score uses lightweight castle data only.");

  return {
    key: getCastleTargetKey(scanData.playerKey, castle),
    castleName: castle.name || "Unnamed castle",
    castleType: Number(castle.type || 0),
    castleIconUrl: getCastleIconUrl(castle),
    kingdomId: Number(castle.kingdomId || 0),
    score: clampNumber(score, 0, 100),
    verdict: getTargetVerdict(score),
    verdictClass: getTargetVerdictClass(getTargetVerdict(score)),
    breakdown,
    categories,
    publicOrderItems: publicOrder.items,
    publicOrderTotal: publicOrder.publicOrderTotal,
    publicOrderScore: publicOrder.score,
    constructionItemRows,
    notes: [...defense.notes, ...publicOrder.notes].slice(0, 8),
    warnings,
  };
}

function makeScoreCategory(label, score, details = [], notes = []) {
  const normalizedScore = clampNumber(Math.round(score), 0, 100);
  return {
    label,
    score: normalizedScore,
    details,
    notes,
  };
}

function scoreDefenseStrength(castle, structures) {
  const metrics = [
    makeLevelDefenseMetric("Watchtower", getMaxStructureLevel(structures, ["watchtower", "factionwatchtower"], ["building"]), 10, 18),
    makeLevelDefenseMetric("Wall", Math.max(getMaxStructureLevel(structures, ["castlewall"], ["defence"]), Number(castle.wallLevel || 0)), 9, 14),
    makeTowerDefenseMetric(castle, structures, 14),
    makeLevelDefenseMetric("Gate", Math.max(getMaxStructureLevel(structures, null, ["gate"]), Number(castle.gateLevel || 0)), 9, 12),
    makeLevelDefenseMetric("Moat", Math.max(getMaxStructureLevel(structures, null, ["moat"]), Number(castle.moatLevel || 0)), 4, 14),
    makeLevelDefenseMetric("Keep", Math.max(getMaxStructureLevel(structures, ["keep"], ["building"]), Number(castle.keepLevel || 0)), 8, 8),
    makeGuardhouseDefenseMetric(structures, 6),
    makeLevelDefenseMetric("Reinforced Vault", getMaxStructureLevel(structures, ["reinforcedvault"], ["building"]), 10, 6),
    makeLevelDefenseMetric("Stronghold", getMaxStructureLevel(structures, ["stronghold"], ["building"]), 5, 4),
  ];
  const notes = [];
  const details = [];
  let weighted = 0;
  let totalWeight = 0;

  metrics.forEach((metric) => {
    const strength = clampNumber(metric.score, 0, 100);
    weighted += strength * metric.weight;
    totalWeight += metric.weight;
    details.push({
      label: metric.label,
      value: metric.value,
      score: Math.round(strength),
      note: metric.note,
    });
    if (metric.missing) {
      notes.push(`No ${metric.label.toLowerCase()} found.`);
    } else if (strength <= 55) {
      notes.push(`${metric.label} is low at ${metric.value}.`);
    }
  });

  const constructionItemStats = getDefensiveConstructionItemStats(structures);
  const constructionItemStrength = constructionItemStats.strength;
  weighted += constructionItemStrength * 5;
  totalWeight += 5;
  details.push(
    {
      label: "Construction items",
      value: `${constructionItemStats.withItems}/${constructionItemStats.total} defensive buildings equipped`,
      score: Math.round(constructionItemStrength),
      action: "constructionItems",
      note: "One Defense strength stat based on how many defensive buildings have build items. Click to inspect the buildings.",
    },
  );
  if (constructionItemStats.weakness >= 70) notes.push("Few defensive construction items detected.");

  return {
    score: Math.round(weighted / totalWeight),
    notes,
    details,
  };
}

function makeLevelDefenseMetric(label, level, max, weight) {
  const normalizedLevel = Number(level || 0);
  const score = normalizedLevel > 0 ? (Math.min(normalizedLevel, max) / max) * 100 : 0;
  return {
    label,
    weight,
    score,
    missing: normalizedLevel === 0,
    value: normalizedLevel > 0 ? `Level ${normalizedLevel} of ${max}` : "Not detected",
    note: normalizedLevel > 0
      ? `Higher ${label.toLowerCase()} levels increase the strength score.`
      : `Missing ${label.toLowerCase()} is treated as low defensive strength.`,
  };
}

function makeTowerDefenseMetric(castle, structures, weight) {
  const towers = structures.filter((structure) => structure.group === "tower" && structure.name === "guard");
  if (towers.length === 0) {
    const fallbackLevel = Number(castle.towerLevel || 0);
    return makeLevelDefenseMetric("Towers", fallbackLevel, 9, weight);
  }

  const maxPerTower = 9;
  const totalLevels = towers.reduce((sum, tower) => sum + Math.min(Number(tower.level || 0), maxPerTower), 0);
  const maxLevels = towers.length * maxPerTower;
  const score = maxLevels > 0 ? (totalLevels / maxLevels) * 100 : 0;
  return {
    label: "Towers",
    weight,
    score,
    missing: totalLevels === 0,
    value: `${totalLevels}/${maxLevels} total tower levels`,
    note: `All ${towers.length} detected towers must be level ${maxPerTower} for a 100 tower score.`,
  };
}

function makeGuardhouseDefenseMetric(structures, weight) {
  const guardhouses = structures.filter((structure) => ["guardpost", "factionguardpost"].includes(structure.name));
  const totalLevels = guardhouses.reduce((sum, guardhouse) => sum + Number(guardhouse.level || 0), 0);
  const maxLevels = 70;
  return {
    label: "Guardhouses",
    weight,
    score: Math.min(totalLevels, maxLevels) / maxLevels * 100,
    missing: totalLevels === 0,
    value: `${totalLevels}/${maxLevels} total guardhouse levels`,
    note: "Guardhouse strength uses total levels across all guardhouses; 70 total levels equals a 100 score.",
  };
}

function scoreDefensivePublicOrder(castleData) {
  const items = extractDefensivePublicOrderItems(castleData);
  const publicOrderTotal = items.reduce((sum, item) => sum + item.publicOrder, 0);
  const totals = items.reduce((result, item) => {
    item.effects.forEach((effect) => {
      result[effect.type] = (result[effect.type] || 0) + effect.value;
    });
    return result;
  }, {});

  if (items.length === 0) {
    return {
      score: 0,
      publicOrderTotal: 0,
      items: [],
      notes: ["No defense-enhancing public order found."],
      details: [{
        label: "Public order bonus",
        value: "None found",
        score: 0,
        action: "publicOrder",
        note: "This is one stat inside Defense strength. Only placed PO pieces with recognized defensive perks count here.",
      }],
    };
  }

  const poScore = Math.min(publicOrderTotal, 32000) / 32000 * 30;
  const yardScore = Math.min(totals.yardPercent || 0, 130) / 130 * 25;
  const wallScore = Math.min(totals.wallPercent || 0, 160) / 160 * 25;
  const defenseScore = Math.min(totals.defensePercent || 0, 130) / 130 * 10;
  const flatScore = Math.min((totals.flatWall || 0) + (totals.flatDefense || 0), 37500) / 37500 * 10;
  const score = Math.round(clampNumber(poScore + yardScore + wallScore + defenseScore + flatScore, 0, 100));

  return {
    score,
    publicOrderTotal,
    items,
    notes: [`${items.length} defense-enhancing PO ${items.length === 1 ? "piece" : "pieces"} found.`],
    details: [
      {
        label: "Public order bonus",
        value: `${items.length} ${items.length === 1 ? "piece" : "pieces"} - ${formatNumber(publicOrderTotal)} PO`,
        score,
        action: "publicOrder",
        note: "One Defense strength stat combining defense-enhancing pieces, courtyard defense, wall capacity, and flat troop-capacity bonuses. Click to inspect pieces.",
      },
    ],
  };
}

function extractDefensivePublicOrderItems(castleData) {
  const placedItems = [
    ...(castleData?.data?.buildings || []),
    ...(castleData?.data?.defenses || []),
    ...(castleData?.data?.towers || []),
    ...(castleData?.data?.gates || []),
  ];

  return placedItems.map((placed) => {
    const item = state.buildingItemByWod.get(Number(placed.wodID));
    if (!item || String(item.buildingGroundType || "").toUpperCase() !== "DECO") return null;
    const effects = parseDefensivePublicOrderEffects(item.areaSpecificEffects);
    const publicOrder = getPublicOrderValue(item);
    if (publicOrder <= 0 || effects.length === 0) return null;
    return {
      objectID: placed.objectID,
      wodID: placed.wodID,
      name: formatPublicOrderName(item),
      publicOrder,
      effects,
      iconUrl: getBuildingAssetUrl(item),
      size: `${item.width || "?"}x${item.height || "?"}`,
    };
  }).filter(Boolean).sort((a, b) => {
    if (b.publicOrder !== a.publicOrder) return b.publicOrder - a.publicOrder;
    return a.name.localeCompare(b.name);
  });
}

function parseDefensivePublicOrderEffects(areaSpecificEffects) {
  if (!areaSpecificEffects) return [];
  return String(areaSpecificEffects).split(",").map((entry) => {
    const [effectId, rawValue] = entry.split("&");
    const definition = DEFENSIVE_PUBLIC_ORDER_EFFECTS.get(String(effectId));
    if (!definition) return null;
    const value = Number(rawValue || 0);
    return {
      id: String(effectId),
      label: definition.label,
      type: definition.type,
      value,
      valueLabel: formatPublicOrderEffectValue(value, definition.type),
    };
  }).filter(Boolean);
}

function formatPublicOrderEffectValue(value, type) {
  if (type === "flatWall" || type === "flatDefense") return `+${formatNumber(value)}`;
  return `+${formatNumber(value)}%`;
}

function getPublicOrderValue(item) {
  if (item?.decoPoints) return parseNumeric(item.decoPoints);
  const fusionLevel = parseNumeric(item?.initialFusionLevel);
  return fusionLevel > 0 ? 100 + fusionLevel * 5 : 0;
}

function formatPublicOrderName(item) {
  const rawName = String(item.type || item.name || "Public order").replace(/^Level/i, "");
  return formatConstructionComment(rawName || item.comment2 || item.comment1 || "Public order");
}

function scoreTargetConfidence(scanData, castleTargets) {
  let score = 100;
  if (castleTargets.length === 0) score -= 60;
  score -= scanData.castleResults.filter((result) => result.error).length * 20;
  score -= Math.min(30, (scanData.castles.length - scanData.availableCastles.length) * 10);
  return clampNumber(score, 0, 100);
}

function getMaxStructureLevel(structures, names, groups) {
  return structures
    .filter((structure) => {
      const nameMatches = !names || names.includes(structure.name);
      const groupMatches = !groups || groups.includes(structure.group);
      return nameMatches && groupMatches;
    })
    .reduce((max, structure) => Math.max(max, Number(structure.level || 0)), 0);
}

function mapDefensiveConstructionItemRows(player, castle, structures) {
  return structures
    .map((structure) => ({
      structure,
      defensiveItems: getDefensiveConstructionItems(structure),
    }))
    .filter(({ defensiveItems }) => defensiveItems.length > 0)
    .map(({ structure, defensiveItems }) => {
      const displayName = structure.catalogItem?.displayName || formatBuildingName(structure.item?.name || structure.name, structure.item?.group || structure.group);
      return {
        playerKey: getPlayerKey(player),
        playerName: player.player_name,
        castleName: castle.name || "Unnamed castle",
        castleId: castle.id || "",
        castleType: Number(castle.type || 0),
        castleIconUrl: getCastleIconUrl(castle),
        kingdomId: Number(castle.kingdomId || 0),
        buildingKey: structure.key,
        buildingName: displayName,
        buildingGroup: structure.item?.group || structure.group || "Building",
        buildingIconUrl: structure.catalogItem?.iconUrl || getBuildingAssetUrl(structure.item || {}),
        count: 1,
        maxLevel: Number(structure.level || 0),
        levels: [Number(structure.level || 0)],
        instances: [{
          objectID: structure.raw.objectID,
          wodID: structure.raw.wodID,
          level: Number(structure.level || 0),
          positionX: structure.raw.positionX,
          positionY: structure.raw.positionY,
          hitPoints: Number(structure.raw.hitPoints || 0),
          efficiency: Number(structure.raw.efficiency || 0),
          buildingState: Number(structure.raw.buildingState || 0),
          damageFactor: Number(structure.raw.damageFactor || 0),
          constructionItems: defensiveItems,
        }],
        missing: false,
      };
    });
}

function getDefensiveConstructionItemStats(structures) {
  const defensiveStructures = structures.filter(isDefensiveStructure);
  const structuresWithDefensiveItems = structures.filter((structure) => getDefensiveConstructionItems(structure).length > 0);
  const total = Math.max(defensiveStructures.length, structuresWithDefensiveItems.length);
  if (defensiveStructures.length === 0) {
    return {
      total,
      withItems: structuresWithDefensiveItems.length,
      itemCount: structuresWithDefensiveItems.reduce((sum, structure) => sum + getDefensiveConstructionItems(structure).length, 0),
      weakness: 100,
      strength: total > 0 ? 100 : 0,
    };
  }
  const withItems = structuresWithDefensiveItems.length;
  const itemCount = structuresWithDefensiveItems.reduce((sum, structure) => sum + getDefensiveConstructionItems(structure).length, 0);
  const weakness = clampNumber(100 - (withItems / total) * 100, 0, 100);
  return {
    total,
    withItems,
    itemCount,
    weakness,
    strength: 100 - weakness,
  };
}

function isDefensiveStructure(structure) {
  return (
    ["tower", "gate", "moat", "defence"].includes(structure.group) ||
    ["watchtower", "factionwatchtower", "keep", "guardpost", "factionguardpost", "stronghold", "reinforcedvault"].includes(structure.name)
  );
}

function getDefensiveConstructionItems(structure) {
  return (structure.constructionItems || []).filter(isDefensiveConstructionItem);
}

function isDefensiveConstructionItem(item) {
  const searchText = getConstructionItemSearchText(item);
  if (NON_DEFENSIVE_CONSTRUCTION_ITEM_KEYWORDS.some((keyword) => constructionItemTextIncludes(searchText, keyword))) {
    return false;
  }
  return DEFENSIVE_CONSTRUCTION_ITEM_KEYWORDS.some((keyword) => constructionItemTextIncludes(searchText, keyword));
}

function getConstructionItemSearchText(item) {
  const text = [
    item.name,
    item.displayName,
    item.effectText,
    item.comment,
    item.slotName,
  ].join(" ").toLowerCase();
  return {
    text,
    compact: text.replaceAll(/[^a-z0-9]+/g, ""),
  };
}

function constructionItemTextIncludes(searchText, keyword) {
  const normalizedKeyword = String(keyword).toLowerCase();
  const compactKeyword = normalizedKeyword.replaceAll(/[^a-z0-9]+/g, "");
  return searchText.text.includes(normalizedKeyword) || searchText.compact.includes(compactKeyword);
}

function getHistoryPoints(stats, key) {
  const points = Array.isArray(stats?.points?.[key]) ? stats.points[key] : [];
  return points
    .map((point) => ({
      date: new Date(point.date),
      point: parseNumeric(point.point),
    }))
    .filter((point) => !Number.isNaN(point.date.getTime()))
    .sort((a, b) => a.date.getTime() - b.date.getTime());
}

function getAllianceLootActivityByPlayer(stats) {
  const grouped = new Map();
  const points = Array.isArray(stats?.points?.player_loot_history) ? stats.points.player_loot_history : [];
  points.forEach((point) => {
    const playerKey = String(point.player_id || "");
    const date = new Date(point.date);
    if (!playerKey || Number.isNaN(date.getTime())) return;
    if (!grouped.has(playerKey)) grouped.set(playerKey, []);
    grouped.get(playerKey).push({
      date,
      point: parseNumeric(point.point),
    });
  });

  const activityByPlayer = new Map();
  grouped.forEach((playerPoints, playerKey) => {
    const sortedPoints = playerPoints.sort((a, b) => a.date.getTime() - b.date.getTime());
    activityByPlayer.set(playerKey, {
      latestPositiveDate: getLatestPositiveGainDate(sortedPoints),
      botLikeLootStreak: getBotLikeLootStreak(sortedPoints),
    });
  });
  return activityByPlayer;
}

function getLatestPositiveGainDate(points) {
  let latest = null;
  for (let index = 1; index < points.length; index += 1) {
    if (points[index].point - points[index - 1].point > 0) latest = points[index].date;
  }
  return latest;
}

function getBotLikeLootStreak(points) {
  let current = buildEmptyLootStreak();
  let longest = buildEmptyLootStreak();

  for (let index = 1; index < points.length; index += 1) {
    const previous = points[index - 1];
    const point = points[index];
    const gainedLoot = point.point - previous.point > 0;
    const gapHours = (point.date.getTime() - previous.date.getTime()) / 36e5;

    if (!gainedLoot || !isContinuousLootInterval(gapHours)) {
      current = buildEmptyLootStreak();
      continue;
    }

    if (!current.startDate) {
      current = {
        startDate: previous.date,
        endDate: point.date,
        changes: 1,
        hours: gapHours,
        isFlagged: false,
      };
    } else {
      current = {
        ...current,
        endDate: point.date,
        changes: current.changes + 1,
        hours: current.hours + gapHours,
      };
    }

    if (current.hours > longest.hours) {
      longest = { ...current };
    }
  }

  return {
    ...longest,
    hours: Math.round(longest.hours * 10) / 10,
    isFlagged: longest.hours >= BOT_LOOT_STREAK_HOURS,
  };
}

function isContinuousLootInterval(hours) {
  return hours >= LOOT_STREAK_MIN_INTERVAL_HOURS && hours <= LOOT_STREAK_MAX_INTERVAL_HOURS;
}

function buildEmptyLootStreak() {
  return {
    startDate: null,
    endDate: null,
    changes: 0,
    hours: 0,
    isFlagged: false,
  };
}

function formatStreakHours(hours) {
  const rounded = Math.round(Number(hours || 0) * 10) / 10;
  return Number.isInteger(rounded) ? `${rounded} hours` : `${rounded.toFixed(1)} hours`;
}

function getTargetVerdict(score) {
  if (score <= 24) return "Good target";
  if (score <= 49) return "Possible target";
  if (score <= 74) return "Hard target";
  return "Poor target";
}

function getTargetVerdictClass(verdict) {
  if (verdict === "Good target") return "good";
  if (verdict === "Possible target") return "possible";
  if (verdict === "Hard target") return "hard";
  if (verdict === "Poor target") return "poor";
  return "unknown";
}

function getConfidenceLabel(score) {
  if (score >= 80) return "High";
  if (score >= 55) return "Medium";
  return "Low";
}

function renderWatchtowerStatus(customStatus) {
  if (customStatus) {
    elements.watchtowerStatus.hidden = false;
    elements.watchtowerStatus.textContent = customStatus;
    syncRosterStatusVisibility();
    return;
  }

  elements.watchtowerStatus.textContent = "";
  elements.watchtowerStatus.hidden = true;
  syncRosterStatusVisibility();
}

function syncRosterStatusVisibility() {
  const showBuildingFilter = state.activeRosterTab === "roster";
  const showStatus = Boolean(elements.watchtowerStatus?.textContent.trim()) && elements.watchtowerStatus.hidden === false;
  if (elements.buildingFilter) {
    elements.buildingFilter.hidden = !showBuildingFilter;
  }
  if (elements.watchtowerInlineStatus) {
    elements.watchtowerInlineStatus.hidden = !showStatus;
  }
}

function keepViewportStable(anchor, callback) {
  const beforeTop = getViewportAnchorTop(anchor);
  callback();
  if (beforeTop === null) return;

  const afterTop = getViewportAnchorTop(anchor);
  if (afterTop === null) return;

  const delta = afterTop - beforeTop;
  if (Math.abs(delta) > 0.5) {
    window.scrollTo(window.scrollX, Math.max(0, window.scrollY + delta));
  }
}

function getViewportAnchorTop(anchor) {
  if (!anchor || typeof anchor.getBoundingClientRect !== "function") return null;
  const rect = anchor.getBoundingClientRect();
  if (rect.bottom < 0 || rect.top > window.innerHeight) return null;
  return rect.top;
}

function resetWatchtowerScanState({ restoreResults = false } = {}) {
  state.watchtowerScanId += 1;
  state.watchtowerSelectedPlayerIds = new Set();
  state.watchtowerLoadingPlayerIds = new Set();
  state.activeAttackScoreCastleKey = "";
  if (restoreResults) {
    restoreWatchtowerResultsForCurrentAlliance();
  } else {
    state.watchtowerResults = new Map();
  }
  state.watchtowerScanActive = false;
  state.activeRosterTab = "roster";
}

function getWatchtowerAllianceCacheKey(alliance = state.currentAlliance, server = state.server) {
  if (!alliance?.alliance_id || !server) return "";
  return `${server}:${alliance.alliance_id}`;
}

function cacheCurrentWatchtowerResults() {
  const cacheKey = getWatchtowerAllianceCacheKey();
  cacheWatchtowerResultsForAllianceKey(cacheKey, state.watchtowerResults);
}

function cacheWatchtowerResultsForAllianceKey(cacheKey, results) {
  if (!cacheKey) return;

  if (results.size === 0) {
    state.watchtowerResultsByAlliance.delete(cacheKey);
  } else {
    state.watchtowerResultsByAlliance.set(cacheKey, cloneWatchtowerResults(results));
  }
  persistWatchtowerSessionCache();
}

function restoreWatchtowerResultsForCurrentAlliance() {
  const cacheKey = getWatchtowerAllianceCacheKey();
  const cachedResults = cacheKey ? state.watchtowerResultsByAlliance.get(cacheKey) : null;
  state.watchtowerResults = cachedResults ? cloneWatchtowerResults(cachedResults) : new Map();
  restoreBuildingRowsFromWatchtowerResults();
}

function restoreBuildingRowsFromWatchtowerResults() {
  state.buildingScanRows = [...state.watchtowerResults.values()]
    .flatMap((row) => Array.isArray(row.buildingRows) ? row.buildingRows : [])
    .sort(sortBuildingRows);
}

function cloneWatchtowerResults(results) {
  const cloned = new Map();
  results.forEach((row) => {
    const normalizedRow = normalizeWatchtowerResultRow(row);
    if (normalizedRow) {
      cloned.set(normalizedRow.playerKey, normalizedRow);
    }
  });
  return cloned;
}

function loadWatchtowerSessionCache() {
  try {
    const rawCache = sessionStorage.getItem(WATCHTOWER_SESSION_CACHE_KEY);
    if (!rawCache) return new Map();
    const parsedCache = JSON.parse(rawCache);
    if (!parsedCache || typeof parsedCache !== "object") return new Map();

    const cache = new Map();
    Object.entries(parsedCache).forEach(([cacheKey, rows]) => {
      const results = new Map();
      (Array.isArray(rows) ? rows : []).forEach((row) => {
        const normalizedRow = normalizeWatchtowerResultRow(row);
        if (normalizedRow) results.set(normalizedRow.playerKey, normalizedRow);
      });
      if (results.size > 0) cache.set(cacheKey, results);
    });
    return cache;
  } catch {
    return new Map();
  }
}

function persistWatchtowerSessionCache() {
  try {
    const cache = {};
    state.watchtowerResultsByAlliance.forEach((results, cacheKey) => {
      if (results.size > 0) {
        cache[cacheKey] = [...results.values()].map(serializeWatchtowerResultRow).filter(Boolean);
      }
    });
    sessionStorage.setItem(WATCHTOWER_SESSION_CACHE_KEY, JSON.stringify(cache));
  } catch {
    // Session storage can be unavailable in private or restricted browser contexts.
  }
}

function normalizeWatchtowerResultRow(row) {
  if (!row || typeof row !== "object") return null;
  const playerKey = String(row.playerKey || "");
  if (!playerKey) return null;

  return {
    playerKey,
    playerName: String(row.playerName || "-"),
    rank: row.rank,
    scannedAt: row.scannedAt || new Date().toISOString(),
    unavailableCount: Math.max(0, Math.trunc(Number(row.unavailableCount) || 0)),
    errorCount: Math.max(0, Math.trunc(Number(row.errorCount) || 0)),
    searchError: row.searchError ? true : null,
    castles: (Array.isArray(row.castles) ? row.castles : []).map(normalizeWatchtowerCastleResult).filter(Boolean),
    targetCastles: (Array.isArray(row.targetCastles) ? row.targetCastles : []).map(normalizeAttackScoreCastleResult).filter(Boolean),
    buildingRows: (Array.isArray(row.buildingRows) ? row.buildingRows : []).map(normalizeBuildingScanRow).filter(Boolean).sort(sortBuildingRows),
  };
}

function normalizeWatchtowerCastleResult(castle) {
  if (!castle || typeof castle !== "object") return null;
  const level = castle.level === null || castle.level === undefined || castle.level === "" ? null : Number(castle.level);
  return {
    castleId: String(castle.castleId || ""),
    castleName: String(castle.castleName || "Unnamed castle"),
    castleType: Number(castle.castleType || 0),
    castleIconUrl: String(castle.castleIconUrl || ""),
    kingdomId: Number(castle.kingdomId || 0),
    displayIndex: Math.max(0, Math.trunc(Number(castle.displayIndex) || 0)),
    level: Number.isFinite(level) ? level : null,
    count: Math.max(0, Math.trunc(Number(castle.count) || 0)),
    error: castle.error ? true : null,
  };
}

function normalizeAttackScoreCastleResult(castle) {
  if (!castle || typeof castle !== "object") return null;
  const score = Number(castle.score || 0);
  const key = String(castle.key || castle.castleId || "");
  return {
    key,
    castleId: String(castle.castleId || ""),
    castleName: String(castle.castleName || "Unnamed castle"),
    castleType: Number(castle.castleType || 0),
    castleIconUrl: String(castle.castleIconUrl || ""),
    kingdomId: Number(castle.kingdomId || 0),
    displayIndex: Math.max(0, Math.trunc(Number(castle.displayIndex) || 0)),
    score: clampNumber(Number.isFinite(score) ? Math.round(score) : 0, 0, 100),
    verdict: String(castle.verdict || "Insufficient data"),
    verdictClass: getTargetVerdictClass(castle.verdict || "Insufficient data"),
    breakdown: castle.breakdown || { defense: score },
    categories: normalizeScoreCategories(castle.categories, score),
    publicOrderItems: Array.isArray(castle.publicOrderItems) ? castle.publicOrderItems : [],
    publicOrderTotal: Math.max(0, Math.trunc(Number(castle.publicOrderTotal) || 0)),
    publicOrderScore: Math.max(0, Math.trunc(Number(castle.publicOrderScore) || 0)),
    constructionItemRows: (Array.isArray(castle.constructionItemRows) ? castle.constructionItemRows : []).map(normalizeBuildingScanRow).filter(Boolean),
    notes: (Array.isArray(castle.notes) ? castle.notes : []).map((note) => String(note)),
    warnings: (Array.isArray(castle.warnings) ? castle.warnings : []).map((warning) => String(warning)),
    error: castle.error ? true : null,
  };
}

function normalizeScoreCategories(categories, fallbackScore = 0) {
  const defense = categories?.defense;
  return {
    defense: {
      label: String(defense?.label || "Defense strength"),
      score: clampNumber(Math.round(Number(defense?.score ?? fallbackScore ?? 0)), 0, 100),
      details: (Array.isArray(defense?.details) ? defense.details : []).map(normalizeScoreDetail),
      notes: (Array.isArray(defense?.notes) ? defense.notes : []).map((note) => String(note)),
    },
  };
}

function normalizeScoreDetail(detail) {
  return {
    label: String(detail?.label || "Detail"),
    value: String(detail?.value || ""),
    score: clampNumber(Math.round(Number(detail?.score || 0)), 0, 100),
    action: detail?.action ? String(detail.action) : undefined,
    note: String(detail?.note || ""),
  };
}

function normalizeBuildingScanRow(row) {
  if (!row || typeof row !== "object") return null;
  const playerKey = String(row.playerKey || "");
  if (!playerKey) return null;

  return {
    playerKey,
    playerName: String(row.playerName || ""),
    castleName: String(row.castleName || "Unnamed castle"),
    castleId: String(row.castleId || ""),
    castleType: Number(row.castleType || 0),
    castleIconUrl: String(row.castleIconUrl || ""),
    kingdomId: Number(row.kingdomId || 0),
    displayIndex: Math.max(0, Math.trunc(Number(row.displayIndex) || 0)),
    buildingKey: String(row.buildingKey || ""),
    buildingName: String(row.buildingName || "Building"),
    buildingGroup: String(row.buildingGroup || "Building"),
    buildingIconUrl: String(row.buildingIconUrl || ""),
    count: Math.max(0, Math.trunc(Number(row.count) || 0)),
    maxLevel: Math.max(0, Math.trunc(Number(row.maxLevel) || 0)),
    levels: (Array.isArray(row.levels) ? row.levels : []).map((level) => Number(level || 0)),
    instances: (Array.isArray(row.instances) ? row.instances : []).map(normalizeBuildingScanInstance).filter(Boolean),
    missing: Boolean(row.missing),
  };
}

function normalizeBuildingScanInstance(instance) {
  if (!instance || typeof instance !== "object") return null;
  return {
    objectID: instance.objectID,
    wodID: instance.wodID,
    level: Number(instance.level || 0),
    positionX: instance.positionX,
    positionY: instance.positionY,
    hitPoints: Number(instance.hitPoints || 0),
    efficiency: Number(instance.efficiency || 0),
    buildingState: Number(instance.buildingState || 0),
    damageFactor: Number(instance.damageFactor || 0),
    constructionItems: Array.isArray(instance.constructionItems) ? instance.constructionItems : [],
  };
}

function serializeWatchtowerResultRow(row) {
  const normalizedRow = normalizeWatchtowerResultRow(row);
  if (!normalizedRow) return null;
  return normalizedRow;
}

function setRosterTab(tabName) {
  if (!["roster", "watchtowers", "attack-scores"].includes(tabName)) return;
  if (state.activeRosterTab === tabName) return;
  keepViewportStable(document.querySelector(".roster-tabs"), () => {
    state.activeRosterTab = tabName;
    renderRosterTabs();
  });
}

function renderRosterTabs() {
  document.querySelectorAll("[data-roster-tab]").forEach((button) => {
    const active = button.dataset.rosterTab === state.activeRosterTab;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-selected", active ? "true" : "false");
  });

  if (elements.rosterView) elements.rosterView.hidden = state.activeRosterTab !== "roster";
  if (elements.watchtowerView) elements.watchtowerView.hidden = state.activeRosterTab !== "watchtowers";
  if (elements.attackScoreView) elements.attackScoreView.hidden = state.activeRosterTab !== "attack-scores";
  syncRosterStatusVisibility();
}

function renderWatchtowerControls() {
  if (!elements.watchtowerSelectCount || !elements.scanWatchtowers) return;
  const selectedCount = state.watchtowerSelectedPlayerIds.size;
  const loadingCount = state.watchtowerLoadingPlayerIds.size;
  elements.watchtowerSelectCount.textContent = `${selectedCount} / 5 selected`;
  elements.scanWatchtowers.disabled = selectedCount === 0 || state.watchtowerScanActive || state.players.length === 0;
  elements.scanWatchtowers.classList.toggle("is-loading", state.watchtowerScanActive);
  elements.scanWatchtowers.setAttribute("aria-label", state.watchtowerScanActive
    ? `Evaluating ${loadingCount || selectedCount} selected ${loadingCount === 1 || selectedCount === 1 ? "player" : "players"}`
    : `Evaluate ${selectedCount} selected ${selectedCount === 1 ? "player" : "players"}`);
  renderRosterTabs();
}

function renderScanResultViews() {
  renderWatchtowerChart();
  renderAttackScoreChart();
}

function renderWatchtowerChart() {
  renderWatchtowerControls();
  if (!elements.watchtowerChart) return;
  renderBuildingLevelSelect();

  const rows = [...state.watchtowerResults.values()];
  const selectedBuilding = getSelectedLevelBuilding();
  if (rows.length === 0) {
    elements.watchtowerChart.innerHTML = `
      <div class="watchtower-empty">
        <img src="assets/eye-watchtower.svg" alt="">
        <strong>No evaluations yet.</strong>
        <span>Select up to 5 players, then evaluate them to show building levels by castle.</span>
      </div>
    `;
    return;
  }

  const columnCount = Math.max(1, ...rows.map((row) => row.castles.length));
  const castleHeaders = Array.from({ length: columnCount }, (_, index) => `<th>Castle ${index + 1}</th>`).join("");
  elements.watchtowerChart.innerHTML = `
    <div class="watchtower-chart-shell">
      <div class="watchtower-chart-summary">
        <img src="${escapeHtml(selectedBuilding?.iconUrl || "assets/eye-watchtower.svg")}" alt="">
        <div>
          <span class="label">Building levels</span>
          <strong>${escapeHtml(selectedBuilding?.displayName || "Building")} across ${formatNumber(rows.length)} ${rows.length === 1 ? "player" : "players"}</strong>
        </div>
      </div>
      <div class="watchtower-chart-scroll">
        <table class="watchtower-level-table" style="min-width: ${Math.max(720, 190 + columnCount * 180)}px">
          <thead>
            <tr>
              <th>Player</th>
              ${castleHeaders}
            </tr>
          </thead>
          <tbody>
            ${rows.map((row) => renderWatchtowerResultRow(row, columnCount, selectedBuilding)).join("")}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function renderAttackScoreChart() {
  renderWatchtowerControls();
  if (!elements.attackScoreChart) return;

  const rows = [...state.watchtowerResults.values()].filter((row) => Array.isArray(row.targetCastles) && row.targetCastles.length > 0);
  if (rows.length === 0) {
    elements.attackScoreChart.innerHTML = `
      <div class="watchtower-empty">
        <img src="assets/attack-target.svg" alt="">
        <strong>No attack scores yet.</strong>
        <span>Evaluate selected players to score each castle from the same castle data.</span>
      </div>
    `;
    return;
  }

  const columnCount = Math.max(1, ...rows.map((row) => row.targetCastles.length));
  const castleHeaders = Array.from({ length: columnCount }, (_, index) => `<th>Castle ${index + 1}</th>`).join("");
  const activeTarget = getActiveAttackScoreTarget(rows);
  elements.attackScoreChart.innerHTML = `
    <div class="watchtower-chart-shell attack-score-chart-shell">
      <div class="watchtower-chart-summary">
        <img src="assets/attack-target.svg" alt="">
        <div>
          <span class="label">Attack evaluation scores</span>
          <strong>${formatNumber(rows.length)} ${rows.length === 1 ? "player" : "players"} scored</strong>
        </div>
      </div>
      <div class="watchtower-chart-scroll">
        <table class="watchtower-level-table" style="min-width: ${Math.max(720, 190 + columnCount * 180)}px">
          <thead>
            <tr>
              <th>Player</th>
              ${castleHeaders}
            </tr>
          </thead>
          <tbody>
            ${rows.map((row) => renderAttackScoreResultRow(row, columnCount)).join("")}
          </tbody>
        </table>
      </div>
      ${activeTarget ? renderAttackScoreBreakdown(activeTarget) : ""}
    </div>
  `;

  elements.attackScoreChart.querySelectorAll("[data-attack-score-castle]").forEach((button) => {
    button.addEventListener("click", () => {
      toggleAttackScoreCastle(button.dataset.attackScoreCastle);
    });
  });
  elements.attackScoreChart.querySelectorAll("[data-public-order-toggle]").forEach((button) => {
    button.addEventListener("click", () => {
      togglePublicOrderDetails(button.dataset.publicOrderToggle);
    });
  });
  elements.attackScoreChart.querySelectorAll("[data-construction-item-toggle]").forEach((button) => {
    button.addEventListener("click", () => {
      toggleConstructionItemDetails(button.dataset.constructionItemToggle);
    });
  });
}

function renderWatchtowerResultRow(row, columnCount, selectedBuilding) {
  const cells = Array.from({ length: columnCount }, (_, index) => {
    return renderBuildingLevelCastleCell(row, row.castles[index], selectedBuilding);
  }).join("");
  return `
    <tr>
      <td>
        <span class="watchtower-player-cell">
          <strong>${escapeHtml(row.playerName)}</strong>
        </span>
      </td>
      ${cells}
    </tr>
  `;
}

function renderAttackScoreResultRow(row, columnCount) {
  const cells = Array.from({ length: columnCount }, (_, index) => {
    return renderAttackScoreCastleCell(row.targetCastles[index]);
  }).join("");
  return `
    <tr>
      <td>
        <span class="watchtower-player-cell">
          <strong>${escapeHtml(row.playerName)}</strong>
        </span>
      </td>
      ${cells}
    </tr>
  `;
}

function getActiveAttackScoreTarget(rows) {
  if (!state.activeAttackScoreCastleKey) return null;
  return rows.flatMap((row) => row.targetCastles || []).find((target) => target.key === state.activeAttackScoreCastleKey) || null;
}

function toggleAttackScoreCastle(targetKey) {
  if (!targetKey) return;
  state.activeAttackScoreCastleKey = state.activeAttackScoreCastleKey === targetKey ? "" : targetKey;
  renderAttackScoreChart();
}

function renderAttackScoreBreakdown(target) {
  return `
    <div class="attack-score-breakdown">
      <div class="attack-score-breakdown__header">
        <div>
          <span class="label">Attack score breakdown</span>
          <strong>${escapeHtml(target.castleName || "Castle")}</strong>
        </div>
        <button type="button" class="details-close-btn" data-attack-score-castle="${escapeHtml(target.key)}">Close</button>
      </div>
      ${renderCastleTargetSummary(target)}
    </div>
  `;
}

function renderBuildingLevelCastleCell(row, castle, selectedBuilding) {
  if (!castle) {
    return `
      <td>
        <span class="watchtower-castle-cell watchtower-castle-cell--empty">
          <strong>-</strong>
          <span>No castle in this slot</span>
        </span>
      </td>
    `;
  }

  const buildingRow = selectedBuilding ? getBuildingLevelRowForCastle(row, castle, selectedBuilding.key) : null;
  const levelLabel = castle.error ? "Failed" : buildingRow?.maxLevel > 0 ? `L${buildingRow.maxLevel}` : "None";
  const modifier = castle.error ? "error" : buildingRow?.maxLevel > 0 ? "found" : "missing";
  const countLabel = !selectedBuilding
    ? "Select a building"
    : buildingRow?.count > 1 ? `${buildingRow.count} found` : buildingRow?.maxLevel > 0 ? selectedBuilding.displayName : `No ${selectedBuilding.displayName}`;
  return `
    <td>
      <span class="watchtower-castle-cell watchtower-castle-cell--${modifier}">
        <img src="${escapeHtml(castle.castleIconUrl)}" alt="">
        <span class="watchtower-castle-cell__copy">
          <strong>${escapeHtml(castle.castleName)}</strong>
          <span>${escapeHtml(getKingdomName(castle.kingdomId))} - ${escapeHtml(getCastleTypeName(castle.castleType))}</span>
          <small>${escapeHtml(countLabel)}</small>
        </span>
        <b>${escapeHtml(levelLabel)}</b>
      </span>
    </td>
  `;
}

function getSelectedLevelBuilding() {
  if (!state.selectedLevelBuildingKey) syncSelectedLevelBuildingKey();
  return state.buildingCatalog.find((building) => building.key === state.selectedLevelBuildingKey) || null;
}

function getBuildingLevelRowForCastle(row, castle, buildingKey) {
  return (row.buildingRows || []).find((buildingRow) => {
    if (buildingRow.buildingKey !== buildingKey) return false;
    if (String(buildingRow.castleId || "") && String(castle.castleId || "")) {
      return String(buildingRow.castleId) === String(castle.castleId);
    }
    return (
      String(buildingRow.castleName || "") === String(castle.castleName || "") &&
      Number(buildingRow.kingdomId || 0) === Number(castle.kingdomId || 0) &&
      Number(buildingRow.castleType || 0) === Number(castle.castleType || 0)
    );
  });
}

function renderAttackScoreCastleCell(castle) {
  if (!castle) {
    return `
      <td>
        <span class="watchtower-castle-cell watchtower-castle-cell--empty">
          <strong>-</strong>
          <span>No castle in this slot</span>
        </span>
      </td>
    `;
  }

  const modifier = castle.error ? "error" : `target-${castle.verdictClass || "unknown"}`;
  const scoreLabel = castle.error ? "Failed" : `${castle.score}/100`;
  const active = state.activeAttackScoreCastleKey === castle.key;
  return `
    <td>
      <button type="button" class="watchtower-castle-cell watchtower-castle-cell--${escapeHtml(modifier)} attack-score-card-button${active ? " is-active" : ""}" data-attack-score-castle="${escapeHtml(castle.key || "")}" aria-pressed="${active ? "true" : "false"}" title="Show attack score breakdown for ${escapeHtml(castle.castleName)}">
        <img src="${escapeHtml(castle.castleIconUrl)}" alt="">
        <span class="watchtower-castle-cell__copy">
          <strong>${escapeHtml(castle.castleName)}</strong>
          <span>${escapeHtml(getKingdomName(castle.kingdomId))} - ${escapeHtml(getCastleTypeName(castle.castleType))}</span>
          <small>${escapeHtml(castle.verdict)}</small>
        </span>
        <b>${escapeHtml(scoreLabel)}</b>
      </button>
    </td>
  `;
}

function getSelectedBuildingFilters() {
  return state.buildingCatalog.filter((building) => state.selectedBuildingKeys.has(building.key));
}

function getBuildingKey(building) {
  return `${building.name}|${building.group}`;
}

function getBuildingAssetUrl(building) {
  const name = cleanAssetPart(building.name);
  const group = cleanAssetPart(building.group);
  const type = cleanAssetPart(building.type);
  if (!name || !group || !type) return "";
  if (group === "gate" || name === "castlewall" || group === "tower") {
    const level = Number(String(building.type || "").replace(/level/i, "")) || Number(building.level || 1);
    return `${API_BASE_URL}assets/images/castlewall.png?level=${level}&type=${group}&quality=${name}`;
  }
  return `${API_BASE_URL}assets/images/${name}${group}${type}.png`;
}

function getConstructionItemIconUrl(item) {
  const name = cleanAssetPart(item.name);
  return name ? `${API_BASE_URL}assets/common/constructionitem${name}.png` : "";
}

function getConstructionItemBoxUrl(slotTypeID, rarityID) {
  const base = getConstructionItemBoxBaseName(slotTypeID);
  const rarity = getConstructionItemRarityName(rarityID).toLowerCase();
  return `../gge-tracker/gge-tracker-frontend/src/assets/ci/${base}_${rarity}.png`;
}

function getConstructionItemBoxBaseName(slotTypeID) {
  switch (String(slotTypeID)) {
    case "1":
      return "ci_primary";
    case "2":
      return "ci_secondary";
    case "0":
    default:
      return "ci_appearance";
  }
}

function getConstructionItemSlotName(slotTypeID) {
  switch (String(slotTypeID)) {
    case "1":
      return "Primary";
    case "2":
      return "Secondary";
    case "0":
      return "Appearance";
    default:
      return "Build item";
  }
}

function getConstructionItemRarityName(rarityID) {
  switch (Number(rarityID)) {
    case 1:
      return "Common";
    case 2:
      return "Rare";
    case 3:
      return "Epic";
    case 4:
      return "Legendary";
    case 0:
      return "Unique";
    default:
      return "Unknown";
  }
}

function getConstructionItemRarityColor(rarityID) {
  switch (Number(rarityID)) {
    case 1:
      return "#868686";
    case 2:
      return "#6a8bdc";
    case 3:
      return "#8a3fd3";
    case 4:
      return "#ef6b00";
    case 0:
      return "#a30b0f";
    default:
      return "#6b746d";
  }
}

function formatConstructionItemName(item) {
  const fallback = formatBuildingName(item.name, "item");
  const comment = formatConstructionComment(item.comment2 || "");
  if (comment && comment.toLowerCase() !== fallback.toLowerCase()) return comment;
  return fallback || `Construction item ${item.constructionItemID || ""}`.trim();
}

function formatConstructionComment(value) {
  return String(value || "")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/([A-Za-z])(\d)/g, "$1 $2")
    .replace(/(\d)([A-Za-z])/g, "$1 $2")
    .replaceAll("_", " ")
    .trim()
    .replace(/^./, (letter) => letter.toUpperCase());
}

function getConstructionItemEffectText(item) {
  if (item.effects) {
    const [effectId, effectValue] = String(item.effects).split("&");
    return effectValue ? `Effect ${effectId}: ${effectValue}` : `Effect ${item.effects}`;
  }
  if (item.decoPoints) return `Decoration +${formatNumber(item.decoPoints)}`;

  const ignoredKeys = new Set([
    "constructionItemID",
    "constructionItemGroupID",
    "constructionItemEffectGroupID",
    "comment1",
    "comment2",
    "name",
    "level",
    "rarenessID",
    "slotTypeID",
    "removalCostC1",
    "lockRemoval",
    "isPremium",
    "disassemblingTombolaID",
  ]);
  const effectKey = Object.keys(item).find((key) => {
    if (ignoredKeys.has(key) || key.startsWith("add")) return false;
    const value = Number(item[key]);
    return Number.isFinite(value) && value !== 0;
  });
  if (!effectKey) return "No effect listed.";

  const value = Number(item[effectKey]);
  const label = formatConstructionComment(effectKey);
  const sign = value > 0 ? "+" : "";
  return `${label} ${sign}${formatNumber(value)}`;
}

function getCastleIconUrl(castle) {
  const type = Number(castle.type || 0);
  const keepLevel = Number(castle.keepLevel || 1);
  if (type === 1 || type === 12) {
    return `${API_BASE_URL}assets/images/keepbuildinglevel${keepLevel || 1}.png`;
  }
  if (type === 4) {
    return `${API_BASE_URL}assets/images/outpostmapobjectlevel${keepLevel || 1}.png`;
  }
  if (type === 3) return `${API_BASE_URL}assets/images/capitalmapobjectbasic.png`;
  if (type === 22) return `${API_BASE_URL}assets/images/metropolmapobjectbasic.png`;
  return "../gge-tracker/gge-tracker-frontend/src/assets/icon_castles.png";
}

function getCastleTypeName(type) {
  return CASTLE_TYPE_LABELS.get(Number(type)) || "Castle";
}

function formatBuildingName(name, group) {
  const spaced = String(name || "")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/([A-Za-z])(\d)/g, "$1 $2")
    .replace(/(\d)([A-Za-z])/g, "$1 $2")
    .replaceAll("_", " ")
    .trim();
  if (!spaced) return String(group || "Building");
  if (["Gate", "Defence", "Tower", "Moat"].includes(group) && !spaced.toLowerCase().includes(group.toLowerCase())) {
    return `${spaced} ${group}`;
  }
  return spaced;
}

function cleanAssetPart(value) {
  return String(value || "").trim().toLowerCase().replaceAll(/[^\da-z]/g, "");
}

function getPlayerKey(player) {
  return String(player.player_id || player.player_name || "");
}

async function apiFetchWithRetry(path, attempts = 3) {
  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      return await apiFetch(path);
    } catch (error) {
      const shouldRetry = attempt < attempts && String(error.message || "").includes("429");
      if (!shouldRetry) throw error;
      await sleep(1800 * attempt);
    }
  }
}

async function safeApiFetch(path) {
  try {
    return {
      data: await apiFetchWithRetry(path, 2),
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error,
    };
  }
}

function normalizeCastleSearchResponse(value) {
  if (Array.isArray(value)) return value;
  if (Array.isArray(value?.value)) return value.value;
  if (Array.isArray(value?.castles)) return value.castles;
  return [];
}

async function mapLimit(items, limit, worker) {
  const results = new Array(items.length);
  let nextIndex = 0;

  async function runWorker() {
    while (nextIndex < items.length) {
      const index = nextIndex;
      nextIndex += 1;
      results[index] = await worker(items[index], index);
      await sleep(130);
    }
  }

  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, runWorker));
  return results;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getKingdomName(kingdomId) {
  switch (Number(kingdomId)) {
    case 1:
      return "Burning Sands";
    case 2:
      return "Everwinter";
    case 3:
      return "Fire Peaks";
    default:
      return "Green";
  }
}

function renderRank(rank) {
  return rank === null || rank === undefined ? "-" : `Rank ${rank}`;
}

function getProtectedPlayers() {
  return state.players.filter((player) => isProtected(player.peace_disabled_at));
}

function isProtected(dateValue) {
  return Boolean(dateValue) && new Date(dateValue).getTime() > Date.now();
}

function formatRemainingTime(dateValue) {
  const target = new Date(dateValue).getTime();
  let remainingSeconds = Math.max(0, Math.floor((target - Date.now()) / 1000));
  const days = Math.floor(remainingSeconds / 86400);
  remainingSeconds -= days * 86400;
  const hours = Math.floor(remainingSeconds / 3600);
  remainingSeconds -= hours * 3600;
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds - minutes * 60;

  if (days > 0) return `${days}d ${hours}h ${minutes}m`;
  if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`;
  if (minutes > 0) return `${minutes}m ${seconds}s`;
  return `${seconds}s`;
}

function formatDateTime(dateValue) {
  if (!dateValue) return "-";
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return "-";
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function formatDurationSince(date) {
  const seconds = Math.max(0, Math.floor((Date.now() - date.getTime()) / 1000));
  const days = Math.floor(seconds / 86400);
  if (days > 0) return `${days}d`;
  const hours = Math.floor(seconds / 3600);
  if (hours > 0) return `${hours}h`;
  const minutes = Math.floor(seconds / 60);
  if (minutes > 0) return `${minutes}m`;
  return `${seconds}s`;
}

function formatNumber(value) {
  const number = Number(value || 0);
  return new Intl.NumberFormat().format(number);
}

function formatCompactNumber(value) {
  const number = Number(value || 0);
  return new Intl.NumberFormat(undefined, {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(number);
}

function parseNumeric(value) {
  const number = Number(value || 0);
  return Number.isFinite(number) ? number : 0;
}

function clampNumber(value, min, max) {
  const number = Number(value);
  if (!Number.isFinite(number)) return min;
  return Math.min(max, Math.max(min, number));
}

function setLoading(isLoading) {
  [...elements.form.querySelectorAll("button, input, select"), elements.serverSelect].forEach((control) => {
    control.disabled = isLoading;
  });

  if (isLoading) {
    elements.playersTable.innerHTML = `<tr class="empty-row"><td colspan="7">Loading...</td></tr>`;
  }
}

function setHint(message) {
  elements.formHint.textContent = message;
}

function startClock() {
  if (state.tickHandle) clearInterval(state.tickHandle);
  state.tickHandle = setInterval(() => {
    const birdCount = getProtectedPlayers().length;
    if (birdCount !== state.lastBirdCount) {
      renderAllianceData(true);
    } else {
      renderAllianceData(false, false);
      updateCountdownCells();
    }
  }, 1000);
}

function updateUrl() {
  if (!state.currentAlliance) return;
  const url = new URL(window.location.href);
  url.searchParams.set("server", state.server);
  url.searchParams.set("alliance", state.currentAlliance.alliance_name);
  window.history.replaceState(null, "", url);
}

function showToast(message) {
  const existing = document.querySelector(".toast");
  if (existing) existing.remove();

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  document.body.append(toast);
  setTimeout(() => toast.remove(), 4200);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

init();

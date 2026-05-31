const API_BASE_URL = "https://api.gge-tracker.com/api/v1/";
const ALLIANCE_PAGES_TO_LOAD = 5;
const MAX_VISIBLE_ALLIANCES = 80;
const MAX_VISIBLE_BUILDINGS = 80;
const THEME_STORAGE_KEY = "empireBirds.theme";
const WATCHTOWER_SESSION_CACHE_KEY = "empireBirds.watchtowerResultsByAlliance";
const ALL_REGION_FILTER_STORAGE_KEY = "empireBirds.allRegionFilter";
const ALL_CASTLE_KIND_FILTER_STORAGE_KEY = "empireBirds.allCastleKindFilter";
const ALL_DISTANCE_RANGE_FILTER_STORAGE_KEY = "empireBirds.allDistanceRangeFilter";
const ALL_ATTACK_SCORE_FILTER_STORAGE_KEY = "empireBirds.allAttackScoreFilter";
const ALL_BUILDING_LEVEL_FILTER_STORAGE_KEY = "empireBirds.allBuildingLevelFilter";
const ALL_MIGHT_RANGE_FILTER_STORAGE_KEY = "empireBirds.allMightRangeFilter";
const ALL_LOOT_AGE_RANGE_FILTER_STORAGE_KEY = "empireBirds.allLootAgeRangeFilter";
const DISTANCE_SESSION_CACHE_KEY = "empireBirds.distanceRowsByAlliance";
const HOME_PLAYER_STORAGE_KEY = "empireBirds.homePlayerName";
const HOME_CASTLE_STORAGE_KEY = "empireBirds.homeCastleKey";
const HOME_PLAYER_HISTORY_STORAGE_KEY = "empireBirds.homePlayerHistory";
const DISTANCE_ORIGIN_MODE_STORAGE_KEY = "empireBirds.distanceOriginMode";
const DISTANCE_COORDINATES_STORAGE_KEY = "empireBirds.distanceCoordinates";
const DISTANCE_HIGHLIGHT_STORAGE_KEY = "empireBirds.distanceHighlightThreshold";
const DISTANCE_HIGHLIGHT_MIGHT_STORAGE_KEY = "empireBirds.distanceHighlightMightMillions";
const DISTANCE_HIGHLIGHT_LOOT_DAYS_STORAGE_KEY = "empireBirds.distanceHighlightLootDays";
const DISTANCE_HIGHLIGHT_NOT_CHEATING_STORAGE_KEY = "empireBirds.distanceHighlightNotCheating";
const DISTANCE_HIGHLIGHT_NOT_BIRDED_STORAGE_KEY = "empireBirds.distanceHighlightNotBirded";
const ALL_HIGHLIGHT_SCANNED_STORAGE_KEY = "empireBirds.allHighlightScanned";
const DISTANCE_SLIDER_MAX = 2000;
const DISTANCE_SLIDER_INFINITY_VALUE = DISTANCE_SLIDER_MAX + 10;
const MIGHT_SLIDER_STEPS = 100;
const MIGHT_SLIDER_MIN_MILLIONS = 0.1;
const MIGHT_SLIDER_MAX_MILLIONS = 500;
const MIGHT_SLIDER_INFINITY_STEP = MIGHT_SLIDER_STEPS + 1;
const LOOT_AGE_SLIDER_HOUR_STEPS = 24;
const LOOT_AGE_SLIDER_MAX = 53;
const LOOT_AGE_SLIDER_INFINITY_VALUE = LOOT_AGE_SLIDER_MAX + 1;
const RANGE_FILTER_THUMB_RADIUS_PX = 10;
const RANGE_FILTER_THUMB_SIZE_PX = RANGE_FILTER_THUMB_RADIUS_PX * 2;
const ALL_PLAYER_COLUMN_MIN_WIDTH = 330;
const ALL_CASTLE_COLUMN_MIN_WIDTH = 330;
const ALL_RANGE_FILTER_DEFS = {
  distance: {
    storageKey: ALL_DISTANCE_RANGE_FILTER_STORAGE_KEY,
    legacyStorageKey: DISTANCE_HIGHLIGHT_STORAGE_KEY,
    legacyMode: "max",
    minValue: 0,
    maxValue: Number.POSITIVE_INFINITY,
    finiteMaxValue: DISTANCE_SLIDER_MAX,
    allowInfinityMax: true,
    defaultMin: 0,
    defaultMax: Number.POSITIVE_INFINITY,
    sliderMin: 0,
    sliderMax: DISTANCE_SLIDER_INFINITY_VALUE,
    sliderStep: 10,
    label: "player distance",
    format: formatDistanceRuleValue,
    formatInput: formatDistanceInputValue,
    parse: parseDistanceRangeInput,
    sliderToValue: getDistanceFromRangeSlider,
    valueToSlider: getDistanceSliderValue,
  },
  attack: {
    storageKey: ALL_ATTACK_SCORE_FILTER_STORAGE_KEY,
    legacyStorageKey: ALL_ATTACK_SCORE_FILTER_STORAGE_KEY,
    legacyMode: "max",
    minValue: 0,
    maxValue: 100,
    defaultMin: 0,
    defaultMax: 100,
    sliderMin: 0,
    sliderMax: 100,
    sliderStep: 1,
    label: "attack score",
    format: formatAttackScoreRuleValue,
    formatInput: (value) => String(Math.trunc(Number(value || 0))),
    parse: parsePlainRangeInput,
    sliderToValue: getAttackScoreFromSlider,
    valueToSlider: getAttackScoreSliderValue,
  },
  building: {
    storageKey: ALL_BUILDING_LEVEL_FILTER_STORAGE_KEY,
    legacyStorageKey: ALL_BUILDING_LEVEL_FILTER_STORAGE_KEY,
    legacyMode: "min",
    minValue: 0,
    maxValue: 30,
    defaultMin: 0,
    defaultMax: 30,
    sliderMin: 0,
    sliderMax: 30,
    sliderStep: 1,
    label: "building level",
    format: formatBuildingLevelRuleValue,
    formatInput: (value) => String(Math.trunc(Number(value || 0))),
    parse: parsePlainRangeInput,
    sliderToValue: getBuildingLevelFromSlider,
    valueToSlider: getBuildingLevelSliderValue,
  },
  might: {
    storageKey: ALL_MIGHT_RANGE_FILTER_STORAGE_KEY,
    legacyStorageKey: DISTANCE_HIGHLIGHT_MIGHT_STORAGE_KEY,
    legacyMode: "min",
    minValue: 0,
    maxValue: Number.POSITIVE_INFINITY,
    finiteMaxValue: MIGHT_SLIDER_MAX_MILLIONS,
    allowInfinityMax: true,
    defaultMin: 0,
    defaultMax: Number.POSITIVE_INFINITY,
    sliderMin: 0,
    sliderMax: MIGHT_SLIDER_INFINITY_STEP,
    sliderStep: 1,
    label: "might points",
    format: formatMightRuleValue,
    formatInput: formatMightRuleValue,
    parse: parseMightRangeInput,
    sliderToValue: getMightMillionsFromSlider,
    valueToSlider: getMightSliderValue,
  },
  loot: {
    storageKey: ALL_LOOT_AGE_RANGE_FILTER_STORAGE_KEY,
    legacyStorageKey: DISTANCE_HIGHLIGHT_LOOT_DAYS_STORAGE_KEY,
    legacyMode: "min",
    minValue: 0,
    maxValue: Number.POSITIVE_INFINITY,
    finiteMaxValue: 30,
    allowInfinityMax: true,
    defaultMin: 0,
    defaultMax: Number.POSITIVE_INFINITY,
    sliderMin: 0,
    sliderMax: LOOT_AGE_SLIDER_INFINITY_VALUE,
    sliderStep: 1,
    label: "last time looted",
    format: formatLootAgeRuleValue,
    formatInput: (value) => formatLootAgeRuleValue(value).toUpperCase(),
    parse: parseLootAgeRangeInput,
    sliderToValue: getLootDaysFromSlider,
    valueToSlider: getLootDaysSliderValue,
  },
};
const BOT_LOOT_STREAK_HOURS = 15;
const LOOT_STREAK_MIN_INTERVAL_HOURS = 0.75;
const LOOT_STREAK_MAX_INTERVAL_HOURS = 1.5;
const CONSTRUCTION_ITEM_DEFENSE_WEIGHT = 16;
const CONSTRUCTION_ITEM_SCORE_SPEED = 0.4;
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
  "defensive tools",
  "defensivetools",
  "tool",
  "tools",
  "toolcost",
  "tooltime",
  "toolspeed",
  "toolsmith",
];
const DIRECT_DEFENSIVE_CONSTRUCTION_EFFECT_TYPES = new Set([
  "defensebonus",
  "defenseboostyard",
  "defenseboostfront",
  "defenseboostflank",
  "defenseunitamountwall",
  "defenseunitamountwallpvp",
  "defenseunitamountyardbonus",
  "defenseunitamountyardboost",
  "defensesupportunits",
  "gatebonus",
  "moatbonus",
  "unitwallabsoluteamount",
  "wallamount",
  "wallbonus",
]);
const DIRECT_DEFENSIVE_CONSTRUCTION_EFFECT_ID_TYPES = new Map([
  ["370", "defenseboostyard"],
  ["371", "defenseunitamountyardbonus"],
  ["387", "defenseunitamountwall"],
  ["420", "unitwallabsoluteamount"],
  ["421", "defenseboostfront"],
  ["422", "defenseboostflank"],
  ["501", "defenseboostyard"],
  ["507", "defensesupportunits"],
  ["508", "defensesupportunits"],
  ["509", "defenseboostfront"],
  ["510", "defenseboostflank"],
  ["618", "defenseunitamountwall"],
  ["619", "defensebonus"],
  ["620", "defenseboostyard"],
  ["702", "defenseunitamountyardbonus"],
  ["703", "defenseunitamountyardboost"],
  ["705", "defenseunitamountyardboost"],
]);
const DIRECT_DEFENSIVE_CONSTRUCTION_STAT_KEYS = new Set([
  "unitWallCount",
]);
const CONSTRUCTION_ITEM_EFFECT_SCORE_CAPS = new Map([
  ["defensebonus", 100],
  ["defenseboostyard", 60],
  ["defenseboostfront", 60],
  ["defenseboostflank", 60],
  ["defenseunitamountwall", 160],
  ["defenseunitamountwallpvp", 160],
  ["defenseunitamountyardbonus", 10000],
  ["defenseunitamountyardboost", 20],
  ["defensesupportunits", 100],
  ["gatebonus", 80],
  ["moatbonus", 80],
  ["unitwallabsoluteamount", 250],
  ["wallamount", 250],
  ["wallbonus", 80],
]);
const CONSTRUCTION_ITEM_STAT_SCORE_CAPS = new Map([
  ["unitWallCount", 250],
]);
const CASTLE_TYPE_LABELS = new Map([
  [1, "Main castle"],
  [3, "Capital"],
  [4, "Outpost"],
  [12, "Realm castle"],
  [22, "Metropolis"],
  [23, "Royal tower"],
  [26, "Monument"],
  [28, "Laboratory"],
]);
const DISTANCE_TARGET_CASTLE_TYPES = new Set([1, 3, 4, 12, 22]);
const CASTLE_TYPE_COLUMN_LABELS = new Map([
  [1, "Main castle"],
  [3, "Capitals"],
  [4, "Outposts"],
  [12, "Realm castles"],
  [22, "Metropolises"],
  [23, "Royal towers"],
  [26, "Monuments"],
  [28, "Laboratories"],
]);
const CASTLE_TYPE_COLUMN_ORDER = new Map([
  [1, 0],
  [4, 10],
  [12, 20],
  [22, 30],
  [3, 40],
  [23, 50],
  [26, 60],
  [28, 70],
]);
const ALL_KINGDOM_FILTER_OPTIONS = [
  { id: 0, label: "Green" },
  { id: 2, label: "Everwinter" },
  { id: 1, label: "Burning Sands" },
  { id: 3, label: "Fire Peaks" },
  { id: 4, label: "Storm Islands" },
];
const ALL_CASTLE_KIND_FILTER_OPTIONS = [
  { id: "main", label: "Main Castles" },
  { id: "outpost", label: "Outposts" },
  { id: "property", label: "Property" },
];

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
  effectById: new Map(),
  effectTypeById: new Map(),
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
  watchtowerScanProgress: null,
  activeAttackScoreCastleKey: "",
  selectedAllRegionIds: loadAllRegionFilterSelection(),
  selectedAllCastleKindIds: loadAllCastleKindFilterSelection(),
  allRangeFilters: loadAllRangeFilters(),
  distanceRows: [],
  distanceRowsByAlliance: loadDistanceSessionCache(),
  distanceLoading: false,
  distanceLoadError: "",
  distanceLoadId: 0,
  homePlayerName: localStorage.getItem(HOME_PLAYER_STORAGE_KEY) || "",
  homePlayerHistory: loadHomePlayerHistory(),
  filteredHomePlayerChoices: [],
  activeHomePlayerIndex: -1,
  homePlayerMenuOpen: false,
  homeCastles: [],
  homeCastleLoading: false,
  selectedHomeCastleKey: localStorage.getItem(HOME_CASTLE_STORAGE_KEY) || "",
  distanceOriginMode: localStorage.getItem(DISTANCE_ORIGIN_MODE_STORAGE_KEY) === "coordinates" ? "coordinates" : "castle",
  distanceCoordinates: loadDistanceCoordinates(),
  distanceHighlightThreshold: loadDistanceHighlightNumber(DISTANCE_HIGHLIGHT_STORAGE_KEY, "max"),
  distanceHighlightMightMillions: loadDistanceHighlightNumber(DISTANCE_HIGHLIGHT_MIGHT_STORAGE_KEY, "min"),
  distanceHighlightLootDays: loadDistanceHighlightNumber(DISTANCE_HIGHLIGHT_LOOT_DAYS_STORAGE_KEY, "min"),
  distanceHighlightNotCheating: localStorage.getItem(DISTANCE_HIGHLIGHT_NOT_CHEATING_STORAGE_KEY) === "true",
  distanceHighlightNotBirded: localStorage.getItem(DISTANCE_HIGHLIGHT_NOT_BIRDED_STORAGE_KEY) === "true",
  allHighlightScanned: localStorage.getItem(ALL_HIGHLIGHT_SCANNED_STORAGE_KEY) === "true",
  allPlayerSearchQuery: "",
  allSort: null,
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
  distanceChart: document.querySelector("#distance-chart"),
  distanceView: document.querySelector("#distance-view"),
  allChart: document.querySelector("#all-chart"),
  allView: document.querySelector("#all-view"),
  allSummary: document.querySelector("#all-summary"),
  allBuildingSelect: document.querySelector("#all-building-select"),
  allHomePlayerInput: document.querySelector("#all-home-player-input"),
  allLoadHomeCastles: document.querySelector("#all-load-home-castles"),
  allHomeCastleSelect: document.querySelector("#all-home-castle-select"),
  allDistanceRegionSelect: document.querySelector("#all-distance-region-select"),
  allDistanceXInput: document.querySelector("#all-distance-x-input"),
  allDistanceYInput: document.querySelector("#all-distance-y-input"),
  allHighlightNotCheating: document.querySelector("#all-filter-not-cheating"),
  allHighlightNotBirded: document.querySelector("#all-filter-not-birded"),
  allHighlightScanned: document.querySelector("#all-filter-scanned"),
  allRegionFilterPanel: document.querySelector("#all-region-filter-panel"),
  allRegionFilterSummary: document.querySelector("#all-region-filter-summary"),
  allCastleKindFilterSummary: document.querySelector("#all-castle-kind-filter-summary"),
  homePlayerPicker: document.querySelector("#home-player-picker"),
  homePlayerInput: document.querySelector("#home-player-input"),
  toggleHomePlayers: document.querySelector("#toggle-home-players"),
  homePlayerMenu: document.querySelector("#home-player-menu"),
  homePlayerList: document.querySelector("#home-player-list"),
  loadHomeCastles: document.querySelector("#load-home-castles"),
  homeCastleSelect: document.querySelector("#home-castle-select"),
  distanceRegionSelect: document.querySelector("#distance-region-select"),
  distanceXInput: document.querySelector("#distance-x-input"),
  distanceYInput: document.querySelector("#distance-y-input"),
  distanceHighlightInput: document.querySelector("#distance-highlight-input"),
  distanceHighlightValue: document.querySelector("#distance-highlight-value"),
  distanceMightInput: document.querySelector("#distance-might-input"),
  distanceMightValue: document.querySelector("#distance-might-value"),
  distanceLootDaysInput: document.querySelector("#distance-loot-days-input"),
  distanceLootDaysValue: document.querySelector("#distance-loot-days-value"),
  distanceHighlightNotCheating: document.querySelector("#distance-filter-not-cheating"),
  distanceHighlightNotBirded: document.querySelector("#distance-filter-not-birded"),
  homeDistanceSummary: document.querySelector("#home-distance-summary"),
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
    cacheCurrentDistanceRows();
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
    state.homeCastles = [];
    state.selectedHomeCastleKey = "";
    state.distanceRows = [];
    state.distanceLoading = false;
    state.distanceLoadError = "";
    state.distanceLoadId += 1;
    localStorage.removeItem(HOME_CASTLE_STORAGE_KEY);
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

  document.querySelectorAll("[data-distance-origin-mode]").forEach((button) => {
    button.addEventListener("click", () => {
      setDistanceOriginMode(button.dataset.distanceOriginMode);
    });
  });

  elements.homePlayerInput?.addEventListener("input", () => {
    const nextName = elements.homePlayerInput.value.trim();
    if (nextName === state.homePlayerName) return;
    state.homePlayerName = nextName;
    state.homeCastles = [];
    state.selectedHomeCastleKey = "";
    localStorage.setItem(HOME_PLAYER_STORAGE_KEY, state.homePlayerName);
    localStorage.removeItem(HOME_CASTLE_STORAGE_KEY);
    state.activeHomePlayerIndex = -1;
    renderHomePlayerMenu();
    openHomePlayerMenu();
    renderDistanceChart();
    renderAllChart();
  });

  elements.homePlayerInput?.addEventListener("focus", () => {
    openHomePlayerMenu();
  });

  elements.homePlayerInput?.addEventListener("keydown", (event) => {
    handleHomePlayerInputKeydown(event);
  });

  elements.toggleHomePlayers?.addEventListener("click", () => {
    if (state.homePlayerMenuOpen) {
      closeHomePlayerMenu();
    } else {
      openHomePlayerMenu();
    }
  });

  elements.loadHomeCastles?.addEventListener("click", () => {
    void loadHomeCastles();
  });

  elements.homeCastleSelect?.addEventListener("change", () => {
    state.selectedHomeCastleKey = elements.homeCastleSelect.value;
    if (state.selectedHomeCastleKey) {
      localStorage.setItem(HOME_CASTLE_STORAGE_KEY, state.selectedHomeCastleKey);
    } else {
      localStorage.removeItem(HOME_CASTLE_STORAGE_KEY);
    }
    renderDistanceChart();
    renderAllChart();
  });

  elements.distanceRegionSelect?.addEventListener("change", () => {
    state.distanceCoordinates.kingdomId = Number(elements.distanceRegionSelect.value || 0);
    persistDistanceCoordinates();
    renderDistanceChart();
    renderAllChart();
  });

  [elements.distanceXInput, elements.distanceYInput].forEach((input) => {
    input?.addEventListener("input", () => {
      state.distanceCoordinates.positionX = parseCoordinate(elements.distanceXInput?.value);
      state.distanceCoordinates.positionY = parseCoordinate(elements.distanceYInput?.value);
      persistDistanceCoordinates();
      renderDistanceChart();
      renderAllChart();
    });
  });

  elements.distanceHighlightInput?.addEventListener("input", () => {
    setDistanceHighlightNumber("distanceHighlightThreshold", DISTANCE_HIGHLIGHT_STORAGE_KEY, getDistanceThresholdFromSlider(elements.distanceHighlightInput.value));
    refreshDistanceHighlightFilters();
  });

  elements.distanceHighlightInput?.addEventListener("change", () => {
    setDistanceHighlightNumber("distanceHighlightThreshold", DISTANCE_HIGHLIGHT_STORAGE_KEY, getDistanceThresholdFromSlider(elements.distanceHighlightInput.value));
    refreshDistanceHighlightFilters();
  });

  elements.distanceMightInput?.addEventListener("input", () => {
    setDistanceHighlightNumber("distanceHighlightMightMillions", DISTANCE_HIGHLIGHT_MIGHT_STORAGE_KEY, getMightMillionsFromSlider(elements.distanceMightInput.value));
    refreshDistanceHighlightFilters();
  });

  elements.distanceMightInput?.addEventListener("change", () => {
    setDistanceHighlightNumber("distanceHighlightMightMillions", DISTANCE_HIGHLIGHT_MIGHT_STORAGE_KEY, getMightMillionsFromSlider(elements.distanceMightInput.value));
    refreshDistanceHighlightFilters();
  });

  elements.distanceLootDaysInput?.addEventListener("input", () => {
    setDistanceHighlightNumber("distanceHighlightLootDays", DISTANCE_HIGHLIGHT_LOOT_DAYS_STORAGE_KEY, getLootDaysFromSlider(elements.distanceLootDaysInput.value));
    refreshDistanceHighlightFilters();
  });

  elements.distanceLootDaysInput?.addEventListener("change", () => {
    setDistanceHighlightNumber("distanceHighlightLootDays", DISTANCE_HIGHLIGHT_LOOT_DAYS_STORAGE_KEY, getLootDaysFromSlider(elements.distanceLootDaysInput.value));
    refreshDistanceHighlightFilters();
  });

  elements.distanceHighlightNotCheating?.addEventListener("change", () => {
    state.distanceHighlightNotCheating = elements.distanceHighlightNotCheating.checked;
    localStorage.setItem(DISTANCE_HIGHLIGHT_NOT_CHEATING_STORAGE_KEY, String(state.distanceHighlightNotCheating));
    refreshDistanceHighlightFilters();
  });

  elements.distanceHighlightNotBirded?.addEventListener("change", () => {
    state.distanceHighlightNotBirded = elements.distanceHighlightNotBirded.checked;
    localStorage.setItem(DISTANCE_HIGHLIGHT_NOT_BIRDED_STORAGE_KEY, String(state.distanceHighlightNotBirded));
    refreshDistanceHighlightFilters();
  });

  elements.allHomePlayerInput?.addEventListener("input", () => {
    const nextName = elements.allHomePlayerInput.value.trim();
    if (nextName === state.homePlayerName) return;
    state.homePlayerName = nextName;
    if (state.homePlayerName) {
      localStorage.setItem(HOME_PLAYER_STORAGE_KEY, state.homePlayerName);
    } else {
      localStorage.removeItem(HOME_PLAYER_STORAGE_KEY);
    }
    if (elements.allLoadHomeCastles) {
      elements.allLoadHomeCastles.disabled = state.homeCastleLoading || !state.homePlayerName;
    }
  });

  elements.allLoadHomeCastles?.addEventListener("click", () => {
    state.homePlayerName = (elements.allHomePlayerInput?.value || state.homePlayerName || "").trim();
    if (state.homePlayerName) localStorage.setItem(HOME_PLAYER_STORAGE_KEY, state.homePlayerName);
    void loadHomeCastles();
  });

  elements.allHomeCastleSelect?.addEventListener("change", () => {
    state.selectedHomeCastleKey = elements.allHomeCastleSelect.value;
    if (state.selectedHomeCastleKey) {
      localStorage.setItem(HOME_CASTLE_STORAGE_KEY, state.selectedHomeCastleKey);
    } else {
      localStorage.removeItem(HOME_CASTLE_STORAGE_KEY);
    }
    renderDistanceChart();
    renderAllChart();
  });

  elements.allDistanceRegionSelect?.addEventListener("change", () => {
    state.distanceCoordinates.kingdomId = Number(elements.allDistanceRegionSelect.value || 0);
    persistDistanceCoordinates();
    renderDistanceChart();
    renderAllChart();
  });

  [elements.allDistanceXInput, elements.allDistanceYInput].forEach((input) => {
    input?.addEventListener("input", () => {
      state.distanceCoordinates.positionX = parseCoordinate(elements.allDistanceXInput?.value);
      state.distanceCoordinates.positionY = parseCoordinate(elements.allDistanceYInput?.value);
      persistDistanceCoordinates();
      renderDistanceChart();
      renderAllChart();
    });
  });

  elements.allBuildingSelect?.addEventListener("change", () => {
    setSelectedLevelBuildingKey(elements.allBuildingSelect.value);
  });

  bindAllRangeFilterControls();

  elements.allHighlightNotCheating?.addEventListener("change", () => {
    state.distanceHighlightNotCheating = elements.allHighlightNotCheating.checked;
    localStorage.setItem(DISTANCE_HIGHLIGHT_NOT_CHEATING_STORAGE_KEY, String(state.distanceHighlightNotCheating));
    refreshDistanceHighlightFilters();
  });

  elements.allHighlightNotBirded?.addEventListener("change", () => {
    state.distanceHighlightNotBirded = elements.allHighlightNotBirded.checked;
    localStorage.setItem(DISTANCE_HIGHLIGHT_NOT_BIRDED_STORAGE_KEY, String(state.distanceHighlightNotBirded));
    refreshDistanceHighlightFilters();
  });

  elements.allHighlightScanned?.addEventListener("change", () => {
    state.allHighlightScanned = elements.allHighlightScanned.checked;
    localStorage.setItem(ALL_HIGHLIGHT_SCANNED_STORAGE_KEY, String(state.allHighlightScanned));
    refreshAllFilters();
  });

  document.querySelectorAll("[data-all-region-filter]").forEach((input) => {
    input.addEventListener("change", () => {
      const kingdomId = Number(input.value);
      if (!Number.isFinite(kingdomId)) return;
      if (input.checked) {
        state.selectedAllRegionIds.add(kingdomId);
      } else {
        state.selectedAllRegionIds.delete(kingdomId);
      }
      persistAllRegionFilterSelection();
      renderAllChart();
    });
  });

  document.querySelectorAll("[data-all-castle-kind-filter]").forEach((input) => {
    input.addEventListener("change", () => {
      const kindId = String(input.value || "");
      if (!ALL_CASTLE_KIND_FILTER_OPTIONS.some((option) => option.id === kindId)) return;
      if (input.checked) {
        state.selectedAllCastleKindIds.add(kindId);
      } else {
        state.selectedAllCastleKindIds.delete(kindId);
      }
      persistAllCastleKindFilterSelection();
      renderAllChart();
    });
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
    if (!elements.homePlayerPicker?.contains(event.target)) {
      closeHomePlayerMenu();
    }
  });

}

function bindAllRangeFilterControls() {
  document.querySelectorAll("[data-all-range-rule]").forEach((ruleEl) => {
    const id = String(ruleEl.dataset.allRangeRule || "");
    if (!getAllRangeFilterDef(id)) return;

    ruleEl.querySelector("[data-all-range-enabled]")?.addEventListener("change", (event) => {
      setAllRangeFilter(id, { enabled: event.currentTarget.checked });
    });

    ruleEl.querySelectorAll("[data-all-range-slider]").forEach((slider) => {
      slider.addEventListener("input", () => {
        handleAllRangeSliderInput(id, slider);
      });
    });

    ruleEl.querySelectorAll("[data-all-range-input]").forEach((input) => {
      input.addEventListener("change", () => {
        commitAllRangeTextInput(id, input);
      });
      input.addEventListener("keydown", (event) => {
        if (event.key !== "Enter") return;
        event.preventDefault();
        commitAllRangeTextInput(id, input);
        input.blur();
      });
    });
  });
}

function handleAllRangeSliderInput(id, slider) {
  const def = getAllRangeFilterDef(id);
  if (!def) return;
  const bound = slider.dataset.allRangeBound === "max" ? "max" : "min";
  const value = def.sliderToValue(slider.value, bound);
  if (!isValidAllRangeValue(value)) return;
  const current = getAllRangeFilter(id);
  const updates = { enabled: true, [bound]: value };
  if (bound === "min" && current && value > current.max) updates.max = value;
  if (bound === "max" && current && value < current.min) updates.min = value;
  setAllRangeFilter(id, updates);
}

function commitAllRangeTextInput(id, input) {
  const def = getAllRangeFilterDef(id);
  if (!def) return;
  const bound = input.dataset.allRangeBound === "max" ? "max" : "min";
  const value = def.parse(input.value);
  if (!isValidAllRangeValue(value)) {
    syncAllRangeFilterControl(id);
    const current = getAllRangeFilter(id);
    if (current) input.value = def.formatInput(current[bound]);
    return;
  }
  const current = getAllRangeFilter(id);
  const updates = { enabled: true, [bound]: value };
  if (bound === "min" && current && value > current.max) updates.max = value;
  if (bound === "max" && current && value < current.min) updates.min = value;
  setAllRangeFilter(id, updates);
  const next = getAllRangeFilter(id);
  if (next) input.value = def.formatInput(next[bound]);
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
    const effects = Array.isArray(items.effects) ? items.effects : [];
    const effectTypes = Array.isArray(items.effecttypes) ? items.effecttypes : [];
    state.buildingItemByWod = new Map(buildings.map((building) => [Number(building.wodID), building]));
    state.constructionItemById = new Map(constructionItems.map((item) => [Number(item.constructionItemID), item]));
    state.effectById = new Map(effects.map((effect) => [String(effect.effectID), effect]));
    state.effectTypeById = new Map(effectTypes.map((effectType) => [String(effectType.effectTypeID), effectType]));
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
    renderAllChart();
  } catch (error) {
    elements.buildingFilterSummary.textContent = "Building catalog could not be loaded.";
    renderBuildingLevelSelect();
    renderAllChart();
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

function setDistanceOriginMode(mode) {
  const normalizedMode = mode === "coordinates" ? "coordinates" : "castle";
  if (state.distanceOriginMode === normalizedMode) return;
  state.distanceOriginMode = normalizedMode;
  localStorage.setItem(DISTANCE_ORIGIN_MODE_STORAGE_KEY, normalizedMode);
  closeHomePlayerMenu();
  renderDistanceChart();
  renderAllChart();
}

function renderHomePlayerMenu() {
  if (!elements.homePlayerList || !elements.homePlayerInput) return;
  const choices = getHomePlayerChoices();
  state.filteredHomePlayerChoices = choices;

  if (choices.length === 0) {
    elements.homePlayerList.innerHTML = `<div class="alliance-empty">Type an exact player name.</div>`;
    return;
  }

  elements.homePlayerList.innerHTML = choices.map((choice, index) => {
    const active = index === state.activeHomePlayerIndex ? " is-active" : "";
    return `
      <button type="button" class="building-option building-option--text${active}" role="option" data-home-player-index="${index}" aria-selected="${index === state.activeHomePlayerIndex}">
        <span>
          <span class="building-option__name">${escapeHtml(choice.playerName)}</span>
          <span class="building-option__meta">${escapeHtml(choice.meta)}</span>
        </span>
      </button>
    `;
  }).join("");

  elements.homePlayerList.querySelectorAll("[data-home-player-index]").forEach((option) => {
    option.addEventListener("click", () => {
      selectHomePlayerChoice(Number(option.dataset.homePlayerIndex));
    });
  });
}

function getHomePlayerChoices() {
  const query = (elements.homePlayerInput?.value || state.homePlayerName || "").trim();
  const normalizedQuery = query.toLowerCase();
  const choices = [];
  const seen = new Set();

  const addChoice = (playerName, meta, source) => {
    const name = String(playerName || "").trim();
    const key = name.toLowerCase();
    if (!name || seen.has(key)) return;
    if (normalizedQuery && !key.includes(normalizedQuery)) return;
    seen.add(key);
    choices.push({ playerName: name, meta, source });
  };

  state.players.forEach((player) => {
    addChoice(player.player_name, state.currentAlliance?.alliance_name || "Current roster", "roster");
  });
  state.homePlayerHistory.forEach((playerName) => {
    addChoice(playerName, "Saved player", "history");
  });

  if (query && !seen.has(normalizedQuery)) {
    choices.unshift({
      playerName: query,
      meta: `Exact lookup on ${state.server}`,
      source: "exact",
    });
  }

  return choices.slice(0, MAX_VISIBLE_ALLIANCES);
}

function openHomePlayerMenu() {
  if (!elements.homePlayerMenu || !elements.homePlayerInput) return;
  renderHomePlayerMenu();
  state.homePlayerMenuOpen = true;
  elements.homePlayerMenu.hidden = false;
  elements.homePlayerInput.setAttribute("aria-expanded", "true");
}

function closeHomePlayerMenu() {
  if (!elements.homePlayerMenu || !elements.homePlayerInput) return;
  state.homePlayerMenuOpen = false;
  elements.homePlayerMenu.hidden = true;
  elements.homePlayerInput.setAttribute("aria-expanded", "false");
}

function selectHomePlayerChoice(index) {
  const choice = state.filteredHomePlayerChoices[index];
  if (!choice) return;

  const previousName = state.homePlayerName;
  state.activeHomePlayerIndex = index;
  state.homePlayerName = choice.playerName;
  if (elements.homePlayerInput) elements.homePlayerInput.value = choice.playerName;
  localStorage.setItem(HOME_PLAYER_STORAGE_KEY, state.homePlayerName);

  if (previousName !== choice.playerName) {
    state.homeCastles = [];
    state.selectedHomeCastleKey = "";
    localStorage.removeItem(HOME_CASTLE_STORAGE_KEY);
  }

  closeHomePlayerMenu();
  renderDistanceChart();
  renderAllChart();
}

function handleHomePlayerInputKeydown(event) {
  if (!state.homePlayerMenuOpen && ["ArrowDown", "ArrowUp"].includes(event.key)) {
    openHomePlayerMenu();
    event.preventDefault();
    return;
  }

  if (event.key === "Escape") {
    closeHomePlayerMenu();
    return;
  }

  if (event.key === "Enter") {
    if (state.homePlayerMenuOpen && state.filteredHomePlayerChoices.length > 0 && state.activeHomePlayerIndex >= 0) {
      selectHomePlayerChoice(state.activeHomePlayerIndex);
    }
    event.preventDefault();
    void loadHomeCastles();
    return;
  }

  if (!state.homePlayerMenuOpen || state.filteredHomePlayerChoices.length === 0) return;

  if (event.key === "ArrowDown") {
    state.activeHomePlayerIndex = Math.min(state.activeHomePlayerIndex + 1, state.filteredHomePlayerChoices.length - 1);
    renderHomePlayerMenu();
    event.preventDefault();
  }

  if (event.key === "ArrowUp") {
    state.activeHomePlayerIndex = Math.max(state.activeHomePlayerIndex - 1, 0);
    renderHomePlayerMenu();
    event.preventDefault();
  }
}

function loadHomePlayerHistory() {
  try {
    const parsed = JSON.parse(localStorage.getItem(HOME_PLAYER_HISTORY_STORAGE_KEY) || "[]");
    return Array.isArray(parsed) ? parsed.map((name) => String(name || "").trim()).filter(Boolean).slice(0, 12) : [];
  } catch {
    return [];
  }
}

function loadDistanceCoordinates() {
  try {
    const parsed = JSON.parse(localStorage.getItem(DISTANCE_COORDINATES_STORAGE_KEY) || "{}");
    return {
      kingdomId: Number(parsed.kingdomId || 0),
      positionX: parseCoordinate(parsed.positionX),
      positionY: parseCoordinate(parsed.positionY),
    };
  } catch {
    return { kingdomId: 0, positionX: null, positionY: null };
  }
}

function loadDistanceHighlightNumber(storageKey, legacyMode = "max") {
  return loadFilterNumber(storageKey, legacyMode);
}

function loadAllRegionFilterSelection() {
  const allIds = ALL_KINGDOM_FILTER_OPTIONS.map((option) => option.id);
  const raw = localStorage.getItem(ALL_REGION_FILTER_STORAGE_KEY);
  if (raw === null) return new Set(allIds);
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return new Set(allIds);
    const validIds = new Set(allIds);
    return new Set(parsed.map(Number).filter((id) => validIds.has(id)));
  } catch {
    return new Set(allIds);
  }
}

function persistAllRegionFilterSelection() {
  localStorage.setItem(ALL_REGION_FILTER_STORAGE_KEY, JSON.stringify([...getSelectedAllRegionIds()]));
}

function getSelectedAllRegionIds() {
  if (!(state.selectedAllRegionIds instanceof Set)) {
    state.selectedAllRegionIds = loadAllRegionFilterSelection();
  }
  return state.selectedAllRegionIds;
}

function loadAllCastleKindFilterSelection() {
  const allIds = ALL_CASTLE_KIND_FILTER_OPTIONS.map((option) => option.id);
  const raw = localStorage.getItem(ALL_CASTLE_KIND_FILTER_STORAGE_KEY);
  if (raw === null) return new Set(allIds);
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return new Set(allIds);
    const validIds = new Set(allIds);
    return new Set(parsed.map(String).filter((id) => validIds.has(id)));
  } catch {
    return new Set(allIds);
  }
}

function persistAllCastleKindFilterSelection() {
  localStorage.setItem(ALL_CASTLE_KIND_FILTER_STORAGE_KEY, JSON.stringify([...getSelectedAllCastleKindIds()]));
}

function getSelectedAllCastleKindIds() {
  if (!(state.selectedAllCastleKindIds instanceof Set)) {
    state.selectedAllCastleKindIds = loadAllCastleKindFilterSelection();
  }
  return state.selectedAllCastleKindIds;
}

function getAllRangeFilterDef(id) {
  const def = ALL_RANGE_FILTER_DEFS[id];
  if (!def) return null;
  if (id !== "building") return def;
  const maxLevel = getSelectedBuildingRangeMax();
  return {
    ...def,
    maxValue: maxLevel,
    defaultMax: maxLevel,
    sliderMax: maxLevel,
    finiteMaxValue: maxLevel,
  };
}

function getSelectedBuildingRangeMax() {
  let selectedBuilding = null;
  try {
    selectedBuilding = getSelectedLevelBuilding();
  } catch {
    return 30;
  }
  const levels = Array.isArray(selectedBuilding?.levels) ? selectedBuilding.levels.map(Number).filter(Number.isFinite) : [];
  const maxLevel = Math.max(0, Number(selectedBuilding?.maxLevel || 0), ...levels);
  return Number.isFinite(maxLevel) && maxLevel > 0 ? Math.trunc(maxLevel) : 30;
}

function getFiniteAllRangeMax(def) {
  const finiteMax = Number(def?.finiteMaxValue);
  if (Number.isFinite(finiteMax)) return finiteMax;
  const max = Number(def?.maxValue);
  return Number.isFinite(max) ? max : 0;
}

function isValidAllRangeValue(value) {
  if (value === null || value === undefined || value === "") return false;
  const number = Number(value);
  return Number.isFinite(number) || number === Number.POSITIVE_INFINITY;
}

function clampAllRangeValue(value, min, max) {
  const number = Number(value);
  if (number === Number.POSITIVE_INFINITY && max === Number.POSITIVE_INFINITY) return number;
  if (number === Number.POSITIVE_INFINITY) return max;
  if (!Number.isFinite(number)) return min;
  return Math.min(max, Math.max(min, number));
}

function serializeAllRangeNumber(value) {
  return Number(value) === Number.POSITIVE_INFINITY ? "Infinity" : value;
}

function loadAllRangeFilters() {
  return Object.fromEntries(Object.keys(ALL_RANGE_FILTER_DEFS).map((id) => {
    return [id, loadAllRangeFilter(id)];
  }));
}

function loadAllRangeFilter(id) {
  const def = getAllRangeFilterDef(id);
  if (!def) return null;
  const raw = localStorage.getItem(def.storageKey);
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object" && ("enabled" in parsed || "min" in parsed || "max" in parsed)) {
        const hasRangeValue = isValidAllRangeValue(parseAllRangeNumber(parsed.min)) || isValidAllRangeValue(parseAllRangeNumber(parsed.max));
        return normalizeAllRangeFilter(id, {
          enabled: "enabled" in parsed ? Boolean(parsed.enabled) : hasRangeValue,
          min: parsed.min,
          max: parsed.max,
        });
      }
      const legacy = getLegacyFilterNumber(parsed, def.legacyMode);
      if (Number.isFinite(legacy)) return migrateLegacyAllRangeFilter(id, legacy);
    } catch {
      const legacy = parsePositiveFilterNumber(raw);
      if (Number.isFinite(legacy)) return migrateLegacyAllRangeFilter(id, legacy);
    }
  }
  const legacyRaw = def.legacyStorageKey && def.legacyStorageKey !== def.storageKey
    ? localStorage.getItem(def.legacyStorageKey)
    : null;
  if (legacyRaw) {
    const legacy = loadFilterNumber(def.legacyStorageKey, def.legacyMode);
    if (Number.isFinite(legacy)) return migrateLegacyAllRangeFilter(id, legacy);
  }
  return normalizeAllRangeFilter(id, {
    enabled: false,
    min: def.defaultMin,
    max: def.defaultMax,
  });
}

function migrateLegacyAllRangeFilter(id, legacyValue) {
  const def = getAllRangeFilterDef(id);
  if (!def) return null;
  const min = def.legacyMode === "min" ? legacyValue : def.minValue;
  const max = def.legacyMode === "min" ? def.maxValue : legacyValue;
  return normalizeAllRangeFilter(id, { enabled: true, min, max });
}

function normalizeAllRangeFilter(id, value) {
  const def = getAllRangeFilterDef(id);
  if (!def) return null;
  const parsedMin = parseAllRangeNumber(value?.min);
  const parsedMax = parseAllRangeNumber(value?.max);
  let min = Number.isFinite(parsedMin) ? parsedMin : def.defaultMin;
  let max = isValidAllRangeValue(parsedMax) ? parsedMax : def.defaultMax;
  min = clampAllRangeValue(min, def.minValue, getFiniteAllRangeMax(def));
  max = clampAllRangeValue(max, def.minValue, def.allowInfinityMax ? Number.POSITIVE_INFINITY : getFiniteAllRangeMax(def));
  if (min > max) [min, max] = [max, min];
  return {
    enabled: Boolean(value?.enabled),
    min,
    max,
  };
}

function persistAllRangeFilter(id) {
  const def = getAllRangeFilterDef(id);
  const range = state.allRangeFilters?.[id];
  if (!def || !range) return;
  localStorage.setItem(def.storageKey, JSON.stringify({
    enabled: Boolean(range.enabled),
    min: serializeAllRangeNumber(range.min),
    max: serializeAllRangeNumber(range.max),
  }));
}

function getAllRangeFilter(id) {
  if (!state.allRangeFilters || typeof state.allRangeFilters !== "object") {
    state.allRangeFilters = loadAllRangeFilters();
  }
  if (!state.allRangeFilters[id]) {
    state.allRangeFilters[id] = loadAllRangeFilter(id);
  }
  state.allRangeFilters[id] = normalizeAllRangeFilter(id, state.allRangeFilters[id]);
  return state.allRangeFilters[id];
}

function getActiveAllRangeFilter(id) {
  const range = getAllRangeFilter(id);
  return range?.enabled ? range : null;
}

function setAllRangeFilter(id, updates = {}, { refresh = true } = {}) {
  const current = getAllRangeFilter(id);
  if (!current) return;
  state.allRangeFilters[id] = normalizeAllRangeFilter(id, { ...current, ...updates });
  persistAllRangeFilter(id);
  syncAllRangeFilterControl(id);
  if (refresh) refreshAllFilters();
}

function loadFilterNumber(storageKey, legacyMode = "max") {
  const raw = localStorage.getItem(storageKey);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    return getLegacyFilterNumber(parsed, legacyMode);
  } catch {
    return parsePositiveFilterNumber(raw);
  }
}

function getLegacyFilterNumber(value, legacyMode = "max") {
  if (value && typeof value === "object") {
    const preferred = parsePositiveFilterNumber(value[legacyMode === "min" ? "min" : "max"]);
    const fallback = parsePositiveFilterNumber(value[legacyMode === "min" ? "max" : "min"]);
    return Number.isFinite(preferred) ? preferred : fallback;
  }
  return parsePositiveFilterNumber(value);
}

function setDistanceHighlightNumber(stateKey, storageKey, value) {
  state[stateKey] = parsePositiveFilterNumber(value);
  if (state[stateKey] === null) {
    localStorage.removeItem(storageKey);
  } else {
    localStorage.setItem(storageKey, String(state[stateKey]));
  }
  syncDistanceHighlightSliders();
}

function parsePositiveFilterNumber(value) {
  if (value === null || value === undefined || value === "") return null;
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? number : null;
}

function parseAllRangeNumber(value) {
  if (value === null || value === undefined || value === "") return null;
  if (isInfinityInput(value)) return Number.POSITIVE_INFINITY;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function parseDistanceRangeInput(value) {
  const cleaned = String(value || "").replaceAll(",", "").trim();
  if (isInfinityInput(cleaned)) return Number.POSITIVE_INFINITY;
  const number = extractFirstNumber(cleaned);
  return Number.isFinite(number) && number >= 0 ? number : null;
}

function parsePlainRangeInput(value) {
  const cleaned = String(value || "").replaceAll(",", "").replace(/[^\d.-]/g, "").trim();
  if (isZeroInput(value)) return 0;
  if (isInfinityInput(value)) return Number.POSITIVE_INFINITY;
  const parsed = extractFirstNumber(cleaned);
  if (!Number.isFinite(parsed)) return null;
  const number = Math.trunc(parsed);
  return Number.isFinite(number) ? number : null;
}

function parseMightRangeInput(value) {
  const cleaned = String(value || "").replaceAll(",", "").trim().toLowerCase();
  if (isInfinityInput(cleaned)) return Number.POSITIVE_INFINITY;
  const number = extractFirstNumber(cleaned);
  if (!Number.isFinite(number)) return null;
  if (cleaned.includes("b")) return number * 1000;
  if (number > 100000) return number / 1000000;
  return number;
}

function parseLootAgeRangeInput(value) {
  const cleaned = String(value || "").replaceAll(",", "").trim().toLowerCase();
  if (isInfinityInput(cleaned)) return Number.POSITIVE_INFINITY;
  const number = extractFirstNumber(cleaned);
  if (!Number.isFinite(number)) return null;
  if (cleaned.includes("h")) return number / 24;
  return number;
}

function isInfinityInput(value) {
  const cleaned = String(value || "").trim().toLowerCase();
  return cleaned === "inf" || cleaned === "infinite" || cleaned === "infinity";
}

function isZeroInput(value) {
  const cleaned = String(value || "").trim().toLowerCase();
  return cleaned === "none" || cleaned === "off" || cleaned === "zero";
}

function extractFirstNumber(value) {
  const match = String(value || "").match(/-?\d+(?:\.\d+)?/);
  return match ? Number(match[0]) : null;
}

function getDistanceFromRangeSlider(value, bound = "max") {
  const sliderValue = Math.trunc(Number(value || 0));
  if (!Number.isFinite(sliderValue) || sliderValue <= 0) return 0;
  if (bound === "max" && sliderValue >= DISTANCE_SLIDER_INFINITY_VALUE) return Number.POSITIVE_INFINITY;
  return clampNumber(sliderValue, 0, DISTANCE_SLIDER_MAX);
}

function getDistanceThresholdFromSlider(value) {
  const sliderValue = Math.trunc(Number(value || 0));
  if (!Number.isFinite(sliderValue) || sliderValue <= 0) return null;
  return clampNumber(sliderValue, 0, DISTANCE_SLIDER_MAX);
}

function getDistanceSliderValue(value) {
  if (Number(value) === Number.POSITIVE_INFINITY) return DISTANCE_SLIDER_INFINITY_VALUE;
  if (!Number.isFinite(Number(value))) return 0;
  return clampNumber(Math.round(Number(value) / 10) * 10, 0, DISTANCE_SLIDER_MAX);
}

function getAttackScoreFromSlider(value) {
  const score = Math.trunc(Number(value || 0));
  return Number.isFinite(score) ? clampNumber(score, 0, 100) : null;
}

function getAttackScoreSliderValue(value) {
  const score = Number(value);
  return Number.isFinite(score) ? clampNumber(Math.trunc(score), 0, 100) : 0;
}

function getBuildingLevelFromSlider(value) {
  const level = Math.trunc(Number(value || 0));
  return Number.isFinite(level) ? clampNumber(level, 0, getSelectedBuildingRangeMax()) : null;
}

function getBuildingLevelSliderValue(value) {
  const level = Number(value);
  return Number.isFinite(level) ? clampNumber(Math.trunc(level), 0, getSelectedBuildingRangeMax()) : 0;
}

function getMightMillionsFromSlider(value, bound = "max") {
  const sliderValue = Math.trunc(Number(value || 0));
  if (!Number.isFinite(sliderValue) || sliderValue <= 0) return 0;
  if (bound === "max" && sliderValue >= MIGHT_SLIDER_INFINITY_STEP) return Number.POSITIVE_INFINITY;
  const progress = (clampNumber(sliderValue, 1, MIGHT_SLIDER_STEPS) - 1) / Math.max(1, MIGHT_SLIDER_STEPS - 1);
  const ratio = MIGHT_SLIDER_MAX_MILLIONS / MIGHT_SLIDER_MIN_MILLIONS;
  const millions = MIGHT_SLIDER_MIN_MILLIONS * Math.pow(ratio, progress);
  return Math.round(millions * 10) / 10;
}

function getMightSliderValue(value) {
  const millions = Number(value);
  if (millions === Number.POSITIVE_INFINITY) return MIGHT_SLIDER_INFINITY_STEP;
  if (!Number.isFinite(millions) || millions <= 0) return 0;
  const ratio = MIGHT_SLIDER_MAX_MILLIONS / MIGHT_SLIDER_MIN_MILLIONS;
  const progress = Math.log(clampNumber(millions, MIGHT_SLIDER_MIN_MILLIONS, MIGHT_SLIDER_MAX_MILLIONS) / MIGHT_SLIDER_MIN_MILLIONS) / Math.log(ratio);
  return clampNumber(Math.round(progress * (MIGHT_SLIDER_STEPS - 1)) + 1, 1, MIGHT_SLIDER_STEPS);
}

function getLootDaysFromSlider(value, bound = "max") {
  const sliderValue = Math.trunc(Number(value || 0));
  if (!Number.isFinite(sliderValue) || sliderValue <= 0) return 0;
  if (bound === "max" && sliderValue >= LOOT_AGE_SLIDER_INFINITY_VALUE) return Number.POSITIVE_INFINITY;
  if (sliderValue <= LOOT_AGE_SLIDER_HOUR_STEPS) {
    return sliderValue / 24;
  }
  return clampNumber(sliderValue - 23, 2, 30);
}

function getLootDaysSliderValue(value) {
  const days = Number(value);
  if (days === Number.POSITIVE_INFINITY) return LOOT_AGE_SLIDER_INFINITY_VALUE;
  if (!Number.isFinite(days) || days <= 0) return 0;
  if (days <= 1) {
    return clampNumber(Math.round(days * 24), 1, LOOT_AGE_SLIDER_HOUR_STEPS);
  }
  return clampNumber(Math.round(days) + 23, LOOT_AGE_SLIDER_HOUR_STEPS + 1, LOOT_AGE_SLIDER_MAX);
}

function persistDistanceCoordinates() {
  localStorage.setItem(DISTANCE_COORDINATES_STORAGE_KEY, JSON.stringify(state.distanceCoordinates));
}

function saveHomePlayerToHistory(playerName) {
  const name = String(playerName || "").trim();
  if (!name) return;
  const remaining = state.homePlayerHistory.filter((item) => item.toLowerCase() !== name.toLowerCase());
  state.homePlayerHistory = [name, ...remaining].slice(0, 12);
  localStorage.setItem(HOME_PLAYER_HISTORY_STORAGE_KEY, JSON.stringify(state.homePlayerHistory));
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
  renderAllBuildingSelect();
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

function renderAllBuildingSelect() {
  if (!elements.allBuildingSelect) return;
  if (state.buildingCatalog.length === 0) {
    elements.allBuildingSelect.disabled = true;
    elements.allBuildingSelect.innerHTML = `<option value="">Loading buildings...</option>`;
    return;
  }
  syncSelectedLevelBuildingKey();
  elements.allBuildingSelect.disabled = false;
  elements.allBuildingSelect.innerHTML = state.buildingCatalog.map((building) => {
    const selected = building.key === state.selectedLevelBuildingKey ? " selected" : "";
    return `<option value="${escapeHtml(building.key)}"${selected}>${escapeHtml(building.displayName)}</option>`;
  }).join("");
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
  setSelectedLevelBuildingKey(building.key);
  closeLevelBuildingMenu();
}

function setSelectedLevelBuildingKey(key) {
  const nextKey = String(key || "");
  if (!state.buildingCatalog.some((building) => building.key === nextKey)) return;
  state.selectedLevelBuildingKey = nextKey;
  localStorage.setItem("empireBirds.levelBuildingKey", state.selectedLevelBuildingKey);
  renderBuildingLevelSelect();
  renderWatchtowerChart();
  renderAllChart();
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
  cacheCurrentDistanceRows();
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
    restoreDistanceRowsForCurrentAlliance();

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
      renderDistanceChart();
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
  renderScoreDetailViews();
}

function toggleConstructionItemDetails(castleKey) {
  if (!castleKey) return;
  if (state.openConstructionItemCastleKeys.has(castleKey)) {
    state.openConstructionItemCastleKeys.delete(castleKey);
  } else {
    state.openConstructionItemCastleKeys.add(castleKey);
  }
  renderScoreDetailViews();
}

function renderScoreDetailViews() {
  if (state.activeRosterTab === "roster") {
    renderRosterTable();
  }
  renderAttackScoreChart();
  if (state.activeRosterTab === "all") {
    renderAllChart();
  }
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
  const items = getPublicOrderItemsForDisplay(target);
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
          ${renderScoreContributionPill(item.scoreContribution, "to PO score")}
        </div>
        <ul>
          ${(Array.isArray(item.effects) ? item.effects : []).map((effect) => `<li><b>${escapeHtml(effect.valueLabel)}</b><span>${escapeHtml(effect.label)}</span></li>`).join("")}
        </ul>
      </div>
    </article>
  `;
}

function renderDefensiveConstructionItemDetails(target) {
  const rows = getConstructionItemRowsForDisplay(target);
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
          ${renderScoreContributionPill(item.scoreContribution, "to build item score")}
        </div>
        <p>${escapeHtml(item.effectText)}</p>
      </div>
    </div>
  `;
}

function getPublicOrderItemsForDisplay(target) {
  const items = Array.isArray(target.publicOrderItems) ? target.publicOrderItems : [];
  if (items.length === 0 || items.every((item) => Number.isFinite(Number(item.scoreContribution)))) return items;
  return addPublicOrderScoreContributions(items);
}

function getConstructionItemRowsForDisplay(target) {
  const rows = Array.isArray(target.constructionItemRows) ? target.constructionItemRows : [];
  if (rows.length === 0 || rows.every(rowHasConstructionItemContributions)) return rows;
  return addConstructionItemScoreContributions(rows, {
    strength: getConstructionItemDetailScore(target),
  });
}

function rowHasConstructionItemContributions(row) {
  const instances = Array.isArray(row.instances) ? row.instances : [];
  return instances.every((instance) => {
    const items = Array.isArray(instance.constructionItems) ? instance.constructionItems : [];
    return items.every((item) => Number.isFinite(Number(item.scoreContribution)));
  });
}

function getConstructionItemDetailScore(target) {
  const details = Array.isArray(target?.categories?.defense?.details) ? target.categories.defense.details : [];
  const detail = details.find((entry) => entry.action === "constructionItems");
  const score = Number(detail?.score);
  return Number.isFinite(score) ? score : 0;
}

function renderScoreContributionPill(value, label) {
  const number = Number(value);
  if (!Number.isFinite(number) || number <= 0) return "";
  return `<span class="score-contribution-pill" title="${escapeHtml(label)}">${escapeHtml(formatScoreContribution(number))} ${escapeHtml(label)}</span>`;
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
  const selectedPlayers = [...state.watchtowerSelectedPlayerIds]
    .map((playerKey) => state.players.find((player) => getPlayerKey(player) === playerKey))
    .filter(Boolean)
    .slice(0, 5);

  await scanWatchtowerPlayers(selectedPlayers, {
    emptyMessage: "Select up to 5 players to evaluate.",
    clearSelectionOnSuccess: true,
  });
}

async function scanAllPlayer(playerId) {
  const playerKey = String(playerId || "");
  const row = getAllResultRows().find((item) => String(item.playerKey || "") === playerKey);
  const player = getRosterPlayerForAllRow(row) || state.players.find((item) => getPlayerKey(item) === playerKey);
  if (!player) {
    showToast("That player is not in the current roster.");
    return;
  }

  await scanWatchtowerPlayers([player], {
    emptyMessage: "That player is not in the current roster.",
    clearSelectionOnSuccess: false,
    refreshAllRows: true,
  });
}

async function scanWatchtowerPlayers(players, { emptyMessage = "Select players to evaluate.", clearSelectionOnSuccess = false, refreshAllRows = false } = {}) {
  if (state.watchtowerScanActive) {
    showToast("A player evaluation is already running.");
    return;
  }

  const scanCacheKey = getWatchtowerAllianceCacheKey();
  const selectedPlayers = (Array.isArray(players) ? players : [])
    .filter(Boolean)
    .slice(0, 5);
  const selectedPlayerKeys = selectedPlayers.map(getPlayerKey);
  const useQuietAllRefresh = refreshAllRows && state.activeRosterTab === "all";
  let completedPlayerKeys = [];

  if (selectedPlayers.length === 0) {
    showToast(emptyMessage);
    return;
  }

  if (state.buildingItemByWod.size === 0) {
    showToast("Building catalog is still loading. Try again in a moment.");
    return;
  }

  state.watchtowerScanActive = true;
  const scanId = state.watchtowerScanId + 1;
  state.watchtowerScanId = scanId;
  state.watchtowerScanProgress = {
    total: selectedPlayers.length,
    completed: 0,
    currentPlayerName: "",
  };
  selectedPlayers.forEach((player) => state.watchtowerLoadingPlayerIds.add(getPlayerKey(player)));
  renderRosterTable();
  if (useQuietAllRefresh) {
    refreshAllPlayerScanControls();
  } else {
    renderScanResultViews();
  }
  renderWatchtowerStatus();

  try {
    const results = await mapLimit(selectedPlayers, 2, async (player, index) => {
      if (scanId === state.watchtowerScanId && state.watchtowerScanProgress) {
        state.watchtowerScanProgress.currentPlayerName = player.player_name;
        renderWatchtowerStatus(`Marching on ${player.player_name} (${index + 1}/${selectedPlayers.length})`);
      }
      try {
        return await fetchPlayerWatchtowerRow(player);
      } finally {
        if (scanId === state.watchtowerScanId && state.watchtowerScanProgress) {
          state.watchtowerScanProgress.completed = Math.min(
            state.watchtowerScanProgress.total,
            state.watchtowerScanProgress.completed + 1,
          );
          renderWatchtowerStatus();
        }
      }
    });

    const cachedResults = scanCacheKey === getWatchtowerAllianceCacheKey()
      ? cloneWatchtowerResults(state.watchtowerResults)
      : cloneWatchtowerResults(state.watchtowerResultsByAlliance.get(scanCacheKey) || new Map());
    results.forEach((result) => {
      cachedResults.set(result.playerKey, result);
    });
    completedPlayerKeys = results.map((result) => String(result.playerKey || "")).filter(Boolean);
    cacheWatchtowerResultsForAllianceKey(scanCacheKey, cachedResults);

    if (scanId === state.watchtowerScanId && scanCacheKey === getWatchtowerAllianceCacheKey()) {
      state.watchtowerResults = cloneWatchtowerResults(cachedResults);
      results.forEach((result) => {
        storePlayerBuildingRows(result.playerKey, result.buildingRows || []);
      });
      if (clearSelectionOnSuccess) {
        state.watchtowerSelectedPlayerIds = new Set();
      }
      state.watchtowerScanProgress = null;
      renderWatchtowerStatus();
    }
  } catch (error) {
    if (scanId === state.watchtowerScanId) {
      showToast(error.message || "Could not evaluate players.");
      state.watchtowerScanProgress = null;
      renderWatchtowerStatus("Evaluation failed. Try again in a moment.");
    }
  } finally {
    if (scanId === state.watchtowerScanId) {
      selectedPlayers.forEach((player) => state.watchtowerLoadingPlayerIds.delete(getPlayerKey(player)));
      state.watchtowerScanActive = false;
      state.watchtowerScanProgress = null;
      renderRosterTable();
      if (useQuietAllRefresh) {
        if (completedPlayerKeys.length > 0) {
          refreshAllRowsForPlayers(completedPlayerKeys);
        } else {
          refreshAllPlayerScanControls(selectedPlayerKeys);
        }
      } else {
        renderScanResultViews();
      }
      renderAllianceData(false, false);
    }
  }
}

async function loadHomeCastles() {
  const playerName = (state.homePlayerName || elements.homePlayerInput?.value || elements.allHomePlayerInput?.value || "").trim();
  if (!playerName) {
    showToast("Type or select your player name first.");
    renderDistanceChart();
    return;
  }

  state.homePlayerName = playerName;
  state.homeCastleLoading = true;
  state.homeCastles = [];
  state.selectedHomeCastleKey = "";
  localStorage.setItem(HOME_PLAYER_STORAGE_KEY, playerName);
  localStorage.removeItem(HOME_CASTLE_STORAGE_KEY);
  closeHomePlayerMenu();
  renderDistanceChart();
  renderWatchtowerStatus(`Loading castles for ${playerName}...`);

  try {
    const castles = normalizeCastleSearchResponse(await apiFetchWithRetry(`castle/search/${encodeURIComponent(playerName)}`))
      .map(mapHomeCastle)
      .filter((castle) => castle && castle.isAvailable && hasCastlePosition(castle))
      .sort(sortScanResultCastles);

    state.homeCastles = castles;
    state.selectedHomeCastleKey = pickDefaultHomeCastleKey(castles);
    if (state.selectedHomeCastleKey) {
      localStorage.setItem(HOME_CASTLE_STORAGE_KEY, state.selectedHomeCastleKey);
    }
    if (castles.length > 0) {
      saveHomePlayerToHistory(playerName);
    }
    if (castles.length === 0) {
      showToast(`No available positioned castles found for ${playerName}.`);
    }
    renderWatchtowerStatus();
  } catch (error) {
    showToast(error.message || "Could not load your castles.");
    renderWatchtowerStatus(`Castle lookup failed for ${playerName}. Try again in a moment.`);
  } finally {
    state.homeCastleLoading = false;
    renderDistanceChart();
    renderScanResultViews();
  }
}

async function ensureAllianceDistanceRows({ force = false } = {}) {
  const cacheKey = getDistanceAllianceCacheKey();
  if (!cacheKey || !state.currentAlliance) {
    state.distanceRows = [];
    state.distanceLoading = false;
    state.distanceLoadError = "";
    renderDistanceChart();
    renderAllChart();
    return;
  }

  if (!force && state.distanceRowsByAlliance.has(cacheKey)) {
    state.distanceRows = cloneDistanceRows(state.distanceRowsByAlliance.get(cacheKey));
    state.distanceLoading = false;
    state.distanceLoadError = "";
    renderDistanceChart();
    renderAllChart();
    return;
  }

  if (state.distanceLoading) return;

  const loadId = state.distanceLoadId + 1;
  state.distanceLoadId = loadId;
  state.distanceLoading = true;
  state.distanceLoadError = "";
  renderDistanceChart();
  renderAllChart();
  renderWatchtowerStatus(`Loading castle coordinates for ${state.currentAlliance.alliance_name}...`);

  try {
    const data = await apiFetchWithRetry(`cartography/id/${encodeURIComponent(state.currentAlliance.alliance_id)}`, 2);
    const rows = normalizeCartographyDistanceRows(data);
    if (loadId !== state.distanceLoadId || cacheKey !== getDistanceAllianceCacheKey()) return;

    state.distanceRows = rows;
    cacheDistanceRowsForAllianceKey(cacheKey, rows);
    renderWatchtowerStatus(rows.length > 0
      ? `Loaded coordinate rows for ${formatNumber(rows.length)} alliance ${rows.length === 1 ? "player" : "players"}.`
      : "No positioned player castles were returned for this alliance.");
  } catch (error) {
    if (loadId !== state.distanceLoadId) return;
    state.distanceRows = [];
    state.distanceLoadError = error.message || "Could not load alliance castle coordinates.";
    showToast("Could not load alliance castle coordinates.");
    renderWatchtowerStatus("Distance coordinate load failed. Try opening the tab again in a moment.");
  } finally {
    if (loadId === state.distanceLoadId) {
      state.distanceLoading = false;
      renderDistanceChart();
      renderAllChart();
      renderAllianceData(false, false);
    }
  }
}

function normalizeCartographyDistanceRows(value) {
  const entries = Array.isArray(value)
    ? value
    : Array.isArray(value?.players)
      ? value.players
      : Array.isArray(value?.data)
        ? value.data
        : [];
  const rosterByName = new Map(
    state.players.map((player) => [String(player.player_name || "").trim().toLowerCase(), player]),
  );

  return entries
    .map((entry, index) => mapCartographyDistanceRow(entry, index, rosterByName))
    .filter(Boolean)
    .sort(sortDistanceRows);
}

function mapCartographyDistanceRow(entry, fallbackIndex, rosterByName) {
  if (!entry || typeof entry !== "object") return null;
  const playerName = String(entry.name || entry.player_name || entry.playerName || "").trim();
  if (!playerName) return null;

  const rosterPlayer = rosterByName.get(playerName.toLowerCase());
  const rawCastles = [
    ...parseCartographyCastleList(entry.castles).map((castle) => mapCartographyCastle(castle, 0, false)),
    ...parseCartographyCastleList(entry.castles_realm ?? entry.castlesRealm).map((castle) => mapCartographyCastle(castle, 0, true)),
  ].filter(Boolean);

  if (rawCastles.length === 0) return null;

  const sortedCastles = rawCastles.sort(sortScanResultCastles);
  const typeTotals = sortedCastles.reduce((totals, castle) => {
    const key = getDistanceCastleTypeKey(castle);
    totals.set(key, (totals.get(key) || 0) + 1);
    return totals;
  }, new Map());
  const typeCounts = new Map();
  const castles = sortedCastles.map((castle, index) => {
    const key = getDistanceCastleTypeKey(castle);
    const count = (typeCounts.get(key) || 0) + 1;
    typeCounts.set(key, count);
    const typeName = getCastleTypeName(castle.castleType);
    return {
      ...castle,
      castleName: typeTotals.get(key) > 1 ? `${typeName} ${count}` : typeName,
      displayIndex: index,
    };
  });

  return normalizeDistanceResultRow({
    playerKey: rosterPlayer ? getPlayerKey(rosterPlayer) : `cartography:${playerName.toLowerCase()}`,
    playerName,
    rank: rosterPlayer?.alliance_rank ?? fallbackIndex + 1,
    mightCurrent: entry.might_current,
    castles,
  });
}

function parseCartographyCastleList(value) {
  if (Array.isArray(value)) return value;
  if (typeof value !== "string") return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function mapCartographyCastle(value, defaultKingdomId = 0, isRealmCastle = false) {
  if (!value) return null;
  const isArrayValue = Array.isArray(value);
  const kingdomId = isRealmCastle
    ? Number(isArrayValue ? value[0] : value.kingdomId ?? value.kingdom_id ?? defaultKingdomId)
    : Number(isArrayValue ? defaultKingdomId : value.kingdomId ?? value.kingdom_id ?? defaultKingdomId);
  const positionX = parseCoordinate(isArrayValue ? value[isRealmCastle ? 1 : 0] : value.positionX ?? value.x);
  const positionY = parseCoordinate(isArrayValue ? value[isRealmCastle ? 2 : 1] : value.positionY ?? value.y);
  const fallbackType = kingdomId === 0 ? 1 : 12;
  const castleType = Number(isArrayValue ? value[isRealmCastle ? 3 : 2] : value.castleType ?? value.type ?? fallbackType) || fallbackType;

  if (!DISTANCE_TARGET_CASTLE_TYPES.has(castleType) || !Number.isFinite(positionX) || !Number.isFinite(positionY)) {
    return null;
  }

  const castleId = `cartography:${kingdomId}:${positionX}:${positionY}:${castleType}`;
  return {
    key: castleId,
    castleId,
    castleName: getCastleTypeName(castleType),
    castleType,
    castleIconUrl: getCastleIconUrl({ type: castleType }),
    kingdomId,
    positionX,
    positionY,
    displayIndex: 0,
  };
}

function getDistanceCastleTypeKey(castle) {
  return `${Number(castle.kingdomId || 0)}:${Number(castle.castleType || 0)}`;
}

function sortDistanceRows(a, b) {
  const rankA = Number(a.rank);
  const rankB = Number(b.rank);
  if (Number.isFinite(rankA) && Number.isFinite(rankB) && rankA !== rankB) return rankA - rankB;
  if (Number.isFinite(rankA) !== Number.isFinite(rankB)) return Number.isFinite(rankA) ? -1 : 1;
  const mightSort = Number(b.mightCurrent || 0) - Number(a.mightCurrent || 0);
  if (mightSort !== 0) return mightSort;
  return String(a.playerName || "").localeCompare(String(b.playerName || ""), undefined, { sensitivity: "base" });
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
    positionX: parseCoordinate(castle.positionX),
    positionY: parseCoordinate(castle.positionY),
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

function mapHomeCastle(castle, displayIndex = 0) {
  if (!castle || typeof castle !== "object") return null;
  return {
    key: getHomeCastleKey(castle),
    castleId: String(castle.id || ""),
    castleName: String(castle.name || "Unnamed castle"),
    castleType: Number(castle.type || 0),
    castleIconUrl: getCastleIconUrl(castle),
    kingdomId: Number(castle.kingdomId || 0),
    positionX: parseCoordinate(castle.positionX),
    positionY: parseCoordinate(castle.positionY),
    isAvailable: Boolean(castle.isAvailable),
    displayIndex,
  };
}

function getHomeCastleKey(castle) {
  return [
    castle.id || castle.castleId || castle.name,
    castle.kingdomId,
    castle.type || castle.castleType,
    castle.positionX,
    castle.positionY,
  ].map((part) => String(part || "")).join("|");
}

function pickDefaultHomeCastleKey(castles) {
  if (!Array.isArray(castles) || castles.length === 0) return "";
  const existing = castles.find((castle) => castle.key === state.selectedHomeCastleKey);
  if (existing) return existing.key;
  const mainCastle = castles.find((castle) => Number(castle.kingdomId) === 0 && Number(castle.castleType) === 1);
  return (mainCastle || castles[0]).key;
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
  const effect = getConstructionItemEffectDefinition(item);
  const statValues = getConstructionItemStatValues(item);
  const normalized = {
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
    effectId: effect.id,
    effectValue: effect.value,
    effectName: effect.name,
    effectTypeName: effect.typeName,
    statValues,
  };
  const defenseProfile = getDefensiveConstructionItemProfile(normalized);
  return {
    ...normalized,
    defensiveScore: defenseProfile.score,
    defensiveSignals: defenseProfile.signals,
    defensiveKind: defenseProfile.kind,
  };
}

function getConstructionItemEffectDefinition(item) {
  const [rawEffectId, rawValue] = String(item?.effects || "").split("&");
  const id = String(rawEffectId || "").trim();
  const effect = id ? state.effectById.get(id) : null;
  const effectType = effect ? state.effectTypeById.get(String(effect.effectTypeID)) : null;
  const value = Number(rawValue);
  return {
    id,
    value: Number.isFinite(value) ? value : null,
    name: String(effect?.name || ""),
    typeName: String(effectType?.name || ""),
  };
}

function getConstructionItemStatValues(item) {
  return [...DIRECT_DEFENSIVE_CONSTRUCTION_STAT_KEYS].reduce((values, key) => {
    const value = Number(item?.[key]);
    if (Number.isFinite(value) && value !== 0) values[key] = value;
    return values;
  }, {});
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
  const constructionItemRows = addConstructionItemScoreContributions(
    mapDefensiveConstructionItemRows(player, castle, result?.structures || []),
    defense.constructionItemStats,
  );
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
    castleId: castle.id || "",
    castleName: castle.name || "Unnamed castle",
    castleType: Number(castle.type || 0),
    castleIconUrl: getCastleIconUrl(castle),
    kingdomId: Number(castle.kingdomId || 0),
    positionX: parseCoordinate(castle.positionX),
    positionY: parseCoordinate(castle.positionY),
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
  weighted += constructionItemStrength * CONSTRUCTION_ITEM_DEFENSE_WEIGHT;
  totalWeight += CONSTRUCTION_ITEM_DEFENSE_WEIGHT;
  details.push(
    {
      label: "Construction items",
      value: constructionItemStats.itemCount > 0
        ? `${constructionItemStats.itemCount} defensive ${constructionItemStats.itemCount === 1 ? "item" : "items"} on ${constructionItemStats.withItems}/${constructionItemStats.total || constructionItemStats.withItems} item-slot buildings`
        : `0/${constructionItemStats.total} item-slot buildings`,
      score: Math.round(constructionItemStrength),
      action: "constructionItems",
      note: "One Defense strength stat from defensive effects found on any building with equipped build items. Click to inspect the buildings.",
    },
  );
  if (constructionItemStats.itemCount === 0) {
    notes.push("No defensive construction items detected.");
  } else if (constructionItemStats.weakness >= 70) {
    notes.push(`${constructionItemStats.itemCount} defensive construction ${constructionItemStats.itemCount === 1 ? "item was" : "items were"} detected, but the item strength looks limited.`);
  }

  return {
    score: Math.round(weighted / totalWeight),
    notes,
    details,
    constructionItemStats,
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
  const scoring = getPublicOrderScoringParts(items);

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

  const itemsWithContributions = addPublicOrderScoreContributions(items, scoring);

  return {
    score: scoring.score,
    publicOrderTotal: scoring.publicOrderTotal,
    items: itemsWithContributions,
    notes: [`${items.length} defense-enhancing PO ${items.length === 1 ? "piece" : "pieces"} found.`],
    details: [
      {
        label: "Public order bonus",
        value: `${items.length} ${items.length === 1 ? "piece" : "pieces"} - ${formatNumber(scoring.publicOrderTotal)} PO`,
        score: scoring.score,
        action: "publicOrder",
        note: "One Defense strength stat combining defense-enhancing pieces, courtyard defense, wall capacity, and flat troop-capacity bonuses. Click to inspect pieces.",
      },
    ],
  };
}

function getPublicOrderScoringParts(items) {
  const publicOrderTotal = items.reduce((sum, item) => sum + Number(item.publicOrder || 0), 0);
  const totals = items.reduce((result, item) => {
    (Array.isArray(item.effects) ? item.effects : []).forEach((effect) => {
      result[effect.type] = (result[effect.type] || 0) + Number(effect.value || 0);
    });
    return result;
  }, {});
  const componentScores = {
    publicOrder: Math.min(publicOrderTotal, 32000) / 32000 * 30,
    yardPercent: Math.min(totals.yardPercent || 0, 130) / 130 * 25,
    wallPercent: Math.min(totals.wallPercent || 0, 160) / 160 * 25,
    defensePercent: Math.min(totals.defensePercent || 0, 130) / 130 * 10,
    flatCapacity: Math.min((totals.flatWall || 0) + (totals.flatDefense || 0), 37500) / 37500 * 10,
  };
  const score = Math.round(clampNumber(Object.values(componentScores).reduce((sum, value) => sum + value, 0), 0, 100));
  return {
    publicOrderTotal,
    totals,
    componentScores,
    score,
  };
}

function addPublicOrderScoreContributions(items, scoring = getPublicOrderScoringParts(items)) {
  const flatTotal = (scoring.totals.flatWall || 0) + (scoring.totals.flatDefense || 0);
  return items.map((item) => {
    const effectTotals = getPublicOrderEffectTotals(item.effects);
    const contribution =
      getProportionalScoreContribution(item.publicOrder, scoring.publicOrderTotal, scoring.componentScores.publicOrder) +
      getProportionalScoreContribution(effectTotals.yardPercent, scoring.totals.yardPercent, scoring.componentScores.yardPercent) +
      getProportionalScoreContribution(effectTotals.wallPercent, scoring.totals.wallPercent, scoring.componentScores.wallPercent) +
      getProportionalScoreContribution(effectTotals.defensePercent, scoring.totals.defensePercent, scoring.componentScores.defensePercent) +
      getProportionalScoreContribution((effectTotals.flatWall || 0) + (effectTotals.flatDefense || 0), flatTotal, scoring.componentScores.flatCapacity);
    return {
      ...item,
      scoreContribution: clampNumber(contribution, 0, 100),
    };
  });
}

function getPublicOrderEffectTotals(effects = []) {
  return effects.reduce((result, effect) => {
    result[effect.type] = (result[effect.type] || 0) + Number(effect.value || 0);
    return result;
  }, {});
}

function getProportionalScoreContribution(value, total, score) {
  const normalizedValue = Math.max(0, Number(value || 0));
  const normalizedTotal = Math.max(0, Number(total || 0));
  const normalizedScore = Math.max(0, Number(score || 0));
  if (normalizedValue <= 0 || normalizedTotal <= 0 || normalizedScore <= 0) return 0;
  return normalizedValue / normalizedTotal * normalizedScore;
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

function addConstructionItemScoreContributions(rows, stats = null) {
  const allItems = rows.flatMap((row) => {
    const instances = Array.isArray(row.instances) ? row.instances : [];
    return instances.flatMap((instance) => Array.isArray(instance.constructionItems) ? instance.constructionItems : []);
  });
  const itemPower = Math.max(0, Number(stats?.itemPower || 0)) ||
    allItems.reduce((sum, item) => sum + getDefensiveConstructionItemPower(item), 0);
  const strength = Math.max(0, Number(stats?.strength || 0));

  return rows.map((row) => ({
    ...row,
    instances: (Array.isArray(row.instances) ? row.instances : []).map((instance) => ({
      ...instance,
      constructionItems: (Array.isArray(instance.constructionItems) ? instance.constructionItems : []).map((item) => {
        const power = getDefensiveConstructionItemPower(item);
        const scoreContribution = itemPower > 0 && strength > 0 ? power / itemPower * strength : 0;
        return {
          ...item,
          scoreContribution: clampNumber(scoreContribution, 0, 100),
        };
      }),
    })),
  }));
}

function getDefensiveConstructionItemStats(structures) {
  const itemSlotStructures = structures.filter(hasConstructionItemSlots);
  const structuresWithDefensiveItems = structures.filter((structure) => getDefensiveConstructionItems(structure).length > 0);
  const defensiveItems = structuresWithDefensiveItems.flatMap((structure) => getDefensiveConstructionItems(structure));
  const total = Math.max(itemSlotStructures.length, structuresWithDefensiveItems.length);
  const withItems = structuresWithDefensiveItems.length;
  const itemCount = defensiveItems.length;
  const itemPower = defensiveItems.reduce((sum, item) => sum + getDefensiveConstructionItemPower(item), 0);
  const strongestItem = defensiveItems.reduce((max, item) => Math.max(max, getDefensiveConstructionItemPower(item)), 0);
  const scaledItemPower = itemPower * CONSTRUCTION_ITEM_SCORE_SPEED;
  const scaledStrongestItem = strongestItem * CONSTRUCTION_ITEM_SCORE_SPEED;
  const scaledItemCount = itemCount * CONSTRUCTION_ITEM_SCORE_SPEED;
  const scaledCoverage = withItems * CONSTRUCTION_ITEM_SCORE_SPEED;
  const powerScore = scaledItemPower > 0 ? 100 * (1 - Math.exp(-scaledItemPower / 115)) : 0;
  const countScore = scaledItemCount > 0 ? 100 * (1 - Math.exp(-scaledItemCount / 2.25)) : 0;
  const coverageTarget = Math.max(1, Math.min(8, total || withItems || 1));
  const coverageScore = scaledCoverage > 0 ? clampNumber((scaledCoverage / coverageTarget) * 100, 0, 100) : 0;
  const strength = clampNumber(
    Math.max(scaledStrongestItem * 0.9, powerScore * 0.7 + countScore * 0.2 + coverageScore * 0.1),
    0,
    100,
  );
  return {
    total,
    withItems,
    itemCount,
    itemPower,
    weakness: 100 - strength,
    strength,
  };
}

function hasConstructionItemSlots(structure) {
  return String(structure?.item?.constructionItemGroupIDs || "")
    .split(",")
    .some((groupId) => groupId.trim());
}

function getDefensiveConstructionItems(structure) {
  return (structure.constructionItems || []).filter(isDefensiveConstructionItem);
}

function isDefensiveConstructionItem(item) {
  return getDefensiveConstructionItemProfile(item).score > 0;
}

function getDefensiveConstructionItemPower(item) {
  return getDefensiveConstructionItemProfile(item).score;
}

function getDefensiveConstructionItemProfile(item) {
  const signals = [];
  const effectTypeKey = normalizeConstructionItemSignalKey(item?.effectTypeName);
  const effectNameKey = normalizeConstructionItemSignalKey(item?.effectName);
  const effectIdTypeKey = DIRECT_DEFENSIVE_CONSTRUCTION_EFFECT_ID_TYPES.get(String(item?.effectId || ""));
  const effectValue = Number(item?.effectValue);

  if (DIRECT_DEFENSIVE_CONSTRUCTION_EFFECT_TYPES.has(effectTypeKey)) {
    signals.push({
      kind: "direct",
      label: item.effectTypeName || item.effectName || "Defensive effect",
      score: scoreDefensiveConstructionEffect(effectTypeKey, effectValue, item),
    });
  } else if (effectIdTypeKey) {
    signals.push({
      kind: "direct",
      label: item.effectName || item.effectTypeName || `Effect ${item.effectId}`,
      score: scoreDefensiveConstructionEffect(effectIdTypeKey, effectValue, item),
    });
  } else if (DIRECT_DEFENSIVE_CONSTRUCTION_EFFECT_TYPES.has(effectNameKey)) {
    signals.push({
      kind: "direct",
      label: item.effectName || "Defensive effect",
      score: scoreDefensiveConstructionEffect(effectNameKey, effectValue, item),
    });
  }

  Object.entries(item?.statValues || {}).forEach(([key, value]) => {
    if (DIRECT_DEFENSIVE_CONSTRUCTION_STAT_KEYS.has(key)) {
      signals.push({
        kind: "direct",
        label: formatConstructionComment(key),
        score: scoreDefensiveConstructionStat(key, value, item),
      });
    }
  });

  if (signals.length === 0 && shouldUseConstructionItemKeywordFallback(item)) {
    signals.push({
      kind: "keyword",
      label: "Defensive wording",
      score: Math.max(20, Math.min(65, getConstructionItemRarityScore(item) + Number(item?.level || 0) * 1.5)),
    });
  }

  const score = clampNumber(signals.reduce((max, signal) => Math.max(max, signal.score), 0), 0, 100);
  const kind = signals.some((signal) => signal.kind === "direct")
    ? "direct"
    : signals.length > 0
      ? "keyword"
      : "";
  return {
    score,
    kind,
    signals: signals.map((signal) => signal.label).filter(Boolean),
  };
}

function scoreDefensiveConstructionEffect(effectTypeKey, value, item) {
  const cap = CONSTRUCTION_ITEM_EFFECT_SCORE_CAPS.get(effectTypeKey);
  if (Number.isFinite(value) && value > 0 && cap) {
    return clampNumber((value / cap) * 100, 0, 100);
  }
  return Math.max(25, Math.min(85, getConstructionItemRarityScore(item) + Number(item?.level || 0) * 1.5));
}

function scoreDefensiveConstructionStat(key, value, item) {
  const cap = CONSTRUCTION_ITEM_STAT_SCORE_CAPS.get(key);
  if (Number.isFinite(Number(value)) && Number(value) > 0 && cap) {
    return clampNumber((Number(value) / cap) * 100, 0, 100);
  }
  return Math.max(20, Math.min(70, getConstructionItemRarityScore(item) + Number(item?.level || 0)));
}

function getConstructionItemRarityScore(item) {
  switch (String(item?.rarityName || "").toLowerCase()) {
    case "unique":
      return 72;
    case "legendary":
      return 64;
    case "epic":
      return 52;
    case "rare":
      return 38;
    case "common":
      return 24;
    default:
      return 28;
  }
}

function shouldUseConstructionItemKeywordFallback(item) {
  const searchText = getConstructionItemSearchText(item);
  if (item?.effectName || item?.effectTypeName || Object.keys(item?.statValues || {}).length > 0) {
    return false;
  }
  if (NON_DEFENSIVE_CONSTRUCTION_ITEM_KEYWORDS.some((keyword) => constructionItemTextIncludes(searchText, keyword))) {
    return false;
  }
  return DEFENSIVE_CONSTRUCTION_ITEM_KEYWORDS.some((keyword) => constructionItemTextIncludes(searchText, keyword));
}

function normalizeConstructionItemSignalKey(value) {
  return String(value || "").toLowerCase().replaceAll(/[^a-z0-9]+/g, "");
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
  if (state.watchtowerScanActive && state.watchtowerScanProgress?.total) {
    elements.watchtowerStatus.hidden = false;
    elements.watchtowerStatus.innerHTML = renderWatchtowerAttackStatus(customStatus);
    syncRosterStatusVisibility();
    return;
  }

  if (customStatus) {
    elements.watchtowerStatus.hidden = false;
    elements.watchtowerStatus.innerHTML = `<p>${escapeHtml(customStatus)}</p>`;
    syncRosterStatusVisibility();
    return;
  }

  elements.watchtowerStatus.innerHTML = "";
  elements.watchtowerStatus.hidden = true;
  syncRosterStatusVisibility();
}

function renderWatchtowerAttackStatus(customStatus = "") {
  const progress = state.watchtowerScanProgress || {};
  const total = Math.max(1, Number(progress.total || 1));
  const completed = Math.max(0, Math.min(total, Number(progress.completed || 0)));
  const percent = Math.max(3, Math.min(100, (completed / total) * 100));
  const status = customStatus
    || (completed >= total
      ? "Attack reports returning..."
      : progress.currentPlayerName
        ? `Marching on ${progress.currentPlayerName}`
        : `Launching ${total === 1 ? "attack" : "attacks"} from the castle`);
  return `
    <div class="scan-march" style="--scan-progress: ${percent}%">
      <div class="scan-march__meta">
        <span class="label">Evaluation march</span>
        <strong>${escapeHtml(status)}</strong>
        <small>${formatNumber(completed)} / ${formatNumber(total)} ${total === 1 ? "player" : "players"} evaluated</small>
      </div>
      <div class="scan-march__field" aria-hidden="true">
        <div class="scan-march__castle scan-march__castle--home">
          <img src="../gge-tracker/gge-tracker-frontend/src/assets/castle1.png" alt="">
        </div>
        <div class="scan-march__path">
          <span class="scan-march__arrow"></span>
          <span class="scan-march__army">
            <img src="../gge-tracker/gge-tracker-frontend/src/assets/troop.png" alt="">
          </span>
        </div>
        <div class="scan-march__castle scan-march__castle--target">
          <img src="../gge-tracker/gge-tracker-frontend/src/assets/castle4.png" alt="">
        </div>
      </div>
    </div>
  `;
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
  state.watchtowerScanProgress = null;
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

function getDistanceAllianceCacheKey(alliance = state.currentAlliance, server = state.server) {
  return getWatchtowerAllianceCacheKey(alliance, server);
}

function cacheCurrentDistanceRows() {
  const cacheKey = getDistanceAllianceCacheKey();
  if (!cacheKey || (!state.distanceRowsByAlliance.has(cacheKey) && state.distanceRows.length === 0)) return;
  cacheDistanceRowsForAllianceKey(cacheKey, state.distanceRows);
}

function cacheDistanceRowsForAllianceKey(cacheKey, rows) {
  if (!cacheKey) return;
  state.distanceRowsByAlliance.set(cacheKey, cloneDistanceRows(rows));
  persistDistanceSessionCache();
}

function restoreDistanceRowsForCurrentAlliance() {
  state.distanceLoadId += 1;
  state.distanceLoading = false;
  state.distanceLoadError = "";
  const cacheKey = getDistanceAllianceCacheKey();
  const cachedRows = cacheKey && state.distanceRowsByAlliance.has(cacheKey)
    ? state.distanceRowsByAlliance.get(cacheKey)
    : null;
  state.distanceRows = cachedRows ? cloneDistanceRows(cachedRows) : [];
}

function cloneDistanceRows(rows) {
  return (Array.isArray(rows) ? rows : [])
    .map(normalizeDistanceResultRow)
    .filter(Boolean)
    .sort(sortDistanceRows);
}

function loadDistanceSessionCache() {
  try {
    const rawCache = sessionStorage.getItem(DISTANCE_SESSION_CACHE_KEY);
    if (!rawCache) return new Map();
    const parsedCache = JSON.parse(rawCache);
    if (!parsedCache || typeof parsedCache !== "object") return new Map();

    const cache = new Map();
    Object.entries(parsedCache).forEach(([cacheKey, rows]) => {
      cache.set(cacheKey, cloneDistanceRows(rows));
    });
    return cache;
  } catch {
    return new Map();
  }
}

function persistDistanceSessionCache() {
  try {
    const cache = {};
    state.distanceRowsByAlliance.forEach((rows, cacheKey) => {
      cache[cacheKey] = cloneDistanceRows(rows);
    });
    sessionStorage.setItem(DISTANCE_SESSION_CACHE_KEY, JSON.stringify(cache));
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
    positionX: parseCoordinate(castle.positionX),
    positionY: parseCoordinate(castle.positionY),
    displayIndex: Math.max(0, Math.trunc(Number(castle.displayIndex) || 0)),
    level: Number.isFinite(level) ? level : null,
    count: Math.max(0, Math.trunc(Number(castle.count) || 0)),
    error: castle.error ? true : null,
  };
}

function normalizeDistanceResultRow(row) {
  if (!row || typeof row !== "object") return null;
  const playerName = String(row.playerName || row.name || "").trim();
  const playerKey = String(row.playerKey || playerName || "").trim();
  if (!playerKey || !playerName) return null;
  const castles = (Array.isArray(row.castles) ? row.castles : [])
    .map(normalizeDistanceCastleResult)
    .filter(Boolean)
    .sort(sortScanResultCastles);
  return {
    playerKey,
    playerName,
    rank: row.rank,
    mightCurrent: Math.max(0, Math.trunc(parseNumeric(row.mightCurrent ?? row.might_current))),
    scannedAt: row.scannedAt || new Date().toISOString(),
    castles,
  };
}

function normalizeDistanceCastleResult(castle) {
  if (!castle || typeof castle !== "object") return null;
  const kingdomId = Number(castle.kingdomId || 0);
  const castleType = Number(castle.castleType ?? castle.type ?? (kingdomId === 0 ? 1 : 12));
  const positionX = parseCoordinate(castle.positionX);
  const positionY = parseCoordinate(castle.positionY);
  if (!DISTANCE_TARGET_CASTLE_TYPES.has(castleType) || !Number.isFinite(positionX) || !Number.isFinite(positionY)) {
    return null;
  }
  const castleId = String(castle.castleId || castle.id || `cartography:${kingdomId}:${positionX}:${positionY}:${castleType}`);
  return {
    key: String(castle.key || castleId),
    castleId,
    castleName: String(castle.castleName || castle.name || getCastleTypeName(castleType)),
    castleType,
    castleIconUrl: String(castle.castleIconUrl || getCastleIconUrl({ type: castleType })),
    kingdomId,
    positionX,
    positionY,
    displayIndex: Math.max(0, Math.trunc(Number(castle.displayIndex) || 0)),
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
    positionX: parseCoordinate(castle.positionX),
    positionY: parseCoordinate(castle.positionY),
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
  if (!["roster", "all"].includes(tabName)) return;
  if (state.activeRosterTab === tabName) {
    if (tabName === "all") void ensureAllianceDistanceRows();
    return;
  }
  keepViewportStable(document.querySelector(".roster-tabs"), () => {
    state.activeRosterTab = tabName;
    renderRosterTabs();
  });
  if (tabName === "all") renderAllChart();
  if (tabName === "all") void ensureAllianceDistanceRows();
}

function isCompactCastleResultView() {
  return false;
}

function renderRosterTabs() {
  document.querySelectorAll("[data-roster-tab]").forEach((button) => {
    const active = button.dataset.rosterTab === state.activeRosterTab;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-selected", active ? "true" : "false");
  });

  if (elements.rosterView) elements.rosterView.hidden = state.activeRosterTab !== "roster";
  if (elements.allView) elements.allView.hidden = state.activeRosterTab !== "all";
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
  renderAllChart();
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

  const compact = isCompactCastleResultView();
  const columns = compact ? null : getCastleTypeColumns(rows, "castles");
  const columnCount = compact ? getCompactCastleColumnCount(rows, "castles") : 0;
  const castleHeaders = compact ? renderCompactCastleHeaders(columnCount) : renderCastleTypeHeaders(columns);
  const tableMinWidth = compact ? getCompactCastleTableMinWidth(columnCount) : getCastleTypeTableMinWidth(columns);
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
        <table class="watchtower-level-table watchtower-level-table--${compact ? "compact" : "grouped"}" style="min-width: ${tableMinWidth}px">
          <thead>
            <tr>
              <th>Player</th>
              ${castleHeaders}
            </tr>
          </thead>
          <tbody>
            ${rows.map((row) => compact
              ? renderCompactWatchtowerResultRow(row, columnCount, selectedBuilding)
              : renderWatchtowerResultRow(row, columns, selectedBuilding)).join("")}
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

  const compact = isCompactCastleResultView();
  const columns = compact ? null : getCastleTypeColumns(rows, "targetCastles");
  const columnCount = compact ? getCompactCastleColumnCount(rows, "targetCastles") : 0;
  const castleHeaders = compact ? renderCompactCastleHeaders(columnCount) : renderCastleTypeHeaders(columns);
  const tableMinWidth = compact ? getCompactCastleTableMinWidth(columnCount) : getCastleTypeTableMinWidth(columns);
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
        <table class="watchtower-level-table watchtower-level-table--${compact ? "compact" : "grouped"}" style="min-width: ${tableMinWidth}px">
          <thead>
            <tr>
              <th>Player</th>
              ${castleHeaders}
            </tr>
          </thead>
          <tbody>
            ${rows.map((row) => compact
              ? renderCompactAttackScoreResultRow(row, columnCount)
              : renderAttackScoreResultRow(row, columns)).join("")}
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

function renderDistanceChart() {
  renderWatchtowerControls();
  renderDistanceControls();
  if (!elements.distanceChart) return;

  if (!state.currentAlliance) {
    elements.distanceChart.innerHTML = `
      <div class="watchtower-empty">
        <img src="assets/attack-target.svg" alt="">
        <strong>No alliance loaded.</strong>
        <span>Load an alliance, then open Distances to fetch castle coordinates.</span>
      </div>
    `;
    return;
  }

  if (state.distanceLoading) {
    elements.distanceChart.innerHTML = `
      <div class="watchtower-empty">
        <img src="assets/attack-target.svg" alt="">
        <strong>Loading castle coordinates...</strong>
        <span>Fetching one cartography snapshot for ${escapeHtml(state.currentAlliance.alliance_name || "this alliance")}.</span>
      </div>
    `;
    return;
  }

  if (state.distanceLoadError) {
    elements.distanceChart.innerHTML = `
      <div class="watchtower-empty">
        <img src="assets/attack-target.svg" alt="">
        <strong>Could not load distances.</strong>
        <span>${escapeHtml(state.distanceLoadError)}</span>
      </div>
    `;
    return;
  }

  const rows = state.distanceRows.filter((row) => Array.isArray(row.castles) && row.castles.length > 0);
  if (rows.length === 0) {
    const cacheKey = getDistanceAllianceCacheKey();
    const hasLoadedDistanceRows = Boolean(cacheKey && state.distanceRowsByAlliance.has(cacheKey));
    elements.distanceChart.innerHTML = `
      <div class="watchtower-empty">
        <img src="assets/attack-target.svg" alt="">
        <strong>${hasLoadedDistanceRows ? "No castle coordinates found." : "No distances yet."}</strong>
        <span>${hasLoadedDistanceRows ? "The cartography snapshot did not return main, outpost, realm, capital, or metropolis castles for this alliance." : "Open this tab to fetch alliance castle coordinates, then choose an origin castle or coordinates."}</span>
      </div>
    `;
    return;
  }

  const origin = getSelectedDistanceOrigin();
  const compact = isCompactCastleResultView();
  const columns = compact ? null : getCastleTypeColumns(rows, "castles");
  const columnCount = compact ? getCompactCastleColumnCount(rows, "castles") : 0;
  const castleHeaders = compact ? renderCompactCastleHeaders(columnCount) : renderCastleTypeHeaders(columns);
  const tableMinWidth = compact ? getCompactCastleTableMinWidth(columnCount) : getCastleTypeTableMinWidth(columns);
  const summaryLabel = origin
    ? `${origin.castleName} to ${formatNumber(rows.length)} ${rows.length === 1 ? "player" : "players"}`
    : `${formatNumber(rows.length)} alliance ${rows.length === 1 ? "player" : "players"} ready for distance checks`;

  elements.distanceChart.innerHTML = `
    <div class="watchtower-chart-shell distance-chart-shell">
      <div class="watchtower-chart-summary">
        <img src="${escapeHtml(origin?.castleIconUrl || "assets/attack-target.svg")}" alt="">
        <div>
          <span class="label">Castle distances</span>
          <strong>${escapeHtml(summaryLabel)}</strong>
        </div>
      </div>
      <div class="watchtower-chart-scroll">
        <table class="watchtower-level-table watchtower-level-table--${compact ? "compact" : "grouped"}" style="min-width: ${tableMinWidth}px">
          <thead>
            <tr>
              <th>Player</th>
              ${castleHeaders}
            </tr>
          </thead>
          <tbody>
            ${rows.map((row, rowIndex) => compact
              ? renderCompactDistanceResultRow(row, columnCount, origin, rowIndex)
              : renderDistanceResultRow(row, columns, origin, rowIndex)).join("")}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function renderAllChart() {
  renderWatchtowerControls();
  renderBuildingLevelSelect();
  renderDistanceControls();
  syncAllFilterControls();
  if (!elements.allChart) return;

  const rows = getAllResultRows();
  const hasAnySourceRows = state.distanceRows.length > 0 || state.watchtowerResults.size > 0;
  if (!state.currentAlliance && !hasAnySourceRows) {
    elements.allChart.innerHTML = `
      <div class="watchtower-empty">
        <img src="assets/attack-target.svg" alt="">
        <strong>No alliance loaded.</strong>
        <span>Load an alliance or evaluate players to build the master view.</span>
      </div>
    `;
    return;
  }

  if (state.distanceLoading && !hasAnySourceRows) {
    elements.allChart.innerHTML = `
      <div class="watchtower-empty">
        <img src="assets/attack-target.svg" alt="">
        <strong>Loading master view...</strong>
        <span>Fetching alliance castle coordinates for the distance layer.</span>
      </div>
    `;
    return;
  }

  if (rows.length === 0) {
    elements.allChart.innerHTML = `
      <div class="watchtower-empty">
        <img src="assets/attack-target.svg" alt="">
        <strong>No master data yet.</strong>
        <span>Open All to load distances, or evaluate players to add building and attack score data.</span>
      </div>
    `;
    updateAllSummary(0, 0);
    return;
  }

  const selectedBuilding = getSelectedLevelBuilding();
  const origin = getSelectedDistanceOrigin();
  const compact = isCompactCastleResultView();
  const columns = getAllCastleRegionColumns(rows, "castles");
  const sortedRows = sortAllResultRows(rows, columns, selectedBuilding, origin);
  const castleHeaders = renderAllCastleHeaders(columns);
  const tableMinWidth = getAllRegionTableMinWidth(columns, compact);
  const cardCount = sortedRows.reduce((sum, row) => sum + getRenderedCastlesForRow(row, "castles", columns).length, 0);
  updateAllSummary(sortedRows.length, cardCount);

  if (columns.length === 0) {
    elements.allChart.innerHTML = `
      <div class="watchtower-empty">
        <img src="assets/attack-target.svg" alt="">
        <strong>No selected castle columns.</strong>
        <span>Select at least one region and castle group with data to show the master view columns.</span>
      </div>
    `;
    return;
  }

  elements.allChart.innerHTML = `
    <div class="watchtower-chart-shell all-chart-shell">
      <div class="watchtower-chart-summary all-chart-tools">
        <label class="all-player-search">
          <span class="label">Player search</span>
          <input type="search" data-all-player-search placeholder="Search players" value="${escapeHtml(state.allPlayerSearchQuery)}" autocomplete="off">
        </label>
      </div>
      <div class="watchtower-chart-scroll">
        <table class="watchtower-level-table watchtower-level-table--all watchtower-level-table--${compact ? "compact" : "grouped"}" style="min-width: ${tableMinWidth}px">
          <thead>
            <tr>
              <th>${renderAllPlayerHeader()}</th>
              ${castleHeaders}
            </tr>
          </thead>
          <tbody>
            ${sortedRows.map((row) => renderAllResultRow(row, columns, selectedBuilding, origin)).join("")}
          </tbody>
        </table>
      </div>
    </div>
  `;

  bindAllChartInteractions(elements.allChart);
  refreshAllFilters();
}

function bindAllChartInteractions(root = elements.allChart) {
  if (!root) return;

  root.querySelectorAll("[data-attack-score-castle]").forEach((button) => {
    button.addEventListener("click", () => {
      const opened = toggleAttackScoreCastle(button.dataset.attackScoreCastle, { renderAttackScore: false });
      renderAllChart();
      if (opened) centerActiveAllAttackScoreBreakdown();
    });
  });
  root.querySelectorAll("[data-all-sort]").forEach((button) => {
    button.addEventListener("click", () => {
      setAllSort(button.dataset.allSort, button.dataset.allSortColumn || "");
    });
  });
  const playerSearch = root.querySelector("[data-all-player-search]");
  playerSearch?.addEventListener("input", () => {
    state.allPlayerSearchQuery = playerSearch.value;
    refreshAllFilters();
  });
  root.querySelectorAll("[data-all-player-scan]").forEach((button) => {
    button.addEventListener("click", () => {
      void scanAllPlayer(button.dataset.allPlayerScan);
    });
  });
  root.querySelectorAll("[data-public-order-toggle]").forEach((button) => {
    button.addEventListener("click", () => {
      togglePublicOrderDetails(button.dataset.publicOrderToggle);
    });
  });
  root.querySelectorAll("[data-construction-item-toggle]").forEach((button) => {
    button.addEventListener("click", () => {
      toggleConstructionItemDetails(button.dataset.constructionItemToggle);
    });
  });
}

function syncAllFilterControls() {
  renderAllBuildingSelect();
  syncAllRegionFilterControls();
  syncAllCastleKindFilterControls();
  syncAllRangeFilterControls();
  if (elements.allHighlightNotCheating) {
    elements.allHighlightNotCheating.checked = state.distanceHighlightNotCheating;
  }
  if (elements.allHighlightNotBirded) {
    elements.allHighlightNotBirded.checked = state.distanceHighlightNotBirded;
  }
  if (elements.allHighlightScanned) {
    elements.allHighlightScanned.checked = state.allHighlightScanned;
  }
}

function syncAllRegionFilterControls() {
  const selectedIds = getSelectedAllRegionIds();
  const inputs = [...document.querySelectorAll("[data-all-region-filter]")];
  inputs.forEach((input) => {
    input.checked = selectedIds.has(Number(input.value));
  });
  if (!elements.allRegionFilterSummary) return;
  if (selectedIds.size === 0) {
    elements.allRegionFilterSummary.textContent = "No regions selected";
    return;
  }
  if (selectedIds.size === ALL_KINGDOM_FILTER_OPTIONS.length) {
    elements.allRegionFilterSummary.textContent = "All regions shown";
    return;
  }
  const labels = ALL_KINGDOM_FILTER_OPTIONS
    .filter((option) => selectedIds.has(option.id))
    .map((option) => option.label);
  elements.allRegionFilterSummary.textContent = `${labels.join(", ")} shown`;
}

function syncAllCastleKindFilterControls() {
  const selectedIds = getSelectedAllCastleKindIds();
  const inputs = [...document.querySelectorAll("[data-all-castle-kind-filter]")];
  inputs.forEach((input) => {
    input.checked = selectedIds.has(String(input.value || ""));
  });
  if (!elements.allCastleKindFilterSummary) return;
  if (selectedIds.size === 0) {
    elements.allCastleKindFilterSummary.textContent = "No groups selected";
    return;
  }
  if (selectedIds.size === ALL_CASTLE_KIND_FILTER_OPTIONS.length) {
    elements.allCastleKindFilterSummary.textContent = "All groups shown";
    return;
  }
  const labels = ALL_CASTLE_KIND_FILTER_OPTIONS
    .filter((option) => selectedIds.has(option.id))
    .map((option) => option.label);
  elements.allCastleKindFilterSummary.textContent = `${labels.join(", ")} shown`;
}

function syncAllRangeFilterControls() {
  Object.keys(ALL_RANGE_FILTER_DEFS).forEach(syncAllRangeFilterControl);
}

function syncAllRangeFilterControl(id) {
  const def = getAllRangeFilterDef(id);
  const range = getAllRangeFilter(id);
  const ruleEl = document.querySelector(`[data-all-range-rule="${id}"]`);
  if (!def || !range || !ruleEl) return;

  const normalized = normalizeAllRangeFilter(id, range);
  state.allRangeFilters[id] = normalized;
  const minSliderValue = def.valueToSlider(normalized.min, "min");
  const maxSliderValue = def.valueToSlider(normalized.max, "max");
  const sliderSpan = Math.max(1, def.sliderMax - def.sliderMin);
  const startRatio = clampNumber((minSliderValue - def.sliderMin) / sliderSpan, 0, 1);
  const endRatio = clampNumber((maxSliderValue - def.sliderMin) / sliderSpan, 0, 1);
  const start = startRatio * 100;
  const end = endRatio * 100;
  const startOffsetPx = RANGE_FILTER_THUMB_RADIUS_PX - RANGE_FILTER_THUMB_SIZE_PX * startRatio;
  const endInsetRatio = 1 - endRatio;
  const endInset = endInsetRatio * 100;
  const endOffsetPx = RANGE_FILTER_THUMB_RADIUS_PX - RANGE_FILTER_THUMB_SIZE_PX * endInsetRatio;

  ruleEl.classList.toggle("is-active", normalized.enabled);
  ruleEl.style.setProperty("--range-start", `${clampNumber(start, 0, 100)}%`);
  ruleEl.style.setProperty("--range-end", `${clampNumber(end, 0, 100)}%`);
  ruleEl.style.setProperty("--range-fill-left", `calc(${start.toFixed(4)}% + ${startOffsetPx.toFixed(4)}px)`);
  ruleEl.style.setProperty("--range-fill-right", `calc(${endInset.toFixed(4)}% + ${endOffsetPx.toFixed(4)}px)`);

  const enabledInput = ruleEl.querySelector("[data-all-range-enabled]");
  if (enabledInput) enabledInput.checked = normalized.enabled;
  const stateLabel = ruleEl.querySelector("[data-all-range-state]");
  if (stateLabel) stateLabel.textContent = normalized.enabled ? "On" : "Off";

  ruleEl.querySelectorAll("[data-all-range-slider]").forEach((slider) => {
    const bound = slider.dataset.allRangeBound === "max" ? "max" : "min";
    slider.min = String(def.sliderMin);
    slider.max = String(def.sliderMax);
    slider.step = String(def.sliderStep);
    slider.value = String(bound === "max" ? maxSliderValue : minSliderValue);
  });

  ruleEl.querySelectorAll("[data-all-range-input]").forEach((input) => {
    if (document.activeElement === input) return;
    const bound = input.dataset.allRangeBound === "max" ? "max" : "min";
    input.value = def.formatInput(normalized[bound]);
  });
}

function setAllSort(metric, columnKey = "") {
  const normalizedMetric = String(metric || "");
  if (!["name", "might", "scanned", "attack", "building", "distance"].includes(normalizedMetric)) return;
  const normalizedColumnKey = String(columnKey || "");
  const sameSort = state.allSort?.metric === normalizedMetric && String(state.allSort?.columnKey || "") === normalizedColumnKey;
  state.allSort = {
    metric: normalizedMetric,
    columnKey: normalizedColumnKey,
    direction: sameSort ? getOppositeAllSortDirection(state.allSort.direction) : getDefaultAllSortDirection(normalizedMetric),
  };
  renderAllChart();
}

function getDefaultAllSortDirection(metric) {
  return metric === "name" ? "asc" : "desc";
}

function getOppositeAllSortDirection(direction) {
  return direction === "asc" ? "desc" : "asc";
}

function updateAllSummary(rowCount, cardCount, highlightedCardCount = null) {
  if (!elements.allSummary) return;
  const selectedBuilding = getSelectedLevelBuilding();
  const rules = [];
  const distanceRange = getActiveAllRangeFilter("distance");
  const attackRange = getActiveAllRangeFilter("attack");
  const buildingRange = getActiveAllRangeFilter("building");
  const mightRange = getActiveAllRangeFilter("might");
  const lootRange = getActiveAllRangeFilter("loot");
  if (distanceRange) rules.push(`player distance ${formatAllRangeRuleValue("distance", distanceRange)}`);
  if (attackRange) rules.push(`attack score ${formatAllRangeRuleValue("attack", attackRange)}`);
  if (buildingRange) rules.push(`building level ${formatAllRangeRuleValue("building", buildingRange)}`);
  if (mightRange) rules.push(`might points ${formatAllRangeRuleValue("might", mightRange)}`);
  if (lootRange) rules.push(`last time looted ${formatAllRangeRuleValue("loot", lootRange)}`);
  if (state.distanceHighlightNotCheating) rules.push("players not cheating");
  if (state.distanceHighlightNotBirded) rules.push("players not birded");
  if (state.allHighlightScanned) rules.push("players scanned");
  if (state.allPlayerSearchQuery.trim()) rules.push(`player contains "${state.allPlayerSearchQuery.trim()}"`);
  const ruleText = rules.length > 0 ? ` Filters: ${rules.join(" and ")}.` : "";
  if (hasActiveAllFilters() && Number.isFinite(highlightedCardCount)) {
    elements.allSummary.textContent = `${formatNumber(highlightedCardCount)} highlighted of ${formatNumber(cardCount)} ${cardCount === 1 ? "castle" : "castles"} for ${formatNumber(rowCount)} ${rowCount === 1 ? "player" : "players"}.${ruleText}`;
    return;
  }
  if (rowCount > 0) {
    elements.allSummary.textContent = `${formatNumber(cardCount)} ${cardCount === 1 ? "castle" : "castles"} for ${formatNumber(rowCount)} ${rowCount === 1 ? "player" : "players"}.${ruleText}`;
  } else if (hasActiveAllFilters() && (state.distanceRows.length > 0 || state.watchtowerResults.size > 0)) {
    elements.allSummary.textContent = `0 castles highlighted by the active rules.${ruleText}`;
  } else {
    elements.allSummary.textContent = `Combines player distance, building level, and attack score data when available.${ruleText}`;
  }
}

function hasActiveAllFilters() {
  return Object.keys(ALL_RANGE_FILTER_DEFS).some((id) => Boolean(getActiveAllRangeFilter(id)))
    || state.distanceHighlightNotCheating
    || state.distanceHighlightNotBirded
    || state.allHighlightScanned;
}

function formatAllRangeRuleValue(id, range) {
  const def = getAllRangeFilterDef(id);
  if (!def || !range) return "";
  const minLabel = def.format(range.min);
  const maxLabel = def.format(range.max);
  if (minLabel === maxLabel) return `= ${minLabel}`;
  return `between ${minLabel} and ${maxLabel}`;
}

function refreshAllFilters() {
  if (!elements.allChart) return;
  syncAllFilterControls();
  const rowEls = [...elements.allChart.querySelectorAll("[data-all-row]")];
  if (rowEls.length === 0) {
    updateAllSummary(0, 0);
    return;
  }

  const hasActiveFilters = hasActiveAllFilters();
  let totalRows = 0;
  let totalCards = 0;
  let highlightedCards = 0;

  rowEls.forEach((rowEl) => {
    const rowMatchesSearch = allRowMatchesPlayerSearch(rowEl);
    rowEl.hidden = !rowMatchesSearch;
    const breakdownRow = findAllBreakdownRowElement(rowEl.dataset.allRow);
    if (breakdownRow) breakdownRow.hidden = !rowMatchesSearch;
    if (!rowMatchesSearch) return;

    let rowCardCount = 0;
    rowEl.querySelectorAll("[data-all-card]").forEach((cardEl) => {
      rowCardCount += 1;
      totalCards += 1;
      const matches = allCardElementMatchesFilters(cardEl);
      cardEl.classList.toggle("watchtower-castle-cell--distance-highlight", hasActiveFilters && matches);
      cardEl.classList.remove("is-filtered-out");
      if (hasActiveFilters && matches) highlightedCards += 1;
    });
    rowEl.classList.remove("is-filtered-out");
    if (rowCardCount > 0) totalRows += 1;
  });

  updateAllSummary(totalRows, totalCards, hasActiveFilters ? highlightedCards : null);
}

function allRowMatchesPlayerSearch(rowEl) {
  const query = normalizeSearchText(state.allPlayerSearchQuery);
  if (!query) return true;
  return normalizeSearchText(rowEl?.dataset?.allPlayerName).includes(query);
}

function normalizeSearchText(value) {
  return String(value || "").trim().toLowerCase();
}

function refreshAllPlayerScanControls() {
  if (!elements.allChart) return;
  elements.allChart.querySelectorAll("[data-all-player-scan]").forEach((button) => {
    const playerKey = String(button.dataset.allPlayerScan || "");
    const row = getAllResultRows().find((item) => getAllRowDomKey(item) === playerKey);
    const player = getRosterPlayerForAllRow(row) || state.players.find((item) => getPlayerKey(item) === playerKey);
    const playerName = row?.playerName || player?.player_name || "player";
    const loading = state.watchtowerLoadingPlayerIds.has(playerKey);
    const scanned = Boolean(row?.watchtowerRow || state.watchtowerResults.has(playerKey));
    const label = loading
      ? `Scanning ${playerName}`
      : player
        ? scanned
          ? `${playerName} already evaluated; rescan player`
          : `Scan ${playerName}`
        : `Cannot scan ${playerName}; player is not in the roster`;
    button.classList.toggle("is-loading", loading);
    button.classList.toggle("is-scanned", scanned);
    button.disabled = !player || loading || state.watchtowerScanActive;
    button.title = label;
    button.setAttribute("aria-label", label);
    button.setAttribute("aria-pressed", "false");
  });
}

function refreshAllRowsForPlayers(playerKeys) {
  if (!elements.allChart || state.activeRosterTab !== "all") return;
  const rows = getAllResultRows();
  const columns = getAllCastleRegionColumns(rows, "castles");
  const currentColumnCount = getCurrentAllColumnCount();

  if (currentColumnCount !== null && currentColumnCount !== columns.length) {
    renderAllChart();
    return;
  }

  const selectedBuilding = getSelectedLevelBuilding();
  const origin = getSelectedDistanceOrigin();
  let replacedAny = false;
  (Array.isArray(playerKeys) ? playerKeys : []).forEach((playerKey) => {
    const key = String(playerKey || "");
    const row = rows.find((item) => getAllRowDomKey(item) === key);
    const rowEl = findAllRowElement(key);
    if (!row || !rowEl) return;
    findAllBreakdownRowElement(key)?.remove();
    rowEl.outerHTML = renderAllResultRow(row, columns, selectedBuilding, origin);
    const nextRowEl = findAllRowElement(key);
    bindAllChartInteractions(nextRowEl);
    bindAllChartInteractions(findAllBreakdownRowElement(key));
    replacedAny = true;
  });

  if (replacedAny) {
    refreshAllFilters();
    refreshAllPlayerScanControls();
  } else {
    refreshAllPlayerScanControls();
  }
}

function getCurrentAllColumnCount() {
  const headerRow = elements.allChart?.querySelector(".watchtower-level-table--all thead tr");
  if (!headerRow) return null;
  return Math.max(0, headerRow.children.length - 1);
}

function findAllRowElement(playerKey) {
  const key = String(playerKey || "");
  return [...(elements.allChart?.querySelectorAll("[data-all-row]") || [])]
    .find((rowEl) => rowEl.dataset.allRow === key) || null;
}

function findAllBreakdownRowElement(playerKey) {
  const key = String(playerKey || "");
  return [...(elements.allChart?.querySelectorAll("[data-all-breakdown-row]") || [])]
    .find((rowEl) => rowEl.dataset.allBreakdownRow === key) || null;
}

function centerActiveAllAttackScoreBreakdown() {
  requestAnimationFrame(() => {
    const breakdown = elements.allChart?.querySelector("[data-all-breakdown-row] .attack-score-breakdown");
    breakdown?.scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "nearest",
    });
  });
}

function allCardElementMatchesFilters(cardEl) {
  if (!cardEl) return false;
  const distanceRange = getActiveAllRangeFilter("distance");
  const attackRange = getActiveAllRangeFilter("attack");
  const buildingRange = getActiveAllRangeFilter("building");
  const mightRange = getActiveAllRangeFilter("might");
  const lootRange = getActiveAllRangeFilter("loot");
  if (distanceRange && !isValueInRange(getDataNumber(cardEl, "distance"), distanceRange)) {
    return false;
  }
  if (attackRange && !isValueInRange(getDataNumber(cardEl, "attackScore"), attackRange)) {
    return false;
  }
  if (buildingRange && !isValueInRange(getDataNumber(cardEl, "buildingLevel"), buildingRange)) {
    return false;
  }
  if (mightRange && !isValueInRange(getDataNumber(cardEl, "might"), mightRange)) {
    return false;
  }
  if (lootRange && !isValueInRange(getDataNumber(cardEl, "lootDays"), lootRange)) {
    return false;
  }
  if (state.distanceHighlightNotCheating && cardEl.dataset.notCheating !== "true") return false;
  if (state.distanceHighlightNotBirded && cardEl.dataset.notBirded !== "true") return false;
  if (state.allHighlightScanned && cardEl.dataset.scanned !== "true") return false;
  return true;
}

function shouldGlowAllCardElement(cardEl) {
  return hasActiveAllFilters() && allCardElementMatchesFilters(cardEl);
}

function getDataNumber(element, key) {
  const raw = element?.dataset?.[key];
  if (raw === null || raw === undefined || raw === "") return null;
  const value = Number(raw);
  return Number.isFinite(value) ? value : null;
}

function isValueAtMost(value, threshold) {
  return Number.isFinite(Number(value)) && Number.isFinite(Number(threshold)) && Number(value) <= Number(threshold);
}

function isValueAtLeast(value, threshold) {
  return Number.isFinite(Number(value)) && Number.isFinite(Number(threshold)) && Number(value) >= Number(threshold);
}

function isValueInRange(value, range) {
  const number = Number(value);
  const min = Number(range?.min);
  const max = Number(range?.max);
  return Number.isFinite(number)
    && Number.isFinite(min)
    && (Number.isFinite(max) || max === Number.POSITIVE_INFINITY)
    && number >= min
    && number <= max;
}

function getAllResultRows() {
  const rowsByKey = new Map();
  const mergeRow = (row, source) => {
    if (!row) return;
    const key = getAllResultRowKey(row);
    if (!key) return;
    const existing = rowsByKey.get(key) || {
      playerKey: String(row.playerKey || key),
      playerName: String(row.playerName || row.name || "Unknown player"),
      rank: row.rank,
      mightCurrent: Math.max(0, Math.trunc(parseNumeric(row.mightCurrent ?? row.might_current))),
      castles: [],
      distanceRow: null,
      watchtowerRow: null,
    };
    existing.playerKey = existing.playerKey || String(row.playerKey || key);
    existing.playerName = existing.playerName || String(row.playerName || row.name || "Unknown player");
    existing.rank = existing.rank ?? row.rank;
    existing.mightCurrent = existing.mightCurrent || Math.max(0, Math.trunc(parseNumeric(row.mightCurrent ?? row.might_current)));
    if (source === "distance") existing.distanceRow = row;
    if (source === "watchtower") existing.watchtowerRow = row;
    existing.castles = dedupeAllCastles([
      ...existing.castles,
      ...(Array.isArray(row.castles) ? row.castles : []),
      ...(Array.isArray(row.targetCastles) ? row.targetCastles : []),
    ]);
    rowsByKey.set(key, existing);
  };

  state.distanceRows.forEach((row) => mergeRow(row, "distance"));
  state.watchtowerResults.forEach((row) => mergeRow(row, "watchtower"));

  return [...rowsByKey.values()]
    .map((row) => ({ ...row, castles: row.castles.sort(sortScanResultCastles) }))
    .sort(sortDistanceRows);
}

function sortAllResultRows(rows, columns, selectedBuilding, origin) {
  const sort = state.allSort;
  if (!sort?.metric) return rows;
  const direction = sort.direction === "asc" ? "asc" : "desc";
  return rows.slice().sort((a, b) => {
    if (sort.metric === "name") {
      const nameSort = String(a.playerName || "").localeCompare(String(b.playerName || ""), undefined, { sensitivity: "base" });
      return direction === "asc" ? nameSort : -nameSort;
    }
    if (sort.metric === "might") {
      const mightSort = compareNullableNumbers(Number(a.mightCurrent || 0), Number(b.mightCurrent || 0), direction);
      return mightSort || sortDistanceRows(a, b);
    }
    if (sort.metric === "scanned") {
      const scannedSort = compareNullableNumbers(a.watchtowerRow ? 1 : 0, b.watchtowerRow ? 1 : 0, direction);
      return scannedSort || sortDistanceRows(a, b);
    }
    const valueA = getAllColumnSortValue(a, columns, sort, selectedBuilding, origin);
    const valueB = getAllColumnSortValue(b, columns, sort, selectedBuilding, origin);
    const numericSort = compareNullableNumbers(valueA, valueB, direction);
    return numericSort || sortDistanceRows(a, b);
  });
}

function getAllColumnSortValue(row, columns, sort, selectedBuilding, origin) {
  const column = (Array.isArray(columns) ? columns : []).find((entry) => entry.key === sort.columnKey);
  if (!column) return null;
  const castle = getCastlesForColumn(row, "castles", column)[0];
  if (!castle) return null;
  if (sort.metric === "attack") {
    const target = getAllAttackTargetForCastle(row, castle);
    return target && !target.error ? Number(target.score) : null;
  }
  if (sort.metric === "building") {
    const buildingRow = getAllBuildingRowForCastle(row, castle, selectedBuilding);
    return Number(buildingRow?.maxLevel || 0) > 0 ? Number(buildingRow.maxLevel) : null;
  }
  if (sort.metric === "distance") {
    const targetOrigin = getDistanceOriginForTarget(castle, origin);
    return getComparableDisplayedDistance(getCastleDistance(targetOrigin, castle));
  }
  return null;
}

function compareNullableNumbers(a, b, direction = "desc") {
  const valueA = Number(a);
  const valueB = Number(b);
  const hasA = Number.isFinite(valueA);
  const hasB = Number.isFinite(valueB);
  if (hasA && hasB && valueA !== valueB) return direction === "asc" ? valueA - valueB : valueB - valueA;
  if (hasA !== hasB) return hasA ? -1 : 1;
  return 0;
}

function getAllResultRowKey(row) {
  const key = String(row?.playerKey || "").trim();
  if (key) return key.toLowerCase();
  const name = String(row?.playerName || row?.name || "").trim();
  return name ? `name:${name.toLowerCase()}` : "";
}

function dedupeAllCastles(castles) {
  const seen = new Set();
  const indexByKey = new Map();
  const result = [];
  (Array.isArray(castles) ? castles : []).forEach((castle) => {
    if (!castle) return;
    const key = getAllCastleIdentity(castle);
    if (seen.has(key)) {
      const index = indexByKey.get(key);
      if (Number.isInteger(index)) {
        result[index] = mergeAllCastleCandidate(result[index], castle);
      }
      return;
    }
    seen.add(key);
    indexByKey.set(key, result.length);
    result.push(castle);
  });
  return result;
}

function getAllCastleIdentity(castle) {
  const x = parseCoordinate(castle?.positionX);
  const y = parseCoordinate(castle?.positionY);
  if (Number.isFinite(x) && Number.isFinite(y)) {
    return `pos:${Number(castle?.kingdomId || 0)}:${Number(castle?.castleType || 0)}:${x}:${y}`;
  }
  const castleId = String(castle?.castleId || castle?.id || "").trim();
  if (castleId) return `id:${castleId}`;
  return `name:${Number(castle?.kingdomId || 0)}:${Number(castle?.castleType || 0)}:${String(castle?.castleName || "").toLowerCase()}`;
}

function mergeAllCastleCandidate(baseCastle, candidateCastle) {
  const merged = { ...baseCastle };
  const baseName = String(baseCastle?.castleName || "").trim();
  const candidateName = String(candidateCastle?.castleName || "").trim();
  if (candidateName && (!baseName || isGenericCastleDisplayName(baseCastle) || candidateName.length > baseName.length)) {
    merged.castleName = candidateName;
  }
  ["key", "castleId", "id", "castleIconUrl", "displayIndex"].forEach((field) => {
    const current = String(merged[field] || "").trim();
    const next = candidateCastle?.[field];
    if (next !== null && next !== undefined && (!current || current.startsWith("cartography:"))) {
      merged[field] = next;
    }
  });
  return merged;
}

function isGenericCastleDisplayName(castle) {
  const name = String(castle?.castleName || "").trim().toLowerCase();
  if (!name) return true;
  if (["main castle", "realm castle", "capital", "metropolis"].includes(name)) return true;
  return /^outpost\s+\d+$/i.test(name);
}

function filterAllResultRows(rows, selectedBuilding) {
  const origin = getSelectedDistanceOrigin();
  return rows.map((row) => {
    const castles = row.castles.filter((castle) => allCastleMatchesFilters(row, castle, selectedBuilding, origin));
    return { ...row, castles };
  }).filter((row) => row.castles.length > 0);
}

function allCastleMatchesFilters(row, castle, selectedBuilding, selectedOrigin = getSelectedDistanceOrigin()) {
  const target = getAllAttackTargetForCastle(row, castle);
  const buildingRow = selectedBuilding ? getAllBuildingRowForCastle(row, castle, selectedBuilding) : null;
  const origin = getDistanceOriginForTarget(castle, selectedOrigin);
  const distance = getComparableDisplayedDistance(getCastleDistance(origin, castle));
  const meta = getDistanceRowFilterMeta(row);
  const distanceRange = getActiveAllRangeFilter("distance");
  const attackRange = getActiveAllRangeFilter("attack");
  const buildingRange = getActiveAllRangeFilter("building");
  const mightRange = getActiveAllRangeFilter("might");
  const lootRange = getActiveAllRangeFilter("loot");
  if (distanceRange && !isValueInRange(distance, distanceRange)) {
    return false;
  }
  if (attackRange && (!target || target.error || !isValueInRange(Number(target.score), attackRange))) {
    return false;
  }
  if (buildingRange && !isValueInRange(Number(buildingRow?.maxLevel || 0), buildingRange)) {
    return false;
  }
  if (mightRange && !isValueInRange(meta.playerMightMillions, mightRange)) {
    return false;
  }
  if (lootRange && !isValueInRange(meta.lootAgeDays, lootRange)) {
    return false;
  }
  if (state.allHighlightScanned && !row.watchtowerRow) {
    return false;
  }
  return (!state.distanceHighlightNotCheating || meta.matchesNotCheating)
    && (!state.distanceHighlightNotBirded || meta.matchesNotBirded);
}

function renderDistanceControls() {
  if (!elements.homePlayerInput && !elements.allHomePlayerInput) return;
  const isCoordinateMode = state.distanceOriginMode === "coordinates";

  document.querySelectorAll("[data-distance-origin-mode]").forEach((button) => {
    const active = button.dataset.distanceOriginMode === state.distanceOriginMode;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-selected", active ? "true" : "false");
  });
  document.querySelectorAll("[data-distance-origin-panel]").forEach((panel) => {
    panel.hidden = panel.dataset.distanceOriginPanel !== state.distanceOriginMode;
  });
  document.querySelectorAll("[data-all-distance-origin-panel]").forEach((panel) => {
    panel.hidden = panel.dataset.allDistanceOriginPanel !== state.distanceOriginMode;
  });

  if (elements.homePlayerInput && document.activeElement !== elements.homePlayerInput) {
    elements.homePlayerInput.value = state.homePlayerName;
  }
  if (elements.allHomePlayerInput && document.activeElement !== elements.allHomePlayerInput) {
    elements.allHomePlayerInput.value = state.homePlayerName;
  }

  renderHomePlayerMenu();

  if (elements.loadHomeCastles) {
    elements.loadHomeCastles.disabled = state.homeCastleLoading || !state.homePlayerName.trim();
    elements.loadHomeCastles.textContent = state.homeCastleLoading ? "Loading..." : "Load castles";
  }
  if (elements.allLoadHomeCastles) {
    elements.allLoadHomeCastles.disabled = state.homeCastleLoading || !state.homePlayerName.trim();
    elements.allLoadHomeCastles.textContent = state.homeCastleLoading ? "Loading..." : "Load";
  }

  const options = state.homeCastles.length > 0
    ? state.homeCastles.map((castle) => {
      const selected = castle.key === state.selectedHomeCastleKey ? " selected" : "";
      const label = `${castle.castleName} - ${getKingdomName(castle.kingdomId)} (${formatCoordinate(castle.positionX)}, ${formatCoordinate(castle.positionY)})`;
      return `<option value="${escapeHtml(castle.key)}"${selected}>${escapeHtml(label)}</option>`;
    }).join("")
    : `<option value="">${state.homeCastleLoading ? "Loading castles..." : "Load castles first"}</option>`;
  if (elements.homeCastleSelect) {
    elements.homeCastleSelect.innerHTML = options;
    elements.homeCastleSelect.disabled = state.homeCastleLoading || state.homeCastles.length === 0;
  }
  if (elements.allHomeCastleSelect) {
    elements.allHomeCastleSelect.innerHTML = options;
    elements.allHomeCastleSelect.disabled = state.homeCastleLoading || state.homeCastles.length === 0;
  }

  if (elements.distanceRegionSelect) {
    elements.distanceRegionSelect.value = String(state.distanceCoordinates.kingdomId || 0);
  }
  if (elements.allDistanceRegionSelect) {
    elements.allDistanceRegionSelect.value = String(state.distanceCoordinates.kingdomId || 0);
  }
  if (document.activeElement !== elements.distanceXInput && elements.distanceXInput) {
    elements.distanceXInput.value = state.distanceCoordinates.positionX ?? "";
  }
  if (document.activeElement !== elements.distanceYInput && elements.distanceYInput) {
    elements.distanceYInput.value = state.distanceCoordinates.positionY ?? "";
  }
  if (document.activeElement !== elements.allDistanceXInput && elements.allDistanceXInput) {
    elements.allDistanceXInput.value = state.distanceCoordinates.positionX ?? "";
  }
  if (document.activeElement !== elements.allDistanceYInput && elements.allDistanceYInput) {
    elements.allDistanceYInput.value = state.distanceCoordinates.positionY ?? "";
  }
  syncDistanceHighlightSliders();
  syncDistanceHighlightToggles();

  const origin = getSelectedDistanceOrigin();
  const homeCastle = getSelectedHomeCastle();
  if (elements.homeDistanceSummary) {
    if (state.homeCastleLoading) {
      elements.homeDistanceSummary.textContent = `Loading castles for ${state.homePlayerName}...`;
    } else if (isCoordinateMode && origin) {
      elements.homeDistanceSummary.textContent = `${getKingdomName(origin.kingdomId)} coordinates at ${formatCoordinates(origin)}.`;
    } else if (isCoordinateMode) {
      elements.homeDistanceSummary.textContent = "Enter X/Y coordinates and region.";
    } else if (homeCastle) {
      elements.homeDistanceSummary.textContent = `${homeCastle.castleName} in ${getKingdomName(homeCastle.kingdomId)} at ${formatCoordinates(homeCastle)}. Regional cards use matching main castles.`;
    } else if (state.homePlayerName) {
      elements.homeDistanceSummary.textContent = "Load your castles to calculate distances.";
    } else {
      elements.homeDistanceSummary.textContent = "Type or select your player, then load castles.";
    }
  }
}

function syncDistanceHighlightSliders() {
  syncSliderControl(
    elements.distanceHighlightInput,
    elements.distanceHighlightValue,
    formatDistanceRuleValue,
    getDistanceSliderValue(state.distanceHighlightThreshold),
  );
  syncSliderControl(
    elements.distanceMightInput,
    elements.distanceMightValue,
    formatMightRuleValue,
    getMightSliderValue(state.distanceHighlightMightMillions),
  );
  syncSliderControl(
    elements.distanceLootDaysInput,
    elements.distanceLootDaysValue,
    formatLootAgeRuleValue,
    getLootDaysSliderValue(state.distanceHighlightLootDays),
  );
  syncAllFilterControls();
}

function syncDistanceHighlightToggles() {
  if (elements.distanceHighlightNotCheating) {
    elements.distanceHighlightNotCheating.checked = state.distanceHighlightNotCheating;
  }
  if (elements.distanceHighlightNotBirded) {
    elements.distanceHighlightNotBirded.checked = state.distanceHighlightNotBirded;
  }
  if (elements.allHighlightNotCheating) {
    elements.allHighlightNotCheating.checked = state.distanceHighlightNotCheating;
  }
  if (elements.allHighlightNotBirded) {
    elements.allHighlightNotBirded.checked = state.distanceHighlightNotBirded;
  }
}

function syncSliderControl(input, output, formatter, sliderValue) {
  if (!input) return;
  input.value = String(sliderValue || 0);
  updateSliderControl(input, output, formatter);
}

function refreshDistanceHighlightFilters() {
  refreshDistanceHighlightControlDisplays();
  refreshDistanceCardHighlights();
  refreshAllFilters();
}

function refreshDistanceHighlightControlDisplays() {
  updateSliderControl(
    elements.distanceHighlightInput,
    elements.distanceHighlightValue,
    formatDistanceRuleValue,
  );
  updateSliderControl(
    elements.distanceMightInput,
    elements.distanceMightValue,
    formatMightRuleValue,
  );
  updateSliderControl(
    elements.distanceLootDaysInput,
    elements.distanceLootDaysValue,
    formatLootAgeRuleValue,
  );
  syncAllFilterControls();
  syncDistanceHighlightToggles();
}

function updateSliderControl(input, output, formatter) {
  if (!input) return;
  const min = Number(input.min || 0);
  const max = Number(input.max || 100);
  const value = Number(input.value || 0);
  const fill = max > min ? ((value - min) / (max - min)) * 100 : 0;
  input.style.setProperty("--slider-fill", `${clampNumber(fill, 0, 100)}%`);
  input.closest(".distance-rule")?.classList.toggle("is-active", value > min);
  if (output) output.textContent = formatter(value > min ? getSliderSemanticValue(input, value) : null);
}

function getSliderSemanticValue(input, value) {
  const id = String(input?.id || "");
  if (id.includes("might")) return getMightMillionsFromSlider(value);
  if (id.includes("loot-days")) return getLootDaysFromSlider(value);
  if (id.includes("attack-score")) return getAttackScoreFromSlider(value);
  if (id.includes("building-level")) return getBuildingLevelFromSlider(value);
  return getDistanceThresholdFromSlider(value);
}

function refreshDistanceCardHighlights() {
  if (!elements.distanceChart) return;
  const rowEls = [...elements.distanceChart.querySelectorAll("[data-distance-row-index]")];
  if (rowEls.length === 0) return;

  const rows = state.distanceRows.filter((row) => Array.isArray(row.castles) && row.castles.length > 0);
  if (rowEls.length !== rows.length) {
    renderDistanceChart();
    return;
  }

  const origin = getSelectedDistanceOrigin();
  const columns = isCompactCastleResultView() ? null : getCastleTypeColumns(rows, "castles");
  rows.forEach((row, rowIndex) => {
    const rowEl = rowEls[rowIndex];
    if (!rowEl) return;
    const rowStatus = getDistanceRowStatus(row);
    const playerCell = rowEl.querySelector("[data-distance-player-cell]");
    if (playerCell) {
      if (rowStatus.title) {
        playerCell.setAttribute("title", rowStatus.title);
      } else {
        playerCell.removeAttribute("title");
      }
    }

    const cardEls = [...rowEl.querySelectorAll("[data-distance-castle-card]")];
    getRenderedCastlesForRow(row, "castles", columns).forEach((castle, cardIndex) => {
      const cardEl = cardEls[cardIndex];
      if (!cardEl) return;
      const targetOrigin = getDistanceOriginForTarget(castle, origin);
      const distance = getCastleDistance(targetOrigin, castle);
      cardEl.classList.toggle("watchtower-castle-cell--distance-highlight", shouldGlowDistanceCastle(distance, rowStatus));
    });
  });
}

function getCompactCastleColumnCount(rows, listKey) {
  const maxCastles = Math.max(0, ...(Array.isArray(rows) ? rows : []).map((row) => {
    return Array.isArray(row?.[listKey]) ? row[listKey].length : 0;
  }));
  return Math.max(1, maxCastles);
}

function renderCompactCastleHeaders(columnCount) {
  return Array.from({ length: columnCount }, (_, index) => `<th>Castle ${index + 1}</th>`).join("");
}

function getCompactCastleTableMinWidth(columnCount) {
  return Math.max(720, 190 + Math.max(1, columnCount) * 180);
}

function getAllCompactCastleTableMinWidth(columnCount) {
  return Math.max(900, ALL_PLAYER_COLUMN_MIN_WIDTH + Math.max(1, columnCount) * ALL_CASTLE_COLUMN_MIN_WIDTH);
}

function getAllCastleTypeTableMinWidth(columns) {
  return Math.max(900, ALL_PLAYER_COLUMN_MIN_WIDTH + Math.max(1, columns.length) * ALL_CASTLE_COLUMN_MIN_WIDTH);
}

function getAllRegionTableMinWidth(columns, compact = false) {
  return Math.max(compact ? 900 : 960, ALL_PLAYER_COLUMN_MIN_WIDTH + Math.max(1, columns.length) * ALL_CASTLE_COLUMN_MIN_WIDTH);
}

function getCompactResultCastles(row, listKey) {
  return (Array.isArray(row?.[listKey]) ? row[listKey] : []).slice().sort(sortScanResultCastles);
}

function getRenderedCastlesForRow(row, listKey, columns = null) {
  if (!Array.isArray(columns) && isCompactCastleResultView()) return getCompactResultCastles(row, listKey);
  return (Array.isArray(columns) ? columns : getCastleTypeColumns([row], listKey))
    .flatMap((column) => getCastlesForColumn(row, listKey, column));
}

function getCastleTypeColumns(rows, listKey) {
  const seen = new Set();
  (Array.isArray(rows) ? rows : []).forEach((row) => {
    (Array.isArray(row?.[listKey]) ? row[listKey] : []).forEach((castle) => {
      if (castle) seen.add(getCastleTypeColumnKey(castle));
    });
  });
  return [...seen].map(getCastleTypeColumn).sort((a, b) => a.order - b.order || a.label.localeCompare(b.label));
}

function getAllCastleRegionColumns(rows, listKey) {
  const maxSlotsByRegion = new Map();
  (Array.isArray(rows) ? rows : []).forEach((row) => {
    const countsByRegion = new Map();
    getAllFilteredCastlesForRow(row, listKey).forEach((castle) => {
      const kingdomId = Number(castle.kingdomId || 0);
      countsByRegion.set(kingdomId, (countsByRegion.get(kingdomId) || 0) + 1);
    });
    countsByRegion.forEach((count, kingdomId) => {
      maxSlotsByRegion.set(kingdomId, Math.max(maxSlotsByRegion.get(kingdomId) || 0, count));
    });
  });
  return [...maxSlotsByRegion.entries()]
    .flatMap(([kingdomId, count]) => Array.from({ length: count }, (_, slotIndex) => getCastleRegionColumn(getCastleRegionSlotColumnKey(kingdomId, slotIndex))))
    .sort((a, b) => a.order - b.order || a.slotIndex - b.slotIndex || a.label.localeCompare(b.label));
}

function getCastleRegionColumnKey(castle) {
  return `kingdom:${Number(castle?.kingdomId || 0)}`;
}

function getCastleRegionSlotColumnKey(kingdomId, slotIndex) {
  return `kingdom:${Number(kingdomId || 0)}:${Number(slotIndex || 0)}`;
}

function getCastleRegionColumn(key) {
  const [, kingdomRaw, slotRaw] = String(key || "").split(":");
  const kingdomId = Number(kingdomRaw || 0);
  const slotIndex = Math.max(0, Number(slotRaw || 0));
  const regionLabel = getKingdomName(kingdomId);
  const label = slotIndex === 0 ? regionLabel : `${regionLabel} ${slotIndex + 1}`;
  return {
    key: getCastleRegionSlotColumnKey(kingdomId, slotIndex),
    kingdomId,
    slotIndex,
    label,
    emptyLabel: `${regionLabel.toLowerCase()} castle`,
    order: getCastleRegionColumnOrder(kingdomId) * 100 + slotIndex,
  };
}

function getCastleRegionColumnOrder(kingdomId) {
  switch (Number(kingdomId || 0)) {
    case 0:
      return 0;
    case 2:
      return 20;
    case 1:
      return 30;
    case 3:
      return 40;
    case 4:
      return 50;
    default:
      return 100 + Number(kingdomId || 0);
  }
}

function getAllFilteredCastlesForRow(row, listKey) {
  const selectedRegionIds = getSelectedAllRegionIds();
  return (Array.isArray(row?.[listKey]) ? row[listKey] : [])
    .filter((castle) => castle && selectedRegionIds.has(Number(castle.kingdomId || 0)) && allCastleMatchesSelectedCastleKinds(castle))
    .sort(sortScanResultCastles);
}

function allCastleMatchesSelectedCastleKinds(castle) {
  const selectedKindIds = getSelectedAllCastleKindIds();
  if (selectedKindIds.size === 0) return false;
  const castleType = Number(castle?.castleType || 0);
  const kingdomId = Number(castle?.kingdomId || 0);
  if (selectedKindIds.has("main") && (castleType === 1 || castleType === 12)) return true;
  if (selectedKindIds.has("outpost") && castleType === 4 && kingdomId === 0) return true;
  if (selectedKindIds.has("property") && (castleType === 3 || castleType === 22)) return true;
  return false;
}

function getCastleTypeColumnKey(castle) {
  return `type:${Number(castle?.castleType || 0)}`;
}

function getCastleTypeColumn(key) {
  const type = Number(String(key || "").replace("type:", ""));
  const label = CASTLE_TYPE_COLUMN_LABELS.get(type) || getCastleTypeName(type);
  return {
    key: `type:${type}`,
    type,
    label,
    emptyLabel: label.toLowerCase(),
    order: CASTLE_TYPE_COLUMN_ORDER.get(type) ?? 100 + type,
  };
}

function renderCastleTypeHeaders(columns) {
  return columns.map((column) => `<th>${escapeHtml(column.label)}</th>`).join("");
}

function renderAllPlayerHeader() {
  return `
    <div class="all-column-header">
      <span class="all-column-title">Player</span>
      <span class="all-sort-label">Sort by</span>
      <span class="all-sort-controls" aria-label="Sort players by">
        ${renderAllSortButton("name", "Name", "Sort players by name")}
        ${renderAllSortButton("might", "Might", "Sort players by might")}
        ${renderAllSortButton("scanned", "Scanned", "Sort players by scan status")}
      </span>
    </div>
  `;
}

function renderAllCastleHeaders(columns) {
  return columns.map((column) => `
    <th>
      <div class="all-column-header">
        <span class="all-column-title">${escapeHtml(column.label)}</span>
        <span class="all-sort-label">Sort by</span>
        <span class="all-sort-controls" aria-label="Sort ${escapeHtml(column.label)} by">
          ${renderAllSortButton("attack", "Attack", `Sort ${column.label} by attack score`, column.key)}
          ${renderAllSortButton("building", "Level", `Sort ${column.label} by building level`, column.key)}
          ${renderAllSortButton("distance", "Distance", `Sort ${column.label} by distance`, column.key)}
        </span>
      </div>
    </th>
  `).join("");
}

function renderAllSortButton(metric, label, title, columnKey = "") {
  const active = isAllSortActive(metric, columnKey);
  const direction = active ? getAllSortDirection() : getDefaultAllSortDirection(metric);
  const nextDirection = active ? getOppositeAllSortDirection(direction) : direction;
  const directionLabel = getAllSortDirectionLabel(metric, direction);
  const nextDirectionLabel = getAllSortDirectionLabel(metric, nextDirection);
  const activeLabel = active ? `, currently ${directionLabel}` : "";
  return `
    <button type="button" class="all-sort-button all-sort-button--${escapeHtml(direction)}${active ? " is-active" : ""}" data-all-sort="${escapeHtml(metric)}" data-all-sort-column="${escapeHtml(columnKey)}" title="${escapeHtml(`${title}${activeLabel}. Click for ${nextDirectionLabel}.`)}" aria-label="${escapeHtml(`${title}${activeLabel}. Click for ${nextDirectionLabel}.`)}" aria-pressed="${active ? "true" : "false"}">
      <span class="all-sort-button__arrow" aria-hidden="true"></span>
      <span class="all-sort-button__label">${escapeHtml(label)}</span>
    </button>
  `;
}

function isAllSortActive(metric, columnKey = "") {
  return state.allSort?.metric === metric && String(state.allSort?.columnKey || "") === String(columnKey || "");
}

function getAllSortDirection() {
  return state.allSort?.direction === "asc" ? "asc" : "desc";
}

function getAllSortDirectionLabel(metric, direction) {
  if (metric === "name") return direction === "asc" ? "A to Z" : "Z to A";
  if (metric === "scanned") return direction === "asc" ? "unscanned first" : "scanned first";
  return direction === "asc" ? "lowest first" : "highest first";
}

function getCastleTypeTableMinWidth(columns) {
  return Math.max(720, 190 + Math.max(1, columns.length) * 240);
}

function getCastlesForColumn(row, listKey, column) {
  if (column?.key?.startsWith("kingdom:") && Number.isInteger(column.slotIndex)) {
    const castles = getAllFilteredCastlesForRow(row, listKey)
      .filter((castle) => Number(castle?.kingdomId || 0) === Number(column.kingdomId || 0));
    return castles[column.slotIndex] ? [castles[column.slotIndex]] : [];
  }
  const getColumnKey = column?.key?.startsWith("kingdom:") ? getCastleRegionColumnKey : getCastleTypeColumnKey;
  return (Array.isArray(row?.[listKey]) ? row[listKey] : [])
    .filter((castle) => getColumnKey(castle) === column.key)
    .sort(sortScanResultCastles);
}

function renderCastleTypeCell(castles, column, renderCard) {
  const cards = castles.map(renderCard).join("");
  return `
    <td>
      <div class="watchtower-castle-stack">
        ${cards || renderEmptyCastleTypeCard(column)}
      </div>
    </td>
  `;
}

function renderEmptyCastleTypeCard(column) {
  return `
    <span class="watchtower-castle-cell watchtower-castle-cell--empty">
      <strong>-</strong>
      <span>No ${escapeHtml(column.emptyLabel)}</span>
    </span>
  `;
}

function renderEmptyCompactCastleCard() {
  return `
    <span class="watchtower-castle-cell watchtower-castle-cell--empty">
      <strong>-</strong>
      <span>No castle in this slot</span>
    </span>
  `;
}

function renderCompactCastleCell(castle, renderCard) {
  return `
    <td>
      ${castle ? renderCard(castle) : renderEmptyCompactCastleCard()}
    </td>
  `;
}

function renderWatchtowerResultRow(row, columns, selectedBuilding) {
  const cells = columns.map((column) => {
    const castles = getCastlesForColumn(row, "castles", column);
    return renderCastleTypeCell(castles, column, (castle) => renderBuildingLevelCastleCard(row, castle, selectedBuilding));
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

function renderCompactWatchtowerResultRow(row, columnCount, selectedBuilding) {
  const castles = getCompactResultCastles(row, "castles");
  const cells = Array.from({ length: columnCount }, (_, index) => {
    return renderCompactCastleCell(castles[index], (castle) => renderBuildingLevelCastleCard(row, castle, selectedBuilding));
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

function renderDistanceResultRow(row, columns, origin, rowIndex) {
  const rowStatus = getDistanceRowStatus(row);
  const cells = columns.map((column) => {
    const castles = getCastlesForColumn(row, "castles", column);
    return renderCastleTypeCell(castles, column, (castle) => renderDistanceCastleCard(castle, origin, rowStatus, row));
  }).join("");
  return `
    <tr data-distance-row-index="${rowIndex}">
      <td>
        <span class="watchtower-player-cell" data-distance-player-cell${rowStatus.title ? ` title="${escapeHtml(rowStatus.title)}"` : ""}>
          <strong>${escapeHtml(row.playerName)}</strong>
          ${rowStatus.badges.length > 0 ? `<span>${rowStatus.badges.map(escapeHtml).join(" / ")}</span>` : ""}
        </span>
      </td>
      ${cells}
    </tr>
  `;
}

function renderCompactDistanceResultRow(row, columnCount, origin, rowIndex) {
  const rowStatus = getDistanceRowStatus(row);
  const castles = getCompactResultCastles(row, "castles");
  const cells = Array.from({ length: columnCount }, (_, index) => {
    return renderCompactCastleCell(castles[index], (castle) => renderDistanceCastleCard(castle, origin, rowStatus, row));
  }).join("");
  return `
    <tr data-distance-row-index="${rowIndex}">
      <td>
        <span class="watchtower-player-cell" data-distance-player-cell${rowStatus.title ? ` title="${escapeHtml(rowStatus.title)}"` : ""}>
          <strong>${escapeHtml(row.playerName)}</strong>
          ${rowStatus.badges.length > 0 ? `<span>${rowStatus.badges.map(escapeHtml).join(" / ")}</span>` : ""}
        </span>
      </td>
      ${cells}
    </tr>
  `;
}

function renderAllResultRow(row, columns, selectedBuilding, origin) {
  const cells = columns.map((column) => {
    const castles = getCastlesForColumn(row, "castles", column);
    return renderCastleTypeCell(castles, column, (castle) => renderAllCastleCard(row, castle, selectedBuilding, origin));
  }).join("");
  const rowKey = getAllRowDomKey(row);
  const activeTarget = getActiveAttackScoreTargetForAllRow(row);
  return `
    <tr data-all-row="${escapeHtml(rowKey)}" data-all-player-name="${escapeHtml(row.playerName || "")}">
      <td>
        ${renderAllPlayerCell(row)}
      </td>
      ${cells}
    </tr>
    ${activeTarget ? renderAllAttackScoreDropdownRow(rowKey, activeTarget, columns.length + 1) : ""}
  `;
}

function renderCompactAllResultRow(row, columnCount, selectedBuilding, origin) {
  const castles = getCompactResultCastles(row, "castles");
  const cells = Array.from({ length: columnCount }, (_, index) => {
    return renderCompactCastleCell(castles[index], (castle) => renderAllCastleCard(row, castle, selectedBuilding, origin));
  }).join("");
  const rowKey = getAllRowDomKey(row);
  const activeTarget = getActiveAttackScoreTargetForAllRow(row);
  return `
    <tr data-all-row="${escapeHtml(rowKey)}" data-all-player-name="${escapeHtml(row.playerName || "")}">
      <td>
        ${renderAllPlayerCell(row)}
      </td>
      ${cells}
    </tr>
    ${activeTarget ? renderAllAttackScoreDropdownRow(rowKey, activeTarget, columnCount + 1) : ""}
  `;
}

function getActiveAttackScoreTargetForAllRow(row) {
  if (!state.activeAttackScoreCastleKey) return null;
  return (row?.watchtowerRow?.targetCastles || []).find((target) => target.key === state.activeAttackScoreCastleKey) || null;
}

function renderAllAttackScoreDropdownRow(rowKey, target, colspan) {
  return `
    <tr class="all-attack-breakdown-row" data-all-breakdown-row="${escapeHtml(rowKey)}">
      <td colspan="${Math.max(1, Number(colspan) || 1)}">
        <div class="all-attack-breakdown-panel">
          ${renderAttackScoreBreakdown(target, "all")}
        </div>
      </td>
    </tr>
  `;
}

function renderAllPlayerCell(row) {
  const scanned = Boolean(row?.watchtowerRow);
  const player = getRosterPlayerForAllRow(row);
  const playerKey = player ? getPlayerKey(player) : String(row?.playerKey || "");
  const might = parseNumeric(player?.might_current ?? row?.mightCurrent);
  const loading = state.watchtowerLoadingPlayerIds.has(playerKey) || state.watchtowerLoadingPlayerIds.has(String(row?.playerKey || ""));
  const scanLabel = loading
    ? `Scanning ${row.playerName}`
    : player
      ? scanned
        ? `${row.playerName} already evaluated; rescan player`
        : `Scan ${row.playerName}`
      : `Cannot scan ${row.playerName}; player is not in the roster`;
  const scanButton = `
    <button type="button" class="player-action-btn player-action-btn--watchtower all-player-cell__scan-button${scanned ? " is-scanned" : ""}${loading ? " is-loading" : ""}" data-all-player-scan="${escapeHtml(playerKey)}" title="${escapeHtml(scanLabel)}" aria-label="${escapeHtml(scanLabel)}" aria-pressed="false"${!player || loading || state.watchtowerScanActive ? " disabled" : ""}>
      <img src="assets/eye-watchtower.svg" alt="">
    </button>
  `;
  return `
    <span class="watchtower-player-cell all-player-cell${scanned ? " is-scanned" : ""}">
      <span class="all-player-cell__name">
        <strong>${escapeHtml(row.playerName)}</strong>
        ${scanButton}
      </span>
      <span class="all-player-cell__meta">
        ${renderAllPlayerMightBadge(might)}
      </span>
    </span>
  `;
}

function renderAllPlayerMightBadge(might) {
  const normalizedMight = Math.max(0, parseNumeric(might));
  if (normalizedMight <= 0) return "";
  return `
    <span class="all-player-might" title="${escapeHtml(`${formatNumber(normalizedMight)} might points`)}">
      <img src="../gge-tracker/gge-tracker-frontend/src/assets/might.png" alt="" loading="lazy">
      <strong>${escapeHtml(formatAllPlayerMightValue(normalizedMight))}</strong>
    </span>
  `;
}

function formatAllPlayerMightValue(might) {
  const millions = Math.max(0, Number(might || 0)) / 1000000;
  if (millions <= 0) return "-";
  return `${formatRoundedRuleNumber(millions)}M`;
}

function getRosterPlayerForAllRow(row) {
  if (!row) return null;
  const rowKey = String(row.playerKey || "");
  const rowName = String(row.playerName || "").trim().toLowerCase();
  return state.players.find((player) => getPlayerKey(player) === rowKey)
    || state.players.find((player) => String(player.player_name || "").trim().toLowerCase() === rowName)
    || null;
}

function getAllRowDomKey(row) {
  const player = getRosterPlayerForAllRow(row);
  return player ? getPlayerKey(player) : String(row?.playerKey || "");
}

function getDistanceRowStatus(row) {
  const meta = getDistanceRowFilterMeta(row);
  const mightRange = getEffectiveDistanceMightMillions();
  const lootDaysRange = getEffectiveDistanceLootDays();
  const badges = [];
  const activeFilters = [];
  const matchedFilters = [];

  if (meta.isBotLike) badges.push("Bot-like");
  if (meta.underProtection) badges.push("Protected");
  if (Number.isFinite(mightRange)) {
    const label = `might points >= ${formatMightRuleValue(mightRange)}`;
    activeFilters.push(label);
    if (isValueAtLeast(meta.playerMightMillions, mightRange)) {
      matchedFilters.push(label);
    }
  }
  if (Number.isFinite(lootDaysRange)) {
    const label = `last time looted >= ${formatLootAgeRuleValue(lootDaysRange)}`;
    activeFilters.push(label);
    if (isValueAtLeast(meta.lootAgeDays, lootDaysRange)) {
      matchedFilters.push(label);
    }
  }
  if (state.distanceHighlightNotCheating) {
    activeFilters.push("not cheating");
    if (meta.matchesNotCheating) matchedFilters.push("not cheating");
  }
  if (state.distanceHighlightNotBirded) {
    activeFilters.push("not birded");
    if (meta.matchesNotBirded) matchedFilters.push("not birded");
  }

  const matchesActiveFilters = activeFilters.length > 0 && matchedFilters.length === activeFilters.length;
  return {
    badges,
    hasStatusFilter: activeFilters.length > 0,
    matchesStatusFilters: matchesActiveFilters,
    title: matchesActiveFilters
      ? `Matches ${matchedFilters.join(" and ")} highlight filter${matchedFilters.length === 1 ? "" : "s"}`
      : badges.join(" / "),
  };
}

function getDistanceRowFilterMeta(row) {
  const player = getRosterPlayerForDistanceRow(row);
  const activity = player ? state.lootActivityByPlayerKey.get(getPlayerKey(player)) : null;
  const isBotLike = Boolean(activity?.botLikeLootStreak?.isFlagged);
  const hasBotSignalLoaded = Boolean(activity && !activity.error && activity.botLikeLootStreak);
  const underProtection = Boolean(player && isProtected(player.peace_disabled_at));
  return {
    player,
    activity,
    isBotLike,
    hasBotSignalLoaded,
    underProtection,
    playerMightMillions: getDistanceRowMightMillions(row, player),
    lootAgeDays: getDistanceRowLootAgeDays(activity),
    matchesNotCheating: Boolean(player && hasBotSignalLoaded && !isBotLike),
    matchesNotBirded: Boolean(player && !underProtection),
  };
}

function getDistanceRowMightMillions(row, player) {
  const might = parseNumeric(player?.might_current ?? row?.mightCurrent);
  return might > 0 ? might / 1000000 : null;
}

function getDistanceRowLootAgeDays(activity) {
  if (!activity || activity.error) return null;
  if (!activity.latestPositiveDate) return 30;
  const date = activity.latestPositiveDate instanceof Date
    ? activity.latestPositiveDate
    : new Date(activity.latestPositiveDate);
  if (Number.isNaN(date.getTime())) return null;
  return Math.max(0, (Date.now() - date.getTime()) / 86400000);
}

function getRosterPlayerForDistanceRow(row) {
  const rowKey = String(row?.playerKey || "");
  const rowName = String(row?.playerName || "").trim().toLowerCase();
  return state.players.find((player) => getPlayerKey(player) === rowKey)
    || state.players.find((player) => String(player.player_name || "").trim().toLowerCase() === rowName)
    || null;
}

function renderAttackScoreResultRow(row, columns) {
  const cells = columns.map((column) => {
    const castles = getCastlesForColumn(row, "targetCastles", column);
    return renderCastleTypeCell(castles, column, renderAttackScoreCastleCard);
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

function renderCompactAttackScoreResultRow(row, columnCount) {
  const castles = getCompactResultCastles(row, "targetCastles");
  const cells = Array.from({ length: columnCount }, (_, index) => {
    return renderCompactCastleCell(castles[index], renderAttackScoreCastleCard);
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

function toggleAttackScoreCastle(targetKey, options = {}) {
  if (!targetKey) return false;
  state.activeAttackScoreCastleKey = state.activeAttackScoreCastleKey === targetKey ? "" : targetKey;
  if (options.renderAttackScore !== false) renderAttackScoreChart();
  return state.activeAttackScoreCastleKey === targetKey;
}

function renderAttackScoreBreakdown(target, context = "standalone") {
  const contextClass = context ? ` attack-score-breakdown--${escapeHtml(context)}` : "";
  return `
    <div class="attack-score-breakdown${contextClass}">
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

function renderBuildingLevelCastleCard(row, castle, selectedBuilding) {
  const buildingRow = selectedBuilding ? getBuildingLevelRowForCastle(row, castle, selectedBuilding.key) : null;
  const levelLabel = castle.error ? "Failed" : buildingRow?.maxLevel > 0 ? `L${buildingRow.maxLevel}` : "None";
  const modifier = castle.error ? "error" : buildingRow?.maxLevel > 0 ? "found" : "missing";
  const countLabel = !selectedBuilding
    ? "Select a building"
    : buildingRow?.count > 1 ? `${buildingRow.count} found` : buildingRow?.maxLevel > 0 ? selectedBuilding.displayName : `No ${selectedBuilding.displayName}`;
  return `
    <span class="watchtower-castle-cell watchtower-castle-cell--${modifier}">
      <img src="${escapeHtml(castle.castleIconUrl)}" alt="">
      <span class="watchtower-castle-cell__copy">
        <strong>${escapeHtml(castle.castleName)}</strong>
        <span>${escapeHtml(getKingdomName(castle.kingdomId))} - ${escapeHtml(getCastleTypeName(castle.castleType))}</span>
        <small>${escapeHtml(countLabel)}</small>
      </span>
      <b>${escapeHtml(levelLabel)}</b>
    </span>
  `;
}

function getSelectedLevelBuilding() {
  if (!state.selectedLevelBuildingKey) syncSelectedLevelBuildingKey();
  return state.buildingCatalog.find((building) => building.key === state.selectedLevelBuildingKey) || null;
}

function getSelectedHomeCastle() {
  if (!state.selectedHomeCastleKey && state.homeCastles.length > 0) {
    state.selectedHomeCastleKey = pickDefaultHomeCastleKey(state.homeCastles);
  }
  return state.homeCastles.find((castle) => castle.key === state.selectedHomeCastleKey) || null;
}

function getSelectedDistanceOrigin() {
  if (state.distanceOriginMode === "coordinates") {
    const origin = {
      castleId: "manual-coordinates",
      castleName: `Coordinates ${formatCoordinates(state.distanceCoordinates)}`,
      castleType: 0,
      castleIconUrl: "assets/attack-target.svg",
      kingdomId: Number(state.distanceCoordinates.kingdomId || 0),
      positionX: parseCoordinate(state.distanceCoordinates.positionX),
      positionY: parseCoordinate(state.distanceCoordinates.positionY),
    };
    return hasCastlePosition(origin) ? origin : null;
  }

  return getSelectedHomeCastle();
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

function renderAttackScoreCastleCard(castle) {
  const modifier = castle.error ? "error" : `target-${castle.verdictClass || "unknown"}`;
  const scoreLabel = castle.error ? "Failed" : `${castle.score}/100`;
  const active = state.activeAttackScoreCastleKey === castle.key;
  return `
    <button type="button" class="watchtower-castle-cell watchtower-castle-cell--${escapeHtml(modifier)} attack-score-card-button${active ? " is-active" : ""}" data-attack-score-castle="${escapeHtml(castle.key || "")}" aria-pressed="${active ? "true" : "false"}" title="Show attack score breakdown for ${escapeHtml(castle.castleName)}">
      <img src="${escapeHtml(castle.castleIconUrl)}" alt="">
      <span class="watchtower-castle-cell__copy">
        <strong>${escapeHtml(castle.castleName)}</strong>
        <span>${escapeHtml(getKingdomName(castle.kingdomId))} - ${escapeHtml(getCastleTypeName(castle.castleType))}</span>
        <small>${escapeHtml(castle.verdict)}</small>
      </span>
      <b>${escapeHtml(scoreLabel)}</b>
    </button>
  `;
}

function renderDistanceCastleCard(castle, selectedOrigin, rowStatus = null, row = null) {
  const origin = getDistanceOriginForTarget(castle, selectedOrigin);
  const distance = getCastleDistance(origin, castle);
  const modifier = getDistanceModifier(origin, castle, distance);
  const distanceLabel = Number.isFinite(distance) ? formatDistance(distance) : "-";
  const detailLabel = getDistanceDetailLabel(origin, castle, distance, selectedOrigin);
  const shouldGlow = shouldGlowDistanceCastle(distance, rowStatus);
  const highlightClass = shouldGlow ? " watchtower-castle-cell--distance-highlight" : "";
  const iconUrl = getDisplayCastleIconUrl(row, castle);
  return `
    <span class="watchtower-castle-cell watchtower-castle-cell--${escapeHtml(modifier)}${highlightClass}" data-distance-castle-card>
      <img src="${escapeHtml(iconUrl)}" alt="">
      <span class="watchtower-castle-cell__copy">
        <strong>${escapeHtml(castle.castleName)}</strong>
        <span>${escapeHtml(getKingdomName(castle.kingdomId))} - ${escapeHtml(getCastleTypeName(castle.castleType))} - ${escapeHtml(formatCoordinates(castle))}</span>
        <small>${escapeHtml(detailLabel)}</small>
      </span>
      <b>${escapeHtml(distanceLabel)}</b>
    </span>
  `;
}

function renderAllCastleCard(row, castle, selectedBuilding, selectedOrigin) {
  const attackTarget = getAllAttackTargetForCastle(row, castle);
  const buildingRow = getAllBuildingRowForCastle(row, castle, selectedBuilding);
  const origin = getDistanceOriginForTarget(castle, selectedOrigin);
  const distance = getCastleDistance(origin, castle);
  const distanceLabel = Number.isFinite(distance) ? formatDistance(distance) : "-";
  const rowStatus = getDistanceRowStatus(row);
  const rowMeta = getDistanceRowFilterMeta(row);
  const highlightClass = shouldGlowDistanceCastle(distance, rowStatus) ? " watchtower-castle-cell--distance-highlight" : "";
  const active = attackTarget && state.activeAttackScoreCastleKey === attackTarget.key;
  const tagName = attackTarget ? "button" : "span";
  const scoreText = getAllAttackScoreText(row, attackTarget);
  const buildingText = getAllBuildingLevelText(row, buildingRow, selectedBuilding);
  const attackScore = attackTarget && !attackTarget.error && Number.isFinite(Number(attackTarget.score))
    ? Math.round(Number(attackTarget.score))
    : null;
  const buildingLevel = Number(buildingRow?.maxLevel || 0) > 0 ? Number(buildingRow.maxLevel) : null;
  const displayDistance = getComparableDisplayedDistance(distance);
  const iconUrl = getDisplayCastleIconUrl(row, castle, attackTarget);
  const actionClass = attackTarget ? " all-castle-card--clickable" : "";
  const attackMetricClass = attackTarget && !attackTarget.error
    ? `all-card-metric--attack-${escapeHtml(attackTarget.verdictClass || "unknown")}`
    : "all-card-metric--missing";
  const buildingMetricClass = buildingRow?.maxLevel > 0 ? "all-card-metric--building-found" : "all-card-metric--missing";
  const distanceMetricClass = Number.isFinite(distance) ? "all-card-metric--distance" : "all-card-metric--missing";
  const buttonAttrs = attackTarget
    ? ` type="button" data-attack-score-castle="${escapeHtml(attackTarget.key || "")}" aria-pressed="${active ? "true" : "false"}" title="Show attack score breakdown for ${escapeHtml(attackTarget.castleName || castle.castleName)}"`
    : "";
  const filterAttrs = [
    `data-all-card`,
    `data-distance="${Number.isFinite(displayDistance) ? escapeHtml(displayDistance) : ""}"`,
    `data-attack-score="${Number.isFinite(attackScore) ? escapeHtml(attackScore) : ""}"`,
    `data-building-level="${Number.isFinite(buildingLevel) ? escapeHtml(buildingLevel) : ""}"`,
    `data-might="${Number.isFinite(rowMeta.playerMightMillions) ? escapeHtml(rowMeta.playerMightMillions) : ""}"`,
    `data-loot-days="${Number.isFinite(rowMeta.lootAgeDays) ? escapeHtml(rowMeta.lootAgeDays) : ""}"`,
    `data-not-cheating="${rowMeta.matchesNotCheating ? "true" : "false"}"`,
    `data-not-birded="${rowMeta.matchesNotBirded ? "true" : "false"}"`,
    `data-scanned="${row.watchtowerRow ? "true" : "false"}"`,
  ].join(" ");
  return `
    <${tagName}${buttonAttrs} ${filterAttrs} class="watchtower-castle-cell all-castle-card${actionClass}${active ? " is-active" : ""}${highlightClass}">
      <img src="${escapeHtml(iconUrl)}" alt="">
      <span class="watchtower-castle-cell__copy all-castle-card__copy">
        <strong>${escapeHtml(castle.castleName || attackTarget?.castleName || "Castle")}</strong>
        <span>${escapeHtml(getKingdomName(castle.kingdomId))}</span>
        <span class="all-card-metrics" aria-label="Master castle metrics">
          ${renderAllCardMetric("attack", scoreText.value, attackMetricClass, "Attack score")}
          ${renderAllCardMetric("building", buildingText, buildingMetricClass, selectedBuilding?.displayName || "Building level")}
          ${renderAllCardMetric("distance", distanceLabel, distanceMetricClass, "Distance")}
        </span>
      </span>
    </${tagName}>
  `;
}

function renderAllCardMetric(type, value, className, title) {
  const safeType = String(type || "metric").replace(/[^a-z0-9_-]/gi, "").toLowerCase() || "metric";
  return `
    <b class="all-card-metric all-card-metric--${escapeHtml(safeType)} ${className}" title="${escapeHtml(title)}">
      <span class="all-card-metric__icon all-card-metric__icon--${escapeHtml(safeType)}" aria-hidden="true"></span>
      <span>${escapeHtml(value)}</span>
    </b>
  `;
}

function getAllAttackScoreText(row, attackTarget) {
  if (!attackTarget) return row.watchtowerRow ? { value: "-", detail: "not scored" } : { value: "-", detail: "not scanned" };
  if (attackTarget.error) return { value: "Failed", detail: "failed" };
  return {
    value: String(Math.round(Number(attackTarget.score || 0))),
    detail: attackTarget.verdict || "scored",
  };
}

function getAllBuildingLevelText(row, buildingRow, selectedBuilding) {
  if (!selectedBuilding) return "-";
  if (!row.watchtowerRow) return "-";
  if (!buildingRow) return "None";
  return buildingRow.maxLevel > 0 ? `L${buildingRow.maxLevel}` : "None";
}

function getAllAttackTargetForCastle(row, castle) {
  return findMatchingCastle(row?.watchtowerRow?.targetCastles, castle);
}

function getAllBuildingRowForCastle(row, castle, selectedBuilding) {
  if (!row?.watchtowerRow || !selectedBuilding) return null;
  const sourceCastle = findMatchingCastle(row.watchtowerRow.castles, castle) || castle;
  return getBuildingLevelRowForCastle(row.watchtowerRow, sourceCastle, selectedBuilding.key);
}

function getDisplayCastleIconUrl(row, castle, fallbackCastle = null) {
  const scannedCastle = getScannedCastleForDisplay(row, castle);
  return scannedCastle?.castleIconUrl
    || fallbackCastle?.castleIconUrl
    || castle?.castleIconUrl
    || "assets/attack-target.svg";
}

function getScannedCastleForDisplay(row, castle) {
  const watchtowerRow = row?.watchtowerRow || getWatchtowerRowForPlayer(row);
  return findMatchingCastle(watchtowerRow?.castles, castle)
    || findMatchingCastle(watchtowerRow?.targetCastles, castle)
    || null;
}

function getWatchtowerRowForPlayer(row) {
  if (!row) return null;
  const rowKey = String(row.playerKey || "").trim();
  if (rowKey && state.watchtowerResults.has(rowKey)) return state.watchtowerResults.get(rowKey);
  const rowName = String(row.playerName || row.name || "").trim().toLowerCase();
  if (!rowName) return null;
  return [...state.watchtowerResults.values()].find((result) => {
    return String(result?.playerName || result?.name || "").trim().toLowerCase() === rowName;
  }) || null;
}

function findMatchingCastle(castles, targetCastle) {
  if (!targetCastle || !Array.isArray(castles)) return null;
  return castles.find((castle) => castlesMatch(castle, targetCastle)) || null;
}

function castlesMatch(a, b) {
  if (!a || !b) return false;
  const aId = String(a.castleId || a.id || "").trim();
  const bId = String(b.castleId || b.id || "").trim();
  if (aId && bId && aId === bId) return true;
  const aKey = String(a.key || "").trim();
  const bKey = String(b.key || "").trim();
  if (aKey && bKey && aKey === bKey) return true;
  const ax = parseCoordinate(a.positionX);
  const ay = parseCoordinate(a.positionY);
  const bx = parseCoordinate(b.positionX);
  const by = parseCoordinate(b.positionY);
  if (Number.isFinite(ax) && Number.isFinite(ay) && Number.isFinite(bx) && Number.isFinite(by)) {
    return Number(a.kingdomId || 0) === Number(b.kingdomId || 0)
      && Number(a.castleType || 0) === Number(b.castleType || 0)
      && ax === bx
      && ay === by;
  }
  return Number(a.kingdomId || 0) === Number(b.kingdomId || 0)
    && Number(a.castleType || 0) === Number(b.castleType || 0)
    && String(a.castleName || "").trim().toLowerCase() === String(b.castleName || "").trim().toLowerCase();
}

function getDistanceOriginForTarget(targetCastle, selectedOrigin) {
  if (!targetCastle || !selectedOrigin) return selectedOrigin || null;
  if (state.distanceOriginMode !== "castle") return selectedOrigin;

  const targetKingdom = Number(targetCastle.kingdomId || 0);
  const selectedKingdom = Number(selectedOrigin.kingdomId || 0);
  if (targetKingdom === 0) {
    return selectedKingdom === 0 ? selectedOrigin : getHomeRegionalCastleForKingdom(0);
  }

  return getHomeRegionalCastleForKingdom(targetKingdom);
}

function getHomeRegionalCastleForKingdom(kingdomId) {
  const normalizedKingdom = Number(kingdomId || 0);
  const requiredType = normalizedKingdom === 0 ? 1 : 12;
  return state.homeCastles.find((castle) => {
    return Number(castle.kingdomId || 0) === normalizedKingdom
      && Number(castle.castleType || 0) === requiredType
      && hasCastlePosition(castle);
  }) || null;
}

function shouldGlowDistanceCastle(distance, rowStatus = null) {
  const threshold = getEffectiveDistanceHighlightThreshold();
  const hasDistanceFilter = Number.isFinite(threshold);
  const distanceMatches = !hasDistanceFilter || isDistanceWithinHighlightThreshold(distance);
  const statusMatches = !rowStatus?.hasStatusFilter || rowStatus.matchesStatusFilters;
  return (hasDistanceFilter || Boolean(rowStatus?.hasStatusFilter)) && distanceMatches && statusMatches;
}

function isDistanceWithinHighlightThreshold(distance) {
  const threshold = getEffectiveDistanceHighlightThreshold();
  const visibleDistance = getComparableDisplayedDistance(distance);
  return isValueAtMost(visibleDistance, threshold);
}

function getEffectiveDistanceHighlightThreshold() {
  return state.distanceHighlightThreshold;
}

function getEffectiveDistanceMightMillions() {
  return state.distanceHighlightMightMillions;
}

function getEffectiveDistanceLootDays() {
  return state.distanceHighlightLootDays;
}

function getComparableDisplayedDistance(distance) {
  if (!Number.isFinite(distance)) return null;
  return distance < 100 ? Number(distance.toFixed(1)) : Math.round(distance);
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
    const effect = getConstructionItemEffectDefinition(item);
    const label = formatConstructionComment(effect.name || effect.typeName || `Effect ${effect.id}`);
    return Number.isFinite(effect.value) ? `${label} +${formatNumber(effect.value)}` : label;
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

function hasCastlePosition(castle) {
  return Number.isFinite(parseCoordinate(castle?.positionX)) && Number.isFinite(parseCoordinate(castle?.positionY));
}

function getCastleDistance(homeCastle, targetCastle) {
  if (!homeCastle || !targetCastle) return null;
  if (Number(homeCastle.kingdomId) !== Number(targetCastle.kingdomId)) return null;
  if (!hasCastlePosition(homeCastle) || !hasCastlePosition(targetCastle)) return null;
  const deltaX = Number(targetCastle.positionX) - Number(homeCastle.positionX);
  const deltaY = Number(targetCastle.positionY) - Number(homeCastle.positionY);
  return Math.hypot(deltaX, deltaY);
}

function getDistanceModifier(homeCastle, targetCastle, distance) {
  if (!homeCastle) return "missing";
  if (Number(homeCastle.kingdomId) !== Number(targetCastle?.kingdomId)) return "missing";
  if (!Number.isFinite(distance)) return "error";
  if (distance <= 50) return "distance-near";
  if (distance <= 200) return "distance-mid";
  return "distance-far";
}

function getDistanceDetailLabel(homeCastle, targetCastle, distance, selectedOrigin = homeCastle) {
  if (!selectedOrigin) return state.distanceOriginMode === "coordinates" ? "Enter origin coordinates" : "Select your castle first";
  if (!homeCastle) {
    const kingdomName = getKingdomName(targetCastle?.kingdomId);
    return Number(targetCastle?.kingdomId || 0) === 0
      ? "No Green main castle loaded"
      : `No ${kingdomName} main castle loaded`;
  }
  if (Number(homeCastle.kingdomId) !== Number(targetCastle?.kingdomId)) {
    return state.distanceOriginMode === "coordinates"
      ? `Switch region to ${getKingdomName(targetCastle?.kingdomId)}`
      : `Choose a ${getKingdomName(targetCastle?.kingdomId)} castle to compare`;
  }
  if (!Number.isFinite(distance)) return "No coordinates available";
  const usesRegionalOrigin = selectedOrigin
    && String(homeCastle.key || homeCastle.castleId || "") !== String(selectedOrigin.key || selectedOrigin.castleId || "");
  const originLabel = usesRegionalOrigin
    ? `${homeCastle.castleName} (${getKingdomName(homeCastle.kingdomId)})`
    : homeCastle.castleName;
  return `${formatCoordinates(targetCastle)} from ${originLabel}`;
}

function formatDistance(distance) {
  if (!Number.isFinite(distance)) return "-";
  return distance < 100 ? distance.toFixed(1) : formatNumber(Math.round(distance));
}

function formatCoordinate(value) {
  const number = parseCoordinate(value);
  return Number.isFinite(number) ? formatNumber(Math.round(number)) : "-";
}

function formatCoordinates(castle) {
  return `${formatCoordinate(castle?.positionX)}, ${formatCoordinate(castle?.positionY)}`;
}

function parseCoordinate(value) {
  if (value === null || value === undefined || value === "") return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function parseDistanceHighlightThreshold(value) {
  if (value === null || value === undefined || value === "") return null;
  const number = Math.trunc(Number(value));
  return Number.isFinite(number) && number >= 0 ? number : null;
}

function parseDistanceHighlightNumber(value) {
  if (value === null || value === undefined || value === "") return null;
  const number = Number(value);
  return Number.isFinite(number) && number >= 0 ? number : null;
}

function parseAllFilterNumber(value) {
  if (value === null || value === undefined || value === "") return null;
  const number = Math.trunc(Number(value));
  return Number.isFinite(number) && number > 0 ? number : null;
}

function formatRoundedRuleNumber(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return "-";
  const rounded = Math.round(number * 10) / 10;
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
}

function formatDistanceRuleValue(value) {
  if (Number(value) === Number.POSITIVE_INFINITY) return "Infinite";
  return Number.isFinite(Number(value)) && Number(value) >= 0 ? formatNumber(Math.round(Number(value))) : "Off";
}

function formatAttackScoreRuleValue(value) {
  return Number.isFinite(Number(value)) && Number(value) >= 0 ? `${Math.trunc(Number(value))}/100` : "Off";
}

function formatBuildingLevelRuleValue(value) {
  return Number.isFinite(Number(value)) && Number(value) > 0 ? `L${Math.trunc(Number(value))}` : "None";
}

function formatMightRuleValue(value) {
  if (Number(value) === Number.POSITIVE_INFINITY) return "Infinite";
  return Number.isFinite(Number(value)) && Number(value) >= 0 ? `${formatRoundedRuleNumber(value)}M` : "Off";
}

function formatLootAgeRuleValue(value) {
  const days = Number(value);
  if (days === Number.POSITIVE_INFINITY) return "Infinite";
  if (!Number.isFinite(days) || days < 0) return "Off";
  if (days === 0) return "0h";
  if (days < 1) {
    const hours = Math.max(1, Math.round(days * 24));
    return `${hours}h`;
  }
  return `${formatRoundedRuleNumber(days)}d`;
}

function formatDistanceInputValue(value) {
  return Number(value) === Number.POSITIVE_INFINITY ? "Infinite" : formatNumber(Math.max(0, Math.round(Number(value || 0))));
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
    case 4:
      return "Storm Islands";
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

function formatScoreContribution(value) {
  const number = Math.max(0, Number(value || 0));
  if (number <= 0) return "+0 pts";
  const rounded = number >= 10 ? Math.round(number) : Math.round(number * 10) / 10;
  const label = rounded === 1 ? "pt" : "pts";
  return `+${Number.isInteger(rounded) ? rounded : rounded.toFixed(1)} ${label}`;
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
      renderDistanceChart();
      renderAllChart();
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

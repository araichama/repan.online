const canvas = document.querySelector("#game");
const ctx = canvas.getContext("2d");

// UI references
const scareButton = document.querySelector("#scareButton");
const skillButton = document.querySelector("#skillButton");
const gachaButton = document.querySelector("#gachaButton");
const skinButton = document.querySelector("#skinButton");
const adButton = document.querySelector("#adButton");
const shopButton = document.querySelector("#shopButton");
const settingsButton = document.querySelector("#settingsButton");
const soundToggleButton = document.querySelector("#soundToggleButton");
const volumeSlider = document.querySelector("#volumeSlider");
const developerControls = document.querySelector("#developerControls");
const developerModeButton = document.querySelector("#developerModeButton");
const skillModal = document.querySelector("#skillModal");
const gachaModal = document.querySelector("#gachaModal");
const skinModal = document.querySelector("#skinModal");
const settingsModal = document.querySelector("#settingsModal");
const skillList = document.querySelector("#skillList");
const learnedSkillsEl = document.querySelector("#learnedSkills");
const modalSkillPointsEl = document.querySelector("#modalSkillPoints");
const gachaSkillPointsEl = document.querySelector("#gachaSkillPoints");
const evolutionTicketsEl = document.querySelector("#evolutionTickets");
const gachaResultEl = document.querySelector("#gachaResult");
const rollGachaButton = document.querySelector("#rollGachaButton");
const skipGachaButton = document.querySelector("#skipGachaButton");
const skinListEl = document.querySelector("#skinList");
const upgradeListEl = document.querySelector("#upgradeList");
const levelRewardButton = document.querySelector("#levelRewardButton");
const levelRewardModal = document.querySelector("#levelRewardModal");
const levelRewardListEl = document.querySelector("#levelRewardList");
const clearModal = document.querySelector("#clearModal");
const clearSkinChoice = document.querySelector("#clearSkinChoice");
const clearSkillChoice = document.querySelector("#clearSkillChoice");
const clearRollArea = document.querySelector("#clearRollArea");
const clearRollButton = document.querySelector("#clearRollButton");
const levelEl = document.querySelector("#level");
const experienceEl = document.querySelector("#experience");
const skillPointsEl = document.querySelector("#skillPoints");
const lepanPtEl = document.querySelector("#lepanPt");
const moveSpeedEl = document.querySelector("#moveSpeed");
const scareCountEl = document.querySelector("#scareCount");
const humanCountEl = document.querySelector("#humanCount");
const bgmVolumeSlider = document.querySelector("#bgmVolumeSlider");
const seVolumeSlider = document.querySelector("#seVolumeSlider");
const bgmVolumeValue = document.querySelector("#bgmVolumeValue");
const seVolumeValue = document.querySelector("#seVolumeValue");
const toast = document.querySelector("#toast");

// Balance constants
const EXP_PER_SCARE = 20;
const SCARE_DAMAGE = 1;
const SKILL_DAMAGE = 2;
const SKILL_POINT_PER_KYUN = 1;
const SCARE_RANGE = 104;
const DETECTION_RANGE = 150;
const ALERT_MAX = 100;
const MIN_HUMAN_FLEE_SECONDS = 1.5;
const HUMAN_FLEE_SECONDS = 1.5;
const HUMAN_ALERT_GAIN_PER_SECOND = ALERT_MAX / Math.max(HUMAN_FLEE_SECONDS, MIN_HUMAN_FLEE_SECONDS);
const BASE_HUMAN_REVIVE_DELAY = 10000;
const MIN_HUMAN_REVIVE_DELAY = 3000;
const HUMAN_LOOK_INTERVAL_MIN = 900;
const HUMAN_LOOK_INTERVAL_MAX = 2600;
const AREA_WIDTH = 1920;
const AREA_HEIGHT = 1344;
const BASE_LEPAN_PT = 5;
const DEVELOPER_SKILL_POINTS = 999999;
const DEVELOPER_LEPAN_PT = 999;
const RELEASE_BUILD = false;
const SHOW_DEVELOPER_MODE = !RELEASE_BUILD;
const LEPAN_RECOVERY_INTERVAL = 180000;
const LEPAN_REWARD_PER_KYUN = 3;
const RESEARCHER_SPAWN_RATE = 0.2;
const HIGH_LEVEL_HUMAN_COUNT = 10;
const KYUN_MINION_DAMAGE = 0.5;
const KYUN_MINION_BASE_COST = 20;
const KYUN_MINION_COST_STEP = 5;
const KYUN_MINION_BASE_LIMIT = 10;
const KYUN_MINION_LIMIT_STEP = 5;
const KYUN_MINION_SEARCH_RANGE = 460;
const KYUN_MINION_PERSONAL_SPACE = 54;
const KYUN_MINION_WANDER_INTERVAL_MIN = 2000;
const KYUN_MINION_WANDER_INTERVAL_MAX = 4000;
const SCARE_PHRASES = [
  "がおおお～！",
  "ふしゃーっ！",
  "見たかこのしっぽ！",
];
const FIRST_GACHA_COST = 50;
const NORMAL_GACHA_COST = 200;
const SECRET_SKIN_RATE = 0.0000001;
const GACHA_ANIMATION_DURATION = 3600;
const SECRET_GACHA_DARK_DURATION = 3000;
const SECRET_GACHA_TOTAL_DURATION = 5200;
const CLEAR_LEVEL = 200;
const TOWN_BGM_LOOP_SECONDS = 30;
const SOUND_SETTINGS_KEY = "lepanOnlineSoundSettings";
const DEFAULT_SOUND_SETTINGS = { enabled: true, bgmVolume: 0.7, seVolume: 0.5 };
const HUMAN_MINIMAP_COLORS = {
  normal: "#d94332",
  researcher: "#8e44ad",
  boss: "#1f1f24",
  event: "#f0b429",
};
const SOUND_FILE_PATHS = {
  scare: "assets/sounds/scare.mp3",
  kyun: "assets/sounds/kyun.mp3",
  gachaStart: "assets/sounds/gacha-start.mp3",
  gachaC: "assets/sounds/gacha-c.mp3",
  gachaB: "assets/sounds/gacha-b.mp3",
  gachaA: "assets/sounds/gacha-a.mp3",
  secretStart: "assets/sounds/secret-start.mp3",
  secretFlood: "assets/sounds/secret-flood.mp3",
  levelUp: "assets/sounds/level-up.mp3",
  buttonScare: "assets/sounds/button-scare.mp3",
  menuOpen: "assets/sounds/menu-open.mp3",
  gachaOpen: "assets/sounds/gacha-open.mp3",
  skinOpen: "assets/sounds/skin-open.mp3",
  settingsOpen: "assets/sounds/settings-open.mp3",
  menuClose: "assets/sounds/menu-close.mp3",
  reward: "assets/sounds/reward.mp3",
};
const SKIN_IMAGE_PATHS = {
  classic: ["assets/skins/redpanda.png", "assets/redpanda.png", "assets/redpanda..png.PNG"],
};
const skinImageCache = new Map();
const savedSoundSettings = loadSoundSettings();

const soundState = {
  enabled: savedSoundSettings.enabled,
  audioGroups: {
    bgm: { name: "BGM", volume: savedSoundSettings.bgmVolume },
    se: { name: "SE", volume: savedSoundSettings.seVolume },
  },
  context: null,
  bgmGain: null,
  bgmTimer: 0,
  bgmStarted: false,
  buffers: new Map(),
  missingFiles: new Set(),
  loadingFiles: new Set(),
};

function loadSoundSettings() {
  try {
    const raw = window.localStorage.getItem(SOUND_SETTINGS_KEY);
    if (!raw) return { ...DEFAULT_SOUND_SETTINGS };
    const parsed = JSON.parse(raw);
    return {
      enabled: typeof parsed.enabled === "boolean" ? parsed.enabled : DEFAULT_SOUND_SETTINGS.enabled,
      bgmVolume: clamp(Number(parsed.bgmVolume ?? DEFAULT_SOUND_SETTINGS.bgmVolume), 0, 1),
      seVolume: clamp(Number(parsed.seVolume ?? DEFAULT_SOUND_SETTINGS.seVolume), 0, 1),
    };
  } catch (error) {
    return { ...DEFAULT_SOUND_SETTINGS };
  }
}

function saveSoundSettings() {
  try {
    window.localStorage.setItem(SOUND_SETTINGS_KEY, JSON.stringify({
      enabled: soundState.enabled,
      bgmVolume: soundGroupVolume("bgm"),
      seVolume: soundGroupVolume("se"),
    }));
  } catch (error) {
    // Settings are convenient, not required for the game to run.
  }
}

function soundGroupVolume(groupName) {
  return soundState.audioGroups[groupName]?.volume ?? 0;
}

function setSoundGroupVolume(groupName, value) {
  if (!soundState.audioGroups[groupName]) return;
  soundState.audioGroups[groupName].volume = clamp(value, 0, 1);
  saveSoundSettings();
  updateSoundUi();
}

const mapAreas = [
  { id: "residential", name: "住宅街", requiredLevel: 1, x: 0, y: 0, w: AREA_WIDTH, h: AREA_HEIGHT, color: "#93d486" },
  { id: "shopping", name: "商店街", requiredLevel: 20, x: AREA_WIDTH, y: 0, w: AREA_WIDTH, h: AREA_HEIGHT, color: "#9fd0d7", unlockMessage: "商店街が解放されました！" },
  { id: "parkland", name: "公園エリア", requiredLevel: 40, x: 0, y: AREA_HEIGHT, w: AREA_WIDTH, h: AREA_HEIGHT, color: "#86cf77", unlockMessage: "公園エリアが解放されました！" },
  { id: "zooFront", name: "動物園前", requiredLevel: 60, x: AREA_WIDTH, y: AREA_HEIGHT, w: AREA_WIDTH, h: AREA_HEIGHT, color: "#d0c48c", unlockMessage: "動物園前が解放されました！" },
];

// Gacha and skin data
const skinCatalog = [
  { id: "classic", name: "クラシック", body: "#b9432f", belly: "#f7dfb2", tail: "#f4d27a", accent: "#202024", pattern: "stripe" },
  { id: "sakura", name: "さくらもち", body: "#d96f82", belly: "#fff2d8", tail: "#8fca72", accent: "#783342", pattern: "stripe" },
  { id: "midnight", name: "まよなか", body: "#34324a", belly: "#d9ddff", tail: "#f8d25c", accent: "#15151f", pattern: "moon" },
  { id: "matcha", name: "抹茶ラテ", body: "#6f9f55", belly: "#f3e8c0", tail: "#b8d27f", accent: "#31472e", pattern: "stripe" },
  { id: "snow", name: "雪見", body: "#e8edf2", belly: "#ffffff", tail: "#8ac2bd", accent: "#43515c", pattern: "dot" },
  { id: "gold", name: "金運", body: "#d8a536", belly: "#fff1b8", tail: "#b9432f", accent: "#5a3a12", pattern: "stripe" },
  { id: "soda", name: "ソーダ", body: "#54a9c8", belly: "#e6fbff", tail: "#f8d25c", accent: "#1f5063", pattern: "dot" },
  { id: "plum", name: "梅しそ", body: "#9b4267", belly: "#ffd9e4", tail: "#77a85b", accent: "#402032", pattern: "stripe" },
  { id: "charcoal", name: "炭火", body: "#4a403a", belly: "#d8d0c8", tail: "#e58f72", accent: "#1d1917", pattern: "ember" },
  { id: "lemon", name: "レモン", body: "#e0c13a", belly: "#fff6b7", tail: "#6fbf7b", accent: "#6b5b11", pattern: "dot" },
  { id: "peach", name: "白桃", body: "#e89a92", belly: "#ffe4d8", tail: "#b9432f", accent: "#6f3938", pattern: "stripe" },
  { id: "violet", name: "すみれ", body: "#6e5aa8", belly: "#e8ddff", tail: "#f8d25c", accent: "#352d58", pattern: "moon" },
  { id: "mint", name: "ミント", body: "#61bfa8", belly: "#e8fff7", tail: "#3e7f72", accent: "#245548", pattern: "stripe" },
  { id: "tomato", name: "トマト", body: "#d94332", belly: "#ffe8d2", tail: "#2f8f70", accent: "#76231c", pattern: "dot" },
  { id: "rain", name: "雨あがり", body: "#6d89ad", belly: "#eaf2ff", tail: "#8ac2bd", accent: "#2d4059", pattern: "drop" },
  { id: "pumpkin", name: "かぼちゃ", body: "#d57b29", belly: "#fff0cf", tail: "#3f8f57", accent: "#6f3814", pattern: "stripe" },
  { id: "berry", name: "ベリー", body: "#b83b7d", belly: "#ffd7ef", tail: "#4f7cc8", accent: "#532442", pattern: "dot" },
  { id: "ash", name: "灰かぶり", body: "#86827c", belly: "#eee9e2", tail: "#c9b58f", accent: "#3f3d3a", pattern: "ember" },
  { id: "sky", name: "青空", body: "#79b7e8", belly: "#f0fbff", tail: "#ffffff", accent: "#2f668f", pattern: "drop" },
  { id: "royal", name: "王者", body: "#7b3bb7", belly: "#ffe7a8", tail: "#d8a536", accent: "#2b1644", pattern: "crown" },
];
const secretSkin = {
  id: "god",
  name: "レパン最強神王ゴッド",
  body: "#fff3a1",
  belly: "#ffffff",
  tail: "#ff4fc3",
  accent: "#7d2cff",
  pattern: "god",
};
const levelRewardSkin = { id: "level_reward_cape", name: "十段しっぽマント", body: "#c94747", belly: "#fff4d5", tail: "#51307d", accent: "#202024", pattern: "crown" };
const clearSkinCatalog = [
  { id: "clear_aurora", name: "全クリオーロラ", body: "#7fe5d8", belly: "#ffffff", tail: "#d68cff", accent: "#30506f", pattern: "moon" },
  { id: "clear_star", name: "全クリ流星", body: "#29365f", belly: "#fff3a1", tail: "#ffffff", accent: "#f8d25c", pattern: "god" },
  { id: "clear_gold", name: "全クリ黄金しっぽ", body: "#d8a536", belly: "#fff9d6", tail: "#ff4fc3", accent: "#7b4a2d", pattern: "crown" },
];
const allSkins = [...skinCatalog, secretSkin, levelRewardSkin, ...clearSkinCatalog];

// Skill data
const skillCatalog = [
  {
    id: "scary",
    name: "こわいだろ～！",
    description: "レッサーパンダが全力で威嚇する技。",
    cost: 1,
    range: 120,
    exp: 25,
    phrase: "こわいだろ～！",
    damage: SKILL_DAMAGE,
  },
  {
    id: "hug",
    name: "人に抱き着きもふもふさせる",
    description: "高確率できゅん状態にする。",
    cost: 1,
    range: 92,
    exp: 30,
    phrase: "もふもふの刑です",
    damage: SKILL_DAMAGE,
  },
  {
    id: "cute",
    name: "かわいいだろ～！",
    description: "愛らしいポーズで相手を魅了する。",
    cost: 1,
    range: 142,
    exp: 25,
    phrase: "かわいいだろ～！",
    damage: SKILL_DAMAGE,
  },
  {
    id: "swift",
    name: "すばしっこいレパン",
    description: "購入すると移動速度が上がるパッシブスキル。",
    cost: 2,
    passive: true,
  },
];

const world = {
  width: AREA_WIDTH * 2,
  height: AREA_HEIGHT * 2,
  viewportWidth: canvas.width,
  viewportHeight: canvas.height,
  keys: new Set(),
  lastTime: 0,
  scarePulseUntil: 0,
  messageTimer: 0,
  lockedAreaMessageAt: 0,
  scareCount: 0,
  level: 1,
  experience: 0,
  skillPoints: 0,
  lepanPt: BASE_LEPAN_PT,
  lastLepanRecoveryAt: performance.now(),
  learnedSkills: [],
  equippedSkills: [],
  skillLevels: {},
  reviveCooldownReduction: 0,
  allies: [],
  allyLastAttackAt: [],
  kyunMinions: [],
  kyunMinionLevel: 0,
  lepanPtMaxBonus: 0,
  claimedLevelRewards: [],
  unlockedAreaMessages: [],
  allClearShown: false,
  clearRewardType: null,
  clearRollsRemaining: 0,
  developerMode: false,
  inputLocked: false,
  gachaAnimation: null,
  hasRolledGacha: false,
  ownedSkins: ["classic"],
  activeSkin: "classic",
  evolutionTickets: 0,
  effects: [],
  damagePopups: [],
  lepanPopups: [],
  skillPhraseUntil: 0,
  skillPhrase: "がおおお～！",
};

// Camera and actor state
const camera = {
  x: 0,
  y: 0,
};

const player = {
  x: 960,
  y: 672,
  radius: 25,
  baseSpeed: 190,
  facingX: 1,
  facingY: 0,
  bob: 0,
};

const humans = [
  { x: 760, y: 560, state: "idle", role: "normal", name: "にんげん", label: "会社員", direction: "right", alert: 0, nextLookAt: 0, hp: 2, maxHp: 2, wobble: 0, faintedAt: 0 },
  { x: 1180, y: 520, state: "idle", role: "normal", name: "にんげん", label: "散歩人", direction: "left", alert: 0, nextLookAt: 0, hp: 3, maxHp: 3, wobble: 1.6, faintedAt: 0 },
  { x: 1420, y: 900, state: "idle", role: "normal", name: "にんげん", label: "観光客", direction: "down", alert: 0, nextLookAt: 0, hp: 4, maxHp: 4, wobble: 3.1, faintedAt: 0 },
  { x: 540, y: 970, state: "idle", role: "normal", name: "にんげん", label: "店員", direction: "up", alert: 0, nextLookAt: 0, hp: 3, maxHp: 3, wobble: 4.2, faintedAt: 0 },
  { x: 1540, y: 260, state: "idle", role: "normal", name: "にんげん", label: "犬の散歩", direction: "left", alert: 0, nextLookAt: 0, hp: 3, maxHp: 3, wobble: 2.4, faintedAt: 0 },
  { x: 340, y: 300, state: "idle", role: "normal", name: "にんげん", label: "買い物客", direction: "right", alert: 0, nextLookAt: 0, hp: 4, maxHp: 4, wobble: 5.1, faintedAt: 0 },
];

// Map data
const obstacles = [
  { x: 88, y: 88, w: 220, h: 126, type: "building", kind: "shop", name: "もふ屋", color: "#f2c15f", roof: "#d95745", trim: "#7b4a2d" },
  { x: 520, y: 78, w: 206, h: 126, type: "building", kind: "house", name: "民家", color: "#8ac2bd", roof: "#4f7cc8", trim: "#2c5b64" },
  { x: 1120, y: 74, w: 232, h: 138, type: "building", kind: "shop", name: "キュン堂", color: "#e58f72", roof: "#a34455", trim: "#744033" },
  { x: 1540, y: 96, w: 240, h: 124, type: "building", kind: "apartment", name: "レパン荘", color: "#a9c96d", roof: "#6e8f3a", trim: "#4d6430" },
  { x: 176, y: 734, w: 216, h: 132, type: "building", kind: "house", name: "民家", color: "#d7a7d9", roof: "#8056a8", trim: "#65406a" },
  { x: 698, y: 1040, w: 238, h: 148, type: "building", kind: "shop", name: "しっぽ亭", color: "#f0a36e", roof: "#c85f3e", trim: "#835030" },
  { x: 1256, y: 1110, w: 232, h: 134, type: "building", kind: "apartment", name: "青空AP", color: "#9db7e5", roof: "#51689e", trim: "#3a4d7c" },
  { x: 1584, y: 690, w: 208, h: 144, type: "building", kind: "shop", name: "草だんご", color: "#efcf72", roof: "#6e9d62", trim: "#6a5523" },
  { x: 820, y: 294, w: 280, h: 190, type: "park", name: "キュン公園", color: "#68b96d" },
  { x: 300, y: 1080, w: 180, h: 122, type: "park", name: "しっぽ広場", color: "#68b96d" },
  { x: 2050, y: 90, w: 260, h: 144, type: "building", kind: "shop", name: "りんご市場", color: "#f0a36e", roof: "#c85f3e", trim: "#835030" },
  { x: 2480, y: 88, w: 236, h: 134, type: "building", kind: "shop", name: "もふ商店", color: "#efcf72", roof: "#6e9d62", trim: "#6a5523" },
  { x: 3040, y: 100, w: 252, h: 150, type: "building", kind: "apartment", name: "駅前AP", color: "#9db7e5", roof: "#51689e", trim: "#3a4d7c" },
  { x: 3320, y: 760, w: 260, h: 140, type: "building", kind: "shop", name: "キュン百貨", color: "#e58f72", roof: "#a34455", trim: "#744033" },
  { x: 2220, y: 840, w: 220, h: 132, type: "building", kind: "shop", name: "笹パン", color: "#b7dca0", roof: "#6e8f3a", trim: "#4d6430" },
  { x: 240, y: 1530, w: 520, h: 360, type: "park", name: "花の広場", color: "#68b96d" },
  { x: 1120, y: 1600, w: 560, h: 390, type: "park", name: "大きな公園", color: "#76c66d" },
  { x: 520, y: 2280, w: 240, h: 136, type: "building", kind: "house", name: "管理小屋", color: "#d9c692", roof: "#8b5f9d", trim: "#6a5523" },
  { x: 2150, y: 1530, w: 320, h: 160, type: "building", kind: "shop", name: "動物園みやげ", color: "#f2c15f", roof: "#d95745", trim: "#7b4a2d" },
  { x: 2680, y: 1560, w: 360, h: 180, type: "building", kind: "apartment", name: "飼育員棟", color: "#a9c96d", roof: "#6e8f3a", trim: "#4d6430" },
  { x: 3220, y: 2120, w: 360, h: 260, type: "park", name: "動物園前広場", color: "#d7c777" },
];

function showMessage(text) {
  toast.textContent = text;
  toast.classList.remove("pop");
  window.requestAnimationFrame(() => toast.classList.add("pop"));
  window.clearTimeout(world.messageTimer);
  world.messageTimer = window.setTimeout(() => toast.classList.remove("pop"), 260);
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function randomBetween(min, max) {
  return min + Math.random() * (max - min);
}

function distance(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function isAreaUnlocked(area) {
  return world.level >= area.requiredLevel;
}

function areaAtPoint(point) {
  return mapAreas.find((area) => (
    point.x >= area.x &&
    point.x <= area.x + area.w &&
    point.y >= area.y &&
    point.y <= area.y + area.h
  ));
}

function unlockedAreas() {
  return mapAreas.filter(isAreaUnlocked);
}

function clampPointToUnlockedAreas(point) {
  const unlocked = unlockedAreas();
  const currentArea = areaAtPoint(player) || unlocked[0];
  if (areaAtPoint(point) && isAreaUnlocked(areaAtPoint(point))) return point;

  const now = performance.now();
  if (now - world.lockedAreaMessageAt > 900) {
    const target = areaAtPoint(point);
    const label = target ? `${target.name}はLv${target.requiredLevel}で解放` : "この先はまだ町の外";
    showMessage(`${label}です。フェンスが、じっとこちらを見ている。`);
    world.lockedAreaMessageAt = now;
  }

  return {
    x: clamp(point.x, currentArea.x + 28, currentArea.x + currentArea.w - 28),
    y: clamp(point.y, currentArea.y + 46, currentArea.y + currentArea.h - 28),
  };
}

function skinImagePaths(skin) {
  if (!skin) return [];
  if (skin.imagePaths) return skin.imagePaths;
  if (skin.imagePath) return [skin.imagePath];
  return SKIN_IMAGE_PATHS[skin.id] || [];
}

function getSkinImage(skin) {
  const paths = skinImagePaths(skin);
  if (paths.length === 0) return null;

  const cached = skinImageCache.get(skin.id);
  if (cached?.loaded) return cached.image;
  if (cached?.loading || cached?.failed) return null;

  const entry = { image: new Image(), index: 0, loading: true, loaded: false, failed: false };
  const tryLoad = () => {
    entry.image.src = paths[entry.index];
  };
  entry.image.onload = () => {
    entry.loading = false;
    entry.loaded = true;
  };
  entry.image.onerror = () => {
    entry.index += 1;
    if (entry.index < paths.length) {
      tryLoad();
      return;
    }
    entry.loading = false;
    entry.failed = true;
  };
  skinImageCache.set(skin.id, entry);
  tryLoad();
  return null;
}

// Web Audio placeholder SE. Drop files into assets/sounds with SOUND_FILE_PATHS names to replace synth sounds.
function ensureAudioContext() {
  if (!soundState.enabled) return null;
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return null;

  try {
    if (!soundState.context || soundState.context.state === "closed") {
      soundState.context = new AudioContextClass();
    }
    if (soundState.context.state === "suspended") {
      soundState.context.resume()
        .then(() => startTownBgm())
        .catch(() => {});
    } else {
      startTownBgm();
    }
    return soundState.context;
  } catch (error) {
    return null;
  }
}

function updateSoundUi() {
  if (!soundToggleButton) return;
  soundToggleButton.textContent = soundState.enabled ? "サウンドON" : "サウンドOFF";
  soundToggleButton.classList.toggle("is-off", !soundState.enabled);
  const bgmPercent = Math.round(soundGroupVolume("bgm") * 100);
  const sePercent = Math.round(soundGroupVolume("se") * 100);
  if (volumeSlider) volumeSlider.value = String(sePercent);
  if (bgmVolumeSlider) bgmVolumeSlider.value = String(bgmPercent);
  if (seVolumeSlider) seVolumeSlider.value = String(sePercent);
  if (bgmVolumeValue) bgmVolumeValue.textContent = `${bgmPercent}%`;
  if (seVolumeValue) seVolumeValue.textContent = `${sePercent}%`;
  updateTownBgmVolume();
}

function updateTownBgmVolume() {
  if (!soundState.bgmGain || !soundState.context) return;
  const value = soundState.enabled ? soundGroupVolume("bgm") * 0.55 : 0.0001;
  soundState.bgmGain.gain.setTargetAtTime(value, soundState.context.currentTime, 0.08);
}

function stopTownBgm() {
  window.clearTimeout(soundState.bgmTimer);
  soundState.bgmTimer = 0;
  soundState.bgmStarted = false;
  if (soundState.bgmGain) {
    try {
      soundState.bgmGain.disconnect();
    } catch (error) {
      // BGM is optional; failures should not affect gameplay.
    }
  }
  soundState.bgmGain = null;
}

function shutdownAudioSystem() {
  stopTownBgm();
  if (soundState.context && soundState.context.state !== "closed") {
    try {
      soundState.context.close().catch(() => {});
    } catch (error) {
      // Page shutdown should never throw into the browser.
    }
  }
  soundState.context = null;
}

function startTownBgm() {
  if (!soundState.enabled || soundState.bgmStarted) return;
  const context = soundState.context;
  if (!context || context.state === "suspended") return;

  try {
    soundState.bgmStarted = true;
    soundState.bgmGain = context.createGain();
    soundState.bgmGain.gain.value = soundGroupVolume("bgm") * 0.55;
    soundState.bgmGain.connect(context.destination);
    scheduleTownBgmLoop(context.currentTime + 0.08);
  } catch (error) {
    stopTownBgm();
  }
}

function scheduleTownBgmLoop(start) {
  const context = soundState.context;
  if (!context || !soundState.bgmGain || !soundState.enabled) return;

  scheduleTownBgmNotes(context, start);
  window.clearTimeout(soundState.bgmTimer);
  soundState.bgmTimer = window.setTimeout(() => {
    if (!soundState.enabled) return;
    scheduleTownBgmLoop(start + TOWN_BGM_LOOP_SECONDS);
  }, Math.max(1000, (start + TOWN_BGM_LOOP_SECONDS - context.currentTime - 1) * 1000));
}

function scheduleTownBgmNotes(context, start) {
  const beat = 0.5;
  const melody = [
    659, 784, 880, 784, 659, 587, 659, 523,
    587, 659, 784, 659, 523, 587, 659, 784,
    880, 988, 880, 784, 659, 784, 659, 587,
    523, 587, 659, 523, 494, 523, 587, 659,
    784, 880, 988, 880, 784, 659, 587, 659,
    698, 784, 880, 784, 698, 659, 587, 523,
    587, 659, 784, 880, 784, 659, 587, 523,
    659, 784, 880, 988, 880, 784,
  ];
  const chords = [
    [262, 330, 392],
    [196, 294, 392],
    [220, 330, 440],
    [175, 262, 349],
    [262, 330, 392],
    [196, 294, 392],
    [220, 330, 440],
    [175, 262, 349],
  ];

  melody.forEach((note, index) => {
    const noteStart = start + index * beat;
    playBgmTone(context, note, noteStart, 0.18, "triangle", index % 4 === 0 ? 0.08 : 0.055);
    if (index % 2 === 1) playBgmTone(context, note * 2, noteStart + 0.08, 0.08, "sine", 0.025);
  });

  chords.forEach((chord, index) => {
    const chordStart = start + index * 4 * beat;
    chord.forEach((note) => playBgmTone(context, note, chordStart, 1.65, "sine", 0.025));
    playBgmTone(context, chord[0] / 2, chordStart, 0.24, "triangle", 0.06);
    playBgmTone(context, chord[0] / 2, chordStart + beat * 2, 0.24, "triangle", 0.045);
  });

  for (let i = 0; i < TOWN_BGM_LOOP_SECONDS / beat; i += 1) {
    const hatStart = start + i * beat + 0.24;
    playBgmNoise(context, hatStart, 0.035, i % 4 === 3 ? 0.035 : 0.022);
  }
}

function playBgmTone(context, frequency, start, duration, type = "sine", volume = 0.04) {
  if (!soundState.bgmGain) return;
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, start);
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(Math.max(0.0002, volume), start + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  oscillator.connect(gain).connect(soundState.bgmGain);
  oscillator.start(start);
  oscillator.stop(start + duration + 0.03);
}

function playBgmNoise(context, start, duration, volume = 0.025) {
  if (!soundState.bgmGain) return;
  const sampleRate = context.sampleRate;
  const buffer = context.createBuffer(1, Math.max(1, Math.floor(sampleRate * duration)), sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i += 1) data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
  const source = context.createBufferSource();
  const filter = context.createBiquadFilter();
  const gain = context.createGain();
  filter.type = "highpass";
  filter.frequency.value = 2600;
  gain.gain.setValueAtTime(volume, start);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  source.buffer = buffer;
  source.connect(filter).connect(gain).connect(soundState.bgmGain);
  source.start(start);
  source.stop(start + duration + 0.02);
}

function loadSoundFile(name) {
  const path = SOUND_FILE_PATHS[name];
  const context = soundState.context;
  if (!path || !context || soundState.buffers.has(name) || soundState.missingFiles.has(name) || soundState.loadingFiles.has(name)) return;

  soundState.loadingFiles.add(name);
  fetch(path)
    .then((response) => {
      if (!response.ok) throw new Error("sound file not found");
      return response.arrayBuffer();
    })
    .then((arrayBuffer) => context.decodeAudioData(arrayBuffer))
    .then((buffer) => soundState.buffers.set(name, buffer))
    .catch(() => soundState.missingFiles.add(name))
    .finally(() => soundState.loadingFiles.delete(name));
}

function playSound(name) {
  const seVolume = soundGroupVolume("se");
  if (!soundState.enabled || seVolume <= 0) return;
  const context = ensureAudioContext();
  if (!context) return;

  try {
    const buffer = soundState.buffers.get(name);
    if (buffer) {
      const source = context.createBufferSource();
      const gain = context.createGain();
      source.buffer = buffer;
      gain.gain.value = seVolume;
      source.connect(gain).connect(context.destination);
      source.start();
      return;
    }

    loadSoundFile(name);
    playSynthSound(name, context);
  } catch (error) {
    // Sound must never block the game loop or rewards.
  }
}

function playTone(context, frequency, start, duration, type = "sine", volume = 0.18, endFrequency = frequency) {
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, start);
  oscillator.frequency.linearRampToValueAtTime(endFrequency, start + duration);
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(Math.max(0.0002, volume * soundGroupVolume("se")), start + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  oscillator.connect(gain).connect(context.destination);
  oscillator.start(start);
  oscillator.stop(start + duration + 0.03);
}

function playNoise(context, start, duration, volume = 0.12, highpass = 500) {
  const sampleRate = context.sampleRate;
  const buffer = context.createBuffer(1, Math.max(1, Math.floor(sampleRate * duration)), sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i += 1) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
  }

  const source = context.createBufferSource();
  const filter = context.createBiquadFilter();
  const gain = context.createGain();
  filter.type = "highpass";
  filter.frequency.value = highpass;
  gain.gain.setValueAtTime(Math.max(0.0001, volume * soundGroupVolume("se")), start);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  source.buffer = buffer;
  source.connect(filter).connect(gain).connect(context.destination);
  source.start(start);
  source.stop(start + duration + 0.02);
}

function playSynthSound(name, context) {
  const now = context.currentTime + 0.01;
  switch (name) {
    case "scare":
      playNoise(context, now, 0.08, 0.12, 650);
      playTone(context, 180, now, 0.12, "triangle", 0.16, 95);
      break;
    case "kyun":
      [880, 1175, 1568, 2093].forEach((note, index) => {
        playTone(context, note, now + index * 0.055, 0.18, "sine", 0.09);
      });
      break;
    case "gachaStart":
      for (let i = 0; i < 7; i += 1) {
        playNoise(context, now + i * 0.055, 0.045, 0.08, 320);
        playTone(context, 260 + i * 24, now + i * 0.055, 0.05, "square", 0.05);
      }
      break;
    case "gachaC":
      playTone(context, 180, now, 0.22, "sine", 0.12, 135);
      break;
    case "gachaB":
      playTone(context, 523, now, 0.13, "triangle", 0.12);
      playTone(context, 784, now + 0.12, 0.18, "triangle", 0.12);
      break;
    case "gachaA":
      [659, 880, 1175, 1760, 2349].forEach((note, index) => {
        playTone(context, note, now + index * 0.065, 0.23, "sine", 0.1);
      });
      playNoise(context, now + 0.1, 0.32, 0.045, 1800);
      break;
    case "secretStart":
      playTone(context, 78, now, 1.6, "sawtooth", 0.15, 42);
      playTone(context, 116, now + 0.15, 1.2, "triangle", 0.08, 58);
      break;
    case "secretFlood":
      [196, 247, 330, 494, 659, 988].forEach((note, index) => {
        playTone(context, note, now + index * 0.075, 0.5, index % 2 ? "triangle" : "sine", 0.11);
      });
      playNoise(context, now + 0.15, 0.55, 0.08, 1200);
      break;
    case "levelUp":
      [523, 659, 784, 1047].forEach((note, index) => {
        playTone(context, note, now + index * 0.09, 0.26, "triangle", 0.12);
      });
      playTone(context, 1568, now + 0.38, 0.42, "sine", 0.1);
      break;
    case "buttonScare":
      playNoise(context, now, 0.045, 0.06, 900);
      playTone(context, 420, now, 0.08, "triangle", 0.08, 240);
      break;
    case "menuOpen":
      playTone(context, 660, now, 0.08, "triangle", 0.08);
      playTone(context, 880, now + 0.07, 0.1, "triangle", 0.07);
      break;
    case "gachaOpen":
      playNoise(context, now, 0.09, 0.07, 450);
      playTone(context, 520, now, 0.12, "square", 0.045);
      break;
    case "skinOpen":
      playTone(context, 740, now, 0.08, "sine", 0.07);
      playTone(context, 1110, now + 0.06, 0.12, "sine", 0.055);
      break;
    case "settingsOpen":
      playTone(context, 494, now, 0.08, "triangle", 0.07);
      playTone(context, 659, now + 0.08, 0.12, "triangle", 0.065);
      break;
    case "menuClose":
      playTone(context, 520, now, 0.08, "triangle", 0.06, 330);
      break;
    case "reward":
      [784, 988, 1319].forEach((note, index) => {
        playTone(context, note, now + index * 0.07, 0.22, "sine", 0.09);
      });
      break;
  }
}

// Level and progression
function movementSpeedMultiplier() {
  let multiplier = 1.2;
  if (world.level >= 50) multiplier = 2.5;
  else if (world.level >= 30) multiplier = 2.25;
  else if (world.level >= 15) multiplier = 2;
  else if (world.level >= 5) multiplier = 1.5;

  if (hasSkill("swift")) {
    multiplier += 0.15 * skillLevel("swift");
  }
  return Number(multiplier.toFixed(2));
}

function maxLepanPt() {
  if (world.developerMode) return DEVELOPER_LEPAN_PT;
  return BASE_LEPAN_PT + (world.level - 1) * 5 + world.lepanPtMaxBonus;
}

function humanReviveDelay() {
  return Math.max(MIN_HUMAN_REVIVE_DELAY, BASE_HUMAN_REVIVE_DELAY - world.reviveCooldownReduction * 1000);
}

function skillLevel(skillId) {
  return world.skillLevels[skillId] || 1;
}

function skillDamage(skillId) {
  if (skillId === "swift") return 0;
  return SKILL_DAMAGE + skillLevel(skillId) - 1;
}

function directionVector(direction) {
  const vectors = {
    up: { x: 0, y: -1 },
    down: { x: 0, y: 1 },
    left: { x: -1, y: 0 },
    right: { x: 1, y: 0 },
  };
  return vectors[direction] || vectors.down;
}

function isPlayerInHumanFront(human) {
  const dx = player.x - human.x;
  const dy = player.y - human.y;
  const range = Math.hypot(dx, dy);
  if (range > DETECTION_RANGE || range === 0) return false;

  const facing = directionVector(human.direction);
  const dot = (dx / range) * facing.x + (dy / range) * facing.y;
  return dot > 0.68;
}

function canScareHuman(human, range = SCARE_RANGE) {
  if (human.state === "fainted") return false;
  if (distance(player, human) > range) return false;
  return human.state === "fleeing" || !isPlayerInHumanFront(human);
}

function randomDirection() {
  const directions = ["up", "down", "left", "right"];
  return directions[Math.floor(Math.random() * directions.length)];
}

function createHuman(index) {
  const point = randomHumanSpawnPoint();
  const isResearcher = Math.random() < RESEARCHER_SPAWN_RATE;
  const maxHp = isResearcher ? 7 : 3 + (index % 2);

  return {
    x: point.x,
    y: point.y,
    state: "idle",
    role: isResearcher ? "researcher" : "normal",
    name: isResearcher ? "レッサーパンダ研究者" : "にんげん",
    label: isResearcher ? "研究者" : "町の人",
    direction: randomDirection(),
    alert: 0,
    nextLookAt: 0,
    hp: maxHp,
    maxHp,
    wobble: index * 0.9,
    faintedAt: 0,
  };
}

function randomHumanSpawnPoint() {
  const areas = unlockedAreas();
  for (let attempt = 0; attempt < 160; attempt += 1) {
    const area = areas[Math.floor(Math.random() * areas.length)] || mapAreas[0];
    const point = {
      x: randomBetween(area.x + 56, area.x + area.w - 56),
      y: randomBetween(area.y + 78, area.y + area.h - 56),
    };
    if (isValidHumanSpawnPoint(point)) return point;
  }

  const area = areas[0] || mapAreas[0];
  return { x: area.x + area.w / 2 + 180, y: area.y + area.h / 2 + 120 };
}

function isValidHumanSpawnPoint(point) {
  const area = areaAtPoint(point);
  if (!area || !isAreaUnlocked(area)) return false;
  if (distance(point, player) < 260) return false;
  if (humans.some((human) => human.state !== "fainted" && distance(point, human) < 92)) return false;
  if (isPointOnRoad(point, 24)) return false;
  return !pointInAnySolidObstacle(point, 26);
}

function pointInObstacle(point, item, padding = 0) {
  return (
    point.x >= item.x - padding &&
    point.x <= item.x + item.w + padding &&
    point.y >= item.y - padding &&
    point.y <= item.y + item.h + padding
  );
}

function isSolidObstacle(item) {
  return item.solid === true;
}

function pointInAnySolidObstacle(point, padding = 0) {
  return obstacles.some((item) => isSolidObstacle(item) && pointInObstacle(point, item, padding));
}

function roadRectsForArea(area) {
  const verticalX = {
    residential: 1380,
    shopping: 860,
    parkland: 860,
    zooFront: 540,
  }[area.id] ?? 860;
  const horizontalYs = {
    residential: [520, 930],
    shopping: [520, 1040],
    parkland: [760, 1080],
    zooFront: [720, 1080],
  }[area.id] ?? [520, 930];
  return [
    { x: area.x, y: area.y + horizontalYs[0], w: area.w, h: 92, direction: "horizontal" },
    { x: area.x, y: area.y + horizontalYs[1], w: area.w, h: 92, direction: "horizontal" },
    { x: area.x + verticalX, y: area.y, w: 104, h: area.h, direction: "vertical" },
  ];
}

function allRoadRects() {
  return mapAreas.flatMap(roadRectsForArea);
}

function isPointOnRoad(point, padding = 0) {
  return allRoadRects().some((road) => (
    point.x >= road.x - padding &&
    point.x <= road.x + road.w + padding &&
    point.y >= road.y - padding &&
    point.y <= road.y + road.h + padding
  ));
}

function ensureHumanPopulation() {
  if (world.level < 10) return;
  while (humans.length < HIGH_LEVEL_HUMAN_COUNT) {
    const human = createHuman(humans.length);
    scheduleNextLook(human, performance.now());
    humans.push(human);
  }
}

function scheduleNextLook(human, now) {
  human.nextLookAt = now + randomBetween(HUMAN_LOOK_INTERVAL_MIN, HUMAN_LOOK_INTERVAL_MAX);
}

// Human AI
function updateHumans(delta, now) {
  for (const human of humans) {
    if (human.state === "fainted") {
      if (now - human.faintedAt >= humanReviveDelay()) {
        reviveHuman(human, now);
      }
      continue;
    }

    if (human.state !== "fleeing" && now >= human.nextLookAt) {
      human.direction = randomDirection();
      scheduleNextLook(human, now);
    }

    if (isPlayerInHumanFront(human)) {
      human.alert = clamp(human.alert + delta * HUMAN_ALERT_GAIN_PER_SECOND, 0, ALERT_MAX);
    } else {
      human.alert = clamp(human.alert - delta * 18, 0, ALERT_MAX);
    }

    if (human.alert >= ALERT_MAX) {
      human.state = "fleeing";
    }

    if (human.state === "fleeing") {
      const awayX = human.x - player.x;
      const awayY = human.y - player.y;
      const length = Math.hypot(awayX, awayY) || 1;
      const next = {
        x: clamp(human.x + (awayX / length) * 72 * delta, 24, world.width - 24),
        y: clamp(human.y + (awayY / length) * 72 * delta, 44, world.height - 24),
      };
      const nextArea = areaAtPoint(next);
      if (nextArea && isAreaUnlocked(nextArea)) {
        human.x = next.x;
        human.y = next.y;
      }
      human.direction = Math.abs(awayX) > Math.abs(awayY)
        ? (awayX > 0 ? "right" : "left")
        : (awayY > 0 ? "down" : "up");
    }
  }
}

function updateAllies(now) {
  world.allies.forEach((ally, index) => {
    const pos = allyPosition(index);
    if (now - world.allyLastAttackAt[index] < ally.cooldown) return;
    const target = humans
      .filter((human) => human.state !== "fainted" && distance(pos, human) <= SCARE_RANGE)
      .map((human) => ({ human, range: distance(pos, human) }))
      .sort((a, b) => a.range - b.range)[0];
    if (!target) return;

    world.allyLastAttackAt[index] = now;
    target.human.hp = Math.max(0, target.human.hp - 1);
    addDamagePopup(target.human, 1);
    if (target.human.hp <= 0) {
      target.human.state = "fainted";
      target.human.faintedAt = now;
      playSound("kyun");
      world.scareCount += 1;
      world.skillPoints += 1;
      addRewardEffect(target.human, 12, 1);
      gainExperience(12);
      updateHud();
      showMessage("仲間レッサーパンダが自動できゅん状態にした！");
    }
  });
}

function updateKyunMinions(delta, now) {
  for (let index = 0; index < world.kyunMinions.length; index += 1) {
    const minion = world.kyunMinions[index];
    if (now - minion.lastAttackAt < 420) {
      minion.bob += delta * 10;
    }

    const target = nearestHuman(minion, KYUN_MINION_SEARCH_RANGE);
    const separation = kyunMinionSeparation(minion, index);
    let moveX = separation.x;
    let moveY = separation.y;
    let targetRange = Infinity;
    minion.bob += delta * 12;

    if (target) {
      const dx = target.x - minion.x;
      const dy = target.y - minion.y;
      targetRange = Math.hypot(dx, dy) || 1;
      moveX += dx / targetRange;
      moveY += dy / targetRange;
      minion.wanderTimer = 0;
    } else {
      minion.wanderTimer = Math.max(0, (minion.wanderTimer || 0) - delta * 1000);
      if (!minion.wanderDirection || minion.wanderTimer <= 0) {
        chooseKyunMinionWanderDirection(minion, now);
      }
      moveX += minion.wanderDirection.x * 0.75;
      moveY += minion.wanderDirection.y * 0.75;
    }

    const moveLength = Math.hypot(moveX, moveY);
    if (moveLength > 0.001 && (!target || targetRange > 76)) {
      moveX /= moveLength;
      moveY /= moveLength;
      minion.facingX = moveX;
      minion.facingY = moveY;
      const speed = target ? 112 : 72;
      const moved = moveKyunMinion(minion, moveX, moveY, speed * delta);
      if (!moved && !target) {
        minion.wanderTimer = 0;
      }
      continue;
    }

    if (!target || now - minion.lastAttackAt < minion.cooldown) continue;
    minion.lastAttackAt = now;
    minion.scareUntil = now + 360;
    target.alert = 0;
    target.hp = Math.max(0, target.hp - KYUN_MINION_DAMAGE);
    addDamagePopup(target, KYUN_MINION_DAMAGE);
    playSound("buttonScare");

    if (target.hp <= 0) {
      target.state = "fainted";
      target.faintedAt = now;
      playSound("kyun");
      world.scareCount += 1;
      const rewardBonus = target.role === "researcher" ? 2 : 1;
      const skillPointReward = SKILL_POINT_PER_KYUN * rewardBonus;
      const expReward = Math.round(EXP_PER_SCARE * rewardBonus);
      world.skillPoints += skillPointReward;
      addRewardEffect(target, expReward, skillPointReward);
      gainLepanPt(LEPAN_REWARD_PER_KYUN, target.x, target.y - 88);
      gainExperience(expReward);
      updateHud();
      showMessage(`${target.name}は子分きゅんレパンにきゅん！ 報酬を獲得しました。`);
    }
  }
}

function kyunMinionSeparation(minion, ownIndex) {
  let x = 0;
  let y = 0;
  for (let index = 0; index < world.kyunMinions.length; index += 1) {
    if (index === ownIndex) continue;
    const other = world.kyunMinions[index];
    const dx = minion.x - other.x;
    const dy = minion.y - other.y;
    const range = Math.hypot(dx, dy) || 1;
    if (range >= KYUN_MINION_PERSONAL_SPACE) continue;
    const force = (KYUN_MINION_PERSONAL_SPACE - range) / KYUN_MINION_PERSONAL_SPACE;
    x += (dx / range) * force * 1.4;
    y += (dy / range) * force * 1.4;
  }
  return { x, y };
}

function chooseKyunMinionWanderDirection(minion, now) {
  const baseAngle = Math.atan2(minion.facingY || 0, minion.facingX || 1);
  const angle = baseAngle + randomBetween(-Math.PI * 0.9, Math.PI * 0.9);
  minion.wanderDirection = {
    x: Math.cos(angle),
    y: Math.sin(angle),
  };
  minion.wanderTimer = randomBetween(KYUN_MINION_WANDER_INTERVAL_MIN, KYUN_MINION_WANDER_INTERVAL_MAX);
}

function moveKyunMinion(minion, dx, dy, distanceToMove) {
  const next = {
    x: minion.x + dx * distanceToMove,
    y: minion.y + dy * distanceToMove,
  };
  const area = areaAtPoint(next);
  if (!area || !isAreaUnlocked(area) || pointInAnySolidObstacle(next, 14)) {
    return false;
  }
  minion.x = clamp(next.x, area.x + 24, area.x + area.w - 24);
  minion.y = clamp(next.y, area.y + 36, area.y + area.h - 24);
  return true;
}

function nearestHuman(from, maxRange = Infinity) {
  return humans
    .filter((human) => human.state !== "fainted")
    .map((human) => ({ human, range: distance(from, human) }))
    .filter((item) => item.range <= maxRange)
    .sort((a, b) => a.range - b.range)[0]?.human || null;
}

function allyPosition(index) {
  const ally = world.allies[index];
  const angle = ally.angle + performance.now() / 900 + index * 0.6;
  return {
    x: player.x + Math.cos(angle) * 58,
    y: player.y + Math.sin(angle) * 42,
  };
}

function reviveHuman(human, now) {
  const point = randomHumanSpawnPoint();
  human.x = point.x;
  human.y = point.y;
  human.state = "idle";
  human.hp = human.maxHp;
  human.alert = 0;
  human.faintedAt = 0;
  human.direction = randomDirection();
  scheduleNextLook(human, now);
  showMessage(`${human.name}が何事もなかった顔で復活した。`);
  updateHud();
}

function randomizeInitialHumans(now) {
  for (const human of humans) {
    const point = randomHumanSpawnPoint();
    human.x = point.x;
    human.y = point.y;
    scheduleNextLook(human, now);
  }
}

function updateCamera() {
  const targetX = player.x - world.viewportWidth / 2;
  const targetY = player.y - world.viewportHeight / 2;
  camera.x = clamp(targetX, 0, world.width - world.viewportWidth);
  camera.y = clamp(targetY, 0, world.height - world.viewportHeight);
}

function movePlayer(delta) {
  if (world.inputLocked) return;
  let dx = 0;
  let dy = 0;

  if (world.keys.has("ArrowUp") || world.keys.has("KeyW")) dy -= 1;
  if (world.keys.has("ArrowDown") || world.keys.has("KeyS")) dy += 1;
  if (world.keys.has("ArrowLeft") || world.keys.has("KeyA")) dx -= 1;
  if (world.keys.has("ArrowRight") || world.keys.has("KeyD")) dx += 1;

  if (dx === 0 && dy === 0) return;

  const length = Math.hypot(dx, dy);
  dx /= length;
  dy /= length;
  player.facingX = dx;
  player.facingY = dy;
  player.bob += delta * 14;

  const speed = player.baseSpeed * movementSpeedMultiplier();
  const target = clampPointToUnlockedAreas({
    x: clamp(player.x + dx * speed * delta, 28, world.width - 28),
    y: clamp(player.y + dy * speed * delta, 46, world.height - 28),
  });

  player.x = target.x;
  player.y = target.y;
}

function scare() {
  if (world.inputLocked) return;
  useMove({
    name: "威嚇",
    range: SCARE_RANGE,
    exp: EXP_PER_SCARE,
    phrase: randomScarePhrase(),
    damage: SCARE_DAMAGE,
  });
}

// Skills and attacks
function randomScarePhrase() {
  return SCARE_PHRASES[Math.floor(Math.random() * SCARE_PHRASES.length)];
}

function useMove(move) {
  const moveDamage = move.name === "威嚇" ? SCARE_DAMAGE : skillDamage(move.id);
  const scareTargets = humans.filter((human) => canScareHuman(human, move.range));
  const nearest = scareTargets
    .map((human) => ({ human, range: distance(player, human) }))
    .sort((a, b) => a.range - b.range)[0];

  if (!nearest) {
    showMessage("近くに人間がいない！");
    return;
  }

  if (world.lepanPt <= 0) {
    showMessage("レパンPTが足りない！");
    return;
  }

  world.lepanPt -= 1;
  updateHud();
  playSound("scare");

  world.scarePulseUntil = performance.now() + 420;
  world.skillPhraseUntil = performance.now() + 650;
  world.skillPhrase = move.phrase;

  const damage = moveDamage;
  nearest.human.alert = 0;
  nearest.human.hp = Math.max(0, nearest.human.hp - damage);
  addDamagePopup(nearest.human, damage);

  if (nearest.human.hp > 0) {
    updateHud();
    showMessage(`${nearest.human.name}のキュン耐久値に-${damage}！ 残りHP ${nearest.human.hp}/${nearest.human.maxHp}。まだ平静を装っている。`);
    return;
  }

  nearest.human.state = "fainted";
  nearest.human.faintedAt = performance.now();
  playSound("kyun");
  world.scareCount += 1;
  const rewardBonus = nearest.human.role === "researcher" ? 2 : 1;
  const skillPointReward = SKILL_POINT_PER_KYUN * rewardBonus;
  const expReward = Math.round(move.exp * rewardBonus);
  world.skillPoints += skillPointReward;
  addRewardEffect(nearest.human, expReward, skillPointReward);
  const lepanGained = gainLepanPt(LEPAN_REWARD_PER_KYUN, nearest.human.x, nearest.human.y - 88);
  const result = gainExperience(expReward);
  updateHud();
  if (result.leveledUp) {
    showMessage(`${nearest.human.name}はきゅん状態！ ${expReward}経験値、スキルポイント+${skillPointReward}、レパンPT+${lepanGained}。レベル${world.level}になった！`);
    return;
  }
  showMessage(`${nearest.human.name}はきゅん状態！ ${expReward}経験値、スキルポイント+${skillPointReward}、レパンPT+${lepanGained}。`);
}

function addDamagePopup(human, damage) {
  world.damagePopups.push({
    x: human.x + 18,
    y: human.y - 66,
    damage,
    createdAt: performance.now(),
  });
}

function addRewardEffect(human, expAmount, skillPointAmount) {
  const coins = Array.from({ length: 5 }, (_, index) => ({
    offsetX: randomBetween(-16, 16),
    offsetY: randomBetween(-4, 10),
    driftX: randomBetween(-20, 20),
    lift: randomBetween(36, 72),
    spin: randomBetween(-Math.PI, Math.PI),
    delay: index * 55,
  }));

  world.effects.push({
    type: "reward",
    x: human.x,
    y: human.y - 72,
    expAmount,
    skillPointAmount,
    coins,
    createdAt: performance.now(),
    duration: 1120,
  });
}

function addLevelUpEffect(levelsGained) {
  world.effects.push({
    type: "levelUp",
    x: player.x,
    y: player.y - 86,
    text: levelsGained > 1 ? `レベルアップ！ x${levelsGained}` : "レベルアップ！",
    createdAt: performance.now(),
    duration: 1380,
  });
}

function updateEffects(now) {
  world.effects = world.effects.filter((effect) => now - effect.createdAt < effect.duration);
}

function gainLepanPt(amount, x = player.x, y = player.y - 74) {
  const before = world.lepanPt;
  world.lepanPt = Math.min(maxLepanPt(), world.lepanPt + amount);
  const gained = world.lepanPt - before;

  world.lepanPopups.push({
    x,
    y,
    amount: gained,
    createdAt: performance.now(),
  });

  return gained;
}

function recoverLepanPt(now) {
  if (world.lepanPt >= maxLepanPt()) {
    world.lastLepanRecoveryAt = now;
    return;
  }

  const elapsed = now - world.lastLepanRecoveryAt;
  if (elapsed < LEPAN_RECOVERY_INTERVAL) return;

  const recoveries = Math.floor(elapsed / LEPAN_RECOVERY_INTERVAL);
  world.lastLepanRecoveryAt += recoveries * LEPAN_RECOVERY_INTERVAL;
  const before = world.lepanPt;
  world.lepanPt = Math.min(maxLepanPt(), world.lepanPt + recoveries);
  const gained = world.lepanPt - before;
  showMessage(`レパンPTが${gained}回復した。しっぽに元気が戻った。`);
  updateHud();
}

function experienceToNextLevel() {
  return world.level * 100;
}

function gainExperience(amount) {
  world.experience += amount;
  let leveledUp = false;
  let levelsGained = 0;
  let unlockedAreaMessages = [];

  while (world.experience >= experienceToNextLevel()) {
    world.experience -= experienceToNextLevel();
    world.level += 1;
    world.skillPoints += 1;
    leveledUp = true;
    levelsGained += 1;
  }

  if (leveledUp) {
    playSound("levelUp");
    addLevelUpEffect(levelsGained);
    unlockedAreaMessages = checkAreaUnlocks();
  }

  ensureHumanPopulation();
  checkAllClear();
  return { leveledUp, unlockedAreaMessages };
}

function checkAllClear() {
  if (world.level < CLEAR_LEVEL || world.allClearShown) return;
  world.allClearShown = true;
  setModalOpen(clearModal, true);
  showMessage("全クリ！ レベル200到達です。");
}

function checkAreaUnlocks() {
  const messages = [];
  for (const area of mapAreas) {
    if (area.requiredLevel <= 1 || world.unlockedAreaMessages.includes(area.id)) continue;
    if (world.level >= area.requiredLevel) {
      world.unlockedAreaMessages.push(area.id);
      messages.push(area.unlockMessage || `${area.name}が解放されました！`);
    }
  }
  if (messages.length > 0) {
    const message = messages[messages.length - 1];
    showMessage(message);
    window.setTimeout(() => showMessage(message), 260);
  }
  return messages;
}

function updateHud() {
  if (world.developerMode) {
    world.skillPoints = DEVELOPER_SKILL_POINTS;
    world.lepanPt = DEVELOPER_LEPAN_PT;
  }

  ensureHumanPopulation();
  levelEl.textContent = String(world.level);
  experienceEl.textContent = `${world.experience}/${experienceToNextLevel()}`;
  skillPointsEl.textContent = String(world.skillPoints);
  lepanPtEl.textContent = `${world.lepanPt}/${maxLepanPt()}`;
  moveSpeedEl.textContent = `x${movementSpeedMultiplier()}`;
  modalSkillPointsEl.textContent = String(world.skillPoints);
  scareCountEl.textContent = String(world.scareCount);
  humanCountEl.textContent = String(humans.filter((human) => human.state !== "fainted").length);
  renderSkillMenu();
  renderLearnedSkills();
}

function updateDeveloperModeUi() {
  if (!developerControls || !developerModeButton) return;
  developerControls.hidden = !SHOW_DEVELOPER_MODE;
  developerModeButton.textContent = world.developerMode ? "DEV ON" : "DEV OFF";
  developerModeButton.classList.toggle("is-on", world.developerMode);
}

function setDeveloperMode(enabled) {
  if (!SHOW_DEVELOPER_MODE) return;
  world.developerMode = enabled;
  if (world.developerMode) {
    world.skillPoints = DEVELOPER_SKILL_POINTS;
    world.lepanPt = DEVELOPER_LEPAN_PT;
    showMessage("開発者モードON：スキルPTとレパンPTがむくむく増えた！");
  } else {
    showMessage("開発者モードOFF：町は少しだけ正気に戻った。");
  }
  updateDeveloperModeUi();
  updateHud();
  renderGacha();
}

function hasSkill(skillId) {
  return world.learnedSkills.includes(skillId);
}

function buySkill(skillId) {
  const skill = skillCatalog.find((item) => item.id === skillId);
  if (!skill || hasSkill(skillId)) return;
  if (world.skillPoints < skill.cost) {
    showMessage("スキルポイントが足りない。レッサーパンダは財布を持っていない。");
    return;
  }

  world.skillPoints -= skill.cost;
  world.learnedSkills.push(skillId);
  if (!skill.passive && world.equippedSkills.length < 1) {
    world.equippedSkills.push(skillId);
  }
  updateHud();
  showMessage(`${skill.name}を習得した！ 使いどころはだいたい今。`);
}

function isSkillEquipped(skillId) {
  return world.equippedSkills.includes(skillId);
}

function toggleSkillEquip(skillId) {
  if (!hasSkill(skillId)) {
    showMessage("未購入スキルはセットできません。まず入手です。");
    return;
  }
  const skill = skillCatalog.find((item) => item.id === skillId);
  if (skill?.passive) {
    showMessage("パッシブスキルはセット不要です。常に効いています。");
    return;
  }

  if (isSkillEquipped(skillId)) {
    world.equippedSkills = world.equippedSkills.filter((id) => id !== skillId);
    updateHud();
    showMessage("スキルを外しました。レッサーパンダは少し身軽です。");
    return;
  }

  world.equippedSkills = [skillId];
  updateHud();
  showMessage("スキルをセットしました。前のスキルは自動で外れます。");
}

function renderSkillMenu() {
  skillList.innerHTML = "";
  renderUpgradeList();
  for (const skill of skillCatalog) {
    const card = document.createElement("article");
    card.className = "skill-card";

    const text = document.createElement("div");
    const title = document.createElement("h3");
    title.textContent = `${skill.name} Lv${skillLevel(skill.id)}`;
    const description = document.createElement("p");
    description.textContent = skill.passive
      ? `${skill.description} 速度+${(0.15 * skillLevel(skill.id)).toFixed(2)} / 必要SP: ${skill.cost}`
      : `${skill.description} ダメージ: ${skillDamage(skill.id)} / 必要SP: ${skill.cost}`;
    text.append(title, description);

    const button = document.createElement("button");
    button.className = "buy-button";
    button.type = "button";
    button.textContent = hasSkill(skill.id) ? "習得済み" : "習得";
    button.disabled = hasSkill(skill.id);
    button.addEventListener("click", () => buySkill(skill.id));

    const equipButton = document.createElement("button");
    equipButton.className = "buy-button";
    equipButton.type = "button";
    equipButton.textContent = skill.passive ? "常時発動" : isSkillEquipped(skill.id) ? "セット中" : "セット";
    equipButton.disabled = skill.passive || !hasSkill(skill.id);
    equipButton.addEventListener("click", () => toggleSkillEquip(skill.id));

    card.append(text, button, equipButton);
    skillList.append(card);
  }
}

function upgradeCost(type, skillId = "") {
  if (type === "skill") return 3 + skillLevel(skillId) * 2;
  if (type === "revive") return 4 + world.reviveCooldownReduction * 2;
  if (type === "ally") return 8 + world.allies.length * 5;
  if (type === "kyunMinion") return KYUN_MINION_BASE_COST + world.kyunMinionLevel * KYUN_MINION_COST_STEP;
  return 999;
}

function kyunMinionLimit() {
  return KYUN_MINION_BASE_LIMIT + Math.floor(world.level / 10) * KYUN_MINION_LIMIT_STEP;
}

function renderUpgradeList() {
  upgradeListEl.innerHTML = "";
  const upgrades = [
    { title: "人間出現クールタイム短縮", body: `現在 ${humanReviveDelay() / 1000}秒 / 最短 ${MIN_HUMAN_REVIVE_DELAY / 1000}秒`, cost: upgradeCost("revive"), action: buyReviveUpgrade },
    { title: "レッサーパンダ仲間追加", body: `現在 ${world.allies.length}匹。近くの人間を自動威嚇します。`, cost: upgradeCost("ally"), action: buyAllyUpgrade },
  ];
  upgrades.push({
    title: "子分きゅんレパン",
    body: `Lv${world.kyunMinionLevel} / 自動きゅんレパン ${world.kyunMinions.length}匹。人間を探して自動で威嚇します。`,
    cost: upgradeCost("kyunMinion"),
    action: buyKyunMinionUpgrade,
    disabled: world.kyunMinionLevel >= kyunMinionLimit(),
    body: `Lv${world.kyunMinionLevel} / 自動きゅんレパン ${world.kyunMinions.length}/${kyunMinionLimit()}匹。ダメージ${KYUN_MINION_DAMAGE}。人間を探して自動で威嚇します。`,
  });

  for (const skillId of world.learnedSkills) {
    const skill = skillCatalog.find((item) => item.id === skillId);
    if (!skill) continue;
    const body = skill.passive
      ? `Lv${skillLevel(skillId)} → Lv${skillLevel(skillId) + 1} / 速度 +${(0.15 * skillLevel(skillId)).toFixed(2)} → +${(0.15 * (skillLevel(skillId) + 1)).toFixed(2)}`
      : `Lv${skillLevel(skillId)} → Lv${skillLevel(skillId) + 1} / ダメージ ${skillDamage(skillId)} → ${skillDamage(skillId) + 1}`;
    upgrades.unshift({
      title: `${skill.name} レベルアップ`,
      body,
      cost: upgradeCost("skill", skillId),
      action: () => buySkillLevelUpgrade(skillId),
    });
  }

  for (const upgrade of upgrades) {
    const card = document.createElement("article");
    card.className = "skill-card";
    const text = document.createElement("div");
    const title = document.createElement("h3");
    title.textContent = upgrade.title;
    const body = document.createElement("p");
    body.textContent = `${upgrade.body} / 必要SP: ${upgrade.cost}`;
    text.append(title, body);
    const button = document.createElement("button");
    button.className = "buy-button";
    button.type = "button";
    button.textContent = "購入";
    button.disabled = world.skillPoints < upgrade.cost || Boolean(upgrade.disabled);
    button.addEventListener("click", upgrade.action);
    card.append(text, button);
    upgradeListEl.append(card);
  }
}

function spendSkillPoints(cost) {
  if (world.skillPoints < cost) {
    showMessage("スキルポイントが足りません。かわいさはあるのに。");
    return false;
  }
  world.skillPoints -= cost;
  return true;
}

function buySkillLevelUpgrade(skillId) {
  const cost = upgradeCost("skill", skillId);
  if (!spendSkillPoints(cost)) return;
  world.skillLevels[skillId] = skillLevel(skillId) + 1;
  updateHud();
  showMessage("スキルレベルアップ！ 威嚇の説得力が増しました。");
}

function buyReviveUpgrade() {
  if (humanReviveDelay() <= MIN_HUMAN_REVIVE_DELAY) {
    showMessage("再出現クールタイムはこれ以上短くできません。人間にも都合があります。");
    return;
  }
  const cost = upgradeCost("revive");
  if (!spendSkillPoints(cost)) return;
  world.reviveCooldownReduction += 1;
  updateHud();
  showMessage("人間出現クールタイムを1秒短縮しました。町が忙しい。");
}

function buyAllyUpgrade() {
  const cost = upgradeCost("ally");
  if (!spendSkillPoints(cost)) return;
  world.allies.push({ angle: world.allies.length * 2.1, cooldown: 2600 });
  world.allyLastAttackAt.push(0);
  updateHud();
  showMessage("仲間レッサーパンダが増えました。圧がかわいい。");
}

function buyKyunMinionUpgrade() {
  if (world.kyunMinionLevel >= kyunMinionLimit()) {
    showMessage(`子分きゅんレパンは現在${kyunMinionLimit()}匹までです。レベルを上げると上限が増えます。`);
    return;
  }
  const cost = upgradeCost("kyunMinion");
  if (!spendSkillPoints(cost)) return;
  world.kyunMinionLevel += 1;
  world.kyunMinions.push(createKyunMinion(world.kyunMinionLevel - 1));
  updateHud();
  showMessage(`子分きゅんレパンLv${world.kyunMinionLevel}！ 自動きゅん部隊が${world.kyunMinions.length}匹になりました。`);
}

function createKyunMinion(index) {
  const angle = index * 2.35;
  const area = areaAtPoint(player) || mapAreas[0];
  return {
    x: clamp(player.x + Math.cos(angle) * 80, area.x + 24, area.x + area.w - 24),
    y: clamp(player.y + Math.sin(angle) * 80, area.y + 36, area.y + area.h - 24),
    facingX: 1,
    facingY: 0,
    cooldown: 1800,
    lastAttackAt: 0,
    scareUntil: 0,
    bob: index,
    wanderDirection: null,
    wanderTimer: 0,
  };
}

function renderLearnedSkills() {
  learnedSkillsEl.innerHTML = "";
  for (const skillId of world.equippedSkills) {
    const skill = skillCatalog.find((item) => item.id === skillId);
    if (!skill || skill.passive) continue;
    const button = document.createElement("button");
    button.className = "technique-button";
    button.type = "button";
    button.textContent = skill.name;
    button.addEventListener("click", () => useMove(skill));
    learnedSkillsEl.append(button);
  }
}

// Gacha and skin collection
function activeSkin() {
  return allSkins.find((skin) => skin.id === world.activeSkin) || skinCatalog[0];
}

function gachaCost() {
  if (world.developerMode) return 0;
  return world.hasRolledGacha ? NORMAL_GACHA_COST : FIRST_GACHA_COST;
}

function rollGacha() {
  if (world.gachaAnimation) return;
  const cost = gachaCost();
  if (world.skillPoints < cost) {
    showMessage(`スキルPTが足りない！ ガチャ箱は${cost}PTを要求している。`);
    renderGacha();
    return;
  }

  if (!world.developerMode) {
    world.skillPoints -= cost;
  }
  world.hasRolledGacha = true;
  updateHud();
  renderGacha();

  const isSecretHit = Math.random() < SECRET_SKIN_RATE;
  const skin = isSecretHit
    ? secretSkin
    : skinCatalog[Math.floor(Math.random() * skinCatalog.length)];
  const rarity = isSecretHit ? "SECRET" : rollGachaRarity();
  const duplicate = world.ownedSkins.includes(skin.id);

  startGachaAnimation({
    skin,
    rarity,
    duplicate,
    secret: isSecretHit,
  });
}

function rollGachaRarity() {
  const roll = Math.random();
  if (roll < 0.08) return "A";
  if (roll < 0.35) return "B";
  return "C";
}

function applyGachaResult(result) {
  if (result.duplicate) {
    world.evolutionTickets += result.secret ? 5 : 1;
    gachaResultEl.textContent = `${result.skin.name} / レアリティ:${result.rarity} / 重複！ 進化チケット+${result.secret ? 5 : 1}`;
  } else {
    world.ownedSkins.push(result.skin.id);
    world.activeSkin = result.skin.id;
    gachaResultEl.textContent = `${result.skin.name} / レアリティ:${result.rarity} / 新規獲得！`;
  }

  updateHud();
  renderGacha();
  renderSkinList();
  if (result.secret) playSecretSkinReveal();
  showMessage(gachaResultEl.textContent);
}

function playSecretSkinReveal() {
  gachaResultEl.classList.remove("secret-reveal");
  window.requestAnimationFrame(() => gachaResultEl.classList.add("secret-reveal"));
  world.scarePulseUntil = performance.now() + 1600;
  world.skillPhrase = "レパン最強神王ゴッド降臨";
}

function renderGacha() {
  gachaSkillPointsEl.textContent = String(world.skillPoints);
  evolutionTicketsEl.textContent = String(world.evolutionTickets);
  rollGachaButton.textContent = `ガチャを回す (${gachaCost()}PT)`;
}

function gachaAnimationEvent(name, data = {}) {
  world.lastGachaEvent = { name, data, at: performance.now() };
}

function startGachaAnimation(result) {
  const patterns = ["apple", "climb", "march"];
  world.inputLocked = true;
  world.gachaAnimation = {
    result,
    pattern: result.secret ? "secret" : patterns[Math.floor(Math.random() * patterns.length)],
    startedAt: performance.now(),
    duration: result.secret ? SECRET_GACHA_TOTAL_DURATION : GACHA_ANIMATION_DURATION,
    skippable: !result.secret,
    floodSoundPlayed: false,
    finished: false,
  };
  playSound(result.secret ? "secretStart" : "gachaStart");
  gachaResultEl.textContent = result.secret ? "......" : "演出中...";
  setGachaControlsAnimating(true, result.secret);
  gachaAnimationEvent("start", { pattern: world.gachaAnimation.pattern, rarity: result.rarity });
}

function setGachaControlsAnimating(isAnimating, secret = false) {
  document.body.classList.toggle("gacha-playing", isAnimating);
  document.body.classList.toggle("gacha-secret", isAnimating && secret);
  rollGachaButton.disabled = isAnimating;
  skipGachaButton.hidden = !isAnimating || secret;
  skipGachaButton.disabled = !isAnimating || secret;
  gachaButton.disabled = isAnimating;
  for (const button of document.querySelectorAll(".close-button")) {
    button.disabled = isAnimating;
  }
}

function updateGachaAnimation(now) {
  const animation = world.gachaAnimation;
  if (!animation || animation.finished) return;

  const elapsed = now - animation.startedAt;
  if (animation.pattern === "secret" && elapsed >= SECRET_GACHA_DARK_DURATION && !animation.floodSoundPlayed) {
    animation.floodSoundPlayed = true;
    playSound("secretFlood");
    gachaAnimationEvent("success", { pattern: "secret", timing: "flood" });
  }

  if (elapsed >= animation.duration) {
    finishGachaAnimation();
  }
}

function finishGachaAnimation() {
  const animation = world.gachaAnimation;
  if (!animation || animation.finished) return;

  animation.finished = true;
  if (!animation.result.secret) {
    playSound(`gacha${animation.result.rarity}`);
  }
  gachaAnimationEvent("result", { skin: animation.result.skin.id, rarity: animation.result.rarity });
  world.gachaAnimation = null;
  world.inputLocked = false;
  setGachaControlsAnimating(false);
  applyGachaResult(animation.result);
}

function skipGachaAnimation() {
  if (!world.gachaAnimation || !world.gachaAnimation.skippable) return;
  gachaAnimationEvent("skip");
  finishGachaAnimation();
}

function levelRewardMilestones() {
  const rewards = [];
  for (let level = 10; level <= CLEAR_LEVEL; level += 10) {
    rewards.push({
      level,
      title: `Lv${level}報酬`,
      body: level % 30 === 0
        ? "限定スキン候補、スキルポイント+5、レパンPT上限+10"
        : "スキルポイント+3、レパンPT上限+5",
    });
  }
  return rewards;
}

function renderLevelRewards() {
  levelRewardListEl.innerHTML = "";
  for (const reward of levelRewardMilestones()) {
    const claimed = world.claimedLevelRewards.includes(reward.level);
    const reached = world.level >= reward.level;
    const card = document.createElement("article");
    card.className = "skill-card";
    const text = document.createElement("div");
    const title = document.createElement("h3");
    title.textContent = reward.title;
    const body = document.createElement("p");
    body.textContent = claimed ? `${reward.body} / 受け取り済み` : reached ? `${reward.body} / 受け取り可能` : `${reward.body} / 未達成`;
    text.append(title, body);
    const button = document.createElement("button");
    button.className = "buy-button";
    button.type = "button";
    button.textContent = claimed ? "済" : reached ? "受け取る" : "未達成";
    button.disabled = claimed || !reached;
    button.addEventListener("click", () => claimLevelReward(reward.level));
    card.append(text, button);
    levelRewardListEl.append(card);
  }
}

function claimLevelReward(level) {
  if (world.level < level || world.claimedLevelRewards.includes(level)) return;
  playSound("reward");
  world.claimedLevelRewards.push(level);
  world.skillPoints += level % 30 === 0 ? 5 : 3;
  world.lepanPtMaxBonus += level % 30 === 0 ? 10 : 5;
  if (level % 30 === 0 && !world.ownedSkins.includes(levelRewardSkin.id)) {
    world.ownedSkins.push(levelRewardSkin.id);
  }
  updateHud();
  renderLevelRewards();
  showMessage(`Lv${level}報酬を受け取りました。しっぽが少し偉そう。`);
}

function chooseClearReward(type) {
  world.clearRewardType = type;
  world.clearRollsRemaining = 2;
  clearSkinChoice.disabled = true;
  clearSkillChoice.disabled = true;
  clearRollButton.disabled = false;
  clearRollArea.textContent = type === "skin"
    ? "全クリ専用スキンガチャを2回引けます。"
    : "全クリ専用スキルガチャを2回引けます。";
}

function rollClearReward() {
  if (!world.clearRewardType || world.clearRollsRemaining <= 0) return;
  world.clearRollsRemaining -= 1;

  if (world.clearRewardType === "skin") {
    const skin = clearSkinCatalog[Math.floor(Math.random() * clearSkinCatalog.length)];
    if (world.ownedSkins.includes(skin.id)) {
      world.evolutionTickets += 2;
      clearRollArea.textContent = `${skin.name}が重複。進化チケット+2。残り${world.clearRollsRemaining}回。`;
    } else {
      world.ownedSkins.push(skin.id);
      world.activeSkin = skin.id;
      clearRollArea.textContent = `${skin.name}獲得！ 残り${world.clearRollsRemaining}回。`;
    }
  } else {
    const skill = skillCatalog[Math.floor(Math.random() * skillCatalog.length)];
    world.skillLevels[skill.id] = skillLevel(skill.id) + 2;
    clearRollArea.textContent = `${skill.name}が超強化！ Lv${skillLevel(skill.id)}。残り${world.clearRollsRemaining}回。`;
  }

  clearRollButton.disabled = world.clearRollsRemaining <= 0;
  updateHud();
}

function renderSkinList() {
  skinListEl.innerHTML = "";
  for (const skin of skinCatalog) {
    const owned = world.ownedSkins.includes(skin.id);
    const card = document.createElement("article");
    card.className = `skin-card${owned ? "" : " is-locked"}`;

    const swatch = document.createElement("span");
    swatch.className = "skin-swatch";
    swatch.style.setProperty("--skin-body", skin.body);
    swatch.style.setProperty("--skin-belly", skin.belly);
    swatch.style.setProperty("--skin-tail", skin.tail);

    const text = document.createElement("div");
    const title = document.createElement("h3");
    title.textContent = owned ? skin.name : "未所持スキン";
    const description = document.createElement("p");
    description.textContent = owned
      ? (world.activeSkin === skin.id ? "装備中。今日の主役面です。" : "所持中。クリックで着替えます。")
      : "ガチャから出るまで秘密。";
    text.append(title, description);

    const button = document.createElement("button");
    button.className = "buy-button";
    button.type = "button";
    button.textContent = world.activeSkin === skin.id ? "装備中" : "着替え";
    button.disabled = !owned || world.activeSkin === skin.id;
    button.addEventListener("click", () => {
      world.activeSkin = skin.id;
      renderSkinList();
      showMessage(`${skin.name}に着替えた。町の空気が少しざわついた。`);
    });

    card.append(swatch, text, button);
    skinListEl.append(card);
  }
  renderSecretSkinSlot();
}

function renderSecretSkinSlot() {
  const owned = world.ownedSkins.includes(secretSkin.id);
  const card = document.createElement("article");
  card.className = `skin-card secret-slot${owned ? "" : " is-locked"}`;

  const swatch = document.createElement("span");
  swatch.className = "skin-swatch";
  swatch.style.setProperty("--skin-body", owned ? secretSkin.body : "#3a3a42");
  swatch.style.setProperty("--skin-belly", owned ? secretSkin.belly : "#77727d");
  swatch.style.setProperty("--skin-tail", owned ? secretSkin.tail : "#202024");

  const text = document.createElement("div");
  const title = document.createElement("h3");
  title.textContent = owned ? secretSkin.name : "???";
  const description = document.createElement("p");
  description.textContent = owned
    ? "0.00001%の向こう側。もはや町内伝説です。"
    : "図鑑に謎の空白。通常一覧には出ない何か。";
  text.append(title, description);

  const button = document.createElement("button");
  button.className = "buy-button";
  button.type = "button";
  button.textContent = world.activeSkin === secretSkin.id ? "装備中" : "着替え";
  button.disabled = !owned || world.activeSkin === secretSkin.id;
  button.addEventListener("click", () => {
    world.activeSkin = secretSkin.id;
    renderSkinList();
    showMessage(`${secretSkin.name}に着替えた。人類側が会議を始めた。`);
  });

  card.append(swatch, text, button);
  skinListEl.append(card);
}

function setModalOpen(modal, isOpen) {
  if (world.gachaAnimation?.result?.secret && modal === gachaModal && !isOpen) return;
  modal.classList.toggle("is-open", isOpen);
  modal.setAttribute("aria-hidden", String(!isOpen));
  if (modal === gachaModal && isOpen) renderGacha();
  if (modal === skinModal && isOpen) renderSkinList();
  if (modal === levelRewardModal && isOpen) renderLevelRewards();
}

function closeAllModals() {
  if (world.gachaAnimation) return;
  playSound("menuClose");
  for (const modal of [skillModal, gachaModal, skinModal, settingsModal, levelRewardModal]) {
    setModalOpen(modal, false);
  }
}

// Map rendering
function mapVariant(item, salt = 0) {
  const seed = Math.sin((item.x * 12.9898 + item.y * 78.233 + item.w * 5.371 + salt * 91.7)) * 43758.5453;
  return seed - Math.floor(seed);
}

function chooseByVariant(item, salt, values) {
  return values[Math.floor(mapVariant(item, salt) * values.length) % values.length];
}

function drawRoads() {
  const roads = allRoadRects();

  ctx.fillStyle = "#dde5d7";
  for (const road of roads) {
    if (road.direction === "horizontal") {
      ctx.fillRect(road.x, road.y - 26, road.w, 26);
      ctx.fillRect(road.x, road.y + road.h, road.w, 24);
    } else {
      ctx.fillRect(road.x - 26, road.y, 26, road.h);
      ctx.fillRect(road.x + road.w, road.y, 24, road.h);
    }
  }

  ctx.fillStyle = "#b9bec2";
  for (const road of roads) ctx.fillRect(road.x, road.y, road.w, road.h);

  ctx.fillStyle = "#9fa6aa";
  for (const road of roads) {
    if (road.direction === "horizontal") {
      ctx.fillRect(road.x, road.y, road.w, 4);
      ctx.fillRect(road.x, road.y + road.h - 4, road.w, 4);
    } else {
      ctx.fillRect(road.x, road.y, 4, road.h);
      ctx.fillRect(road.x + road.w - 4, road.y, 4, road.h);
    }
  }

  ctx.fillStyle = "#edf0e7";
  for (const road of roads) {
    if (road.direction === "horizontal") {
      for (let x = road.x + 18; x < road.x + road.w; x += 96) ctx.fillRect(x, road.y + road.h / 2 - 3, 42, 6);
    } else {
      for (let y = road.y + 18; y < road.y + road.h; y += 96) ctx.fillRect(road.x + road.w / 2 - 3, y, 6, 42);
    }
  }

  for (const area of mapAreas) {
    const hRoads = roadRectsForArea(area).filter((road) => road.direction === "horizontal");
    const vRoads = roadRectsForArea(area).filter((road) => road.direction === "vertical");
    for (const h of hRoads) {
      for (const v of vRoads) {
        drawCrosswalk(v.x + v.w / 2, h.y - 4, "horizontal");
        drawCrosswalk(v.x - 4, h.y + h.h / 2, "vertical");
      }
    }
  }
}

function drawStreetDetails() {
  for (let x = 70; x < world.width; x += 210) {
    drawTree(x, 204, x % 3);
    drawTree(x + 86, 744, (x + 1) % 3);
    drawTree(x + 34, 1112, (x + 2) % 3);
  }

  for (let x = 28; x < world.width; x += 180) {
    drawStreetLamp(x, 234);
    drawStreetLamp(x + 72, 736);
    drawStreetLamp(x + 42, 982);
  }

  for (let x = 120; x < world.width; x += 360) {
    drawRoadSign(x, 226, "止");
    drawRoadSign(x + 160, 742, "徐");
    drawRoadSign(x + 70, 980, "P");
  }
}

function drawCrosswalk(x, y, direction) {
  ctx.fillStyle = "#f7f5eb";
  if (direction === "horizontal") {
    for (let i = -3; i <= 3; i += 1) ctx.fillRect(x + i * 12 - 4, y, 8, 34);
  } else {
    for (let i = -3; i <= 3; i += 1) ctx.fillRect(x, y + i * 12 - 4, 34, 8);
  }
}

function drawStreetLamp(x, y) {
  ctx.fillStyle = "#3f4750";
  ctx.fillRect(x, y, 5, 46);
  ctx.fillStyle = "#f7f1df";
  ctx.beginPath();
  ctx.arc(x + 2, y - 4, 9, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#3f4750";
  ctx.lineWidth = 2;
  ctx.stroke();
}

function drawRoadSign(x, y, text) {
  ctx.fillStyle = "#3f7ec7";
  ctx.beginPath();
  ctx.arc(x, y, 13, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.fillStyle = "#ffffff";
  ctx.font = "900 11px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(text, x, y + 4);
  ctx.textAlign = "start";
  ctx.fillStyle = "#4a4a4e";
  ctx.fillRect(x - 2, y + 13, 4, 24);
}

function drawTree(x, y, variant = 0) {
  ctx.fillStyle = "#7a5335";
  ctx.fillRect(x - 5, y + 18, 10, 20);
  if (variant % 3 === 1) {
    ctx.fillStyle = "#3f9563";
    ctx.beginPath();
    ctx.moveTo(x, y - 18);
    ctx.lineTo(x - 26, y + 28);
    ctx.lineTo(x + 26, y + 28);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "#63b36b";
    ctx.fillRect(x - 9, y + 2, 18, 8);
  } else if (variant % 3 === 2) {
    ctx.fillStyle = "#6aa64e";
    ctx.beginPath();
    ctx.ellipse(x, y + 11, 24, 18, 0, 0, Math.PI * 2);
    ctx.ellipse(x - 13, y + 22, 17, 13, 0, 0, Math.PI * 2);
    ctx.ellipse(x + 14, y + 23, 18, 13, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#f4a1bb";
    ctx.beginPath();
    ctx.arc(x + 10, y + 10, 3, 0, Math.PI * 2);
    ctx.arc(x - 9, y + 20, 3, 0, Math.PI * 2);
    ctx.fill();
  } else {
    ctx.fillStyle = "#2f8f70";
    ctx.beginPath();
    ctx.arc(x, y + 12, 20, 0, Math.PI * 2);
    ctx.arc(x - 14, y + 22, 16, 0, Math.PI * 2);
    ctx.arc(x + 15, y + 23, 17, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#73bd67";
    ctx.beginPath();
    ctx.arc(x - 7, y + 8, 7, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawMap() {
  for (const area of mapAreas) {
    ctx.fillStyle = area.color;
    ctx.fillRect(area.x, area.y, area.w, area.h);
  }

  ctx.fillStyle = "rgba(255, 255, 255, 0.11)";
  for (let x = 0; x < world.width; x += 64) ctx.fillRect(x, 0, 2, world.height);
  for (let y = 0; y < world.height; y += 64) ctx.fillRect(0, y, world.width, 2);

  drawGrassDetails();

  drawRoads();
  drawStreetDetails();

  for (const item of obstacles) {
    if (item.type === "park") {
      drawPark(item);
      continue;
    }

    drawBuilding(item);
  }

  drawAreaBoundaries();
}

function drawGrassDetails() {
  for (let x = 34; x < world.width; x += 74) {
    for (let y = 34; y < world.height; y += 62) {
      const offset = Math.sin(x * 0.17 + y * 0.11) * 12;
      const px = x + offset;
      const py = y + Math.cos(x * 0.07 + y * 0.19) * 10;
      ctx.strokeStyle = "#5eb66f";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(px, py + 8);
      ctx.lineTo(px + 4, py);
      ctx.moveTo(px + 6, py + 8);
      ctx.lineTo(px + 10, py + 2);
      ctx.stroke();

      if ((x + y) % 5 === 0) {
        drawFlower(px + 22, py + 6, (x + y) % 2 ? "#f4a1bb" : "#f7d45b");
      }
    }
  }

  ctx.fillStyle = "rgba(101, 183, 119, 0.55)";
  for (let x = 60; x < world.width; x += 180) {
    for (let y = 410; y < world.height; y += 260) {
      ctx.fillRect(x, y, 54, 28);
      ctx.fillRect(x + 16, y - 14, 36, 18);
    }
  }
}

function drawFlower(x, y, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x - 3, y, 3, 0, Math.PI * 2);
  ctx.arc(x + 3, y, 3, 0, Math.PI * 2);
  ctx.arc(x, y - 3, 3, 0, Math.PI * 2);
  ctx.arc(x, y + 3, 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#fff8ec";
  ctx.fillRect(x - 1, y - 1, 2, 2);
}

function drawAreaBoundaries() {
  ctx.save();
  ctx.lineWidth = 5;
  ctx.setLineDash([18, 12]);
  ctx.strokeStyle = "rgba(80, 70, 54, 0.45)";
  ctx.beginPath();
  ctx.moveTo(AREA_WIDTH, 0);
  ctx.lineTo(AREA_WIDTH, world.height);
  ctx.moveTo(0, AREA_HEIGHT);
  ctx.lineTo(world.width, AREA_HEIGHT);
  ctx.stroke();
  ctx.setLineDash([]);

  for (const area of mapAreas) {
    drawAreaLabel(area);
    if (!isAreaUnlocked(area)) drawLockedAreaFence(area);
  }
  ctx.restore();
}

function drawAreaLabel(area) {
  ctx.fillStyle = "rgba(255, 248, 236, 0.88)";
  ctx.strokeStyle = "#2e2e30";
  ctx.lineWidth = 2;
  const x = area.x + 34;
  const y = area.y + 34;
  ctx.fillRect(x, y, 210, 46);
  ctx.strokeRect(x, y, 210, 46);
  ctx.fillStyle = "#202024";
  ctx.font = "900 17px sans-serif";
  ctx.fillText(area.name, x + 14, y + 28);
  if (!isAreaUnlocked(area)) {
    ctx.font = "800 12px sans-serif";
    ctx.fillText(`Lv${area.requiredLevel}で解放`, x + 114, y + 29);
  }
}

function drawLockedAreaFence(area) {
  ctx.fillStyle = "rgba(32, 32, 36, 0.12)";
  ctx.fillRect(area.x, area.y, area.w, area.h);

  if (area.x > 0) {
    drawGateFence(area.x, area.y + 120, area.h - 240, "vertical", area);
  }
  if (area.y > 0) {
    drawGateFence(area.x + 120, area.y, area.w - 240, "horizontal", area);
  }
}

function drawGateFence(x, y, length, direction, area) {
  ctx.fillStyle = "#fff0c8";
  ctx.strokeStyle = "#2e2e30";
  ctx.lineWidth = 2;
  const step = 44;
  for (let p = 0; p < length; p += step) {
    if (direction === "vertical") {
      ctx.fillRect(x - 11, y + p, 22, 32);
      ctx.strokeRect(x - 11, y + p, 22, 32);
    } else {
      ctx.fillRect(x + p, y - 11, 32, 22);
      ctx.strokeRect(x + p, y - 11, 32, 22);
    }
  }

  const signX = direction === "vertical" ? x + 26 : x + length / 2 - 78;
  const signY = direction === "vertical" ? y + length / 2 - 24 : y + 26;
  ctx.fillStyle = "#fff8ec";
  ctx.fillRect(signX, signY, 156, 46);
  ctx.strokeRect(signX, signY, 156, 46);
  ctx.fillStyle = "#202024";
  ctx.font = "900 13px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(`${area.name}`, signX + 78, signY + 18);
  ctx.fillText(`Lv${area.requiredLevel}から`, signX + 78, signY + 35);
  ctx.textAlign = "start";
}

function drawBuilding(item) {
  const roofHeight = item.kind === "apartment" ? 30 : 42;
  const bodyY = item.y + roofHeight - 12;
  const bodyH = item.h - roofHeight + 12;
  const bodyColor = chooseByVariant(item, 1, [item.color, "#f1b980", "#b7dca0", "#9fd0d7", "#e3a4c0", "#d9c692"]);
  const roofColor = chooseByVariant(item, 2, [item.roof, "#c65a4f", "#51689e", "#6e8f3a", "#8b5f9d", "#b76f3f"]);

  ctx.fillStyle = "rgba(32, 32, 36, 0.28)";
  ctx.fillRect(item.x + 9, item.y + 13, item.w, item.h);

  if (item.kind !== "shop") drawYard(item);

  ctx.fillStyle = bodyColor;
  ctx.fillRect(item.x, bodyY, item.w, bodyH);

  drawRoof(item, bodyY, roofHeight, roofColor);

  ctx.fillStyle = item.trim;
  ctx.fillRect(item.x, bodyY + bodyH - 12, item.w, 12);
  drawBuildingTexture(item, bodyY, bodyH);
  drawWindows(item, bodyY);
  drawDoor(item, bodyY, bodyH);
  drawSign(item, bodyY);
  if (item.kind !== "apartment") drawPlanters(item, bodyY + bodyH - 18);
}

function drawWindows(item, bodyY) {
  const rows = item.kind === "apartment" ? 3 : 2;
  const columns = item.kind === "apartment" ? 4 : (item.kind === "shop" ? 3 : 2);
  const gap = item.w / (columns + 1);

  for (let row = 0; row < rows; row += 1) {
    for (let col = 1; col <= columns; col += 1) {
      const x = item.x + gap * col - 15;
      const y = bodyY + 20 + row * 42;
      if (y > item.y + item.h - 58) continue;
      ctx.fillStyle = "#fff3bf";
      ctx.fillRect(x, y, 30, 24);
      ctx.strokeStyle = "#2e2e30";
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, 30, 24);
      ctx.fillStyle = "rgba(134, 201, 223, 0.55)";
      ctx.fillRect(x + 3, y + 3, 24, 8);
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(x + 14, y + 2, 2, 20);
      ctx.fillRect(x + 3, y + 12, 24, 2);
    }
  }
}

function drawDoor(item, bodyY, bodyH) {
  const doorW = item.kind === "shop" ? 42 : 32;
  const doorX = item.x + item.w / 2 - doorW / 2;
  const doorY = bodyY + bodyH - 52;
  ctx.fillStyle = item.kind === "shop" ? "#6aa3b8" : "#7b4a2d";
  ctx.fillRect(doorX, doorY, doorW, 52);
  ctx.strokeStyle = "#2e2e30";
  ctx.lineWidth = 2;
  ctx.strokeRect(doorX, doorY, doorW, 52);
  ctx.fillStyle = "#f8d25c";
  ctx.beginPath();
  ctx.arc(doorX + doorW - 9, doorY + 28, 3, 0, Math.PI * 2);
  ctx.fill();
}

function drawRoof(item, bodyY, roofHeight, roofColor) {
  const roofType = item.kind === "apartment" ? "flat" : chooseByVariant(item, 3, ["gable", "hip", "round"]);
  ctx.fillStyle = roofColor;
  ctx.beginPath();
  if (roofType === "flat") {
    ctx.roundRect(item.x - 8, item.y, item.w + 16, roofHeight, 7);
  } else if (roofType === "hip") {
    ctx.moveTo(item.x - 10, bodyY);
    ctx.lineTo(item.x + 32, item.y - 8);
    ctx.lineTo(item.x + item.w - 32, item.y - 8);
    ctx.lineTo(item.x + item.w + 10, bodyY);
    ctx.closePath();
  } else if (roofType === "round") {
    ctx.roundRect(item.x - 10, item.y + 1, item.w + 20, roofHeight + 4, 18);
  } else {
    ctx.moveTo(item.x - 12, bodyY);
    ctx.lineTo(item.x + item.w / 2, item.y - 8);
    ctx.lineTo(item.x + item.w + 12, bodyY);
    ctx.closePath();
  }
  ctx.fill();
  ctx.strokeStyle = "#2e2e30";
  ctx.lineWidth = 3;
  ctx.stroke();

  ctx.strokeStyle = "rgba(255, 255, 255, 0.35)";
  ctx.lineWidth = 2;
  for (let x = item.x + 18; x < item.x + item.w - 8; x += 28) {
    ctx.beginPath();
    ctx.moveTo(x, item.y + 6);
    ctx.lineTo(x + 12, bodyY - 3);
    ctx.stroke();
  }
}

function drawYard(item) {
  ctx.fillStyle = "rgba(116, 177, 93, 0.42)";
  ctx.fillRect(item.x - 18, item.y + item.h - 24, item.w + 36, 46);
  drawFence(item.x - 16, item.y + item.h + 8, item.w + 32);
}

function drawFence(x, y, width) {
  ctx.fillStyle = "#fff0c8";
  ctx.fillRect(x, y, width, 5);
  ctx.fillRect(x, y + 14, width, 5);
  for (let px = x + 4; px < x + width; px += 18) {
    ctx.fillRect(px, y - 7, 7, 31);
  }
  ctx.strokeStyle = "rgba(32, 32, 36, 0.35)";
  ctx.lineWidth = 1;
  ctx.strokeRect(x, y, width, 19);
}

function drawBuildingTexture(item, bodyY, bodyH) {
  if (item.kind === "apartment") {
    ctx.fillStyle = "rgba(255, 255, 255, 0.18)";
    for (let y = bodyY + 14; y < bodyY + bodyH - 12; y += 24) {
      ctx.fillRect(item.x + 8, y, item.w - 16, 2);
    }
    return;
  }

  ctx.fillStyle = "rgba(255, 255, 255, 0.13)";
  for (let x = item.x + 12; x < item.x + item.w - 8; x += 34) {
    ctx.fillRect(x, bodyY + 8, 3, bodyH - 22);
  }
}

function drawPlanters(item, y) {
  for (let x = item.x + 22; x < item.x + item.w - 22; x += 58) {
    ctx.fillStyle = "#8b6f43";
    ctx.fillRect(x, y, 28, 9);
    drawFlower(x + 8, y - 4, "#f4a1bb");
    drawFlower(x + 20, y - 5, "#f7d45b");
  }
}

function drawSign(item, bodyY) {
  if (item.kind !== "shop") return;
  const signW = Math.min(112, item.w - 54);
  const signX = item.x + item.w / 2 - signW / 2;
  const signY = bodyY + 12;
  ctx.fillStyle = "#fff8ec";
  ctx.fillRect(signX, signY, signW, 28);
  ctx.strokeStyle = "#2e2e30";
  ctx.lineWidth = 2;
  ctx.strokeRect(signX, signY, signW, 28);
  ctx.fillStyle = "#202024";
  ctx.font = "900 15px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(item.name, item.x + item.w / 2, signY + 19);
  ctx.textAlign = "start";
}

function drawPark(item) {
  ctx.fillStyle = "rgba(32, 32, 36, 0.2)";
  ctx.fillRect(item.x + 8, item.y + 8, item.w, item.h);
  ctx.fillStyle = item.color;
  ctx.fillRect(item.x, item.y, item.w, item.h);
  ctx.fillStyle = "rgba(255, 248, 236, 0.18)";
  ctx.fillRect(item.x + 22, item.y + item.h / 2 - 8, item.w - 44, 16);
  ctx.fillRect(item.x + item.w / 2 - 8, item.y + 20, 16, item.h - 40);
  drawParkFence(item);

  for (let x = item.x + 22; x < item.x + item.w - 10; x += 34) {
    ctx.fillStyle = "#8b6f43";
    ctx.fillRect(x, item.y + 4, 7, 24);
    ctx.fillRect(x, item.y + item.h - 28, 7, 24);
  }

  drawTree(item.x + 48, item.y + 34, 0);
  drawTree(item.x + item.w - 54, item.y + 52, 1);
  drawTree(item.x + 86, item.y + item.h - 62, 2);
  drawBench(item.x + item.w / 2 - 52, item.y + item.h / 2 + 24);
  drawFlowerBed(item.x + 30, item.y + item.h - 48, 82, 26);
  drawPlayground(item.x + item.w - 96, item.y + item.h - 74);
  ctx.fillStyle = "#202024";
  ctx.font = "900 14px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(item.name, item.x + item.w / 2, item.y + item.h - 18);
  ctx.textAlign = "start";
}

function drawParkFence(item) {
  ctx.strokeStyle = "#8b6f43";
  ctx.lineWidth = 5;
  ctx.strokeRect(item.x + 8, item.y + 8, item.w - 16, item.h - 16);
  ctx.fillStyle = "#fff0c8";
  for (let x = item.x + 20; x < item.x + item.w - 18; x += 28) {
    ctx.fillRect(x, item.y + 7, 6, 24);
    ctx.fillRect(x, item.y + item.h - 31, 6, 24);
  }
  for (let y = item.y + 26; y < item.y + item.h - 28; y += 28) {
    ctx.fillRect(item.x + 7, y, 24, 6);
    ctx.fillRect(item.x + item.w - 31, y, 24, 6);
  }
}

function drawBench(x, y) {
  ctx.fillStyle = "#8b5a3c";
  ctx.fillRect(x, y, 92, 9);
  ctx.fillRect(x + 4, y + 14, 84, 8);
  ctx.fillStyle = "#3f4750";
  ctx.fillRect(x + 12, y + 22, 6, 18);
  ctx.fillRect(x + 72, y + 22, 6, 18);
}

function drawFlowerBed(x, y, w, h) {
  ctx.fillStyle = "#8b6f43";
  ctx.fillRect(x, y, w, h);
  ctx.fillStyle = "#6cb85d";
  ctx.fillRect(x + 5, y + 5, w - 10, h - 10);
  for (let fx = x + 14; fx < x + w - 8; fx += 18) {
    drawFlower(fx, y + 13, fx % 3 ? "#f4a1bb" : "#f7d45b");
  }
}

function drawPlayground(x, y) {
  ctx.strokeStyle = "#d95745";
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(x, y + 42);
  ctx.lineTo(x + 24, y);
  ctx.lineTo(x + 48, y + 42);
  ctx.stroke();
  ctx.strokeStyle = "#51689e";
  ctx.beginPath();
  ctx.moveTo(x + 24, y + 4);
  ctx.lineTo(x + 24, y + 28);
  ctx.stroke();
  ctx.fillStyle = "#f8d25c";
  ctx.fillRect(x + 13, y + 28, 22, 8);

  ctx.fillStyle = "#e58f72";
  ctx.beginPath();
  ctx.arc(x + 70, y + 32, 16, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#fff8ec";
  ctx.fillRect(x + 62, y + 18, 16, 28);
}

function drawHuman(human, now) {
  ctx.save();
  ctx.translate(human.x, human.y);

  if (human.state === "fainted") {
    const spin = Math.min((now - human.faintedAt) / 230, 1) * Math.PI / 2;
    ctx.rotate(spin);
    ctx.fillStyle = "rgba(32, 32, 36, 0.18)";
    ctx.beginPath();
    ctx.ellipse(0, 24, 28, 9, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#476b9e";
    ctx.fillRect(-16, -4, 42, 20);
    ctx.fillStyle = "#f2caa0";
    ctx.beginPath();
    ctx.arc(-22, 6, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#202024";
    ctx.font = "900 18px sans-serif";
    ctx.fillText("きゅん", -20, -18);
    ctx.font = "700 12px sans-serif";
    ctx.fillText(human.name, -26, 43);
    ctx.restore();
    return;
  }

  const wobble = Math.sin(now / 280 + human.wobble) * 3;
  ctx.translate(wobble, 0);
  const isResearcher = human.role === "researcher";
  const shirt = isResearcher ? "#f4f6f8" : "#304f96";
  const pants = isResearcher ? "#6e7781" : "#253260";
  const hair = isResearcher ? "#5e534b" : "#202024";
  const skin = "#f2caa0";

  ctx.fillStyle = "rgba(32, 32, 36, 0.16)";
  ctx.beginPath();
  ctx.ellipse(0, 31, 18, 7, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = isResearcher ? "#f4f6f8" : "#f2caa0";
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(-12, 9);
  ctx.lineTo(-25, 22);
  ctx.moveTo(12, 9);
  ctx.lineTo(25, 22);
  ctx.stroke();

  ctx.fillStyle = shirt;
  ctx.fillRect(-15, 0, 30, 34);
  if (isResearcher) {
    ctx.fillStyle = "#dfe5ec";
    ctx.fillRect(-18, 0, 9, 38);
    ctx.fillRect(9, 0, 9, 38);
    ctx.fillStyle = "#d94332";
    ctx.fillRect(-2, 5, 4, 24);
  }

  ctx.fillStyle = skin;
  ctx.beginPath();
  ctx.arc(0, -12, 13, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = hair;
  ctx.beginPath();
  ctx.arc(0, -21, 13, Math.PI, Math.PI * 2);
  ctx.fill();
  ctx.fillRect(-9, -25, 18, 8);
  ctx.fillStyle = pants;
  ctx.fillRect(-15, 34, 11, 17);
  ctx.fillRect(4, 34, 11, 17);
  ctx.fillStyle = "#202024";
  ctx.fillRect(-17, 49, 14, 5);
  ctx.fillRect(4, 49, 14, 5);
  if (isResearcher) {
    ctx.strokeStyle = "#202024";
    ctx.lineWidth = 2;
    ctx.strokeRect(-9, -15, 7, 5);
    ctx.strokeRect(2, -15, 7, 5);
    ctx.beginPath();
    ctx.moveTo(-2, -13);
    ctx.lineTo(2, -13);
    ctx.stroke();
  }
  drawHumanFaceDirection(human);
  ctx.font = "700 13px sans-serif";
  ctx.fillText(human.state === "fleeing" ? "!!" : "?", 15, -18);
  if (canScareHuman(human)) {
    drawScareAlert(now);
  }
  drawHumanNameplate(human);
  ctx.restore();
}

function drawHumanFaceDirection(human) {
  const eyeOffset = {
    up: { x: 0, y: -5 },
    down: { x: 0, y: 5 },
    left: { x: -5, y: 0 },
    right: { x: 5, y: 0 },
  }[human.direction] || { x: 0, y: 5 };

  ctx.fillStyle = "#202024";
  ctx.beginPath();
  ctx.arc(-4 + eyeOffset.x, -13 + eyeOffset.y, 2.2, 0, Math.PI * 2);
  ctx.arc(5 + eyeOffset.x, -13 + eyeOffset.y, 2.2, 0, Math.PI * 2);
  ctx.fill();
}

function drawScareAlert(now) {
  const bounce = Math.sin(now / 120) * 3;

  ctx.save();
  ctx.translate(0, -76 + bounce);
  ctx.fillStyle = "#f8d25c";
  ctx.strokeStyle = "#202024";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(0, 0, 13, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "#202024";
  ctx.font = "900 22px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("!", 0, 1);
  ctx.restore();
}

function drawHumanNameplate(human) {
  const plateWidth = 82;
  const plateHeight = 42;
  const ratio = human.hp / human.maxHp;
  const alertRatio = human.alert / ALERT_MAX;

  ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
  ctx.strokeStyle = "#202024";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(-plateWidth / 2, -58, plateWidth, plateHeight, 5);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#202024";
  ctx.font = "700 12px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(`${human.name} HP ${human.hp}/${human.maxHp}`, 0, -46);

  ctx.fillStyle = "#f1d9c0";
  ctx.fillRect(-31, -38, 62, 6);
  ctx.fillStyle = ratio > 0.5 ? "#2f8f70" : "#d94332";
  ctx.fillRect(-31, -38, 62 * ratio, 6);
  ctx.strokeStyle = "#202024";
  ctx.strokeRect(-31, -38, 62, 6);

  ctx.fillStyle = "#e4e0d6";
  ctx.fillRect(-31, -29, 62, 5);
  ctx.fillStyle = human.state === "fleeing" ? "#d94332" : "#f8d25c";
  ctx.fillRect(-31, -29, 62 * alertRatio, 5);
  ctx.strokeStyle = "#202024";
  ctx.strokeRect(-31, -29, 62, 5);
  ctx.textAlign = "start";
}

function drawDamagePopups(now) {
  world.damagePopups = world.damagePopups.filter((popup) => now - popup.createdAt < 820);

  for (const popup of world.damagePopups) {
    const age = now - popup.createdAt;
    const progress = age / 820;
    const bounce = Math.sin(progress * Math.PI) * 12;
    const alpha = 1 - progress;

    ctx.save();
    ctx.translate(popup.x, popup.y - progress * 36 - bounce);
    ctx.rotate(Math.sin(progress * Math.PI * 2) * 0.08);
    ctx.globalAlpha = alpha;
    ctx.fillStyle = "#ffffff";
    ctx.strokeStyle = "#202024";
    ctx.lineWidth = 5;
    ctx.font = "900 28px sans-serif";
    ctx.textAlign = "center";
    ctx.strokeText(`-${popup.damage}`, 0, 0);
    ctx.fillText(`-${popup.damage}`, 0, 0);
    ctx.restore();
  }
}

function drawLepanPopups(now) {
  world.lepanPopups = world.lepanPopups.filter((popup) => now - popup.createdAt < 980);

  for (const popup of world.lepanPopups) {
    const age = now - popup.createdAt;
    const progress = age / 980;
    const alpha = 1 - progress;
    const lift = progress * 46;
    const squish = 1 + Math.sin(progress * Math.PI) * 0.08;

    ctx.save();
    ctx.translate(popup.x, popup.y - lift);
    ctx.scale(squish, squish);
    ctx.globalAlpha = alpha;
    ctx.fillStyle = "#f8d25c";
    ctx.strokeStyle = "#202024";
    ctx.lineWidth = 5;
    ctx.font = "900 22px sans-serif";
    ctx.textAlign = "center";
    const text = `レパンPT +${popup.amount}`;
    ctx.strokeText(text, 0, 0);
    ctx.fillText(text, 0, 0);
    ctx.restore();
  }
}

function drawEffects(now) {
  for (const effect of world.effects) {
    if (effect.type === "reward") drawRewardEffect(effect, now);
    if (effect.type === "levelUp") drawLevelUpEffect(effect, now);
  }
}

function drawRewardEffect(effect, now) {
  const age = now - effect.createdAt;
  const progress = clamp(age / effect.duration, 0, 1);
  const alpha = 1 - progress;

  ctx.save();
  ctx.globalAlpha = alpha;

  for (const coin of effect.coins) {
    const coinAge = Math.max(0, age - coin.delay);
    const coinProgress = clamp(coinAge / (effect.duration - coin.delay), 0, 1);
    if (coinAge <= 0) continue;
    const x = effect.x + coin.offsetX + coin.driftX * coinProgress;
    const y = effect.y + coin.offsetY - coin.lift * coinProgress - Math.sin(coinProgress * Math.PI) * 12;
    const spin = coin.spin + coinProgress * Math.PI * 4;
    const sparkle = 0.75 + Math.sin(coinProgress * Math.PI * 8) * 0.25;

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(spin);
    ctx.scale(1, sparkle);
    ctx.fillStyle = "#ffd75c";
    ctx.strokeStyle = "#8a5b20";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(0, 0, 8, 6, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#fff1a8";
    ctx.beginPath();
    ctx.arc(-3, -2, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  ctx.translate(effect.x, effect.y - 42 - progress * 30);
  ctx.rotate(Math.sin(progress * Math.PI * 2) * 0.04);
  ctx.textAlign = "center";
  ctx.font = "900 18px sans-serif";
  ctx.lineWidth = 5;
  ctx.strokeStyle = "#202024";
  ctx.fillStyle = "#ffffff";
  const expText = `+EXP ${effect.expAmount}`;
  const spText = `+SP ${effect.skillPointAmount}`;
  ctx.strokeText(expText, 0, 0);
  ctx.fillText(expText, 0, 0);
  ctx.fillStyle = "#f8d25c";
  ctx.strokeText(spText, 0, 24);
  ctx.fillText(spText, 0, 24);
  ctx.restore();
}

function drawLevelUpEffect(effect, now) {
  const age = now - effect.createdAt;
  const progress = clamp(age / effect.duration, 0, 1);
  const alpha = 1 - progress;
  const pulse = 1 + Math.sin(progress * Math.PI) * 0.18;

  ctx.save();
  ctx.translate(effect.x, effect.y - progress * 58);
  ctx.scale(pulse, pulse);
  ctx.globalAlpha = alpha;
  ctx.textAlign = "center";
  ctx.font = "900 28px sans-serif";
  ctx.lineWidth = 7;
  ctx.strokeStyle = "#202024";
  ctx.fillStyle = "#fff7b8";
  ctx.strokeText(effect.text, 0, 0);
  ctx.fillText(effect.text, 0, 0);

  ctx.strokeStyle = "rgba(255, 215, 92, 0.85)";
  ctx.lineWidth = 3;
  for (let index = 0; index < 8; index += 1) {
    const angle = (Math.PI * 2 * index) / 8 + progress * Math.PI;
    const inner = 38 + progress * 8;
    const outer = 52 + progress * 18;
    ctx.beginPath();
    ctx.moveTo(Math.cos(angle) * inner, Math.sin(angle) * inner - 8);
    ctx.lineTo(Math.cos(angle) * outer, Math.sin(angle) * outer - 8);
    ctx.stroke();
  }
  ctx.restore();
}

function drawPanda(now) {
  const bob = Math.sin(player.bob) * 3;
  const tailAngle = Math.sin(now / 140) * 0.16;
  const skin = activeSkin();
  const skinImage = getSkinImage(skin);

  ctx.save();
  ctx.translate(player.x, player.y + bob);

  ctx.fillStyle = "rgba(32, 32, 36, 0.2)";
  ctx.beginPath();
  ctx.ellipse(0, 28, 31, 10, 0, 0, Math.PI * 2);
  ctx.fill();

  if (skinImage) {
    drawPandaImage(skinImage);
  } else {
    ctx.save();
    ctx.rotate(tailAngle);
    ctx.fillStyle = skin.body;
    ctx.beginPath();
    ctx.ellipse(-30, 8, 26, 13, -0.35, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = skin.tail;
    ctx.lineWidth = 7;
    ctx.beginPath();
    ctx.moveTo(-50, 1);
    ctx.lineTo(-42, 16);
    ctx.moveTo(-35, -4);
    ctx.lineTo(-26, 17);
    ctx.stroke();
    drawSkinPattern(skin);
    ctx.restore();

    ctx.fillStyle = skin.body;
    ctx.beginPath();
    ctx.ellipse(0, 8, 32, 24, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = skin.belly;
    ctx.beginPath();
    ctx.ellipse(10, 4, 23, 18, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = skin.body;
    ctx.beginPath();
    ctx.arc(18, -20, 21, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = skin.accent;
    ctx.beginPath();
    ctx.arc(4, -33, 8, 0, Math.PI * 2);
    ctx.arc(30, -33, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = skin.belly;
    ctx.beginPath();
    ctx.arc(18, -18, 14, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = skin.accent;
    ctx.beginPath();
    ctx.arc(12, -21, 3, 0, Math.PI * 2);
    ctx.arc(24, -21, 3, 0, Math.PI * 2);
    ctx.arc(18, -13, 3, 0, Math.PI * 2);
    ctx.fill();
  }

  if (now < world.scarePulseUntil) {
    const progress = 1 - (world.scarePulseUntil - now) / 420;
    ctx.strokeStyle = `rgba(217, 67, 50, ${1 - progress})`;
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(18 + player.facingX * 18, -16 + player.facingY * 18, 42 + progress * 52, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = "#202024";
    ctx.font = "900 23px sans-serif";
    ctx.fillText(world.skillPhrase, -58, -54);
  }

  ctx.restore();
}

function drawPandaImage(image) {
  const maxWidth = 78;
  const maxHeight = 78;
  const scale = Math.min(maxWidth / image.naturalWidth, maxHeight / image.naturalHeight);
  const width = Math.max(1, Math.round(image.naturalWidth * scale));
  const height = Math.max(1, Math.round(image.naturalHeight * scale));

  ctx.save();
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(image, Math.round(-width / 2), Math.round(-height / 2), width, height);
  ctx.restore();
}

function drawAllyPandas(now) {
  for (let i = 0; i < world.allies.length; i += 1) {
    const pos = allyPosition(i);
    ctx.save();
    ctx.translate(pos.x, pos.y + Math.sin(now / 180 + i) * 2);
    ctx.scale(0.62, 0.62);
    ctx.fillStyle = "rgba(32, 32, 36, 0.18)";
    ctx.beginPath();
    ctx.ellipse(0, 28, 28, 9, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#c94f38";
    ctx.beginPath();
    ctx.ellipse(0, 6, 30, 22, 0, 0, Math.PI * 2);
    ctx.arc(16, -18, 20, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#f7dfb2";
    ctx.beginPath();
    ctx.arc(16, -17, 13, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#202024";
    ctx.beginPath();
    ctx.arc(10, -20, 3, 0, Math.PI * 2);
    ctx.arc(22, -20, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

function drawKyunMinions(now) {
  for (const minion of world.kyunMinions) {
    ctx.save();
    ctx.translate(minion.x, minion.y + Math.sin(minion.bob) * 2);
    ctx.scale(0.66, 0.66);
    ctx.fillStyle = "rgba(32, 32, 36, 0.18)";
    ctx.beginPath();
    ctx.ellipse(0, 28, 28, 9, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#d86b4a";
    ctx.beginPath();
    ctx.ellipse(0, 6, 30, 22, 0, 0, Math.PI * 2);
    ctx.arc(16, -18, 20, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#ffe6bb";
    ctx.beginPath();
    ctx.arc(16, -17, 13, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#202024";
    ctx.beginPath();
    ctx.arc(10, -20, 3, 0, Math.PI * 2);
    ctx.arc(22, -20, 3, 0, Math.PI * 2);
    ctx.arc(16, -12, 2.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "#46a6ff";
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(4, 0, 19, 0.2, Math.PI * 0.86);
    ctx.stroke();
    ctx.fillStyle = "#f8d25c";
    ctx.beginPath();
    ctx.arc(4, 12, 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#6e5aa8";
    ctx.fillRect(1, -42, 31, 8);
    ctx.beginPath();
    ctx.moveTo(6, -42);
    ctx.lineTo(18, -58);
    ctx.lineTo(30, -42);
    ctx.closePath();
    ctx.fill();

    if (now < minion.scareUntil) {
      ctx.strokeStyle = "rgba(70, 166, 255, 0.7)";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(20 + minion.facingX * 18, -14 + minion.facingY * 18, 42, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.restore();
  }
}

function drawSkinPattern(skin) {
  ctx.save();
  ctx.lineWidth = 3;
  ctx.strokeStyle = skin.accent;
  ctx.fillStyle = skin.accent;

  if (skin.pattern === "dot") {
    ctx.beginPath();
    ctx.arc(-41, 5, 3, 0, Math.PI * 2);
    ctx.arc(-30, 13, 3, 0, Math.PI * 2);
    ctx.fill();
  } else if (skin.pattern === "moon") {
    ctx.beginPath();
    ctx.arc(-39, 6, 7, 0.4, Math.PI * 1.6);
    ctx.stroke();
  } else if (skin.pattern === "ember") {
    ctx.beginPath();
    ctx.moveTo(-43, 12);
    ctx.lineTo(-37, 0);
    ctx.lineTo(-31, 13);
    ctx.stroke();
  } else if (skin.pattern === "drop") {
    ctx.beginPath();
    ctx.ellipse(-39, 7, 4, 7, 0.2, 0, Math.PI * 2);
    ctx.fill();
  } else if (skin.pattern === "crown") {
    ctx.beginPath();
    ctx.moveTo(-45, 9);
    ctx.lineTo(-41, 0);
    ctx.lineTo(-36, 8);
    ctx.lineTo(-31, 0);
    ctx.lineTo(-27, 9);
    ctx.stroke();
  } else if (skin.pattern === "god") {
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(-38, 7, 15, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = "#ff4fc3";
    ctx.font = "900 13px sans-serif";
    ctx.fillText("神", -45, 12);
  }

  ctx.restore();
}

function drawScene(now) {
  updateCamera();
  ctx.imageSmoothingEnabled = false;
  ctx.clearRect(0, 0, world.viewportWidth, world.viewportHeight);

  ctx.save();
  ctx.translate(-Math.round(camera.x), -Math.round(camera.y));
  drawMap();

  const actors = [...humans, player].sort((a, b) => a.y - b.y);
  for (const actor of actors) {
    if (actor === player) drawPanda(now);
    else drawHuman(actor, now);
  }
  drawAllyPandas(now);
  drawKyunMinions(now);
  drawDamagePopups(now);
  drawLepanPopups(now);
  drawEffects(now);
  ctx.restore();

  drawMiniPosition();
  drawGachaAnimation(now);
}

function drawMiniPosition() {
  const pad = 12;
  const mapW = 128;
  const mapH = Math.round(mapW * (world.height / world.width));
  const x = world.viewportWidth - mapW - pad;
  const y = world.viewportHeight - mapH - pad;
  const playerX = x + (player.x / world.width) * mapW;
  const playerY = y + (player.y / world.height) * mapH;

  ctx.fillStyle = "rgba(255, 255, 255, 0.82)";
  ctx.strokeStyle = "#202024";
  ctx.lineWidth = 2;
  ctx.fillRect(x, y, mapW, mapH);
  ctx.strokeRect(x, y, mapW, mapH);

  for (const human of humans) {
    const humanX = x + (human.x / world.width) * mapW;
    const humanY = y + (human.y / world.height) * mapH;
    ctx.fillStyle = minimapHumanColor(human);
    ctx.beginPath();
    ctx.arc(humanX, humanY, 2.2, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.fillStyle = "#d94332";
  ctx.beginPath();
  ctx.arc(playerX, playerY, 4, 0, Math.PI * 2);
  ctx.fill();
}

function minimapHumanColor(human) {
  return HUMAN_MINIMAP_COLORS[human.role] || HUMAN_MINIMAP_COLORS.normal;
}

function drawGachaAnimation(now) {
  const animation = world.gachaAnimation;
  if (!animation) return;

  const elapsed = now - animation.startedAt;
  const progress = clamp(elapsed / animation.duration, 0, 1);
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = "rgba(255, 248, 236, 0.94)";
  ctx.fillRect(0, 0, world.viewportWidth, world.viewportHeight);

  if (animation.pattern === "secret") drawSecretGachaAnimation(elapsed);
  if (animation.pattern === "apple") drawAppleGachaAnimation(progress, animation.result.rarity);
  if (animation.pattern === "climb") drawClimbGachaAnimation(progress, animation.result.rarity);
  if (animation.pattern === "march") drawMarchGachaAnimation(progress, animation.result.rarity);

  ctx.restore();
}

function drawAppleGachaAnimation(progress, rarity) {
  ctx.fillStyle = "#202024";
  ctx.font = "900 28px sans-serif";
  ctx.fillText("りんご演出", 34, 44);
  ctx.strokeStyle = "#f2caa0";
  ctx.lineWidth = 18;
  ctx.beginPath();
  ctx.moveTo(world.viewportWidth - 70, 190);
  ctx.lineTo(world.viewportWidth - 210, 210);
  ctx.stroke();
  ctx.fillStyle = "#d94332";
  ctx.beginPath();
  ctx.arc(world.viewportWidth - 240, 214, 24, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#2f8f70";
  ctx.fillRect(world.viewportWidth - 238, 184, 10, 20);

  const endX = rarity === "C" ? 360 : rarity === "B" ? world.viewportWidth - 330 : world.viewportWidth - 258;
  const x = -80 + (endX + 80) * Math.min(progress * 1.25, 1);
  const y = rarity === "C" && progress > 0.72 ? 288 : 312;
  drawGachaRedPanda(x, y, rarity === "C" && progress > 0.72 ? "sleep" : "walk");
  if (rarity === "A" && progress > 0.76) {
    ctx.fillStyle = "#202024";
    ctx.font = "900 24px sans-serif";
    ctx.fillText("しゃくっ", world.viewportWidth - 320, 168);
  }
}

function drawClimbGachaAnimation(progress, rarity) {
  ctx.fillStyle = "#202024";
  ctx.font = "900 28px sans-serif";
  ctx.fillText("木登り演出", 34, 44);
  ctx.fillStyle = "#7a5335";
  ctx.fillRect(450, 78, 64, 390);
  ctx.fillStyle = "#2f8f70";
  ctx.beginPath();
  ctx.arc(482, 72, 88, 0, Math.PI * 2);
  ctx.arc(410, 122, 62, 0, Math.PI * 2);
  ctx.arc(560, 124, 70, 0, Math.PI * 2);
  ctx.fill();
  const top = rarity === "A" ? 92 : rarity === "B" ? 238 : 330;
  const y = 430 - (430 - top) * Math.min(progress * 1.3, 1);
  drawGachaRedPanda(500, rarity === "C" && progress > 0.74 ? 410 : y, rarity === "C" && progress > 0.74 ? "fall" : "climb");
  if (rarity === "A" && progress > 0.78) {
    ctx.fillStyle = "#68b96d";
    ctx.fillRect(548, 92, 42, 8);
    ctx.fillStyle = "#202024";
    ctx.font = "900 22px sans-serif";
    ctx.fillText("笹うまい", 570, 76);
  }
}

function drawMarchGachaAnimation(progress, rarity) {
  ctx.fillStyle = "#202024";
  ctx.font = "900 28px sans-serif";
  ctx.fillText("一列行進演出", 34, 44);
  ctx.fillStyle = "#c4c8ca";
  ctx.fillRect(0, 330, world.viewportWidth, 74);
  for (let i = 0; i < 11; i += 1) {
    const baseX = -80 + progress * (world.viewportWidth + 220) + i * -64;
    let y = 352;
    if (rarity === "C") y += Math.sin(progress * 12 + i) * 42;
    if (rarity === "B" && i === 5) y += 62;
    drawGachaRedPanda(baseX, y, "walk");
  }
}

function drawSecretGachaAnimation(elapsed) {
  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, world.viewportWidth, world.viewportHeight);
  if (elapsed < SECRET_GACHA_DARK_DURATION) return;

  const floodProgress = clamp((elapsed - SECRET_GACHA_DARK_DURATION) / (SECRET_GACHA_TOTAL_DURATION - SECRET_GACHA_DARK_DURATION), 0, 1);
  for (let y = -20; y < world.viewportHeight + 60; y += 56) {
    for (let x = -20; x < world.viewportWidth + 60; x += 64) {
      const offset = Math.sin((x + y) * 0.03) * 12;
      drawGachaRedPanda(x + offset, y + (1 - floodProgress) * 300, "stare", 0.8);
    }
  }
  ctx.fillStyle = `rgba(255, 255, 255, ${floodProgress})`;
  ctx.font = "900 34px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("レパン最強神王ゴッド", world.viewportWidth / 2, 62);
  ctx.textAlign = "start";
}

function drawGachaRedPanda(x, y, pose = "walk", scale = 1) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  if (pose === "sleep") ctx.rotate(0.25);
  if (pose === "fall") ctx.rotate(1.1);
  ctx.fillStyle = "#b9432f";
  ctx.beginPath();
  ctx.ellipse(0, 0, 34, 18, 0, 0, Math.PI * 2);
  ctx.arc(28, -12, 18, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#f7dfb2";
  ctx.beginPath();
  ctx.arc(28, -12, 11, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#202024";
  ctx.beginPath();
  ctx.arc(23, -15, 2.6, 0, Math.PI * 2);
  ctx.arc(33, -15, 2.6, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#f4d27a";
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(-32, -2);
  ctx.lineTo(-52, 8);
  ctx.stroke();
  if (pose === "sleep") {
    ctx.font = "900 18px sans-serif";
    ctx.fillText("Zzz", 8, -38);
  }
  ctx.restore();
}

function frame(now) {
  const delta = Math.min((now - world.lastTime) / 1000 || 0, 0.033);
  world.lastTime = now;
  recoverLepanPt(now);
  updateGachaAnimation(now);
  updateEffects(now);
  movePlayer(delta);
  updateHumans(delta, now);
  updateAllies(now);
  updateKyunMinions(delta, now);
  drawScene(now);
  window.requestAnimationFrame(frame);
}

window.addEventListener("keydown", (event) => {
  if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Space"].includes(event.code)) {
    event.preventDefault();
  }
  if (world.inputLocked) return;
  if (event.code === "Space") {
    scare();
    return;
  }
  world.keys.add(event.code);
});

window.addEventListener("keyup", (event) => {
  world.keys.delete(event.code);
});

for (const button of document.querySelectorAll("[data-move]")) {
  const map = {
    up: "ArrowUp",
    down: "ArrowDown",
    left: "ArrowLeft",
    right: "ArrowRight",
  };
  const code = map[button.dataset.move];
const press = (event) => {
    event.preventDefault();
    if (world.inputLocked) return;
    world.keys.add(code);
  };
  const release = (event) => {
    event.preventDefault();
    world.keys.delete(code);
  };
  button.addEventListener("pointerdown", press);
  button.addEventListener("pointerup", release);
  button.addEventListener("pointerleave", release);
  button.addEventListener("pointercancel", release);
}

soundToggleButton.addEventListener("click", () => {
  soundState.enabled = !soundState.enabled;
  if (soundState.enabled) {
    ensureAudioContext();
    startTownBgm();
    playSound("gachaB");
  } else {
    stopTownBgm();
  }
  saveSoundSettings();
  updateSoundUi();
});
if (volumeSlider) {
  volumeSlider.addEventListener("input", () => {
    setSoundGroupVolume("se", Number(volumeSlider.value) / 100);
    if (soundState.enabled) ensureAudioContext();
  });
}
bgmVolumeSlider.addEventListener("input", () => {
  setSoundGroupVolume("bgm", Number(bgmVolumeSlider.value) / 100);
  if (soundState.enabled) ensureAudioContext();
});
seVolumeSlider.addEventListener("input", () => {
  setSoundGroupVolume("se", Number(seVolumeSlider.value) / 100);
  if (soundState.enabled) ensureAudioContext();
});
developerModeButton.addEventListener("click", () => setDeveloperMode(!world.developerMode));
window.addEventListener("pointerdown", ensureAudioContext, { once: true });
window.addEventListener("keydown", ensureAudioContext, { once: true });
window.addEventListener("pagehide", shutdownAudioSystem);
window.addEventListener("beforeunload", shutdownAudioSystem);

scareButton.addEventListener("click", () => {
  playSound("buttonScare");
  scare();
});
levelRewardButton.addEventListener("click", () => {
  playSound("menuOpen");
  setModalOpen(levelRewardModal, true);
});
skillButton.addEventListener("click", () => {
  playSound("menuOpen");
  setModalOpen(skillModal, true);
});
gachaButton.addEventListener("click", () => {
  playSound("gachaOpen");
  setModalOpen(gachaModal, true);
});
skinButton.addEventListener("click", () => {
  playSound("skinOpen");
  setModalOpen(skinModal, true);
});
adButton.addEventListener("click", () => {
  playSound("menuOpen");
  showMessage("広告機能はまだ開発中です");
});
shopButton.addEventListener("click", () => {
  playSound("menuOpen");
  showMessage("課金機能はまだ開発中です");
});
settingsButton.addEventListener("click", () => {
  playSound("settingsOpen");
  setModalOpen(settingsModal, true);
});
rollGachaButton.addEventListener("click", rollGacha);
skipGachaButton.addEventListener("click", skipGachaAnimation);
clearSkinChoice.addEventListener("click", () => chooseClearReward("skin"));
clearSkillChoice.addEventListener("click", () => chooseClearReward("skill"));
clearRollButton.addEventListener("click", rollClearReward);
for (const closer of document.querySelectorAll("[data-close-modal]")) {
  closer.addEventListener("click", closeAllModals);
}

window.addEventListener("keydown", (event) => {
  if (event.code === "Escape") closeAllModals();
});

randomizeInitialHumans(performance.now());

updateDeveloperModeUi();
updateSoundUi();
if (soundState.enabled) {
  window.setTimeout(ensureAudioContext, 0);
}
updateHud();
window.requestAnimationFrame(frame);

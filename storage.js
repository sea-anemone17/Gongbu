const STORAGE_KEY = "hazel_study_rpg_data_v2";

const defaultData = {
  currentExplorerId: null,
  explorers: []
};

function deepCopy(value) {
  return JSON.parse(JSON.stringify(value));
}

function loadAppData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return deepCopy(defaultData);

    const parsed = JSON.parse(raw);
    const data = {
      ...deepCopy(defaultData),
      ...parsed
    };

    if (!Array.isArray(data.explorers)) {
      data.explorers = [];
    }

    data.explorers = data.explorers.map(normalizeExplorer);

    if (
      data.currentExplorerId &&
      !data.explorers.some(exp => exp.id === data.currentExplorerId)
    ) {
      data.currentExplorerId = data.explorers[0]?.id || null;
    }

    return data;
  } catch (error) {
    return deepCopy(defaultData);
  }
}

function saveAppData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function makeId(prefix = "id") {
  return `${prefix}_${Date.now()}_${Math.floor(Math.random() * 100000)}`;
}

function defaultGrowth() {
  return {
    이해력: 10,
    구조화력: 10,
    적용력: 10,
    복구력: 10,
    지속력: 10
  };
}

function defaultTimer() {
  return {
    remainingSeconds: 0,
    isRunning: false
  };
}

function createExplorer(name, alias = "", theme = "") {
  return normalizeExplorer({
    id: makeId("explorer"),
    name,
    alias,
    theme,
    subjects: [],
    quests: [],
    logs: [],
    microLogs: [],
    reviews: [],
    titles: [],
    growth: defaultGrowth(),
    timer: defaultTimer()
  });
}

function createSubject(name) {
  return {
    id: makeId("subject"),
    name,
    stats: defaultGrowth()
  };
}

function normalizeExplorer(explorer) {
  return {
    id: explorer.id || makeId("explorer"),
    name: explorer.name || "이름 없는 탐사자",
    alias: explorer.alias || "",
    theme: explorer.theme || "",
    subjects: Array.isArray(explorer.subjects) ? explorer.subjects : [],
    quests: Array.isArray(explorer.quests) ? explorer.quests : [],
    logs: Array.isArray(explorer.logs) ? explorer.logs : [],
    microLogs: Array.isArray(explorer.microLogs) ? explorer.microLogs : [],
    reviews: Array.isArray(explorer.reviews) ? explorer.reviews : [],
    titles: Array.isArray(explorer.titles) ? explorer.titles : [],
    growth: {
      ...defaultGrowth(),
      ...(explorer.growth || {})
    },
    timer: {
      ...defaultTimer(),
      ...(explorer.timer || {})
    }
  };
}

function getCurrentExplorer(data) {
  return data.explorers.find(exp => exp.id === data.currentExplorerId) || null;
}

function clampGrowthValue(value) {
  if (value < 0) return 0;
  if (value > 100) return 100;
  return value;
}

function clampExplorerGrowth(explorer) {
  Object.keys(explorer.growth).forEach(key => {
    explorer.growth[key] = clampGrowthValue(explorer.growth[key]);
  });

  explorer.subjects.forEach(subject => {
    Object.keys(subject.stats).forEach(key => {
      subject.stats[key] = clampGrowthValue(subject.stats[key]);
    });
  });
}

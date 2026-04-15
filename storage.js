const STORAGE_KEY = "hazel_study_rpg_data_v1";

const defaultData = {
  currentExplorerId: null,
  explorers: []
};

function loadAppData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return structuredClone(defaultData);
    const parsed = JSON.parse(raw);
    return {
      ...structuredClone(defaultData),
      ...parsed
    };
  } catch (error) {
    return structuredClone(defaultData);
  }
}

function saveAppData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function makeId(prefix = "id") {
  return `${prefix}_${Date.now()}_${Math.floor(Math.random() * 100000)}`;
}

function getCurrentExplorer(data) {
  return data.explorers.find(exp => exp.id === data.currentExplorerId) || null;
}

function createExplorer(name, alias = "", theme = "") {
  return {
    id: makeId("explorer"),
    name,
    alias,
    theme,
    subjects: [],
    quests: [],
    logs: [],
    growth: {
      이해력: 10,
      구조화력: 10,
      적용력: 10,
      복구력: 10,
      지속력: 10
    },
    titles: [],
    timer: {
      remainingSeconds: 0,
      isRunning: false
    }
  };
}

function createSubject(name) {
  return {
    id: makeId("subject"),
    name,
    stats: {
      이해력: 10,
      구조화력: 10,
      적용력: 10,
      복구력: 10,
      지속력: 10
    }
  };
}

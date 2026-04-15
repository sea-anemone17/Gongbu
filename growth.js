// 성장치 기본값
function createDefaultGrowth() {
  return {
    이해력: 0,
    적용력: 0,
    구조화력: 0,
    복구력: 0,
    지속력: 0
  };
}

// 안전 보정 (음수 방지 등)
function clampExplorerGrowth(explorer) {
  for (const key in explorer.growth) {
    if (explorer.growth[key] < 0) explorer.growth[key] = 0;
  }
}

// 퀘스트 완료 시 성장 반영
function applyQuestGrowth(explorer, quest) {
  if (!explorer.growth) {
    explorer.growth = createDefaultGrowth();
  }

  const difficultyWeight = {
    낮음: 1,
    보통: 2,
    높음: 3
  };

  const weight = difficultyWeight[quest.difficulty] || 1;

  switch (quest.type) {
    case "탐사":
      explorer.growth.이해력 += 1 * weight;
      break;

    case "해석":
      explorer.growth.이해력 += 2 * weight;
      explorer.growth.적용력 += 1 * weight;
      break;

    case "판정":
      explorer.growth.적용력 += 2 * weight;
      explorer.growth.구조화력 += 1 * weight;
      break;

    case "복구":
      explorer.growth.복구력 += 2 * weight;
      explorer.growth.구조화력 += 1 * weight;
      break;

    case "회상":
      explorer.growth.이해력 += 1 * weight;
      explorer.growth.구조화력 += 2 * weight;
      break;
  }

  clampExplorerGrowth(explorer);
}

// ⭐ 타이머 전용 성장 (완전히 분리)
function applyTimerGrowth(explorer, minutes) {
  if (!explorer.growth) {
    explorer.growth = createDefaultGrowth();
  }

  // 시간 기준 보상 (너무 크지 않게 설계)
  const gain = Math.max(1, Math.floor(minutes / 5));

  explorer.growth.지속력 += gain;

  clampExplorerGrowth(explorer);
}

// 성장 UI 렌더링
function renderGrowth() {
  const data = loadAppData();
  const current = getCurrentExplorer(data);
  const container = document.getElementById("growthBox");

  if (!container) return;

  if (!current) {
    container.innerHTML = `<div class="empty">탐사자를 선택하세요</div>`;
    return;
  }

  if (!current.growth) {
    current.growth = createDefaultGrowth();
  }

  const growth = current.growth;

  const maxValue = 100; // 임시 기준 (나중에 레벨 시스템 붙일 수 있음)

  container.innerHTML = `
    <div class="growth-grid">
      ${renderGrowthCard("이해력", growth.이해력, maxValue)}
      ${renderGrowthCard("적용력", growth.적용력, maxValue)}
      ${renderGrowthCard("구조화력", growth.구조화력, maxValue)}
      ${renderGrowthCard("복구력", growth.복구력, maxValue)}
      ${renderGrowthCard("지속력", growth.지속력, maxValue)}
    </div>
  `;
}

// 카드 UI
function renderGrowthCard(name, value, max) {
  const percent = Math.min(100, (value / max) * 100);

  return `
    <div class="growth-card">
      <div class="growth-name">${name}</div>
      <div class="growth-value">${value}</div>
      <div class="bar">
        <div class="bar-fill" style="width: ${percent}%"></div>
      </div>
    </div>
  `;
}

// 칭호 해금
function getUnlockedTitles(explorer) {
  const g = explorer.growth || {};

  const titles = [];

  if ((g.이해력 || 0) >= 10) titles.push("개념 추적자");
  if ((g.적용력 || 0) >= 10) titles.push("문제 해석자");
  if ((g.구조화력 || 0) >= 10) titles.push("판정 안정자");
  if ((g.복구력 || 0) >= 10) titles.push("오류 복원자");
  if ((g.지속력 || 0) >= 10) titles.push("끈기의 항해자");

  if (Object.values(g).reduce((a, b) => a + b, 0) >= 50) {
    titles.push("구조를 이해한 자");
  }

  return titles;
}
// ====== 임시 렌더 함수 (에러 방지용) ======

function renderLogs() {
  const data = loadAppData();
  const current = getCurrentExplorer(data);
  const container = document.getElementById("logList");

  if (!container) return;

  if (!current || current.logs.length === 0) {
    container.innerHTML = `<div class="empty">아직 로그가 없습니다.</div>`;
    return;
  }

  container.innerHTML = current.logs.map(log => `
    <div class="item">
      <div class="item-title">${log.questTitle}</div>
      <div class="muted">${log.date}</div>
      <div>${log.resultRank}</div>
      <div>${log.selfExplanation || ""}</div>
      <div>${log.reflection || ""}</div>
    </div>
  `).join("");
}

function renderReviewList() {
  const container = document.getElementById("reviewList");
  if (!container) return;
  container.innerHTML = `<div class="empty">복습 기능 준비 중</div>`;
}

function renderFailureStats() {
  const container = document.getElementById("failureStats");
  if (!container) return;
  container.innerHTML = `<div class="empty">통계 준비 중</div>`;
}

function renderMicro() {
  const container = document.getElementById("microList");
  if (!container) return;
  container.innerHTML = `<div class="empty">응급 기록 준비 중</div>`;
}

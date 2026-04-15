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

// 안전 보정
function clampExplorerGrowth(explorer) {
  if (!explorer.growth) {
    explorer.growth = createDefaultGrowth();
  }

  for (const key in explorer.growth) {
    if (explorer.growth[key] < 0) explorer.growth[key] = 0;
    if (explorer.growth[key] > 100) explorer.growth[key] = 100;
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

// 타이머 전용 성장
function applyTimerGrowth(explorer, minutes) {
  if (!explorer.growth) {
    explorer.growth = createDefaultGrowth();
  }

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
  const maxValue = 100;

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

function renderGrowthCard(name, value, max) {
  const safeValue = typeof value === "number" ? value : 0;
  const percent = Math.min(100, (safeValue / max) * 100);

  return `
    <div class="growth-card">
      <div class="growth-name">${name}</div>
      <div class="growth-value">${safeValue}</div>
      <div class="bar">
        <div class="bar-fill" style="width: ${percent}%"></div>
      </div>
    </div>
  `;
}

// 칭호
function getUnlockedTitles(explorer) {
  const g = explorer.growth || {};
  const titles = [];

  if ((g.이해력 || 0) >= 10) titles.push("개념 추적자");
  if ((g.적용력 || 0) >= 10) titles.push("문제 해석자");
  if ((g.구조화력 || 0) >= 10) titles.push("판정 안정자");
  if ((g.복구력 || 0) >= 10) titles.push("오류 복원자");
  if ((g.지속력 || 0) >= 10) titles.push("끈기의 항해자");

  if (Object.values(g).reduce((a, b) => a + (b || 0), 0) >= 50) {
    titles.push("구조를 이해한 자");
  }

  return titles;
}

function renderTitles() {
  const data = loadAppData();
  const current = getCurrentExplorer(data);

  const currentTitles = document.getElementById("currentTitles");
  const titleList = document.getElementById("titleList");

  if (!current) {
    if (currentTitles) currentTitles.innerHTML = `<span class="badge">탐사자 없음</span>`;
    if (titleList) titleList.innerHTML = `<div class="empty">먼저 탐사자를 선택해 주세요.</div>`;
    return;
  }

  const titles = getUnlockedTitles(current);

  if (currentTitles) {
    currentTitles.innerHTML = titles.length
      ? titles.map(title => `<span class="badge">${title}</span>`).join("")
      : `<span class="badge">아직 없음</span>`;
  }

  if (titleList) {
    titleList.innerHTML = titles.length
      ? titles.map(title => `
          <div class="item">
            <div class="item-title">🏅 ${title}</div>
            <div class="muted">누적 기록과 성장치에 따라 해금된 칭호입니다.</div>
          </div>
        `).join("")
      : `<div class="empty">아직 해금된 칭호가 없습니다.</div>`;
  }
}

// 로그북
function renderLogs() {
  const data = loadAppData();
  const current = getCurrentExplorer(data);
  const container = document.getElementById("logList");

  if (!container) return;

  if (!current || !current.logs || current.logs.length === 0) {
    container.innerHTML = `<div class="empty">아직 로그가 없습니다.</div>`;
    return;
  }

  container.innerHTML = current.logs.map(log => `
    <div class="item">
      <div class="item-title">${log.questTitle}</div>
      <div class="muted">${log.subjectName || "과목 없음"} / ${log.questType || ""} / ${log.difficulty || ""}</div>
      <div class="muted">${log.date || ""}</div>
      <div>${log.resultRank || ""}</div>
      <div>${log.selfExplanation ? `자기설명: ${log.selfExplanation}` : ""}</div>
      <div>${log.reflection ? `메모: ${log.reflection}` : ""}</div>
      <div>${log.blockReason ? `원인: ${log.blockReason}` : ""}</div>
    </div>
  `).join("");
}

// 복습 예약
function renderReviewList() {
  const data = loadAppData();
  const current = getCurrentExplorer(data);
  const container = document.getElementById("reviewList");

  if (!container) return;

  if (!current || !current.reviews || current.reviews.length === 0) {
    container.innerHTML = `<div class="empty">아직 예약된 복습이 없습니다.</div>`;
    return;
  }

  const pendingReviews = current.reviews
    .filter(review => review.status === "pending")
    .sort((a, b) => a.reviewDate.localeCompare(b.reviewDate));

  if (pendingReviews.length === 0) {
    container.innerHTML = `<div class="empty">아직 예약된 복습이 없습니다.</div>`;
    return;
  }

  container.innerHTML = pendingReviews.map(review => `
    <div class="item">
      <div class="item-title">${review.title}</div>
      <div class="muted">${review.subjectName || "과목 없음"} / ${review.reviewType || "회상"}</div>
      <div class="muted">복습일: ${review.reviewDate}</div>
      <div class="button-row" style="margin-top:10px;">
        <button class="main-btn" onclick="completeReview('${review.id}')">회상 완료</button>
      </div>
    </div>
  `).join("");
}

// 실패 유형 통계
function renderFailureStats() {
  const data = loadAppData();
  const current = getCurrentExplorer(data);
  const container = document.getElementById("failureStats");

  if (!container) return;

  if (!current || !current.logs || current.logs.length === 0) {
    container.innerHTML = `<div class="empty">아직 통계가 없습니다.</div>`;
    return;
  }

  const counts = {};

  current.logs.forEach(log => {
    if (!log.blockReason) return;
    counts[log.blockReason] = (counts[log.blockReason] || 0) + 1;
  });

  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);

  if (sorted.length === 0) {
    container.innerHTML = `<div class="empty">아직 통계가 없습니다.</div>`;
    return;
  }

  container.innerHTML = sorted.map(([reason, count]) => `
    <div class="item">
      <div class="item-title">${reason}</div>
      <div class="muted">누적 ${count}회</div>
    </div>
  `).join("");
}

// 응급 기록
function renderMicro() {
  const data = loadAppData();
  const current = getCurrentExplorer(data);
  const container = document.getElementById("microList");

  if (!container) return;

  if (!current || !current.microLogs || current.microLogs.length === 0) {
    container.innerHTML = `<div class="empty">아직 응급 퀘스트 기록이 없습니다.</div>`;
    return;
  }

  container.innerHTML = current.microLogs.map(log => `
    <div class="item">
      <div class="item-title">${log.name || "응급 기록"}</div>
      <div class="muted">${log.date || ""}</div>
    </div>
  `).join("");
}

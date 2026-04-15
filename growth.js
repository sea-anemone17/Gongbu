function renderGrowth() {
  const data = loadAppData();
  const current = getCurrentExplorer(data);
  const growthBox = document.getElementById("growthBox");

  if (!growthBox) return;

  if (!current) {
    growthBox.innerHTML = `<div class="empty">먼저 탐사자를 선택해 주세요.</div>`;
    return;
  }

  const g = current.growth;

  growthBox.innerHTML = `
    <div class="growth-grid">
      ${renderGrowthCard("이해력", g.이해력)}
      ${renderGrowthCard("구조화력", g.구조화력)}
      ${renderGrowthCard("적용력", g.적용력)}
      ${renderGrowthCard("복구력", g.복구력)}
      ${renderGrowthCard("지속력", g.지속력)}
    </div>
  `;
}

function renderGrowthCard(name, value) {
  return `
    <div class="growth-card">
      <div class="growth-name">${name}</div>
      <div class="growth-value">${value}</div>
      <div class="bar">
        <div class="bar-fill" style="width:${value}%;"></div>
      </div>
    </div>
  `;
}

function applyGrowth(current, resultRank, questType, subjectId, blockReason = "") {
  if (resultRank === "🌟 대성공") {
    current.growth.이해력 += 2;
    current.growth.적용력 += 2;
    current.growth.지속력 += 1;
  } else if (resultRank === "✅ 성공") {
    current.growth.이해력 += 1;
    current.growth.지속력 += 1;
  } else if (resultRank === "☑️ 부분 성공") {
    current.growth.구조화력 += 1;
  } else if (resultRank === "❌ 실패") {
    current.growth.복구력 += 2;
  } else if (resultRank === "💥 대실패") {
    current.growth.복구력 += 3;
  }

  if (questType === "탐사") current.growth.이해력 += 1;
  if (questType === "해석") current.growth.구조화력 += 1;
  if (questType === "판정") current.growth.적용력 += 1;
  if (questType === "복구") current.growth.복구력 += 1;

  if (blockReason === "설명 가능해짐") current.growth.구조화력 += 2;
  if (blockReason === "오답 복구 성공") current.growth.복구력 += 2;
  if (blockReason === "자동화 부족") current.growth.지속력 += 1;
  if (blockReason === "개념 이해가 깊어짐") current.growth.이해력 += 2;
  if (blockReason === "적용이 불안정함") current.growth.적용력 += 1;

  const subject = current.subjects.find(s => s.id === subjectId);
  if (subject) {
    if (questType === "탐사") subject.stats.이해력 += 1;
    if (questType === "해석") subject.stats.구조화력 += 1;
    if (questType === "판정") subject.stats.적용력 += 1;
    if (questType === "복구") subject.stats.복구력 += 1;

    if (resultRank === "🌟 대성공") {
      subject.stats.이해력 += 1;
      subject.stats.적용력 += 1;
    }
    if (resultRank === "💥 대실패") {
      subject.stats.복구력 += 1;
    }
  }

  clampExplorerGrowth(current);
  current.titles = getUnlockedTitles(current);
}

function getUnlockedTitles(current) {
  const titles = [];
  const totalLogs = current.logs.length;
  const successCount = current.logs.filter(log => log.resultRank === "🌟 대성공").length;
  const failCount = current.logs.filter(
    log => log.resultRank === "❌ 실패" || log.resultRank === "💥 대실패"
  ).length;
  const recoverCount = current.logs.filter(
    log => log.blockReason === "오답 복구 성공"
  ).length;

  if (totalLogs >= 1) titles.push("첫 기록자");
  if (totalLogs >= 5) titles.push("학습 탐사자");
  if (totalLogs >= 10) titles.push("로그 축적자");
  if (successCount >= 3) titles.push("정밀 해석자");
  if (recoverCount >= 3) titles.push("개념 복원가");
  if (failCount >= 3) titles.push("복구 생존자");

  if (current.growth.이해력 >= 30) titles.push("의미 추적자");
  if (current.growth.구조화력 >= 30) titles.push("구조 설계자");
  if (current.growth.적용력 >= 30) titles.push("판정 실행자");
  if (current.growth.복구력 >= 30) titles.push("회수 전문가");
  if (current.growth.지속력 >= 30) titles.push("끈질긴 항해사");

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

function renderLogs() {
  const data = loadAppData();
  const current = getCurrentExplorer(data);
  const logList = document.getElementById("logList");

  if (!logList) return;

  if (!current) {
    logList.innerHTML = `<div class="empty">먼저 탐사자를 선택해 주세요.</div>`;
    return;
  }

  if (current.logs.length === 0) {
    logList.innerHTML = `<div class="empty">아직 로그가 없습니다.</div>`;
    return;
  }

  logList.innerHTML = current.logs.map(log => `
    <div class="item">
      <div class="item-title">${log.resultRank} ${log.questTitle}</div>
      <div class="muted">
        ${log.subjectName} / ${log.questType} / ${log.difficulty}
      </div>
      <div class="muted">원인: ${log.blockReason || "기록 없음"}</div>
      <div class="muted">메모: ${log.reflection || "없음"}</div>
      <div class="muted">${log.date}</div>
    </div>
  `).join("");
}

function renderMicro() {
  const data = loadAppData();
  const current = getCurrentExplorer(data);
  const microList = document.getElementById("microList");

  if (!microList) return;

  if (!current) {
    microList.innerHTML = `<div class="empty">먼저 탐사자를 선택해 주세요.</div>`;
    return;
  }

  if (current.microLogs.length === 0) {
    microList.innerHTML = `<div class="empty">아직 응급 퀘스트 기록이 없습니다.</div>`;
    return;
  }

  microList.innerHTML = current.microLogs.map(item => `
    <div class="item">
      <div class="item-title">🫧 ${item.name}</div>
      <div class="muted">${item.date}</div>
    </div>
  `).join("");
}

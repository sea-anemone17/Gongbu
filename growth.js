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
    <div class="growth-card">이해력: ${g.이해력}</div>
    <div class="growth-card">구조화력: ${g.구조화력}</div>
    <div class="growth-card">적용력: ${g.적용력}</div>
    <div class="growth-card">복구력: ${g.복구력}</div>
    <div class="growth-card">지속력: ${g.지속력}</div>
  `;
}

function applyGrowth(current, resultRank, questType, subjectId) {
  if (resultRank === "🌟 대성공") {
    current.growth.이해력 += 2;
    current.growth.적용력 += 2;
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

  const subject = current.subjects.find(s => s.id === subjectId);
  if (subject) {
    if (questType === "탐사") subject.stats.이해력 += 1;
    if (questType === "해석") subject.stats.구조화력 += 1;
    if (questType === "판정") subject.stats.적용력 += 1;
    if (questType === "복구") subject.stats.복구력 += 1;
  }
}

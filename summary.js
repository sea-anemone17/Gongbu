function getTodayDateString() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}. ${month}. ${day}.`;
}

function getTodaySummaryMessage(stats) {
  const messages = [];

  if (stats.totalCount >= 5) {
    messages.push("최고의 가나디 🫳🫳🫳 오늘 진짜 많이 해냈어요.");
  } else if (stats.totalCount >= 3) {
    messages.push("좋은 가나디 ✨ 오늘 분명히 전진했습니다.");
  } else if (stats.totalCount >= 1) {
    messages.push("기특한 가나디 🌙 기록이 남았다는 건 0이 아니라는 뜻이에요.");
  } else {
    messages.push("아직 오늘의 기록은 없지만, 5분으로도 시작할 수 있어요.");
  }

  if (stats.questCount >= 1) {
    messages.push("퀘스트를 완료했다는 건 구조를 실제로 움직였다는 뜻입니다.");
  }

  if (stats.reviewCount >= 1) {
    messages.push("복습을 했다는 건 단기 이해를 장기 기억으로 옮기고 있다는 뜻이에요.");
  }

  if (stats.timerCount >= 1) {
    messages.push("타이머를 끝낸 건 의지보다 시스템이 작동했다는 증거예요.");
  }

  return messages[0];
}

function renderTodaySummary() {
  const container = document.getElementById("todaySummary");
  if (!container) return;

  const data = loadAppData();
  const current = getCurrentExplorer(data);

  if (!current) {
    container.innerHTML = `<div class="empty">먼저 탐사자를 선택해 주세요.</div>`;
    return;
  }

  const todayPrefix = getTodayDateString();

  const logs = Array.isArray(current.logs) ? current.logs : [];

  const todayLogs = logs.filter(log => {
    return typeof log.date === "string" && log.date.startsWith(todayPrefix);
  });

  const questLogs = todayLogs.filter(log => log.questType && log.questType !== "회상" && log.questType !== "타이머");
  const reviewLogs = todayLogs.filter(log => log.questType === "회상");
  const timerLogs = todayLogs.filter(log => log.questType === "타이머");

  const stats = {
    totalCount: todayLogs.length,
    questCount: questLogs.length,
    reviewCount: reviewLogs.length,
    timerCount: timerLogs.length
  };

  const cheerMessage = getTodaySummaryMessage(stats);

  if (todayLogs.length === 0) {
    container.innerHTML = `
      <div class="item">
        <div class="item-title">오늘의 요약</div>
        <div class="muted">아직 오늘의 기록이 없습니다.</div>
        <div class="muted">하지만 시작은 아주 작아도 됩니다. 5분 타이머도 충분해요.</div>
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <div class="item">
      <div class="item-title">오늘의 기록 요약</div>
      <div class="muted">완료한 기록: ${stats.totalCount}개</div>
      <div class="muted">퀘스트 완료: ${stats.questCount}개</div>
      <div class="muted">복습/회상 완료: ${stats.reviewCount}개</div>
      <div class="muted">타이머 완료: ${stats.timerCount}개</div>
    </div>

    <div class="item">
      <div class="item-title">오늘의 해석</div>
      <div class="muted">${cheerMessage}</div>
    </div>
  `;
}

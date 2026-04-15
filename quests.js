function renderQuestList() {
  const data = loadAppData();
  const current = getCurrentExplorer(data);
  const questList = document.getElementById("questList");

  if (!questList) return;

  if (!current) {
    questList.innerHTML = `<div class="empty">먼저 탐사자를 선택해 주세요.</div>`;
    return;
  }

  if (current.quests.length === 0) {
    questList.innerHTML = `<div class="empty">아직 퀘스트가 없습니다.</div>`;
    return;
  }

  questList.innerHTML = current.quests.map(quest => `
    <div class="item">
      <div class="item-title">${quest.title}</div>
      <div class="badge-wrap" style="margin-bottom:8px;">
        <span class="badge">${quest.subjectName}</span>
        <span class="badge">${quest.type}</span>
        <span class="badge">${quest.difficulty}</span>
      </div>
      <div class="muted">${quest.memo || "메모 없음"}</div>
      <div class="button-row" style="margin-top:10px;">
        <button class="main-btn" onclick="completeQuest('${quest.id}')">완료 기록</button>
        <button class="danger-btn" onclick="deleteQuest('${quest.id}')">삭제</button>
      </div>
    </div>
  `).join("");
}

function renderQuestSelect() {
  const data = loadAppData();
  const current = getCurrentExplorer(data);
  const questSelect = document.getElementById("questSelect");

  if (!questSelect) return;

  if (!current || current.quests.length === 0) {
    questSelect.innerHTML = `<option value="">퀘스트를 선택하세요</option>`;
    return;
  }

  questSelect.innerHTML =
    `<option value="">퀘스트를 선택하세요</option>` +
    current.quests.map(quest => `
      <option value="${quest.id}">${quest.title}</option>
    `).join("");
}

function addQuest() {
  const data = loadAppData();
  const current = getCurrentExplorer(data);

  if (!current) {
    alert("먼저 탐사자를 선택해 주세요.");
    return;
  }

  const title = document.getElementById("questTitle")?.value.trim();
  const subjectId = document.getElementById("subjectSelect")?.value;
  const type = document.getElementById("questType")?.value;
  const difficulty = document.getElementById("questDifficulty")?.value;
  const memo = document.getElementById("questMemo")?.value.trim() || "";

  if (!title) {
    alert("퀘스트 이름을 입력해 주세요.");
    return;
  }

  if (!subjectId) {
    alert("과목을 선택해 주세요.");
    return;
  }

  const subject = current.subjects.find(s => s.id === subjectId);
  if (!subject) {
    alert("과목을 찾을 수 없습니다.");
    return;
  }

  current.quests.unshift({
    id: makeId("quest"),
    title,
    subjectId,
    subjectName: subject.name,
    type,
    difficulty,
    memo
  });

  saveAppData(data);

  document.getElementById("questTitle").value = "";
  document.getElementById("questMemo").value = "";

  renderAll();
}

function deleteQuest(questId) {
  const data = loadAppData();
  const current = getCurrentExplorer(data);
  if (!current) return;

  const quest = current.quests.find(q => q.id === questId);
  if (!quest) return;

  if (!confirm(`${quest.title} 퀘스트를 삭제할까요?`)) return;

  current.quests = current.quests.filter(q => q.id !== questId);
  saveAppData(data);
  renderAll();
}

function getTodayDateKey() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

function addDaysToDateKey(baseDateKey, days) {
  const date = new Date(baseDateKey);
  date.setDate(date.getDate() + days);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function createReviewSchedule(current, quest, sourceLogId) {
  const today = getTodayDateKey();
  const reviewDays = [1, 3, 7];

  reviewDays.forEach(days => {
    current.reviews.push({
      id: makeId("review"),
      sourceQuestId: quest.id,
      sourceLogId,
      title: `${quest.title} 복습`,
      subjectId: quest.subjectId,
      subjectName: quest.subjectName,
      reviewType: "회상",
      reviewDate: addDaysToDateKey(today, days),
      status: "pending"
    });
  });
}

function completeQuest(questId) {
  const data = loadAppData();
  const current = getCurrentExplorer(data);
  if (!current) return;

  const quest = current.quests.find(q => q.id === questId);
  if (!quest) return;

  if (!current.growth) {
    current.growth = createDefaultGrowth();
  }

  const resultMap = {
    "1": "🌟 대성공",
    "2": "✅ 성공",
    "3": "☑️ 부분 성공",
    "4": "❌ 실패",
    "5": "💥 대실패"
  };

  const resultInput = prompt(
    "판정 결과를 입력하세요:\n1. 대성공\n2. 성공\n3. 부분 성공\n4. 실패\n5. 대실패",
    "2"
  );
  if (resultInput === null) return;

  const resultRank = resultMap[resultInput];
  if (!resultRank) {
    alert("1~5 중 하나를 입력해 주세요.");
    return;
  }

  const blockReason = prompt("막힘 원인", "개념 이해") || "";
  const selfExplanation = prompt("자기설명", "") || "";
  const reflection = prompt("메모", "") || "";

  const newLog = {
    id: makeId("log"),
    date: new Date().toLocaleString(),
    questTitle: quest.title,
    subjectId: quest.subjectId,
    subjectName: quest.subjectName,
    questType: quest.type,
    difficulty: quest.difficulty,
    resultRank,
    blockReason,
    selfExplanation,
    reflection
  };

  current.logs.unshift(newLog);
  if (current.logs.length > 30) current.logs.pop();

  createReviewSchedule(current, quest, newLog.id);

  applyQuestGrowth(current, quest);

  // ✅ 완료한 퀘스트는 목록에서 제거
  current.quests = current.quests.filter(q => q.id !== questId);

  saveAppData(data);
  renderAll();
}

function completeReview(reviewId) {
  const data = loadAppData();
  const current = getCurrentExplorer(data);
  if (!current) return;

  const review = current.reviews.find(r => r.id === reviewId);
  if (!review) return;

  if (!current.growth) {
    current.growth = createDefaultGrowth();
  }

  const resultMap = {
    "1": "🌟 대성공",
    "2": "✅ 성공",
    "3": "☑️ 부분 성공",
    "4": "❌ 실패",
    "5": "💥 대실패"
  };

  const resultInput = prompt(
    "회상 퀘스트 결과를 입력하세요:\n1. 대성공\n2. 성공\n3. 부분 성공\n4. 실패\n5. 대실패",
    "2"
  );
  if (resultInput === null) return;

  const resultRank = resultMap[resultInput];
  if (!resultRank) {
    alert("1~5 중 하나를 입력해 주세요.");
    return;
  }

  const blockReason = prompt("막힘 원인", "") || "";
  const selfExplanation = prompt("자기설명", "") || "";
  const reflection = prompt("메모", "") || "";

  current.logs.unshift({
    id: makeId("log"),
    date: new Date().toLocaleString(),
    questTitle: review.title,
    subjectId: review.subjectId,
    subjectName: review.subjectName,
    questType: "회상",
    difficulty: "복습",
    resultRank,
    blockReason,
    selfExplanation,
    reflection
  });

  if (current.logs.length > 30) current.logs.pop();

  applyQuestGrowth(current, { type: "회상", difficulty: "보통" });

  // ✅ 완료한 복습은 pending에서 제거
  current.reviews = current.reviews.filter(r => r.id !== reviewId);

  saveAppData(data);
  renderAll();
}

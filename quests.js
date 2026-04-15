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
      <div class="muted">${quest.subjectName} / ${quest.type} / ${quest.difficulty}</div>
      <div class="muted">${quest.memo || "메모 없음"}</div>
      <div class="button-row" style="margin-top:10px;">
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

  const title = document.getElementById("questTitle").value.trim();
  const subjectId = document.getElementById("subjectSelect").value;
  const type = document.getElementById("questType").value;
  const difficulty = document.getElementById("questDifficulty").value;
  const memo = document.getElementById("questMemo").value.trim();

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

  current.quests = current.quests.filter(q => q.id !== questId);
  saveAppData(data);
  renderAll();
}

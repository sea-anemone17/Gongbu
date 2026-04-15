function renderSubjectList() {
  const data = loadAppData();
  const current = getCurrentExplorer(data);
  const subjectList = document.getElementById("subjectList");
  const subjectSelect = document.getElementById("subjectSelect");

  if (!subjectList || !subjectSelect) return;

  if (!current) {
    subjectList.innerHTML = `<div class="empty">먼저 탐사자를 선택해 주세요.</div>`;
    subjectSelect.innerHTML = `<option value="">과목을 선택하세요</option>`;
    return;
  }

  if (current.subjects.length === 0) {
    subjectList.innerHTML = `<div class="empty">아직 과목이 없습니다.</div>`;
    subjectSelect.innerHTML = `<option value="">과목을 선택하세요</option>`;
    return;
  }

  subjectSelect.innerHTML =
    `<option value="">과목을 선택하세요</option>` +
    current.subjects.map(subject => `
      <option value="${subject.id}">${subject.name}</option>
    `).join("");

  subjectList.innerHTML = current.subjects.map(subject => `
    <div class="item">
      <div class="item-title">${subject.name}</div>
      <div class="muted">
        이해력 ${subject.stats.이해력} /
        구조화력 ${subject.stats.구조화력} /
        적용력 ${subject.stats.적용력} /
        복구력 ${subject.stats.복구력} /
        지속력 ${subject.stats.지속력}
      </div>
      <div class="button-row" style="margin-top:10px;">
        <button class="danger-btn" onclick="deleteSubject('${subject.id}')">삭제</button>
      </div>
    </div>
  `).join("");
}

function addSubject() {
  const input = document.getElementById("subjectName");
  const name = input?.value.trim();

  if (!name) {
    alert("과목 이름을 입력해 주세요.");
    return;
  }

  const data = loadAppData();
  const current = getCurrentExplorer(data);

  if (!current) {
    alert("먼저 탐사자를 선택해 주세요.");
    return;
  }

  const alreadyExists = current.subjects.some(
    subject => subject.name.trim().toLowerCase() === name.toLowerCase()
  );

  if (alreadyExists) {
    alert("같은 이름의 과목이 이미 있습니다.");
    return;
  }

  current.subjects.push(createSubject(name));
  saveAppData(data);

  if (input) input.value = "";
  renderAll();
}

function deleteSubject(subjectId) {
  const data = loadAppData();
  const current = getCurrentExplorer(data);

  if (!current) return;

  const target = current.subjects.find(subject => subject.id === subjectId);
  if (!target) return;

  const ok = confirm(`${target.name} 과목을 삭제할까요?`);
  if (!ok) return;

  current.subjects = current.subjects.filter(subject => subject.id !== subjectId);
  current.quests = current.quests.filter(quest => quest.subjectId !== subjectId);
  current.reviews = current.reviews.filter(review => review.subjectId !== subjectId);

  saveAppData(data);
  renderAll();
}

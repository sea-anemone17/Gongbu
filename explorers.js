function renderExplorerList() {
  const data = loadAppData();
  const explorerList = document.getElementById("explorerList");
  const explorerSelect = document.getElementById("explorerSelect");

  if (!explorerList || !explorerSelect) return;

  if (data.explorers.length === 0) {
    explorerList.innerHTML = `<div class="empty">아직 탐사자가 없습니다.</div>`;
    explorerSelect.innerHTML = `<option value="">탐사자를 선택하세요</option>`;
    return;
  }

  explorerSelect.innerHTML =
    `<option value="">탐사자를 선택하세요</option>` +
    data.explorers.map(exp => `
      <option value="${exp.id}" ${data.currentExplorerId === exp.id ? "selected" : ""}>
        ${exp.name}
      </option>
    `).join("");

  explorerList.innerHTML = data.explorers.map(exp => `
    <div class="item">
      <div class="item-title">${exp.name}</div>
      <div class="muted">
        ${exp.alias || "별칭 없음"}${exp.theme ? ` / ${exp.theme}` : ""}
      </div>
      <div class="button-row" style="margin-top:10px;">
        <button class="sub-btn" onclick="selectExplorer('${exp.id}')">선택</button>
        <button class="danger-btn" onclick="deleteExplorer('${exp.id}')">삭제</button>
      </div>
    </div>
  `).join("");
}

function addExplorer() {
  const nameInput = document.getElementById("explorerName");
  const aliasInput = document.getElementById("explorerAlias");
  const themeInput = document.getElementById("explorerTheme");

  const name = nameInput?.value.trim();
  const alias = aliasInput?.value.trim() || "";
  const theme = themeInput?.value.trim() || "";

  if (!name) {
    alert("탐사자 이름을 입력해 주세요.");
    return;
  }

  const data = loadAppData();
  const explorer = createExplorer(name, alias, theme);

  data.explorers.unshift(explorer);
  data.currentExplorerId = explorer.id;

  saveAppData(data);

  if (nameInput) nameInput.value = "";
  if (aliasInput) aliasInput.value = "";
  if (themeInput) themeInput.value = "";

  renderAll();
}

function selectExplorer(explorerId) {
  const data = loadAppData();
  data.currentExplorerId = explorerId;
  saveAppData(data);
  renderAll();
}

function deleteExplorer(explorerId) {
  const data = loadAppData();
  const explorer = data.explorers.find(exp => exp.id === explorerId);
  if (!explorer) return;

  const ok = confirm(`${explorer.name} 탐사자를 삭제할까요?`);
  if (!ok) return;

  data.explorers = data.explorers.filter(exp => exp.id !== explorerId);

  if (data.currentExplorerId === explorerId) {
    data.currentExplorerId = data.explorers[0]?.id || null;
  }

  saveAppData(data);
  renderAll();
}

function renderCharacter() {
  const data = loadAppData();
  const current = getCurrentExplorer(data);

  const preview = document.getElementById("characterPreview");
  const currentTitles = document.getElementById("currentTitles");

  if (!current) {
    if (preview) preview.innerHTML = "아직 선택된 탐사자가 없습니다.";
    if (currentTitles) currentTitles.innerHTML = `<span class="badge">아직 없음</span>`;
    return;
  }

  if (preview) {
    preview.innerHTML = `
      이름: ${current.name}<br>
      별칭: ${current.alias || "없음"}<br>
      테마: ${current.theme || "없음"}
    `;
  }
}

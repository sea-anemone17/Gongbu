function renderSafe(fn) {
  if (typeof fn === "function") {
    fn();
  }
}

function renderAll() {
  renderSafe(renderExplorerList);
  renderSafe(renderCharacter);
  renderSafe(renderSubjectList);
  renderSafe(renderQuestList);
  renderSafe(renderQuestSelect);
  renderSafe(renderGrowth);
  renderSafe(renderTimer);
  renderSafe(renderLogs);
  renderSafe(renderTitles);
  renderSafe(renderMicro);
  renderSafe(renderReviewList);
  renderSafe(renderFailureStats);
  renderSafe(renderTodaySummary);
}

function bindEvents() {
  document.getElementById("addExplorerButton")?.addEventListener("click", addExplorer);

  document.getElementById("explorerSelect")?.addEventListener("change", function () {
    if (this.value) {
      selectExplorer(this.value);
    }
  });

  document.getElementById("addSubjectButton")?.addEventListener("click", addSubject);
  document.getElementById("addQuestButton")?.addEventListener("click", addQuest);

  document.getElementById("startTimerButton")?.addEventListener("click", startTimer);
  document.getElementById("stopTimerButton")?.addEventListener("click", stopTimer);
  document.getElementById("resetTimerButton")?.addEventListener("click", resetTimer);
}

function initApp() {
  bindEvents();
  renderAll();
}

document.addEventListener("DOMContentLoaded", initApp);

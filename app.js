function renderAll() {
  renderExplorerList();
  renderSubjectList();
  renderQuestList();
  renderQuestSelect();
  renderGrowth();
  renderTimer();
}

function bindEvents() {
  document.getElementById("addExplorerButton")?.addEventListener("click", addExplorer);
  document.getElementById("explorerSelect")?.addEventListener("change", function () {
    if (this.value) selectExplorer(this.value);
  });

  document.getElementById("addSubjectButton")?.addEventListener("click", addSubject);
  document.getElementById("addQuestButton")?.addEventListener("click", addQuest);

  document.getElementById("startTimerButton")?.addEventListener("click", startTimer);
  document.getElementById("stopTimerButton")?.addEventListener("click", stopTimer);
  document.getElementById("resetTimerButton")?.addEventListener("click", resetTimer);
}

document.addEventListener("DOMContentLoaded", () => {
  bindEvents();
  renderAll();
});

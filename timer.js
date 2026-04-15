let timerInterval = null;
let remainingSeconds = 0;

const praiseMessages = [
  "복복복… 최고의 가나디 🫳🫳🫳",
  "탐사 완료! 오늘도 정말 잘 버텼어요 ✨",
  "좋아요. 지금 이건 단순 수행이 아니라 접속 성공입니다 🌙",
  "아주 잘하셨어요. 오늘의 항해는 분명히 전진했습니다.",
  "최고예요. 오늘의 집중은 분명히 흔적을 남겼습니다 📖",
  "정말 잘했어요. 구조가 조금 더 단단해졌습니다 💫"
];

function renderTimer() {
  const data = loadAppData();
  const current = getCurrentExplorer(data);
  const timerDisplay = document.getElementById("timerDisplay");

  if (!timerDisplay) return;

  if (current && typeof current.timer?.remainingSeconds === "number") {
    remainingSeconds = current.timer.remainingSeconds;
  }

  const min = String(Math.floor(remainingSeconds / 60)).padStart(2, "0");
  const sec = String(remainingSeconds % 60).padStart(2, "0");
  timerDisplay.textContent = `${min}:${sec}`;
}

function getRandomPraise() {
  return praiseMessages[Math.floor(Math.random() * praiseMessages.length)];
}

function playTimerFinishEffect(message) {
  const timerPanel = document.getElementById("timerPanel");
  const timerPraise = document.getElementById("timerPraise");
  const overlay = document.getElementById("celebrationOverlay");

  if (timerPanel) {
    timerPanel.classList.remove("timer-finished");
    void timerPanel.offsetWidth;
    timerPanel.classList.add("timer-finished");
  }

  if (timerPraise) {
    timerPraise.textContent = message;
    timerPraise.classList.remove("praise-burst", "gold-text");
    void timerPraise.offsetWidth;
    timerPraise.classList.add("praise-burst", "gold-text");
  }

  if (overlay) {
    overlay.innerHTML = "";

    for (let i = 0; i < 22; i++) {
      const sparkle = document.createElement("div");
      sparkle.className = "sparkle";
      sparkle.style.left = `${Math.random() * 100}%`;
      sparkle.style.top = `${55 + Math.random() * 25}%`;
      sparkle.style.animationDelay = `${Math.random() * 0.25}s`;
      sparkle.style.animationDuration = `${0.9 + Math.random() * 0.8}s`;
      overlay.appendChild(sparkle);
    }

    setTimeout(() => {
      overlay.innerHTML = "";
    }, 1800);
  }
}

function syncTimerToCurrentExplorer() {
  const data = loadAppData();
  const current = getCurrentExplorer(data);
  if (!current) return;

  current.timer.remainingSeconds = remainingSeconds;
  current.timer.isRunning = !!timerInterval;
  saveAppData(data);
}

function grantTimerReward() {
  const data = loadAppData();
  const current = getCurrentExplorer(data);
  if (!current) return;

  current.growth.지속력 += 2;
  clampExplorerGrowth(current);

  current.logs.unshift({
    id: makeId("timerlog"),
    date: new Date().toLocaleString(),
    questTitle: "타이머 완료",
    subjectId: null,
    subjectName: "집중",
    questType: "타이머",
    difficulty: "보통",
    resultRank: "⏳ 완료",
    blockReason: "집중 시간 완료",
    selfExplanation: "",
    reflection: "타이머를 끝까지 유지했다"
  });

  if (current.logs.length > 30) {
    current.logs.pop();
  }

  current.microLogs.unshift({
    id: makeId("micro"),
    name: "타이머 완료",
    date: new Date().toLocaleString()
  });

  if (current.microLogs.length > 10) {
    current.microLogs.pop();
  }

  current.titles = getUnlockedTitles(current);
  saveAppData(data);
}

function startTimer() {
  const minutesInput = document.getElementById("timerMinutes");
  const value = parseInt(minutesInput?.value);

  if (isNaN(value) || value <= 0) {
    alert("타이머 시간을 분 단위로 입력해 주세요.");
    return;
  }

  if (timerInterval) clearInterval(timerInterval);

  remainingSeconds = value * 60;
  syncTimerToCurrentExplorer();
  renderTimer();

  const praise = document.getElementById("timerPraise");
  if (praise) {
    praise.textContent = "";
    praise.classList.remove("praise-burst", "gold-text");
  }

  timerInterval = setInterval(() => {
    remainingSeconds--;
    syncTimerToCurrentExplorer();
    renderTimer();

    if (remainingSeconds <= 0) {
      clearInterval(timerInterval);
      timerInterval = null;
      remainingSeconds = 0;
      syncTimerToCurrentExplorer();
      renderTimer();

      grantTimerReward();

      const msg = getRandomPraise();
      playTimerFinishEffect(msg);
      renderAll();
    }
  }, 1000);
}

function stopTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
  syncTimerToCurrentExplorer();
}

function resetTimer() {
  stopTimer();
  remainingSeconds = 0;
  syncTimerToCurrentExplorer();
  renderTimer();

  const timerPraise = document.getElementById("timerPraise");
  const timerPanel = document.getElementById("timerPanel");
  const overlay = document.getElementById("celebrationOverlay");

  if (timerPraise) {
    timerPraise.textContent = "";
    timerPraise.classList.remove("praise-burst", "gold-text");
  }

  if (timerPanel) {
    timerPanel.classList.remove("timer-finished");
  }

  if (overlay) {
    overlay.innerHTML = "";
  }
}

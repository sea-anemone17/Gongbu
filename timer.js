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
  const timerDisplay = document.getElementById("timerDisplay");
  if (!timerDisplay) return;

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

function startTimer() {
  const minutesInput = document.getElementById("timerMinutes");
  const value = parseInt(minutesInput.value);

  if (isNaN(value) || value <= 0) {
    alert("타이머 시간을 분 단위로 입력해 주세요.");
    return;
  }

  if (timerInterval) clearInterval(timerInterval);

  remainingSeconds = value * 60;
  renderTimer();

  const praise = document.getElementById("timerPraise");
  if (praise) {
    praise.textContent = "";
    praise.classList.remove("praise-burst", "gold-text");
  }

  timerInterval = setInterval(() => {
    remainingSeconds--;
    renderTimer();

    if (remainingSeconds <= 0) {
      clearInterval(timerInterval);
      timerInterval = null;
      remainingSeconds = 0;
      renderTimer();

      const msg = getRandomPraise();
      playTimerFinishEffect(msg);
    }
  }, 1000);
}

function stopTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}

function resetTimer() {
  stopTimer();
  remainingSeconds = 0;
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

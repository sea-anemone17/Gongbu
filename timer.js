let timerInterval = null;
let remainingSeconds = 0;

const praiseMessages = [
  "복복복… 최고의 가나디 🫳🫳🫳",
  "탐사 완료! 오늘도 정말 잘 버텼어요 ✨",
  "좋아요. 지금 이건 단순 수행이 아니라 접속 성공입니다 🌙",
  "아주 잘하셨어요. 오늘의 항해는 분명히 전진했습니다."
];

function renderTimer() {
  const timerDisplay = document.getElementById("timerDisplay");
  if (!timerDisplay) return;

  const min = String(Math.floor(remainingSeconds / 60)).padStart(2, "0");
  const sec = String(remainingSeconds % 60).padStart(2, "0");
  timerDisplay.textContent = `${min}:${sec}`;
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

  timerInterval = setInterval(() => {
    remainingSeconds--;
    renderTimer();

    if (remainingSeconds <= 0) {
      clearInterval(timerInterval);
      timerInterval = null;
      remainingSeconds = 0;
      renderTimer();

      const msg = praiseMessages[Math.floor(Math.random() * praiseMessages.length)];
      document.getElementById("timerPraise").textContent = msg;
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
  document.getElementById("timerPraise").textContent = "";
}

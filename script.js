const form = document.getElementById('rsvpForm');
const steps = [...document.querySelectorAll('.step')];
const progressDots = [...document.querySelectorAll('.progress-dot')];
const progressLines = [...document.querySelectorAll('.progress-line')];
const success = document.getElementById('success');
const reviewName = document.getElementById('reviewName');
const nameInput = document.getElementById('name');
let currentStep = 0;

function updateProgress() {
  progressDots.forEach((dot, i) => {
    dot.classList.toggle('active', i === Math.min(currentStep, 2));
    dot.classList.toggle('done', i < currentStep);
  });
  progressLines.forEach((line, i) => line.classList.toggle('done', i < currentStep));
}

function showStep(index, direction = 1) {
  currentStep = Math.max(0, Math.min(index, steps.length - 1));
  steps.forEach((step, i) => {
    step.classList.toggle('active', i === currentStep);
    step.setAttribute('aria-hidden', i === currentStep ? 'false' : 'true');
    if (i === currentStep) {
      step.style.animation = 'none';
      void step.offsetWidth;
      step.style.animation = direction >= 0 ? 'stepIn .45s ease both' : 'stepIn .45s ease both';
    }
  });
  updateProgress();

  const backButton = document.querySelector('.step-nav .back-btn');
  if (backButton) backButton.style.visibility = currentStep > 0 && currentStep < 3 ? 'visible' : 'hidden';
}

function goNext() {
  if (currentStep === 0) {
    if (!nameInput.value.trim()) {
      nameInput.focus();
      nameInput.animate([{transform:'translateX(-5px)'},{transform:'translateX(5px)'},{transform:'translateX(0)'}], {duration:220});
      return;
    }
    reviewName.textContent = nameInput.value.trim();
  }
  showStep(currentStep + 1, 1);
}

document.querySelectorAll('[data-next]').forEach(btn => btn.addEventListener('click', goNext));

document.querySelectorAll('[data-back]').forEach(btn => btn.addEventListener('click', () => {
  if (currentStep > 0) showStep(currentStep - 1, -1);
}));

// Answering a multiple-choice question automatically moves to the next question.
form.querySelectorAll('input[type="radio"]').forEach(input => {
  input.addEventListener('change', () => {
    setTimeout(() => showStep(currentStep + 1, 1), 260);
  });
});

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const submitButton = form.querySelector('.submit-btn');
  submitButton.disabled = true;
  submitButton.textContent = 'Sending…';

  try {
    const response = await fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { 'Accept': 'application/json' }
    });
    if (!response.ok) throw new Error('Submission failed');
    form.hidden = true;
    success.hidden = false;
  } catch (error) {
    submitButton.disabled = false;
    submitButton.innerHTML = 'Send my RSVP <span>→</span>';
    alert('Something went wrong while sending your RSVP. Please try again.');
  }
});

// Countdown
const weddingDate = new Date('2026-10-23T16:00:00+03:00').getTime();
function updateCountdown() {
  const diff = weddingDate - Date.now();
  const values = {
    days: Math.max(0, Math.floor(diff / 86400000)),
    hours: Math.max(0, Math.floor(diff / 3600000) % 24),
    minutes: Math.max(0, Math.floor(diff / 60000) % 60),
    seconds: Math.max(0, Math.floor(diff / 1000) % 60)
  };
  Object.entries(values).forEach(([key, value]) => {
    document.getElementById(key).textContent = String(value).padStart(2, '0');
  });
}
updateCountdown();
setInterval(updateCountdown, 1000);
showStep(0);

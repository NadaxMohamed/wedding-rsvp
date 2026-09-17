const weddingDate = new Date("2026-10-23T16:00:00+03:00");

function updateCountdown() {
  const now = new Date();
  let diff = weddingDate - now;
  if (diff < 0) diff = 0;

  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);

  document.getElementById("days").textContent = days;
  document.getElementById("hours").textContent = String(hours).padStart(2, "0");
  document.getElementById("minutes").textContent = String(minutes).padStart(2, "0");
  document.getElementById("seconds").textContent = String(seconds).padStart(2, "0");
}

updateCountdown();
setInterval(updateCountdown, 1000);

const form = document.getElementById("rsvpForm");
const success = document.getElementById("success");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (form.action.includes("YOUR_FORM_ID")) {
    alert("The RSVP form is designed and ready. To receive responses, connect this form to Formspree or Google Forms first.");
    return;
  }

  const button = form.querySelector("button");
  button.disabled = true;
  button.textContent = "Sending…";

  try {
    const response = await fetch(form.action, {
      method: "POST",
      body: new FormData(form),
      headers: { "Accept": "application/json" }
    });

    if (!response.ok) throw new Error("Submission failed");

    form.hidden = true;
    success.hidden = false;
  } catch {
    alert("Something went wrong while sending your RSVP. Please try again.");
    button.disabled = false;
    button.innerHTML = 'Send my RSVP <span>→</span>';
  }
});

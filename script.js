const weddingDate = new Date('2026-10-23T16:00:00+03:00');
const $ = (s) => document.querySelector(s);

function updateCountdown(){
  const diff = Math.max(0, weddingDate - new Date());
  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  $('#days').textContent = String(days).padStart(2,'0');
  $('#hours').textContent = String(hours).padStart(2,'0');
  $('#minutes').textContent = String(minutes).padStart(2,'0');
  $('#seconds').textContent = String(seconds).padStart(2,'0');
}
updateCountdown();
setInterval(updateCountdown,1000);

const form = $('#rsvpForm');
const steps = [...document.querySelectorAll('.step')];
const dots = [...document.querySelectorAll('.dot')];
let current = 0;

function showStep(index){
  current = Math.max(0, Math.min(index, steps.length - 1));
  steps.forEach((step,i)=>{
    const active = i === current;
    step.classList.toggle('active',active);
    step.setAttribute('aria-hidden',String(!active));
  });
  dots.forEach((dot,i)=>dot.classList.toggle('active',i===current));
  if(current === 3) $('#reviewName').textContent = $('#name').value.trim();
  const focusTarget = steps[current].querySelector('input:not([type=radio]), button');
  if(focusTarget) setTimeout(()=>focusTarget.focus(),120);
}

document.querySelector('[data-next]').addEventListener('click',()=>{
  const name = $('#name').value.trim();
  if(!name){ $('#name').focus(); $('#name').classList.add('shake'); setTimeout(()=>$('#name').classList.remove('shake'),450); return; }
  showStep(1);
});

document.querySelectorAll('[data-back]').forEach(btn=>btn.addEventListener('click',()=>showStep(current-1)));

document.querySelectorAll('input[type=radio]').forEach(radio=>{
  radio.addEventListener('change',()=>{
    const next = radio.name === 'attendance' ? 2 : 3;
    setTimeout(()=>showStep(next),260);
  });
});

form.addEventListener('submit',async(e)=>{
  e.preventDefault();
  const submit = form.querySelector('.step[data-step="4"] .primary');
  submit.disabled = true;
  submit.textContent = 'Sending…';
  try{
    const response = await fetch(form.action,{method:'POST',body:new FormData(form),headers:{Accept:'application/json'}});
    if(!response.ok) throw new Error('Submission failed');
    form.hidden = true;
    $('#success').hidden = false;
  }catch(err){
    submit.disabled = false;
    submit.innerHTML = 'Send my RSVP <span>→</span>';
    alert('We could not send your RSVP right now. Please try again.');
  }
});

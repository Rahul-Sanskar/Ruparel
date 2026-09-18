/* RUPAREL ARIANA — main.js */

/* Welcome Modal */
function openWelcomeModal() { document.getElementById('welcomeModal').classList.add('active'); document.body.style.overflow = 'hidden'; }
function closeWelcomeModal() { document.getElementById('welcomeModal').classList.remove('active'); document.body.style.overflow = ''; }
document.getElementById('welcomeModal').addEventListener('click', function(e) { if (e.target === this) closeWelcomeModal(); });
window.addEventListener('load', function() { setTimeout(openWelcomeModal, 1500); });

/* Mobile Menu */
function toggleMobileMenu() { document.getElementById('mobileMenu').classList.toggle('open'); }
function closeMobileMenu() { document.getElementById('mobileMenu').classList.remove('open'); }
document.addEventListener('click', function(e) {
  const m = document.getElementById('mobileMenu');
  const h = document.querySelector('.nav-hamburger');
  if (m && h && m.classList.contains('open') && !m.contains(e.target) && !h.contains(e.target)) m.classList.remove('open');
});

/* Modal */
function openModal() { document.getElementById('modal').classList.add('active'); document.body.style.overflow = 'hidden'; }
function closeModal() { document.getElementById('modal').classList.remove('active'); document.body.style.overflow = ''; }
document.getElementById('modal').addEventListener('click', function(e) { if (e.target === this) closeModal(); });
document.addEventListener('keydown', function(e) { if (e.key === 'Escape') { closeModal(); closeLightbox(); closeWelcomeModal(); } });

/* Snackbar */
function showSnackbar(msg) {
  const s = document.getElementById('snackbar');
  s.textContent = msg; s.classList.add('show');
  setTimeout(() => s.classList.remove('show'), 3500);
}

/* Phone Validation */
function validatePhone(p) { return /^[6-9]\d{9}$/.test(p.replace(/\s/g, '')); }

/* ================================================
   FORM SUBMIT
   ================================================ */
async function handleSubmit(formId, isModal = false, closeFn = closeModal) {
  const form      = document.getElementById(formId);
  const submitBtn = form.querySelector('button[type="submit"]');
  const name      = form.querySelector('[name="name"]');
  const phone     = form.querySelector('[name="phone"]');
  const consent   = form.querySelector('[name="consent"]');

  if (!name.value.trim()) { showSnackbar('Please enter your name.'); name.focus(); return; }
  if (!validatePhone(phone.value)) { showSnackbar('Please enter a valid 10-digit mobile number.'); phone.focus(); return; }
  if (consent && !consent.checked) { showSnackbar('Please agree to be contacted.'); return; }

  submitBtn.disabled      = true;
  submitBtn.textContent   = 'Submitting...';
  submitBtn.style.opacity = '0.6';
  submitBtn.style.cursor  = 'not-allowed';

  try {
    const formData = new FormData(form);
    formData.set('form_submit', '1');

    const response = await fetch(window.location.href, { method: 'POST', body: formData });
    const data     = await response.json();

    if (data.success) {
      showSnackbar('Thank you! Our team will contact you shortly.');
      form.reset();
      submitBtn.disabled      = false;
      submitBtn.textContent   = 'Submit Enquiry →';
      submitBtn.style.opacity = '1';
      submitBtn.style.cursor  = 'pointer';
      if (isModal) setTimeout(closeFn, 1200);
    } else {
      showSnackbar(data.message || 'Something went wrong. Please try again.');
      submitBtn.disabled      = false;
      submitBtn.textContent   = 'Submit Enquiry →';
      submitBtn.style.opacity = '1';
      submitBtn.style.cursor  = 'pointer';
    }
  } catch (err) {
    showSnackbar('Something went wrong. Please try again.');
    submitBtn.disabled      = false;
    submitBtn.textContent   = 'Submit Enquiry →';
    submitBtn.style.opacity = '1';
    submitBtn.style.cursor  = 'pointer';
  }
}

/* Gallery Tabs */
document.querySelectorAll('.g-tab').forEach(tab => {
  tab.addEventListener('click', function() {
    document.querySelectorAll('.g-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.g-panel').forEach(p => p.classList.remove('active'));
    this.classList.add('active');
    document.getElementById(this.dataset.tab).classList.add('active');
  });
});

/* Lightbox */
let lbImages = [], lbIndex = 0, lbMode = 'gallery';
function openLightbox(img, mode = 'gallery') {
  lbMode = mode;
  if (mode === 'gallery') {
    const panel = img.closest('.g-panel');
    lbImages = Array.from(panel.querySelectorAll('.g-item img'));
  } else {
    lbImages = Array.from(document.querySelectorAll('.plan-card img'));
  }
  lbIndex = lbImages.indexOf(img);
  showLbImage();
  document.getElementById('lightbox').classList.add('active');
  document.body.style.overflow = 'hidden';
}
function showLbImage() {
  const img = lbImages[lbIndex];
  document.getElementById('lightboxImg').src = img.src;
  const cap = img.closest('.g-item, .plan-card')?.querySelector('.g-caption, .plan-label');
  document.getElementById('lightboxCaption').textContent = cap ? cap.textContent : '';
}
function closeLightbox() { document.getElementById('lightbox').classList.remove('active'); document.body.style.overflow = ''; }
function lbNext() { lbIndex = (lbIndex + 1) % lbImages.length; showLbImage(); }
function lbPrev() { lbIndex = (lbIndex - 1 + lbImages.length) % lbImages.length; showLbImage(); }

document.querySelectorAll('.g-item img').forEach(img => img.addEventListener('click', () => openLightbox(img, 'gallery')));
document.querySelectorAll('.plan-card img').forEach(img => img.addEventListener('click', () => openLightbox(img, 'plan')));
document.getElementById('lightbox').addEventListener('click', function(e) { if (e.target === this) closeLightbox(); });
document.addEventListener('keydown', function(e) {
  if (!document.getElementById('lightbox').classList.contains('active')) return;
  if (e.key === 'ArrowRight') lbNext();
  if (e.key === 'ArrowLeft') lbPrev();
});

/* Smooth scroll */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', function(e) {
    const t = document.querySelector(this.getAttribute('href'));
    if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  });
});
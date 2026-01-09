// Mobile nav toggle
const navToggle = document.getElementById("navToggle");
const nav = document.getElementById("primaryNav");

if (navToggle && nav) {
  navToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  // Close menu when clicking a link (mobile)
  nav.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => {
      nav.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });
}

// Contact form: lightweight validation + fake submit
const form = document.getElementById("contactForm");
const note = document.getElementById("formNote");

function setNote(msg) {
  if (!note) return;
  note.textContent = msg;
}
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || "").trim());
}

if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = form.querySelector("#name")?.value?.trim();
    const email = form.querySelector("#email")?.value?.trim();
    const details = form.querySelector("#details")?.value?.trim();

    if (!name || !email || !details) {
      setNote("Please fill in all fields.");
      return;
    }
    if (!isValidEmail(email)) {
      setNote("Please enter a valid email.");
      return;
    }

    setNote("Message ready. Connect a backend to actually send it (template demo).");
    console.log("CONTACT_FORM_SUBMIT", { name, email, details });
    form.reset();
  });
}

/* ============================
   Gallery Lightbox (v2)
============================ */
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");
const lightboxCaption = document.getElementById("lightboxCaption");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

const galleryButtons = Array.from(document.querySelectorAll(".gallery-item"));
let currentIndex = -1;

function openLightbox(index) {
  const btn = galleryButtons[index];
  if (!btn || !lightbox || !lightboxImg) return;

  currentIndex = index;
  const full = btn.getAttribute("data-full") || "";
  const alt = btn.getAttribute("data-alt") || btn.querySelector("img")?.alt || "";

  lightboxImg.src = full;
  lightboxImg.alt = alt;
  if (lightboxCaption) lightboxCaption.textContent = alt;

  lightbox.classList.add("open");
  lightbox.setAttribute("aria-hidden", "false");

  // Focus close button for accessibility
  const closeBtn = lightbox.querySelector("[data-close='true']");
  closeBtn?.focus?.();

  // Prevent background scroll
  document.documentElement.style.overflow = "hidden";
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  if (!lightbox || !lightboxImg) return;

  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");

  // Reset image to stop memory usage
  lightboxImg.src = "";
  lightboxImg.alt = "";
  if (lightboxCaption) lightboxCaption.textContent = "";

  document.documentElement.style.overflow = "";
  document.body.style.overflow = "";

  // Return focus to last opened thumbnail
  if (currentIndex >= 0) galleryButtons[currentIndex]?.focus?.();
}

function showNext(delta) {
  if (galleryButtons.length === 0) return;
  const next = (currentIndex + delta + galleryButtons.length) % galleryButtons.length;
  openLightbox(next);
}

// Click handlers
galleryButtons.forEach((btn, i) => {
  btn.addEventListener("click", () => openLightbox(i));
});

// Close on backdrop / close button
if (lightbox) {
  lightbox.addEventListener("click", (e) => {
    const target = e.target;
    if (!(target instanceof HTMLElement)) return;
    if (target.getAttribute("data-close") === "true") closeLightbox();
  });
}

// Prev/Next
prevBtn?.addEventListener("click", () => showNext(-1));
nextBtn?.addEventListener("click", () => showNext(1));

// Keyboard support
document.addEventListener("keydown", (e) => {
  if (!lightbox || !lightbox.classList.contains("open")) return;

  if (e.key === "Escape") closeLightbox();
  if (e.key === "ArrowLeft") showNext(-1);
  if (e.key === "ArrowRight") showNext(1);
});

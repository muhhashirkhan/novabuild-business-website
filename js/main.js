// NovaBuild site behaviour: mobile nav, cost estimator, WhatsApp contact form.

// Replace with the business WhatsApp number in international format, digits only.
const WHATSAPP_NUMBER = "923000000000";

// Mobile navigation
const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.getElementById("site-nav");

function closeNav() {
  navToggle.setAttribute("aria-expanded", "false");
  siteNav.classList.remove("is-open");
}

navToggle.addEventListener("click", () => {
  const open = navToggle.getAttribute("aria-expanded") === "true";
  navToggle.setAttribute("aria-expanded", String(!open));
  siteNav.classList.toggle("is-open", !open);
});

siteNav.addEventListener("click", (event) => {
  if (event.target.closest("a")) closeNav();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && siteNav.classList.contains("is-open")) {
    closeNav();
    navToggle.focus();
  }
});

// Cost estimator
// Indicative Islamabad figures. Update rates as material prices change.
const PLOTS = {
  "5m": { label: "5 Marla", areaPerFloor: 1000 },
  "7m": { label: "7 Marla", areaPerFloor: 1350 },
  "10m": { label: "10 Marla", areaPerFloor: 1800 },
  "1k": { label: "1 Kanal", areaPerFloor: 3200 },
};

const PACKAGES = {
  grey: { label: "Grey structure", rate: 3900, months: 0.55 },
  standard: { label: "Complete, standard", rate: 7600, months: 1 },
  premium: { label: "Complete, premium", rate: 10800, months: 1.25 },
};

const estimator = document.getElementById("estimator");
const out = {
  area: document.getElementById("est-area"),
  rate: document.getElementById("est-rate"),
  time: document.getElementById("est-time"),
  total: document.getElementById("est-total"),
};

const numberFormat = new Intl.NumberFormat("en-PK");

function formatRupees(value) {
  // Pakistani convention: lakh (100,000) and crore (10,000,000)
  if (value >= 1e7) return `Rs ${(value / 1e7).toFixed(2)} crore`;
  return `Rs ${Math.round(value / 1e5)} lakh`;
}

function updateEstimate() {
  const data = new FormData(estimator);
  const plot = PLOTS[data.get("plot")];
  const floors = Number(data.get("floors"));
  const pkg = PACKAGES[data.get("package")];

  const area = Math.round((plot.areaPerFloor * floors) / 50) * 50;
  const total = area * pkg.rate;
  const low = total * 0.92;
  const high = total * 1.08;
  const months = Math.max(4, Math.round((6 + area / 700) * pkg.months));

  out.area.textContent = `${numberFormat.format(area)} sq ft`;
  out.rate.textContent = `Rs ${numberFormat.format(pkg.rate)}`;
  out.time.textContent = `About ${months} months`;
  out.total.textContent = `${formatRupees(low)} to ${formatRupees(high)}`;

  // Carry the choice into the contact form
  const service = document.getElementById("cf-service");
  service.value = pkg.label === "Grey structure" ? "Grey structure" : "New house";
  const message = document.getElementById("cf-message");
  if (!message.dataset.touched) {
    message.value = `Estimate: ${plot.label}, ${floors === 1 ? "single" : floors === 2 ? "double" : "double + basement"} storey, ${pkg.label.toLowerCase()}.`;
  }
}

estimator.addEventListener("change", updateEstimate);
updateEstimate();

// Contact form: validates, then opens WhatsApp with the details filled in
const form = document.getElementById("contact-form");
const status = document.getElementById("form-status");
document.getElementById("cf-message").addEventListener("input", (event) => {
  event.target.dataset.touched = "true";
});

function setError(input, message) {
  const error = document.getElementById(`${input.id}-error`);
  input.setAttribute("aria-invalid", message ? "true" : "false");
  if (message) input.setAttribute("aria-describedby", error.id);
  else input.removeAttribute("aria-describedby");
  error.textContent = message;
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = form.elements.name;
  const phone = form.elements.phone;
  let firstInvalid = null;

  if (!name.value.trim()) {
    setError(name, "Enter your name so we know who to ask for.");
    firstInvalid = firstInvalid || name;
  } else setError(name, "");

  const digits = phone.value.replace(/\D/g, "");
  if (digits.length < 10) {
    setError(phone, "Enter a phone number with at least 10 digits, for example 0300 1234567.");
    firstInvalid = firstInvalid || phone;
  } else setError(phone, "");

  if (firstInvalid) {
    firstInvalid.focus();
    status.textContent = "";
    return;
  }

  const lines = [
    "Site visit request from the NovaBuild website",
    `Name: ${name.value.trim()}`,
    `Phone: ${phone.value.trim()}`,
    `Plot: ${form.elements.location.value.trim() || "Not given"}`,
    `Service: ${form.elements.service.value}`,
  ];
  const note = form.elements.message.value.trim();
  if (note) lines.push(`Notes: ${note}`);

  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join("\n"))}`;
  window.open(url, "_blank", "noopener");
  status.textContent = "WhatsApp opened in a new tab. Press send there to reach us.";
});

document.getElementById("year").textContent = new Date().getFullYear();

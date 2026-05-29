const checklist = [
  ["Barraca principal", "Lucas", true],
  ["Colchao inflavel", "Voce", true],
  ["Lanternas e pilhas", "Voce", false],
  ["Fogareiro", "Marina", true],
  ["Carvao", "Bia", false],
  ["Repelente", "Grupo", true],
  ["Caixa termica", "Bia", true],
  ["Kit primeiros socorros", "Marina", true],
  ["Rota offline", "Voce", false],
  ["Cadeiras dobraveis", "Lucas", true],
  ["Agua potavel", "Grupo", true],
  ["Sacos de lixo", "Grupo", true],
  ["Playlist baixada", "Voce", true],
  ["Capa de chuva", "Grupo", true],
  ["Cafe da manha", "Marina", true],
];

const photos = [
  {
    title: "Fogueira de sabado",
    image: "https://images.unsplash.com/photo-1478827536114-da961b7f86d2?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Barracas montadas",
    image: "https://images.unsplash.com/photo-1504851149312-7a075b496cc7?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Cafe com vista",
    image: "https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?auto=format&fit=crop&w=900&q=80",
  },
];

const checklistRoot = document.querySelector("#checklist-items");
const progressLabel = document.querySelector("#progress-label");
const packedCount = document.querySelector("#packed-count");
const galleryRoot = document.querySelector("#gallery-grid");
const installButton = document.querySelector("#install-app");
const onboarding = document.querySelector("#onboarding");
const joinForm = document.querySelector("#join-form");
const memberNameInput = document.querySelector("#member-name");
const tripCodeInput = document.querySelector("#trip-code");
const sessionLine = document.querySelector("#session-line");
const inviteCode = document.querySelector("#invite-code");
const deviceAvatar = document.querySelector("#device-avatar");
const deviceName = document.querySelector("#device-name");
const deviceCopy = document.querySelector("#device-copy");
const copyCodeButton = document.querySelector("#copy-code");
const resetDeviceButton = document.querySelector("#reset-device");
const SESSION_KEY = "campinho.session";
let deferredInstallPrompt;

function renderChecklist() {
  checklistRoot.innerHTML = "";
  checklist.forEach(([item, owner, done], index) => {
    const row = document.createElement("article");
    row.className = `check-item ${done ? "done" : ""}`;
    row.innerHTML = `
      <button type="button" aria-label="Alternar ${item}">${done ? "OK" : ""}</button>
      <div>
        <strong>${item}</strong>
        <span>Responsavel: ${owner}</span>
      </div>
      <span class="pill">${done ? "separado" : "falta"}</span>
    `;
    row.querySelector("button").addEventListener("click", () => {
      checklist[index][2] = !checklist[index][2];
      renderChecklist();
    });
    checklistRoot.append(row);
  });

  const doneCount = checklist.filter((item) => item[2]).length;
  progressLabel.textContent = `${doneCount} de ${checklist.length} prontos`;
  packedCount.textContent = doneCount;
}

function renderGallery() {
  galleryRoot.innerHTML = "";
  photos.forEach((photo) => {
    const card = document.createElement("article");
    card.className = "gallery-card";
    card.style.backgroundImage = `url("${photo.image}")`;
    card.innerHTML = `
      <div>
        <h3>${photo.title}</h3>
        <button type="button">curtir</button>
      </div>
    `;
    galleryRoot.append(card);
  });
}

document.querySelectorAll(".nav-item").forEach((button) => {
  button.addEventListener("click", () => {
    showView(button.dataset.view);
    history.replaceState(null, "", `#${button.dataset.view}`);
  });
});

joinForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const session = {
    memberName: memberNameInput.value.trim(),
    tripCode: normalizeCode(tripCodeInput.value),
    deviceId: getDeviceId(),
    joinedAt: new Date().toISOString(),
  };

  if (!session.memberName || !session.tripCode) return;

  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  applySession(session);
});

copyCodeButton.addEventListener("click", async () => {
  const code = inviteCode.textContent.trim();
  if (navigator.clipboard && location.protocol !== "file:") {
    await navigator.clipboard.writeText(code);
  }
  copyCodeButton.textContent = "copiado";
  window.setTimeout(() => {
    copyCodeButton.textContent = "copiar";
  }, 1400);
});

resetDeviceButton.addEventListener("click", () => {
  localStorage.removeItem(SESSION_KEY);
  onboarding.classList.remove("hidden");
  memberNameInput.focus();
});

function showView(viewName) {
  const targetButton = document.querySelector(`[data-view="${viewName}"]`);
  const targetView = document.querySelector(`#${viewName}`);
  if (!targetButton || !targetView) return;

  document.querySelectorAll(".nav-item").forEach((item) => item.classList.remove("active"));
  document.querySelectorAll(".view").forEach((view) => view.classList.remove("active"));
  targetButton.classList.add("active");
  targetView.classList.add("active");
}

document.querySelector("#add-memory").addEventListener("click", () => {
  photos.unshift({
    title: "Nova lembranca",
    image: "https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=900&q=80",
  });
  renderGallery();
  showView("gallery");
  history.replaceState(null, "", "#gallery");
});

window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  deferredInstallPrompt = event;
  installButton.hidden = false;
});

installButton.addEventListener("click", async () => {
  if (!deferredInstallPrompt) return;
  deferredInstallPrompt.prompt();
  await deferredInstallPrompt.userChoice;
  deferredInstallPrompt = null;
  installButton.hidden = true;
});

window.addEventListener("appinstalled", () => {
  deferredInstallPrompt = null;
  installButton.hidden = true;
});

if ("serviceWorker" in navigator && location.protocol !== "file:") {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js");
  });
}

function normalizeCode(value) {
  return value.trim().replace(/\s+/g, "").toUpperCase();
}

function getDeviceId() {
  const existing = localStorage.getItem("campinho.deviceId");
  if (existing) return existing;

  const created = `dev-${Math.random().toString(36).slice(2, 8)}-${Date.now().toString(36)}`;
  localStorage.setItem("campinho.deviceId", created);
  return created;
}

function getInitials(name) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .padEnd(2, "X");
}

function loadSession() {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY));
  } catch {
    return null;
  }
}

function applySession(session) {
  onboarding.classList.add("hidden");
  inviteCode.textContent = session.tripCode;
  sessionLine.textContent = `${session.memberName} conectado em ${session.tripCode}`;
  deviceAvatar.textContent = getInitials(session.memberName);
  deviceName.textContent = session.memberName;
  deviceCopy.textContent = `Aparelho ${session.deviceId.slice(-6)} vinculado a ${session.tripCode}.`;
}

renderChecklist();
renderGallery();
showView(location.hash.replace("#", "") || "dashboard");

const savedSession = loadSession();
if (savedSession && savedSession.memberName && savedSession.tripCode) {
  applySession(savedSession);
} else {
  tripCodeInput.value = "LAGOA24";
}

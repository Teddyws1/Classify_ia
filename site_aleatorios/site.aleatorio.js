// Dados das Atualizações
const updatesData = [
  {
    type: "NOVO",
    color: "#22c55e",
    text: "Adicionado sistema de compartilhamento completo.",
  },
  { type: "UI", color: "#facc15", text: "Novo design para o modo Explorar." },
  { type: "FIX", color: "#3b82f6", text: "Correção no tema escuro." },
];

// Estado Global
let currentTab = "recomendados";
let currentShareData = { name: "", url: "" };

/* =========================================
   2. INICIALIZAÇÃO E RENDERIZAÇÃO
   ========================================= */

document.addEventListener("DOMContentLoaded", () => {
  renderMainCards();
  renderUpdates();
});

// Renderiza Cards Principais
function renderMainCards(filterText = "") {
  const container = document.getElementById("cardsContainer");
  container.innerHTML = "";

  const filteredData = mainCardsData.filter((item) => {
    const matchesTab = item.category === currentTab;
    const matchesSearch =
      item.name.toLowerCase().includes(filterText) ||
      item.desc.toLowerCase().includes(filterText);
    return matchesTab && matchesSearch;
  });

  if (filteredData.length === 0) {
    container.innerHTML =
      '<p style="color:var(--muted); grid-column:1/-1; text-align:center;">Nenhum resultado encontrado.</p>';
    return;
  }

  filteredData.forEach((item) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
            <div class="card-header">
                <img src="${item.img}" onerror="this.src='https://placehold.co/42'" alt="${item.name}">
                <h3>${item.name}</h3>
            </div>
            <p class="card-desc">${item.desc}</p>
            <div class="card-actions">
                <button class="btn-share" onclick="openShareModal('${item.name}', '${item.url}')">
                    <ion-icon name="share-social-outline"></ion-icon>
                </button>
                <a href="${item.url}" target="_blank" class="btn-visit">
                    Visitar <ion-icon name="arrow-redo-outline"></ion-icon>
                </a>
            </div>
        `;
    container.appendChild(card);
  });
}

// Renderiza Sites Aleatórios (Modal)
function renderRandomSites(filterText = "") {
  const grid = document.getElementById("randomGrid");
  grid.innerHTML = "";

  const filtered = randomSitesData.filter((site) =>
    site.name.toLowerCase().includes(filterText),
  );

  filtered.forEach((site) => {
    const div = document.createElement("div");
    div.className = "site-card-item";
    div.innerHTML = `
            <img src="${site.img}" onerror="this.src='https://placehold.co/400x200?text=Sem+Imagem'">
            <div class="site-info">
                <h4>${site.name}</h4>
                <p>${site.desc}</p>
                <a href="${site.url}" target="_blank">Visitar</a>
            </div>
        `;
    grid.appendChild(div);
  });
}

// Renderiza Atualizações
function renderUpdates() {
  const list = document.getElementById("updatesList");
  list.innerHTML = "";
  updatesData.forEach((up) => {
    const li = document.createElement("li");
    li.innerHTML = `
            <strong style="color:${up.color}; background:${up.color}20; padding:2px 6px; border-radius:4px;">${up.type}</strong> 
            ${up.text}
        `;
    list.appendChild(li);
  });
}

/* =========================================
   3. FUNÇÕES DE INTERFACE (UI)
   ========================================= */

// Alternar Tema
function toggleTheme() {
  document.body.classList.toggle("light-mode");
  const icon = document.querySelector("#themeToggle ion-icon");
  icon.setAttribute(
    "name",
    document.body.classList.contains("light-mode")
      ? "moon-outline"
      : "sunny-outline",
  );
}

// Tela Cheia
function toggleFullScreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  } else {
    if (document.exitFullscreen) document.exitFullscreen();
  }
}

// Sidebar
function toggleSidebar() {
  document.getElementById("mainSidebar").classList.add("active");
  document.getElementById("globalOverlay").classList.add("active");
}

// Abas
function switchTab(tabId) {
  currentTab = tabId;

  // Atualiza botões
  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.classList.remove("active");
    if (btn.innerText.toLowerCase() === tabId) btn.classList.add("active");
  });

  // Re-renderiza os cards
  renderMainCards();
}

// Busca Principal
function filterMainCards() {
  const term = document.getElementById("mainSearch").value.toLowerCase();
  renderMainCards(term);
}

// Busca Sites Aleatórios
function filterRandom() {
  const term = document.getElementById("randomSearch").value.toLowerCase();
  renderRandomSites(term);
}

/* =========================================
   4. SISTEMA DE MODAIS
   ========================================= */

function openModal(modalId) {
  closeAllOverlays();
  document.getElementById(modalId).classList.add("active");
  document.getElementById("globalOverlay").classList.add("active");

  if (modalId === "randomSitesModal") renderRandomSites();
}

function closeAllOverlays() {
  document
    .querySelectorAll(".modal-box")
    .forEach((m) => m.classList.remove("active"));
  document.getElementById("mainSidebar").classList.remove("active");
  document.getElementById("globalOverlay").classList.remove("active");
}

/* =========================================
   5. SISTEMA DE COMPARTILHAMENTO
   ========================================= */

function openShareModal(name, url) {
  currentShareData = { name, url };
  document.getElementById("shareText").innerText = `Compartilhar ${name}:`;
  openModal("shareModal");
}

function shareAction(type) {
  const { name, url } = currentShareData;
  const text = `Confira ${name}:`;

  if (type === "whatsapp") {
    window.open(
      `https://api.whatsapp.com/send?text=${encodeURIComponent(text + " " + url)}`,
    );
  } else if (type === "facebook") {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    );
  } else {
    navigator.clipboard.writeText(url).then(() => {
      let msg = "Link copiado!";
      if (type === "instagram") msg = "Link copiado! Cole no Stories.";
      if (type === "tiktok") msg = "Link copiado! Cole no TikTok.";
      showToast(msg);
      closeAllOverlays();
    });
  }
}

/* =========================================
   6. UTILITÁRIOS
   ========================================= */

function showToast(msg) {
  const toast = document.getElementById("toast");
  document.getElementById("toastMsg").innerText = msg;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 3000);
}

//button de volta
function goBack() {
  // Tenta voltar no histórico do navegador
  window.history.back();

  // Opcional: Se não houver histórico (ex: abriu em nova aba), redireciona para a home
  setTimeout(() => {
    window.location.href = "index.html";
  }, 500);
}

//sisteam de bloqueio de zoom
document.addEventListener("DOMContentLoaded", () => {
  // 1. INJEÇÃO DA META TAG (Essencial para Celular)
  // Isso força o navegador a não permitir escala manual
  let meta = document.querySelector('meta[name="viewport"]');
  if (!meta) {
    meta = document.createElement("meta");
    meta.name = "viewport";
    document.head.appendChild(meta);
  }
  meta.content =
    "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no";

  // 2. BLOQUEIA ATALHOS DE TECLADO (Ctrl + / Ctrl -)
  document.addEventListener("keydown", function (event) {
    if (
      (event.ctrlKey || event.metaKey) &&
      (event.key === "+" ||
        event.key === "-" ||
        event.key === "=" ||
        event.key === "0")
    ) {
      event.preventDefault();
    }
  });

  // 3. BLOQUEIA O SCROLL DO MOUSE COM CTRL (Roda do mouse)
  document.addEventListener(
    "wheel",
    function (event) {
      if (event.ctrlKey) {
        event.preventDefault();
      }
    },
    { passive: false },
  ); // 'passive: false' é obrigatório para bloquear o scroll

  // 4. BLOQUEIA PINÇA E GESTOS NO TRACKPAD/MOBILE (Safari/iOS)
  document.addEventListener("gesturestart", function (e) {
    e.preventDefault();
  });

  // Bloqueia duplo toque para zoom em alguns Androids antigos
  let lastTouchEnd = 0;
  document.addEventListener(
    "touchend",
    function (event) {
      const now = new Date().getTime();
      if (now - lastTouchEnd <= 300) {
        event.preventDefault();
      }
      lastTouchEnd = now;
    },
    false,
  );
});

document.addEventListener("keydown", function (e) {
    if (e.ctrlKey && e.shiftKey && e.key === "ArrowUp") {
      e.preventDefault();

      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
          console.error("Erro ao entrar em tela cheia:", err);
        });
      } else {
        document.exitFullscreen();
      }
    }
  });

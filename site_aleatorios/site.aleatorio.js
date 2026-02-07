/* =========================================
   1. DADOS E ESTADO GLOBAL
   ========================================= */

const updatesData = [
  {
    type: "NOVO",
    color: "#22c55e",
    text: "Adicionado sistema de compartilhamento completo.",
  },
  { type: "UI", color: "#facc15", text: "Novo design para o modo Explorar." },
  { type: "FIX", color: "#3b82f6", text: "Correção no tema escuro." },
];

// Define "todos" como padrão para mostrar tudo ao abrir o site
let currentTab = "todos"; 
let currentShareData = { name: "", url: "" };

/* =========================================
   2. INICIALIZAÇÃO E RENDERIZAÇÃO
   ========================================= */

document.addEventListener("DOMContentLoaded", () => {
  renderMainCards();
  renderUpdates();
});

// Renderiza Cards Principais (Com lógica para aba "todos")
function renderMainCards(filterText = "") {
  const container = document.getElementById("cardsContainer");
  if (!container) return;
  
  container.innerHTML = "";

  const filteredData = mainCardsData.filter((item) => {
    // Se a aba for "todos", ignora o filtro de categoria e mostra o item
    const matchesTab = currentTab === "todos" || item.category === currentTab;
    
    const matchesSearch =
      item.name.toLowerCase().includes(filterText) ||
      item.desc.toLowerCase().includes(filterText);
      
    return matchesTab && matchesSearch;
  });

  if (filteredData.length === 0) {
    container.innerHTML = `
      <div class="no-results">
        <ion-icon name="search-outline" class="no-results-icon"></ion-icon>
        <p>Nenhum resultado encontrado.</p>
      </div>
    `;
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

// Renderiza Atualizações
function renderUpdates() {
  const list = document.getElementById("updatesList");
  if (!list) return;
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

function toggleTheme() {
  document.body.classList.toggle("light-mode");
  const icon = document.querySelector("#themeToggle ion-icon");
  if (icon) {
    icon.setAttribute(
      "name",
      document.body.classList.contains("light-mode") ? "moon-outline" : "sunny-outline"
    );
  }
}

function toggleFullScreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  } else {
    if (document.exitFullscreen) document.exitFullscreen();
  }
}

function toggleSidebar() {
  document.getElementById("mainSidebar").classList.add("active");
  document.getElementById("globalOverlay").classList.add("active");
}

function switchTab(tabId) {
  currentTab = tabId;

  // Atualiza estado visual dos botões de aba
  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.classList.remove("active");
    // Verifica se o texto ou um atributo data-tab corresponde ao tabId
    if (btn.innerText.toLowerCase() === tabId || btn.getAttribute('onclick')?.includes(tabId)) {
      btn.classList.add("active");
    }
  });

  renderMainCards();
}

function filterMainCards() {
  const term = document.getElementById("mainSearch").value.toLowerCase();
  renderMainCards(term);
}

/* =========================================
   4. SISTEMA DE MODAIS E COMPARTILHAMENTO
   ========================================= */

function openModal(modalId) {
  closeAllOverlays();
  document.getElementById(modalId).classList.add("active");
  document.getElementById("globalOverlay").classList.add("active");
}

function closeAllOverlays() {
  document.querySelectorAll(".modal-box").forEach((m) => m.classList.remove("active"));
  document.getElementById("mainSidebar").classList.remove("active");
  document.getElementById("globalOverlay").classList.remove("active");
}

function openShareModal(name, url) {
  currentShareData = { name, url };
  const shareTextElem = document.getElementById("shareText");
  if (shareTextElem) shareTextElem.innerText = `Compartilhar ${name}:`;
  openModal("shareModal");
}

function shareAction(type) {
  const { name, url } = currentShareData;
  const text = `Confira ${name}:`;

  if (type === "whatsapp") {
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text + " " + url)}`);
  } else if (type === "facebook") {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`);
  } else {
    navigator.clipboard.writeText(url).then(() => {
      showToast("Link copiado!");
      closeAllOverlays();
    });
  }
}

/* =========================================
   5. UTILITÁRIOS E SEGURANÇA (BLOQUEIO DE ZOOM)
   ========================================= */

function showToast(msg) {
  const toast = document.getElementById("toast");
  const toastMsg = document.getElementById("toastMsg");
  if (toast && toastMsg) {
    toastMsg.innerText = msg;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 3000);
  }
}

function goBack() {
  window.history.back();
  setTimeout(() => { window.location.href = "index.html"; }, 500);
}

// Bloqueios de interface e atalhos
document.addEventListener("DOMContentLoaded", () => {
  let meta = document.querySelector('meta[name="viewport"]');
  if (!meta) {
    meta = document.createElement("meta");
    meta.name = "viewport";
    document.head.appendChild(meta);
  }
  meta.content = "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no";

  document.addEventListener("keydown", (e) => {
    // Atalhos de Zoom
    if ((e.ctrlKey || e.metaKey) && ["+", "-", "=", "0"].includes(e.key)) e.preventDefault();
    
    // Atalho Customizado Tela Cheia (Ctrl+Shift+Seta Cima)
    if (e.ctrlKey && e.shiftKey && e.key === "ArrowUp") {
      e.preventDefault();
      toggleFullScreen();
    }
  });

  document.addEventListener("wheel", (e) => { if (e.ctrlKey) e.preventDefault(); }, { passive: false });
  document.addEventListener("gesturestart", (e) => e.preventDefault());
});

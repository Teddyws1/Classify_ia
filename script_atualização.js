/* ==========================================================================
   CONFIGURAÇÃO DE DADOS (DATABASE)
   ========================================================================== */
const updateLogs = [
  {
    type: "NEW",
    text: "sistema de atalho via teclado (tecla ao clica'ctrl + shift + seta cima' coloca tela cheia)",
    color: "#22c55e",
  },
  {
    type: "NEW",
    text: "e site otimizado para dispositivos móveis",
    color: "#22c55e",
  },
  {
    type: "NEW",
    text: "agora com sistema de tela cheia",
    color: "#22c55e",
  },
  {
    type: "NEW",
    text: "melhorias na interface",
    color: "#22c55e",
  },
  {
    type: "NEW",
    text: "nova ia no top dos melhores",
    color: "#22c55e",
  },
  {
    type: "NEW",
    text: "novas 7 IA adicionadas",
    color: "#00ff4cff",
  },
  {
    type: "FIX",
    text: "Corrigido erro de carregamento no menu mobile.",
    color: "#ef4444",
  },
  //ia novas
   {
    type: "IA",
    text: "nova ia no top dos melhores",
    color: "#22c55e",
  },
  {
    type: "IA",
    text: "novas 7 IA adicionadas",
    color: "#00ff4cff",
  },

  //algumas melhorias ou importantes

    {
    type: "HOT",
    text: "Melhoria de 40% na velocidade de carregamento.",
    color: "#f97316",
  },
  {
    type: "HOT",
    text: "e site otimizado para dispositivos móveis",
    color: "#22c55e",
  },

  //ui interface
    {
    type: "UI",
    text: "melhoria na interface",
    color: "#22c55e",
  },
];

/* ==========================================================================
   GERENCIAMENTO DO MODAL PRINCIPAL (NOTAS)
   ========================================================================== */
function handleUpdateModal(open) {
  const modal = document.getElementById("updateLogOverlay");
  const body = document.body;

  if (open) {
    modal.classList.add("active");
    body.classList.add("no-scroll");
    // Ao abrir, sempre renderiza a aba "Tudo"
    const allTabBtn = document.querySelector(".tab-trigger");
    switchTab("ALL", allTabBtn);
  } else {
    modal.classList.remove("active");
    body.classList.remove("no-scroll");
  }
}

/* ==========================================================================
   SISTEMA DE FILTRO POR ABAS (TABS)
   ========================================================================== */
function switchTab(category, element) {
  const renderTarget = document.getElementById("renderTarget");

  // 1. Atualiza visual dos botões das abas
  document
    .querySelectorAll(".tab-trigger")
    .forEach((btn) => btn.classList.remove("active"));
  if (element) element.classList.add("active");

  // 2. Filtra os dados conforme a categoria
  const filteredData =
    category === "ALL"
      ? updateLogs
      : updateLogs.filter((item) => item.type === category);

  // 3. Limpa e Renderiza a lista com animação
  renderTarget.innerHTML = "";
  if (filteredData.length === 0) {
    renderTarget.innerHTML = `
    <div class="empty-results">
      <ion-icon name="search-outline"></ion-icon>
      <p>Nenhum registro nesta categoria.</p>
    </div>
  `;
    return;
  }

  filteredData.forEach((item, index) => {
    const li = document.createElement("li");
    // Adiciona um pequeno delay de animação para cada item
    li.style.animationDelay = `${index * 0.05}s`;

    li.innerHTML = `
            <div class="tag-head">
                <span class="badge b-${item.type.toLowerCase()}">${item.type}</span>
            </div>
            <p>${item.text}</p>
        `;
    renderTarget.appendChild(li);
  });
}

/* ==========================================================================
   MODAL SECUNDÁRIO (EXPLICAÇÃO DAS TAGS)
   ========================================================================== */
function handleTagsModal(open) {
  const tagsModal = document.getElementById("tagsModalOverlay");

  if (open) {
    tagsModal.classList.add("active");
  } else {
    tagsModal.classList.remove("active");
  }
}

/* ==========================================================================
   FECHAMENTO INTELIGENTE (CLICK FORA E ESC)
   ========================================================================== */
window.addEventListener("click", (event) => {
  const modalNews = document.getElementById("updateLogOverlay");
  const modalTags = document.getElementById("tagsModalOverlay");

  // Se clicar no fundo escuro (overlay), fecha o modal correspondente
  if (event.target === modalNews) handleUpdateModal(false);
  if (event.target === modalTags) handleTagsModal(false);
});

// Fecha modais ao apertar a tecla ESC
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    handleUpdateModal(false);
    handleTagsModal(false);
  }
});

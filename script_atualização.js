/* ==========================================================================
   CONFIGURAÇÃO DE DADOS (DATABASE)
   ========================================================================== */
const updateLogs = [
     {
    type: "FIX",
    text: "Correção de erros das imagens",
    color: "#ef4444", 
  },
     {
    type: "NEW",
    text: "nova  função de painel de compartilha com QR",
    color: "#22c55e", 
  },
  {
  type: "NEW",
  text: "Nova função que mostra as últimas datas de atualização do site",
  color: "#22c55e", 
}
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

/* ==========================================================================
   CONFIGURAÇÃO DE DADOS (DATABASE)
   ========================================================================== */
const updateLogs = [
     {
    type: "NEW",
    text: "Agora com um sistema de modal que abre para mostrar a descrição de cada IA, explicando o que elas fazem e fornecendo um exemplo de uso para cada uma.",
    color: "#22c55e", 
  },
   {
    type: "NEW",
    text: "O sistema conta com um atalho para a barra de pesquisa em computadores. Ao pressionar Ctrl + B, a barra é aberta ao lado do curso do mouse",
    color: "#22c55e", 
  },
  {
    type: "FIX",
    text: "Correção de erros",
    color: "#ef4444", 
  },
   {
    type: "NEW",
    text: "agora sistema que abre imagem rapidas e com animação",
    color: "#22c55e", 
  },
   {
    type: "NEW",
    text: "Novo sistema de rolagem para o painel de compartilhamento",
    color: "#22c55e", 
  },
  {
    type: "NEW",
    text: "mais dois novo icones de compartilha instagram,tiktok",
    color: "#22c55e", 
  },
   {
    type: "NEW",
    text: "Animação na marcação de texto durante a pesquisa",
    color: "#22c55e", 
  },

    {
    type: "NEW",
    text: "nova aba de sites recomendados",
    color: "#22c55e", 
  },
  {
    type: "UI",
    text: "Melhorias nos botões",
    color: "#22c530",
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

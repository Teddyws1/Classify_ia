const cards = document.querySelectorAll("[data-category]");
cards.forEach((c) => {
  const n = c.querySelectorAll("li").length;

  c.querySelector("span").innerHTML = `
    ${n} sites <ion-icon name="globe-outline"></ion-icon>
  `;

  total += n;
});
//sistam de cards da divs
const MAX_VISIBLE = 4;

/* fundo escuro */
const overlayBg = document.createElement("div");
overlayBg.className = "overlay-bg";
document.body.appendChild(overlayBg);

let cardAberto = null;

/* =========================
   CONTROLE DE SCROLL
========================= */
function bloquearScroll() {
  document.body.style.overflow = "hidden";
}

function liberarScroll() {
  document.body.style.overflow = "";
}

/* =========================
   SISTEMA VER MAIS
========================= */

cards.forEach((card) => {
  const list = card.querySelector("ul");
  if (!list) return;

  const items = [...list.querySelectorAll("li")];
  if (items.length <= MAX_VISIBLE) return;

  /* esconde a partir do 5º */
  items.slice(MAX_VISIBLE).forEach((li) => li.classList.add("hidden"));

  /* botão ver mais */
  const btnVerMais = document.createElement("button");
  btnVerMais.className = "ver-mais-btn";
  btnVerMais.innerHTML = `Ver mais <ion-icon name="eye-outline" class="icon-ver-mais"></ion-icon>`;

  /* botão fechar */
  const btnFechar = document.createElement("button");
  btnFechar.className = "btn-close";
  btnFechar.innerHTML = "✕";

  function abrirModal() {
    items.forEach((li) => li.classList.remove("hidden"));

    card.classList.add("overlay-open");
    overlayBg.classList.add("active");

    list.appendChild(btnFechar);
    cardAberto = card;

    bloquearScroll(); // 🔒 trava scroll
  }

  function fecharModal() {
    card.classList.remove("overlay-open");
    overlayBg.classList.remove("active");

    items.slice(MAX_VISIBLE).forEach((li) => li.classList.add("hidden"));

    btnFechar.remove();
    cardAberto = null;

    liberarScroll(); // 🔓 libera scroll
  }

  /* clique em ver mais */
  btnVerMais.addEventListener("click", (e) => {
    e.stopPropagation();
    abrirModal();
  });

  /* clique no X */
  btnFechar.addEventListener("click", (e) => {
    e.stopPropagation();
    fecharModal();
  });

  list.after(btnVerMais);
});

/* =========================
   CLICAR FORA FECHA
========================= */
overlayBg.addEventListener("click", () => {
  if (!cardAberto) return;

  const btn = cardAberto.querySelector(".btn-close");
  if (btn) btn.click();
});

/* =========================
   SEARCH
========================= */
/* ==========================================================================
   SISTEMA DE BUSCA: IA + CATEGORIAS (Ideias, Chatbot, Marketing, etc.)
   ========================================================================== */

// 1. Definição Global (Evita erro de redeclaração)

const searchInput = document.getElementById("search");
const searchBox = document.querySelector(".search-box");

if (searchInput) {
  searchInput.addEventListener("keyup", () => {
    const value = searchInput.value.toLowerCase();

    // Gerencia classe visual do input
    searchBox.classList.toggle("has-text", value.length > 0);

    cards.forEach((card) => {
      // Pega o título da categoria (ex: Website, Escrita, Marketing)
      const h2 = card.querySelector("h2");
      const categoryTitle = h2 ? h2.innerText.toLowerCase() : "";
      const lis = card.querySelectorAll("li");

      // Verifica se a busca bate com o título da categoria
      const categoryMatches = categoryTitle.includes(value);
      let cardHasMatch = false;

      lis.forEach((li) => {
        const link = li.querySelector("a");
        if (!link) return;

        const name = link.innerText;
        const lowerName = name.toLowerCase();

        // Limpa marcações anteriores de pesquisa
        link.innerHTML = name;

        if (value === "") {
          li.style.display = "flex";
        }
        // Se bater na CATEGORIA ou no NOME DA IA
        else if (categoryMatches || lowerName.includes(value)) {
          if (lowerName.includes(value)) {
            const start = lowerName.indexOf(value);
            const end = start + value.length;

            // Aplica o destaque <mark> apenas se o nome da IA bater
            link.innerHTML =
              name.substring(0, start) +
              `<mark>${name.substring(start, end)}</mark>` +
              name.substring(end);
          }
          li.style.display = "flex";
          cardHasMatch = true;
        } else {
          li.style.display = "none";
        }
      });

      // O card aparece se houver match na categoria, na IA ou se a busca estiver vazia
      card.style.display =
        cardHasMatch || categoryMatches || value === "" ? "block" : "none";
    });
  });
}

/* ==========================================================================
   BOTÃO DE LIMPAR PESQUISA (X)
   ========================================================================== */
const clearBtn = document.getElementById("clearSearch");

if (clearBtn && searchInput) {
  clearBtn.addEventListener("click", () => {
    // 1. Limpa o valor do input
    searchInput.value = "";

    // 2. Remove a classe que mostra o X
    searchBox.classList.remove("has-text");

    // 3. Reseta a visualização de todos os cards e lis
    cards.forEach((card) => {
      card.style.display = "block";
      const lis = card.querySelectorAll("li");
      const links = card.querySelectorAll("a");

      lis.forEach((li) => {
        li.style.display = "flex";
      });

      // Remove os destaques <mark> voltando ao texto original
      links.forEach((link) => {
        link.innerHTML = link.innerText;
      });
    });

    // 4. Devolve o foco para o input para conveniência do usuário
    searchInput.focus();

    console.log("Pesquisa limpa e layout resetado.");
  });
}

//=========================sistemas deadpitação=========================//

//=========================sistemas de span de adpitação=========================//
function validarEncaixeCards() {
  const cards = document.querySelectorAll(".card");

  cards.forEach((card) => {
    const h2 = card.querySelector("h2");
    if (!h2) return;

    // Reset para cálculo limpo
    h2.style.flexWrap = "nowrap";

    // Verifica se o conteúdo interno é maior que o H2
    if (h2.scrollWidth > h2.clientWidth) {
      // Se não couber, força a quebra de linha para o badge ir para baixo
      h2.style.flexWrap = "wrap";
      h2.style.justifyContent = "flex-start";
    }
  });
}

// Executa ao carregar e sempre que a tela mudar de tamanho
window.addEventListener("load", validarEncaixeCards);
window.addEventListener("resize", validarEncaixeCards);
//=========================fim sistema de span de adpitação=========================//

//bloqueia button de compartilha

/* =====================================================
   SISTEMA DE COMPARTILHAMENTO AUTOMÁTICO
===================================================== */
(() => {
  let activeOverlayLi = null;

  // Funções de ação
  const actions = {
    copy: (url) => {
      navigator.clipboard.writeText(url);
      // Opcional: toast de confirmação aqui
    },
    whats: (url) => {
      window.open(
        `https://api.whatsapp.com/send?text=${encodeURIComponent(url)}`,
        "_blank",
      );
    },
    x: (url) => {
      window.open(
        `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}`,
        "_blank",
      );
    },
    face: (url) => {
      window.open(
        `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
        "_blank",
      );
    },
  };

  // Aplica a lógica em cada item da lista (li)
  document.querySelectorAll(".card ul li").forEach((li) => {
    const linkElement = li.querySelector("a");
    if (!linkElement) return;

    const url = linkElement.href; // Captura a URL exata do link atual

    // 1. Cria o botão de abrir (✚) fixo na direita
    const shareBtn = document.createElement("button");
    shareBtn.className = "share-btn";
    shareBtn.innerHTML = `<ion-icon name="share-social-outline"></ion-icon>`;
    li.appendChild(shareBtn);

    // 2. Cria o overlay lateral (o painel amarelo)
    const overlay = document.createElement("div");
    overlay.className = "side-overlay";
    overlay.innerHTML = `
      <div class="social-links">
        <button data-action="copy" title="Copiar Link"><ion-icon name="copy-outline"></ion-icon></button>
        <button data-action="whats" title="WhatsApp"><ion-icon name="logo-whatsapp"></ion-icon></button>
        <button data-action="x" title="X"><ion-icon name="logo-twitter"></ion-icon></button>
        <button data-action="face" title="Facebook"><ion-icon name="logo-facebook"></ion-icon></button>
        
      </div>
      <button class="btn-close-overlay"><ion-icon name="close-outline"></ion-icon></button>
    `;
    li.appendChild(overlay);

    // --- EVENTOS ---

    // Abrir o painel
    shareBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      if (activeOverlayLi && activeOverlayLi !== li) {
        activeOverlayLi.classList.remove("overlay-open");
      }
      li.classList.toggle("overlay-open");
      activeOverlayLi = li.classList.contains("overlay-open") ? li : null;
    });

    //até aqui
    // fecha ao clicar fora
    document.addEventListener("click", () => {
      if (activeMiniCard) {
        activeMiniCard.remove();
        activeMiniCard = null;
      }
    });

    // Delegar cliques nos botões sociais dentro do overlay
    overlay.addEventListener("click", (e) => {
      e.stopPropagation();

      const btn = e.target.closest("button[data-action]");
      if (btn) {
        const action = btn.dataset.action;
        actions[action](url); // Passa a URL capturada lá no início
      }

      if (e.target.closest(".btn-close-overlay")) {
        li.classList.remove("overlay-open");
        activeOverlayLi = null;
      }
    });
  });

  // Fechar ao clicar fora
  document.addEventListener("click", () => {
    if (activeOverlayLi) {
      activeOverlayLi.classList.remove("overlay-open");
      activeOverlayLi = null;
    }
  });
})();

//fim bloqueia button de compartilha

// Fecha menus
function removeMenus() {
  document.querySelectorAll(".share-menu").forEach((m) => m.remove());
}

const openSidebarBtn = document.getElementById("openSidebar");

let lastScroll = window.scrollY;

window.addEventListener("scroll", () => {
  const currentScroll = window.scrollY;

  if (currentScroll > lastScroll && currentScroll > 10) {
    // rolando para baixo → esconde
    openSidebarBtn.classList.add("hide");
  } else {
    // rolando para cima → mostra
    openSidebarBtn.classList.remove("hide");
  }

  lastScroll = currentScroll;
});

document.addEventListener("click", removeMenus);

//animação sidebar

// Funções de compartilhamento

const sidebar = document.getElementById("sidebar");
const overlay = document.getElementById("overlay");
const openBtn = document.getElementById("openSidebar");
const closeBtn = document.getElementById("closeSidebar");
const html = document.documentElement;

function openSidebar() {
  sidebar.classList.add("active");
  overlay.classList.add("active");
  openBtn.classList.add("hide");
}

function closeSidebar() {
  sidebar.classList.remove("active");
  overlay.classList.remove("active");
  openBtn.classList.remove("hide");
}

openBtn.onclick = openSidebar;
closeBtn.onclick = closeSidebar;
overlay.onclick = closeSidebar;

const closeSidebarBtn = document.getElementById("closeSidebar");

/* FUNÇÕES CLARAS */
function lockScroll() {
  document.body.classList.add("no-scroll");
}

function unlockScroll() {
  document.body.classList.remove("no-scroll");
}

/* EVENTOS */
openSidebarBtn.addEventListener("click", () => {
  lockScroll();
});

closeSidebarBtn.addEventListener("click", () => {
  unlockScroll();
});

overlay.addEventListener("click", unlockScroll);
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") unlockScroll();
});

//tema claro e escuro
// Botão de alternar tema
const themeToggle = document.getElementById("themeToggle");

// Função alternar tema
function toggleTheme() {
  document.documentElement.classList.toggle("light");

  // Salva escolha no localStorage
  if (document.documentElement.classList.contains("light")) {
    localStorage.setItem("theme", "light");
  } else {
    localStorage.setItem("theme", "dark");
  }
}

// Carrega tema salvo no carregamento da página
window.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "light") {
    document.documentElement.classList.add("light");
  } else {
    document.documentElement.classList.remove("light");
  }
});

// Evento do botão
themeToggle.addEventListener("click", toggleTheme);

//fim di tema claro e escuro

// Adição de novos sites
const DAYS_NEW = 6; // quantos dias o item fica como NOVO

document.querySelectorAll(".ia-list li").forEach((li) => {
  const added = li.dataset.added;
  if (!added) return;

  const addedDate = new Date(added);
  const today = new Date();
  const diffDays = (today - addedDate) / (1000 * 60 * 60 * 24);

  const badge = li.querySelector(".ia-badge");

  if (diffDays > DAYS_NEW && badge) {
    badge.remove();
  }
});

//sistema de novas ia com (li)
document.addEventListener("DOMContentLoaded", () => {
  const DAYS_AS_NEW = 30; // quantos dias o item fica como NOVO

  const today = new Date();

  document.querySelectorAll("li[data-new]").forEach((li) => {
    const addedDate = new Date(li.dataset.new);
    const diffTime = today - addedDate;
    const diffDays = diffTime / (1000 * 60 * 60 * 24);

    if (diffDays <= DAYS_AS_NEW) {
      const badge = document.createElement("span");
      badge.className = "ia-badge";
      badge.innerHTML = `
        <ion-icon name="sparkles-outline"></ion-icon>
        NOVO
      `;
      li.appendChild(badge);
    }
  });
});
//fim sistema de novas ia com (li)

//modal das infomação
document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("modalNews");
  const modalBox = modal.querySelector(".modal-box");
  const closeBtn = modal.querySelector(".close-modal");
  const openBtn = document.querySelector(".btn-news");

  // 👉 ABRIR PELO BOTÃO "NOVIDADES"
  openBtn.addEventListener("click", () => {
    modal.classList.add("active");
  });

  // 👉 FECHAR NO X
  closeBtn.addEventListener("click", () => {
    modal.classList.remove("active");
  });

  // 👉 FECHAR CLICANDO FORA DO MODAL
  modal.addEventListener("click", (e) => {
    if (!modalBox.contains(e.target)) {
      modal.classList.remove("active");
    }
  });
});

//fim modal das infomação

///card altas
// #1. Lógica de Troca de Abas
const buttons = document.querySelectorAll(".tab-btn");
const contents = document.querySelectorAll(".tab-content");

buttons.forEach((btn) => {
  btn.addEventListener("click", () => {
    // Remove active de tudo
    buttons.forEach((b) => b.classList.remove("active"));
    contents.forEach((c) => c.classList.remove("active"));

    // Adiciona no clicado
    btn.classList.add("active");
    const tabId = btn.getAttribute("data-tab");
    document.getElementById(tabId).classList.add("active");
  });
});

// #2. Lógica para Adicionar Números de Ranking (#1, #2...)
// Isso percorre todas as listas e coloca o número antes do nome da IA
const listas = document.querySelectorAll(".lista-ia");

listas.forEach((lista) => {
  const itens = lista.querySelectorAll("li");
  itens.forEach((item, index) => {
    const link = item.querySelector("a");
    if (link) {
      // Adiciona o número com base na posição (index + 1)
      link.innerHTML = `<b>#${index + 1}</b> ${link.innerText}`;
    }
  });
});

// #3. Lógica para Arrastar com o Mouse (Desktop Drag)
const sliders = document.querySelectorAll(".scroll-wrapper");

sliders.forEach((slider) => {
  let isDown = false;
  let startX;
  let scrollLeft;

  slider.addEventListener("mousedown", (e) => {
    isDown = true;
    slider.style.cursor = "grabbing"; // Feedback visual de agarrar
    startX = e.pageX - slider.offsetLeft;
    scrollLeft = slider.scrollLeft;
  });

  slider.addEventListener("mouseleave", () => {
    isDown = false;
    slider.style.cursor = "grab";
  });

  slider.addEventListener("mouseup", () => {
    isDown = false;
    slider.style.cursor = "grab";
  });

  slider.addEventListener("mousemove", (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - slider.offsetLeft;
    const walk = (x - startX) * 2; // Velocidade do scroll
    slider.scrollLeft = scrollLeft - walk;
  });
});

///fim card altas
//sisteam de ia nova para divs

document.addEventListener("DOMContentLoaded", () => {
  const DAYS_AS_NEW = 30;
  const today = new Date();

  document.querySelectorAll(".card").forEach((card) => {
    let count = 0;

    card.querySelectorAll("ul li[data-new]").forEach((li) => {
      const addedDate = new Date(li.dataset.new);
      const diffDays = (today - addedDate) / (1000 * 60 * 60 * 24);

      if (diffDays <= DAYS_AS_NEW) {
        count++;
      }
    });

    if (count > 0) {
      const title = card.querySelector("h2");
      if (!title) return;

      if (title.querySelector(".badge-new-ia-count")) return;

      const badge = document.createElement("span");
      badge.className = "badge-new-ia-count";
      badge.innerHTML = `
        <ion-icon name="sparkles-outline"></ion-icon>
        ${count} IA nova${count > 1 ? "s" : ""}
      `;

      title.appendChild(badge);
    }
  });
});

//fim de sisteam de ia nova para divs

//icone balançando

const updateTitle = document.querySelector(".update-title-ui ion-icon");

updateTitle.addEventListener("mouseenter", () => {
  updateTitle.classList.add("swing");
});

updateTitle.addEventListener("animationend", () => {
  updateTitle.classList.remove("swing");
});

//fim icone balançando

// div  de categoria tags

const slider = document.querySelector(".tab-navigation-container");

let isDown = false;
let startX;
let scrollLeft;

// Quando o mouse é pressionado
slider.addEventListener("mousedown", (e) => {
  isDown = true;
  slider.classList.add("active"); // opcional: muda o cursor
  startX = e.pageX - slider.offsetLeft;
  scrollLeft = slider.scrollLeft;
});

// Quando o mouse é liberado
slider.addEventListener("mouseup", () => {
  isDown = false;
  slider.classList.remove("active");
});

// Quando o mouse sai da área
slider.addEventListener("mouseleave", () => {
  isDown = false;
  slider.classList.remove("active");
});

// Quando o mouse se move
slider.addEventListener("mousemove", (e) => {
  if (!isDown) return;
  e.preventDefault();
  const x = e.pageX - slider.offsetLeft;
  const walk = (x - startX) * 2; // multiplica para velocidade de scroll
  slider.scrollLeft = scrollLeft - walk;
});

// Touch para dispositivos móveis
slider.addEventListener("touchstart", (e) => {
  startX = e.touches[0].pageX - slider.offsetLeft;
  scrollLeft = slider.scrollLeft;
});

slider.addEventListener("touchmove", (e) => {
  const x = e.touches[0].pageX - slider.offsetLeft;
  const walk = (x - startX) * 2;
  slider.scrollLeft = scrollLeft - walk;
});

//fim div  de categoria tags
// animação tema claro/escuro
// Seleciona o elemento do ícone
const themeIcon = themeToggle.querySelector(".theme-icon");

// Função principal de alternância
function toggleTheme() {
  document.documentElement.classList.toggle("light");

  // Salva escolha e atualiza ícone
  if (document.documentElement.classList.contains("light")) {
    localStorage.setItem("theme", "light");
    animateIcon("☀️");
  } else {
    localStorage.setItem("theme", "dark");
    animateIcon("🌙");
  }
}

// Animação do ícone
function animateIcon(newIcon) {
  themeIcon.style.transition = "none"; // Reseta para nova animação
  themeIcon.style.transform = "translateY(-20px) rotate(-180deg) scale(0.5)";
  themeIcon.style.opacity = "0";

  setTimeout(() => {
    themeIcon.textContent = newIcon;
    themeIcon.style.transition = "transform 0.5s ease, opacity 0.5s ease";
    themeIcon.style.transform = "translateY(0) rotate(0deg) scale(1)";
    themeIcon.style.opacity = "1";
  }, 200);
}

// =====================================================
// NOVO: SISTEMA DE ATALHO (Ctrl + Shift + Seta Baixo)
// =====================================================
window.addEventListener("keydown", (event) => {
  // Verifica se CTRL + SHIFT + ARROW DOWN foram pressionados
  if (event.ctrlKey && event.shiftKey && event.key === "ArrowDown") {
    // Impede o comportamento padrão (ex: scroll da página)
    event.preventDefault();
    toggleTheme();
  }
});

// Inicializa tema salvo
window.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "light") {
    document.documentElement.classList.add("light");
    themeIcon.textContent = "☀️";
  } else {
    document.documentElement.classList.remove("light");
    themeIcon.textContent = "🌙";
  }
});

// Evento do botão
themeToggle.addEventListener("click", toggleTheme);

//fim animação tema claro/escuro

document.addEventListener("DOMContentLoaded", () => {
  const statusBadge = document.getElementById("statusBadge");
  const openModalBtn = document.getElementById("openModal");
  const closeModalBtn = document.getElementById("closeModal");
  const modalOverlay = document.getElementById("modalOverlay");
  const messageTextEl = document.getElementById("systemMessageText");

  const messageText = messageTextEl.textContent.trim();

  // ID baseado no conteúdo da mensagem
  const messageId =
    "msg_" + messageText.length + "_" + messageText.charCodeAt(0);

  const savedMessage = localStorage.getItem("systemMessageRead");

  // função para atualizar status visual
  function setStatus(status) {
    statusBadge.className = "status " + status;

    if (status === "novo") {
      statusBadge.innerHTML = `
        <ion-icon name="checkmark-outline"></ion-icon>
      `;
    }

    if (status === "lido") {
      statusBadge.innerHTML = `
        <ion-icon name="checkmark-done-outline"></ion-icon>
      `;
    }
  }

  // ===== STATUS INICIAL =====
  if (savedMessage === messageId) {
    setStatus("lido");
  } else {
    setStatus("novo"); // nova mensagem / enviada
  }

  // ===== ABRIR MODAL (marca como lido) =====
  openModalBtn.addEventListener("click", () => {
    modalOverlay.style.display = "flex";

    setStatus("lido");
    localStorage.setItem("systemMessageRead", messageId);
  });

  // ===== FECHAR MODAL =====
  closeModalBtn.addEventListener("click", () => {
    modalOverlay.style.display = "none";
  });

  // ===== FECHAR CLICANDO FORA =====
  modalOverlay.addEventListener("click", (e) => {
    if (e.target === modalOverlay) {
      modalOverlay.style.display = "none";
    }
  });
});

//fim nova mensagem
//img tops ia em 8k 4k

document.addEventListener("DOMContentLoaded", () => {
  const imagensIA = document.querySelectorAll(".lista-ia img");

  imagensIA.forEach((img) => {
    // Pegamos o domínio que você já tem no HTML
    const urlAtual = img.src;
    const match = urlAtual.match(/domain=([^&]+)/);

    if (match && match[1]) {
      const dominio = match[1];

      // Usamos uma API que fornece logos em alta resolução (256px ou mais)
      // Isso garante que em 4K a imagem tenha informação de sobra
      img.src = `https://img.logo.dev/${dominio}?token=pk_YOUR_TOKEN&size=256`;

      // Se a API falhar, usamos o Google em tamanho máximo (128 é o limite deles)
      img.onerror = function () {
        this.src = `https://www.google.com/s2/favicons?domain=${dominio}&sz=128`;

        // Se ainda assim der erro, criamos um ícone vetorial liso
        this.onerror = function () {
          this.src = `https://ui-avatars.com/api/?name=${dominio}&size=256&background=facc15&color=161618&bold=true&rounded=true`;
        };
      };
    }
  });
});

//fim img tops ia em 8k 4k
//img lis

document.addEventListener("DOMContentLoaded", () => {
  const imagens = document.querySelectorAll(".lista-ia li img");

  imagens.forEach((img) => {
    const srcOriginal = img.src;
    // Extrai o domínio da URL do favicon
    const match = srcOriginal.match(/domain=([^&]+)/);

    if (match && match[1]) {
      const dominio = match[1];

      // 1. Forçamos a maior resolução possível (sz=128 no Google ou 256 no DuckDuckGo)
      // Usar 128px para exibir em 42px cria uma densidade de 3x (Qualidade Retina)
      const highResUrl = `https://www.google.com/s2/favicons?domain=${dominio}&sz=128`;

      img.src = highResUrl;

      // 2. Fallback inteligente: se o ícone do Google falhar, tenta o DuckDuckGo HD
      img.onerror = function () {
        this.src = `https://icons.duckduckgo.com/ip3/${dominio}.ico`;

        // 3. Fallback final: Letra estilizada em alta definição
        this.onerror = function () {
          this.src = `https://ui-avatars.com/api/?name=${dominio}&size=128&background=facc15&color=161618&bold=true`;
        };
      };
    }
  });
});

//fim img lis

//img tela media

document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("img-modal");
  const modalImg = document.getElementById("img-zoom");
  const modalLabel = document.getElementById("img-label");
  const closeBtn = document.querySelector(".close-modal");
  const body = document.body;

  const todasImgs = document.querySelectorAll(".lista-ia img, .card img");

  const openModal = (imgSrc, labelText) => {
    if (!imgSrc) return; // Segurança: Não abre se não tiver imagem

    modalImg.src = imgSrc;
    modalLabel.innerText = labelText;
    modal.style.display = "flex";

    // Bloqueia Scroll
    body.style.overflow = "hidden";
    body.style.paddingRight = "15px";
  };

  const closeModal = () => {
    modal.style.display = "none";
    // Limpa a imagem ao fechar para não dar erro de renderização na próxima
    modalImg.src =
      "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

    // Libera Scroll
    body.style.overflow = "auto";
    body.style.paddingRight = "0px";
  };

  todasImgs.forEach((img) => {
    img.addEventListener("click", (e) => {
      // Se clicar na imagem, não abre o link do site, abre o modal
      e.preventDefault();
      e.stopPropagation();

      const nomeIA =
        img.alt || img.parentElement.innerText.trim() || "IA Search";

      // Força alta resolução para o modal
      let srcHighRes = img.src
        .replace("sz=32", "sz=128")
        .replace("sz=64", "sz=128");

      openModal(srcHighRes, nomeIA);
    });
  });

  closeBtn.onclick = closeModal;
  modal.onclick = (e) => {
    if (e.target === modal) closeModal();
  };

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });
});

//=========botão de x do tela media========//
document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("img-modal");
  const modalImg = document.getElementById("img-zoom");
  const modalLabel = document.getElementById("img-label");
  const body = document.body;

  // Seleciona todos os possíveis botões de fechar (previne erro se houver mais de um)
  const closeButtons = document.querySelectorAll(".close-modal");

  const closeModal = () => {
    if (!modal) return;
    modal.style.display = "none";
    modalImg.src =
      "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

    // Libera Scroll usando a lógica de Jan/2026
    body.style.overflow = "auto";
    body.style.paddingRight = "0px";
  };

  // 1. Aplica o evento em todos os botões de fechar encontrados
  closeButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      closeModal();
    });
  });

  // 2. Fecha ao clicar no fundo escuro (Overlay)
  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModal();
    });
  }

  // 3. Fecha com a tecla Esc
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });
});
//=========fim botão de x do tela media========//
//fim tela media

//========sistema de verificação de mensagem do modal========//

document.addEventListener("DOMContentLoaded", () => {
  const modalOverlay = document.getElementById("modalOverlay");
  const messageText = document.getElementById("systemMessageText");

  // Função para validar o conteúdo do modal
  const verificarMensagem = () => {
    // Remove espaços em branco para checagem real
    const conteudo = messageText.innerText.trim();

    if (conteudo === "" || conteudo.length === 0) {
      // Injeta o estado "Vazio" com ícone e estilo premium
      messageText.innerHTML = `
        <div class="empty-state-msg">
          <ion-icon name="notifications-off-outline"></ion-icon>
          <p>Nenhuma mensagem no momento.</p>
          <span>Tudo atualizado por aqui!</span>
        </div>
      `;
    }
  };

  // Chama a função ao carregar ou ao abrir o modal
  verificarMensagem();
});
//========fim sistema de verificação de mensagem do modal========//

//========sistema de tela cheia========//

const btn = document.getElementById("toggleFullscreen");
const text = btn.querySelector(".text");
const icon = btn.querySelector(".icon");

function toggleFullscreen() {
  const isFull =
    document.fullscreenElement ||
    document.webkitFullscreenElement ||
    document.msFullscreenElement;

  if (!isFull) {
    const el = document.documentElement;

    if (el.requestFullscreen) {
      el.requestFullscreen();
    } else if (el.webkitRequestFullscreen) {
      el.webkitRequestFullscreen();
    } else if (el.msRequestFullscreen) {
      el.msRequestFullscreen();
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  }
}

// clique no botão
btn.addEventListener("click", toggleFullscreen);

// atalho PC: CTRL + SHIFT + ↑
document.addEventListener("keydown", (e) => {
  if (e.ctrlKey && e.shiftKey && e.key === "ArrowUp") {
    e.preventDefault();
    toggleFullscreen();
  }
});

// atualiza texto/ícone
function updateButton() {
  const isFull =
    document.fullscreenElement ||
    document.webkitFullscreenElement ||
    document.msFullscreenElement;

  text.textContent = isFull ? "tela cheia" : "Tela cheia";
}

document.addEventListener("fullscreenchange", updateButton);
document.addEventListener("webkitfullscreenchange", updateButton);
document.addEventListener("msfullscreenchange", updateButton);
//========fim sistema de tela cheia========//

//sistema de sw.js limpar cache
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/Classify_ia/sw.js")
      .then(() => console.log("Service Worker registrado"))
      .catch((err) => console.log("Erro no SW", err));
  });
}

//fim sistema de sw.js limpar cache


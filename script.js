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
//=====sisteam de ctrl+x a paga total  da barra
document.addEventListener("keydown", (e) => {
  if (e.ctrlKey && e.key.toLowerCase() === "x") {
    // evita conflito com recortar texto
    e.preventDefault();

    if (!searchInput) return;

    // 1. Limpa o valor do input
    searchInput.value = "";

    // 2. Remove a classe visual
    searchBox.classList.remove("has-text");

    // 3. Reseta cards, listas e destaques
    cards.forEach((card) => {
      card.style.display = "block";

      const lis = card.querySelectorAll("li");
      const links = card.querySelectorAll("a");

      lis.forEach((li) => {
        li.style.display = "flex";
      });

      links.forEach((link) => {
        link.innerHTML = link.innerText;
      });
    });

    // 4. Foco de volta no input
    searchInput.focus();

    console.log("Pesquisa limpa via Ctrl + X");
  }
});

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

//button de compartilha

(() => {
  let activeOverlayLi = null;

  // Sistema de Toasts (Mensagens flutuantes)
  const showToast = (msg) => {
    let toast = document.querySelector(".toast-container");
    if (!toast) {
      toast = document.createElement("div");
      toast.className = "toast-container";
      document.body.appendChild(toast);
    }
    toast.innerHTML = `<ion-icon name="information-circle-outline"></ion-icon> ${msg}`;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2500);
  };

  // Ações das Redes Sociais
  const actions = {
    copy: (url) => {
      navigator.clipboard.writeText(url);
      showToast("Link Copiado!");
    },
    whats: (url) =>
      window.open(
        `https://api.whatsapp.com/send?text=${encodeURIComponent(url)}`,
        "_blank",
      ),
    insta: () => window.open(`https://www.instagram.com/`, "_blank"),
    tiktok: () => window.open(`https://www.tiktok.com/`, "_blank"),
    x: (url) =>
      window.open(
        `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}`,
        "_blank",
      ),
    face: (url) =>
      window.open(
        `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
        "_blank",
      ),
  };

  document.querySelectorAll(".card ul li").forEach((li) => {
    const linkElement = li.querySelector("a");
    if (!linkElement) return;
    const url = linkElement.href;

    // Criar Botão Share
    const shareBtn = document.createElement("button");
    shareBtn.className = "share-btn";
    shareBtn.innerHTML = `<ion-icon name="share-social-outline"></ion-icon>`;
    li.appendChild(shareBtn);

    // Criar Overlay
    const overlay = document.createElement("div");
    overlay.className = "side-overlay";
    overlay.innerHTML = `
      <div class="social-scroll-wrapper">
        <button data-action="copy" class="action-btn"><ion-icon name="copy-outline"></ion-icon></button>
        <button data-action="whats" class="action-btn"><ion-icon name="logo-whatsapp"></ion-icon></button>
        <button data-action="insta" class="action-btn"><ion-icon name="logo-instagram"></ion-icon></button>
        <button data-action="tiktok" class="action-btn"><ion-icon name="logo-tiktok"></ion-icon></button>
        <button data-action="x" class="action-btn"><ion-icon name="logo-twitter"></ion-icon></button>
        <button data-action="face" class="action-btn"><ion-icon name="logo-facebook"></ion-icon></button>
      </div>
      <button class="btn-close-overlay"><ion-icon name="close-outline"></ion-icon></button>
    `;
    li.appendChild(overlay);

    const slider = overlay.querySelector(".social-scroll-wrapper");
    let isDown = false,
      startX,
      scrollLeft,
      isDragging = false;

    // Lógica de Arrastar (Drag to Scroll)
    slider.addEventListener("mousedown", (e) => {
      isDown = true;
      isDragging = false;
      slider.classList.add("active");
      startX = e.pageX - slider.offsetLeft;
      scrollLeft = slider.scrollLeft;
    });

    slider.addEventListener("mousemove", (e) => {
      if (!isDown) return;
      isDragging = true;
      e.preventDefault();
      const x = e.pageX - slider.offsetLeft;
      const walk = (x - startX) * 2;
      slider.scrollLeft = scrollLeft - walk;
    });

    const stopDragging = () => {
      isDown = false;
      slider.classList.remove("active");
    };
    slider.addEventListener("mouseup", stopDragging);
    slider.addEventListener("mouseleave", stopDragging);

    // Scroll com a rodinha
    slider.addEventListener(
      "wheel",
      (e) => {
        if (e.deltaY !== 0) {
          e.preventDefault();
          slider.scrollLeft += e.deltaY;
        }
      },
      { passive: false },
    );

    // Evento de Clique e Confirmação
    overlay.addEventListener("click", (e) => {
      e.stopPropagation();
      if (isDragging) return; // Não clica se estiver arrastando

      const btn = e.target.closest(".action-btn");
      if (btn) {
        if (btn.classList.contains("confirming")) {
          actions[btn.dataset.action](url);
          btn.classList.remove("confirming");
          btn.innerHTML = btn.dataset.oldHtml;
        } else {
          overlay.querySelectorAll(".action-btn").forEach((b) => {
            if (b.dataset.oldHtml) b.innerHTML = b.dataset.oldHtml;
            b.classList.remove("confirming");
          });
          btn.dataset.oldHtml = btn.innerHTML;
          btn.classList.add("confirming");
          btn.innerHTML = `<span>Confirma?</span>`;
          setTimeout(() => {
            if (btn.classList.contains("confirming")) {
              btn.classList.remove("confirming");
              btn.innerHTML = btn.dataset.oldHtml;
            }
          }, 3000);
        }
      }

      if (e.target.closest(".btn-close-overlay")) {
        li.classList.remove("overlay-open");
        activeOverlayLi = null;
      }
    });

    shareBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (activeOverlayLi && activeOverlayLi !== li)
        activeOverlayLi.classList.remove("overlay-open");
      li.classList.toggle("overlay-open");
      activeOverlayLi = li.classList.contains("overlay-open") ? li : null;
    });
  });

  document.addEventListener("click", () => {
    if (activeOverlayLi) {
      activeOverlayLi.classList.remove("overlay-open");
      activeOverlayLi = null;
    }
  });
})();

// button de compartilha

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

//sistema de instalar web

// sw.js - Service Worker Simples
self.addEventListener("install", (e) => {
  console.log("Service Worker Instalado");
});

self.addEventListener("fetch", (e) => {
  // Necessário para o PWA ser detectado
});

//fim sistema de instalar web
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
  // função para atualizar status visual
  function setStatus(status) {
    statusBadge.className = "status " + status;

    // --- MENSAGEM NOVA (Não lida) ---
    if (status === "novo") {
      // Sino preenchido e balançando para chamar atenção
      statusBadge.innerHTML = `
        <ion-icon name="notifications" class="sino-icon animado"></ion-icon>
        <span class="alert-dot"></span>
      `;
    }

    // --- MENSAGEM LIDA ---
    if (status === "lido") {
      // Sino vazado (outline) e parado
      statusBadge.innerHTML = `
        <ion-icon name="notifications-outline" class="sino-icon"></ion-icon>
      `;
    }
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
const initImages = () => {
  const images = document.querySelectorAll("img");

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;

          if (img.dataset.src) {
            img.src = img.dataset.src;
          }

          if (img.complete) {
            img.classList.add("loaded");
          } else {
            img.onload = () => img.classList.add("loaded");
          }

          obs.unobserve(img);
        }
      });
    },
    { rootMargin: "50px" },
  );

  images.forEach((img) => {
    if (!img.getAttribute("loading")) {
      img.setAttribute("loading", "lazy");
    }
    observer.observe(img);
  });
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initImages);
} else {
  initImages();
}
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

/* ======================================================
   SISTEMA DE ALINHAMENTO AUTOMÁTICO (JS + ROOT)
   ====================================================== */

const root = document.documentElement; // Acessa o :root do CSS
const body = document.body;

function autoAlignSystem() {
  // 1. Detecta largura da tela
  const width = window.innerWidth;

  // --- LÓGICA DE COLUNAS DO GRID ---
  // Calcula quantas colunas de 280px cabem na tela
  let columns = Math.floor((width - 40) / 300);
  if (columns < 1) columns = 1; // Mínimo 1 coluna
  if (columns > 4) columns = 4; // Máximo 4 colunas

  // Injeta no CSS
  root.style.setProperty("--grid-cols", columns);

  // --- LÓGICA DE MODO (Mobile vs Desktop) ---
  if (width <= 640) {
    // MODO MOBILE (Redmi Note 13, iPhone, etc)
    body.setAttribute("data-mode", "mobile");

    // Ajustes de Variáveis
    root.style.setProperty("--layout-padding", "10px"); // Menos borda
    root.style.setProperty("--sidebar-left", "-100%"); // Esconde menu
    root.style.setProperty("--sidebar-width", "85%"); // Menu ocupa quase tudo
    root.style.setProperty("--font-scale", "0.9"); // Fonte um pouco menor

    // Botão de Logs (Esquerda)
    root.style.setProperty("--btn-logs-pos-x", "3%");
    root.style.setProperty("--btn-logs-pos-y", "5%");
  } else {
    // MODO DESKTOP
    body.setAttribute("data-mode", "desktop");

    // Ajustes de Variáveis
    root.style.setProperty("--layout-padding", "20px");
    root.style.setProperty("--sidebar-left", "-320px"); // Esconde (padrão desktop)
    root.style.setProperty("--sidebar-width", "300px");
    root.style.setProperty("--font-scale", "1");

    // Botão de Logs (Direita/Centro)
    root.style.setProperty("--btn-logs-pos-x", "55%");
    root.style.setProperty("--btn-logs-pos-y", "5%");
  }

  console.log(
    `Sistema AutoAlign: ${width}px | Colunas: ${columns} | Modo: ${body.getAttribute("data-mode")}`,
  );
}

// --- GATILHOS ---

// 1. Roda ao iniciar o site
window.addEventListener("load", autoAlignSystem);

// 2. Roda ao redimensionar a tela (girar celular ou ajustar janela)
window.addEventListener("resize", autoAlignSystem);

// 3. Função extra para abrir/fechar sidebar manualmente
function toggleSidebar() {
  const currentLeft = getComputedStyle(root)
    .getPropertyValue("--sidebar-left")
    .trim();

  if (currentLeft === "0px") {
    // Se está aberto, fecha baseado no modo
    const mode = body.getAttribute("data-mode");
    root.style.setProperty(
      "--sidebar-left",
      mode === "mobile" ? "-100%" : "-320px",
    );
  } else {
    // Abre
    root.style.setProperty("--sidebar-left", "0px");
  }
}
///fim adapitação para botão atualização

//icone do botão de .Explorar

document.addEventListener("DOMContentLoaded", () => {
  const btn = document.querySelector(".Explorar");

  if (btn) {
    const icon = btn.querySelector("ion-icon");

    btn.addEventListener("mouseenter", () => {
      // Gira rápido e aleatório (como se fosse peteleco na bússola)
      // cubic-bezier(0.2, 0.8, 0.2, 1) = Desaceleração suave
      icon.style.transition = "transform 1s cubic-bezier(0.2, 0.8, 0.2, 1)";

      // Gira entre 360 e 720 graus aleatoriamente
      const randomRotate = 360 + Math.floor(Math.random() * 360);
      icon.style.transform = `rotate(${randomRotate}deg)`;
    });

    btn.addEventListener("mouseleave", () => {
      // Efeito de Mola/Balanço ao voltar para o Norte (0deg)
      // cubic-bezier(0.5, -0.5, 0.5, 1.5) = Vai e volta (balança)
      icon.style.transition =
        "transform 1.5s cubic-bezier(0.68, -0.55, 0.27, 1.55)";
      icon.style.transform = "rotate(0deg)";
    });
  }
});

//fim icone do botão de .Explorar

//sistema de bloqueio de zoom da pagina
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
//testes

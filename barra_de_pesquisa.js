/* =========================================
   BUSCA PRINCIPAL (NÃO ALTERADA)
========================================= */

const searchInput = document.getElementById("search");
const searchBox = document.querySelector(".search-box");

if (searchInput) {
  searchInput.addEventListener("keyup", () => {
    const value = searchInput.value.toLowerCase();

    // Gerencia classe visual do input
    searchBox.classList.toggle("has-text", value.length > 0);

    cards.forEach((card) => {
      const h2 = card.querySelector("h2");
      const categoryTitle = h2 ? h2.innerText.toLowerCase() : "";
      const lis = card.querySelectorAll("li");

      const categoryMatches = categoryTitle.includes(value);
      let cardHasMatch = false;

      lis.forEach((li) => {
        const link = li.querySelector("a");
        if (!link) return;

        const name = link.innerText;
        const lowerName = name.toLowerCase();

        link.innerHTML = name;

        if (value === "") {
          li.style.display = "flex";
        } else if (categoryMatches || lowerName.includes(value)) {
          if (lowerName.includes(value)) {
            const start = lowerName.indexOf(value);
            const end = start + value.length;

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

      card.style.display =
        cardHasMatch || categoryMatches || value === "" ? "block" : "none";
    });
  });
}

/* =========================================
   SEARCH FLUTUANTE — CTRL + B
========================================= */

document.addEventListener("DOMContentLoaded", () => {
  const searchFloat = document.getElementById("searchFloat");
  const searchFloatInput = document.getElementById("searchFloatInput");

  if (!searchFloat || !searchFloatInput || !searchInput) return;

  let mouseX = 0;
  let mouseY = 0;
  let isOpen = false;

  // posição do mouse
  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // Ctrl + B abre / fecha
  document.addEventListener("keydown", (e) => {
    if (e.ctrlKey && e.key.toLowerCase() === "b") {
      e.preventDefault();
      isOpen ? closeSearch() : openSearch();
    }

    if (e.key === "Escape" && isOpen) {
      closeSearch();
    }
  });

  function openSearch() {
    const offset = 12;
    searchFloat.style.left = mouseX + offset + "px";
    searchFloat.style.top = mouseY + offset + "px";
    searchFloat.classList.add("active");
    searchFloatInput.focus();
    isOpen = true;
  }

  function closeSearch() {
    searchFloat.classList.remove("active");
    searchFloatInput.value = "";
    searchInput.value = "";
    searchInput.dispatchEvent(new Event("keyup"));
    isOpen = false;
  }

  // 🔥 AQUI ESTÁ O PULO DO GATO 🔥
  // digitar na flutuante usa a MESMA busca
  searchFloatInput.addEventListener("keyup", () => {
    searchInput.value = searchFloatInput.value;
    searchInput.dispatchEvent(new Event("keyup"));
  });

  // clique fora fecha
  document.addEventListener("mousedown", (e) => {
    if (isOpen && !searchFloat.contains(e.target)) {
      closeSearch();
    }
  });
});
document.addEventListener("DOMContentLoaded", () => {
  const searchFloat = document.getElementById("searchFloat");
  const searchFloatInput = document.getElementById("searchFloatInput");

  if (!searchFloat || !searchFloatInput || !searchInput) return;

  let mouseX = 0;
  let mouseY = 0;
  let isOpen = false;

  // posição do mouse
  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // atalhos de teclado
  document.addEventListener("keydown", (e) => {
    // CTRL + B → abre / fecha
    if (e.ctrlKey && e.key.toLowerCase() === "b") {
      e.preventDefault();
      isOpen ? closeSearch() : openSearch();
    }

    // ESC → fecha
    if (e.key === "Escape" && isOpen) {
      closeSearch();
    }

// CTRL + X → apaga tudo da barra de pesquisa
if (e.ctrlKey && e.key.toLowerCase() === "x") {
  e.preventDefault();

  // limpa os dois inputs
  searchInput.value = "";
  searchFloatInput.value = "";

  // remove classe visual
  searchBox.classList.remove("has-text");

  // força reset da busca
  searchInput.dispatchEvent(new Event("keyup"));
}

  });
function openSearch() {
  const offset = 12;

  // garante que o elemento exista e seja medido
  searchFloat.style.visibility = "hidden";
  searchFloat.classList.add("active");

  const boxWidth = searchFloat.offsetWidth;
  const boxHeight = searchFloat.offsetHeight;

  const maxX = window.innerWidth - boxWidth - offset;
  const maxY = window.innerHeight - boxHeight - offset;

  const posX = Math.max(offset, Math.min(mouseX + offset, maxX));
  const posY = Math.max(offset, Math.min(mouseY + offset, maxY));

  searchFloat.style.left = posX + "px";
  searchFloat.style.top = posY + "px";

  searchFloat.style.visibility = "visible";
  searchFloatInput.focus();
  isOpen = true;
}


  function closeSearch() {
    searchFloat.classList.remove("active");
    searchFloatInput.value = "";
    searchInput.value = "";
    searchInput.dispatchEvent(new Event("keyup"));
    isOpen = false;
  }

  // digitar na flutuante usa a mesma busca
  searchFloatInput.addEventListener("keyup", () => {
    searchInput.value = searchFloatInput.value;
    searchInput.dispatchEvent(new Event("keyup"));
  });

  // clique fora fecha
  document.addEventListener("mousedown", (e) => {
    if (isOpen && !searchFloat.contains(e.target)) {
      closeSearch();
    }
  });
});

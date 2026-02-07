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

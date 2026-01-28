if ("serviceWorker" in navigator) {
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    // Aqui você decide o que fazer
    console.log("Nova versão ativa");
    window.location.reload();
  });

  navigator.serviceWorker.ready.then((reg) => {
    if (reg.waiting) {
      mostrarAvisoUpdate(reg);
    }

    reg.addEventListener("updatefound", () => {
      const newWorker = reg.installing;
      newWorker.addEventListener("statechange", () => {
        if (
          newWorker.state === "installed" &&
          navigator.serviceWorker.controller
        ) {
          mostrarAvisoUpdate(reg);
        }
      });
    });
  });
}

function mostrarAvisoUpdate(reg) {
  const bar = document.createElement("div");
  bar.className = "update-bar";
  bar.innerHTML = `
    <span>🚀 Nova versão disponível</span>
    <button id="btnUpdate">Atualizar</button>
  `;
  document.body.appendChild(bar);

  document.getElementById("btnUpdate").onclick = () => {
    reg.waiting.postMessage({ type: "SKIP_WAITING" });
  };
}
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

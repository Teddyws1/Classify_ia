document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("custom-modal");

  const dbIA = {
    // 💡 IDEIAS
    ChatGPT: {
      desc: "IA para conversar, criar ideias e resolver problemas.",
      ex: "Crie um roteiro de vídeo de 1 minuto para vender um curso de culinária para iniciantes.",
    },
    Gemini: {
      desc: "IA do Google focada em pesquisa e respostas rápidas.",
      ex: "Analise os dados deste PDF e crie um resumo dos 3 pontos mais importantes para uma reunião.",
    },
    "Bing Chat": {
      desc: "Chat com IA integrado ao buscador Bing.",
      ex: "Compare o preço e as especificações técnicas do iPhone 15 Pro com o Samsung S24 Ultra.",
    },
    Perplexity: {
      desc: "IA que responde perguntas mostrando fontes.",
      ex: "Quais são as últimas notícias sobre a regulamentação de IA no Brasil hoje? Cite as fontes.",
    },
    Claude: {
      desc: "IA excelente para textos longos e organização.",
      ex: "Reescreva este artigo técnico de 2.000 palavras em uma linguagem simples para crianças de 10 anos.",
    },
    DeepSeek: {
      desc: "IA focada em raciocínio e programação.",
      ex: "Encontre o erro lógico neste código Python que não está salvando os dados no banco SQLite.",
    },

    // 🤖 CHATBOT
    "AutoCoder AI": {
      desc: "Gera códigos automaticamente.",
      ex: "Crie uma página de login em HTML e CSS com um fundo azul degradê e botões arredondados.",
    },
    "Emergent AI": {
      desc: "Ajuda a criar apps e sistemas com IA.",
      ex: "Gere a estrutura de um banco de dados para um sistema de controle de estoque de uma farmácia.",
    },
    "Monica AI": {
      desc: "Assistente de IA no navegador.",
      ex: "Resuma os principais comentários deste vídeo do YouTube sem eu precisar assistir tudo.",
    },
    MaxAI: {
      desc: "Assistente para leitura, escrita e respostas.",
      ex: "Escreva uma resposta profissional e educada recusando uma proposta de parceria via e-mail.",
    },
    Poe: {
      desc: "Plataforma com vários chatbots juntos.",
      ex: "Teste a mesma pergunta no modelo GPT-4 e no Claude 3 para comparar qual resposta é mais criativa.",
    },
    Copilot: {
      desc: "Assistente da Microsoft para trabalho e código.",
      ex: "Crie uma fórmula no Excel que calcule a comissão de venda baseada em metas batidas.",
    },
    Liner: {
      desc: "Resume textos e páginas da internet.",
      ex: "Destaque apenas as frases que falam sobre valores financeiros neste artigo longo de economia.",
    },
    "Dola AI": {
      desc: "Assistente pessoal com IA.",
      ex: "Agende um lembrete para eu beber água a cada 2 horas e marque uma reunião para amanhã às 14h.",
    },

    // 🌍 WEBSITE
    Dora: {
      desc: "Criação de sites animados com IA.",
      ex: "Crie uma landing page para um tênis futurista com efeito de rolagem 3D onde o produto gira.",
    },
    Durable: {
      desc: "Cria sites completos em minutos.",
      ex: "Gere um site para uma empresa de jardinagem incluindo fotos, serviços e um formulário de contato.",
    },
    Wegic: {
      desc: "Criação de site por conversa.",
      ex: "Estou criando um site de fotografia. Quero uma galeria em mosaico e um tema escuro minimalista.",
    },
    Framer: {
      desc: "Design e publicação de sites modernos.",
      ex: "Transforme meu rascunho do Figma em um site responsivo que funcione perfeitamente no celular.",
    },
    "10Web": {
      desc: "Cria sites WordPress com IA.",
      ex: "Copie o layout deste site existente e transforme-o em um tema editável dentro do WordPress.",
    },

    // ✍️ ESCRITA
    Jasper: {
      desc: "Escrita focada em marketing.",
      ex: "Escreva 5 variações de títulos de anúncios para o Facebook focados em vender um serviço de consultoria.",
    },
    Rytr: {
      desc: "Escrita rápida e simples.",
      ex: "Escreva uma legenda curta e engajadora para uma foto no Instagram sobre uma viagem de férias.",
    },
    TextBlaze: {
      desc: "Textos automáticos e atalhos.",
      ex: "Crie um atalho '/obrigado' que insira automaticamente um texto de agradecimento padrão para clientes.",
    },
    Sudowrite: {
      desc: "Escrita criativa e histórias.",
      ex: "Descreva uma cena de perseguição em uma cidade cyberpunk usando sons, cheiros e luzes de neon.",
    },
    Writesonic: {
      desc: "Conteúdo para blogs e anúncios.",
      ex: "Gere um artigo de blog de 800 palavras sobre 'Benefícios do Yoga' otimizado para aparecer no Google.",
    },

    // 🖼️ IMAGEM (Exemplos Específicos)
    "Leonardo AI": {
      desc: "Arte e ilustração avançada.",
      ex: "Gere a imagem de um gato samurai vestindo armadura dourada, estilo cinematográfico, 8k, luz dramática.",
    },
    "Recraft AI": {
      desc: "Criação de imagens vetoriais.",
      ex: "Crie um ícone de 'configurações' em estilo Flat Vector, usando as cores azul e branco, com fundo transparente.",
    },
    "DALL·E": {
      desc: "Criação de imagens por texto.",
      ex: "Uma pintura a óleo de uma astronauta andando a cavalo em Marte, estilo Van Gogh.",
    },
    "3D Logo Lab": {
      desc: "Logos em 3D.",
      ex: "Crie um logo 3D para uma empresa de tecnologia chamado 'NexGen' com efeito de vidro e metal.",
    },

    // 🎬 VÍDEO
    HeyGen: {
      desc: "Avatar falando.",
      ex: "Crie um vídeo onde um apresentador de terno lê este roteiro em português com gestos naturais.",
    },
    Synthesia: {
      desc: "Vídeos corporativos com avatar.",
      ex: "Crie um vídeo de treinamento de integração de 2 minutos para novos funcionários da empresa.",
    },
    Pictory: {
      desc: "Texto vira vídeo.",
      ex: "Transforme este link de artigo em um vídeo curto de 30 segundos com legendas e imagens de fundo.",
    },

    // 🔊 TEXTO → VOZ
    ElevenLabs: {
      desc: "Voz realista com IA.",
      ex: "Converta este texto em áudio usando uma voz masculina profunda e calma para narrar um audiobook.",
    },
    Suno: {
      desc: "Música e voz por texto.",
      ex: "Crie uma música de Rock sobre café, com batida rápida e voz masculina rasgada.",
    },
    Udio: {
      desc: "Criação de voz e música.",
      ex: "Gere uma trilha sonora de Jazz relaxante para um ambiente de cafeteria com 2 minutos de duração.",
    },

    // 🧠 MAPAS MENTAIS
    "Napkin AI": {
      desc: "Ideias em diagramas.",
      ex: "Transforme este parágrafo que explica o ciclo da água em um infográfico visual automático.",
    },
    Miro: {
      desc: "Quadro colaborativo.",
      ex: "Crie um quadro de brainstorming onde minha equipe possa colar post-its virtuais em tempo real.",
    },
    Mapify: {
      desc: "Organização visual com IA.",
      ex: "Pegue este texto longo sobre História do Brasil e organize em um mapa mental de tópicos e datas.",
    },
  };

  const listItems = document.querySelectorAll(".grid .card ul li");

  listItems.forEach((item) => {
    item.addEventListener("click", function (e) {
      const linkTag = this.querySelector("a");
      if (!linkTag) return;

      e.preventDefault();

      const iaName = linkTag.innerText.trim();
      const iaUrl = linkTag.href;
      const imgSource = this.querySelector("img").src;

      const data = dbIA[iaName] || {
        desc: "Ferramenta de IA avançada.",
        ex: "Explore as funcionalidades acessando o site oficial.",
      };

      const fullDesc = `
                <div style="margin-bottom: 15px;">
                    <strong style="color: #ffcc00; display: block; margin-bottom: 5px;">O que faz:</strong>
                    <span style="color: #ffffff;">${data.desc}</span>
                </div>
                <div>
                    <strong style="color: #ffcc00; display: block; margin-bottom: 5px;">Como pedir (Exemplo):</strong>
                    <em style="color: #a0aec0; border-left: 3px solid #ffcc00; padding-left: 10px; display: block;">"${data.ex}"</em>
                </div>
            `;

      document.getElementById("modal-img").src = imgSource;
      document.getElementById("modal-title").innerText = iaName;
      document.getElementById("modal-domain").innerText = new URL(
        iaUrl,
      ).hostname;
      document.getElementById("modal-desc").innerHTML = fullDesc;
      document.getElementById("modal-link").href = iaUrl;

      modal.style.display = "flex";
    });
  });
});

function closeModal() {
  document.getElementById("custom-modal").style.display = "none";
}

window.onclick = function (event) {
  if (event.target == document.getElementById("custom-modal")) closeModal();
};

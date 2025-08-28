// Lista de arquivos disponíveis com nome, imagem, som e chance de aparecer
const arquivos = [
  { nome: "Mister Bombastic", imagem: "misterBombastic.gif", som: "misterBombastic.mp3", chance: 50 },
  { nome: "Shadow", imagem: "shadow.gif", som: "shadow.mp3", chance: 30 },
  { nome: "Itachi", imagem: "itachi.gif", som: "itachi.mp3", chance: 20 },
  { nome: "Johnny", imagem: "johnny.gif", som: "johnny.mp3", chance: 20 },
  { nome: "O Mano", imagem: "mano.gif", som: "mano.mp3", chance: 20 }
];

// Variáveis globais
let current = -1; // Índice atual do wallpaper exibido
let hasVoted = false; // Controle de voto único
let historico = JSON.parse(localStorage.getItem("historicoVistos") || "[]"); // Histórico salvo

// Elementos da interface
const button = document.getElementById("changeBtn");
const audio = new Audio();
const feedback = document.getElementById("feedback");
const likeBtn = document.getElementById("likeBtn");
const dislikeBtn = document.getElementById("dislikeBtn");
const likeCount = document.getElementById("likeCount");
const dislikeCount = document.getElementById("dislikeCount");
const wallpaperContainer = document.getElementById("wallpaperContainer");
const contador = document.getElementById("contador");

// Função para sortear um wallpaper com base nas chances
function sortearWallpaper() {
  const total = arquivos.reduce((sum, item) => sum + item.chance, 0);
  const roleta = Math.random() * total;
  let acumulado = 0;

  for (let i = 0; i < arquivos.length; i++) {
    acumulado += arquivos[i].chance;
    if (roleta <= acumulado) {
      return i;
    }
  }
  return 0; // Fallback
}

// Exibe o wallpaper sorteado
function exibirWallpaper(index) {
  current = index;
  const atual = arquivos[current];

  // Salva no histórico se ainda não estiver lá
  if (!historico.includes(current)) {
    historico.push(current);
    localStorage.setItem("historicoVistos", JSON.stringify(historico));
  }

  atualizarContadorVisual();

  // Atualiza imagem de fundo
  if (wallpaperContainer) {
    wallpaperContainer.style.backgroundImage = `url(wallpaper/${atual.imagem})`;
  }

  // Toca o som
  audio.src = `sons/${atual.som}`;
  audio.currentTime = 0;
  audio.play();

  // Exibe área de feedback
  if (feedback) {
    feedback.style.display = "flex";
  }

  loadVotes(current);
  enableVoting();
}

// Carrega votos salvos
function loadVotes(index) {
  const likes = localStorage.getItem(`likes_${index}`) || 0;
  const dislikes = localStorage.getItem(`dislikes_${index}`) || 0;
  likeCount.textContent = likes;
  dislikeCount.textContent = dislikes;
}

// Registra voto
function vote(type) {
  if (hasVoted) {
    alert("Você já votou nesse wallpaper!");
    return;
  }

  const countKey = `${type}_${current}`;
  let count = parseInt(localStorage.getItem(countKey) || "0");
  count++;
  localStorage.setItem(countKey, count);

  loadVotes(current);
  disableVoting();
  hasVoted = true;
}

// Desativa botões de voto
function disableVoting() {
  likeBtn.disabled = true;
  dislikeBtn.disabled = true;
  likeBtn.style.opacity = 0.5;
  dislikeBtn.style.opacity = 0.5;
}

// Ativa botões de voto
function enableVoting() {
  likeBtn.disabled = false;
  dislikeBtn.disabled = false;
  likeBtn.style.opacity = 1;
  dislikeBtn.style.opacity = 1;
  hasVoted = false;
}

// Atualiza contador visual de wallpapers coletados
function atualizarContadorVisual() {
  const historicoUnico = [...new Set(historico)];
  contador.textContent = `${historicoUnico.length} de ${arquivos.length} coletados`;
}

// Modo visualização em tela cheia
function entrarModoVisualizacao(item) {
  document.body.style.backgroundImage = `url(wallpaper/${item.imagem})`;
  audio.src = `sons/${item.som}`;
  audio.currentTime = 0;
  audio.play();

  const historicoContainer = document.getElementById("historico");
  if (historicoContainer) historicoContainer.style.display = "none";

  const visualizacao = document.createElement("div");
  visualizacao.id = "visualizacao";
  visualizacao.style.cssText = `
    position: fixed;
    top: 0; left: 0;
    width: 100%; height: 100%;
    background-image: url(wallpaper/${item.imagem});
    background-size: cover;
    background-position: center;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    padding: 20px;
  `;

  const voltarBtn = document.createElement("button");
  voltarBtn.textContent = "← Voltar";
  voltarBtn.style.cssText = `
    padding: 10px 20px;
    font-size: 16px;
    margin-bottom: 20px;
  `;
  voltarBtn.onclick = () => {
    visualizacao.remove();
    if (historicoContainer) historicoContainer.style.display = "flex";
    audio.pause();
  };

  visualizacao.appendChild(voltarBtn);
  document.body.appendChild(visualizacao);
}

// EVENTOS
if (button) {
  button.addEventListener("click", () => {
    const sorteado = sortearWallpaper();
    exibirWallpaper(sorteado);
  });

  likeBtn.addEventListener("click", () => vote("likes"));
  dislikeBtn.addEventListener("click", () => vote("dislikes"));
}

atualizarContadorVisual();

// HISTÓRICO (exibido na página historico.html)
if (window.location.pathname.includes("historico.html")) {
  const container = document.getElementById("historico");
  container.innerHTML = ""; // Limpa antes de renderizar

  // Remove duplicatas do histórico usando Set
  const historicoUnico = [...new Set(historico)];

  // Percorre cada índice único do histórico
  historicoUnico.forEach(index => {
    const item = arquivos[index]; // Pega o item correspondente no array de arquivos
    if (!item) return; // Se não existir (por segurança), pula

    // Cria um bloco visual para cada item do histórico
    const bloco = document.createElement("div");
    bloco.className = "historico-item"; // Classe para estilização

    // Botão com o nome do wallpaper, que ativa o modo visualização
    const btn = document.createElement("button");
    btn.textContent = item.nome;
    btn.onclick = () => entrarModoVisualizacao(item);

    // Links para download da música e do wallpaper
    const linkContainer = document.createElement("div");
    linkContainer.innerHTML = `
      <a href="sons/${item.som}" download>🎵 Baixar Música</a><br>
      <a href="wallpaper/${item.imagem}" download>🖼️ Baixar Wallpaper</a>
    `;

    // Junta tudo no bloco e adiciona ao container
    bloco.appendChild(btn);
    bloco.appendChild(linkContainer);
    container.appendChild(bloco);
  });
}

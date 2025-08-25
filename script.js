const wallpapers = [
    "wallpaper/misterBombastic.gif",
    "wallpaper/Itachi.gif",
    "wallpaper/Shadow.gif"
];
const sounds = [
    "sons/misterBombastic.mp3",
    "sons/itachi.mp3",
    "sons/shadow.mp3"
];
let current = -1;
let hasVoted = false;

const body = document.body;
const button = document.getElementById("changeBtn");
const audio = new Audio();

const feedback = document.getElementById("feedback");
const likeBtn = document.getElementById("likeBtn");
const dislikeBtn = document.getElementById("dislikeBtn");
const likeCount = document.getElementById("likeCount");
const dislikeCount = document.getElementById("dislikeCount");

const showDownloadsBtn = document.getElementById("showDownloadsBtn");
const downloads = document.getElementById("downloads");

// Carrega votos salvos
function loadVotes(index) {
  const likes = localStorage.getItem(`likes_${index}`) || 0;
  const dislikes = localStorage.getItem(`dislikes_${index}`) || 0;
  likeCount.textContent = likes;
  dislikeCount.textContent = dislikes;
}

// Salva voto (uma vez por exibição)
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

// Desativa botões após voto
function disableVoting() {
  likeBtn.disabled = true;
  dislikeBtn.disabled = true;
  likeBtn.style.opacity = 0.5;
  dislikeBtn.style.opacity = 0.5;
}

// Ativa botões ao trocar wallpaper
function enableVoting() {
  likeBtn.disabled = false;
  dislikeBtn.disabled = false;
  likeBtn.style.opacity = 1;
  dislikeBtn.style.opacity = 1;
  hasVoted = false;
}

// Troca wallpaper e som
function changeWallpaperAndSound() {
  current = (current + 1) % wallpapers.length;
  body.style.backgroundImage = `url(${wallpapers[current]})`;
  audio.src = sounds[current];
  audio.currentTime = 0;
  audio.play();

  feedback.style.display = "flex";
  loadVotes(current);
  enableVoting();
}

// Mostra os links de download
function mostrarDownloads() {
  downloads.style.display = "block";
}

// Eventos
button.addEventListener("click", changeWallpaperAndSound);
likeBtn.addEventListener("click", () => vote("likes"));
dislikeBtn.addEventListener("click", () => vote("dislikes"));
showDownloadsBtn.addEventListener("click", mostrarDownloads);
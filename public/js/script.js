const gameList = document.getElementById("gameList");
const tagButtons = document.querySelectorAll(".tag-btn");
const gameCardTemplate = document.getElementById("gameCard");

let games = [];
let selectedTags = [];

// Função para buscar jogos no backend passando tags
function fetchGamesByTags(tagsArray) {
  if (tagsArray.length === 0) {
    games = [];
    renderGames();
    return;
  }

  const tagsParam = tagsArray.join(",");
  fetch(`http://localhost:3000/games?tags=${encodeURIComponent(tagsParam)}`)
    .then(res => res.json())
    .then(data => {
      games = data;
      renderGames();
    })
    .catch(err => {
      console.error("Erro ao carregar jogos:", err);
    });
}

// Renderiza a lista de jogos na tela
function renderGames() {
  gameList.innerHTML = "";

  if (games.length === 0) {
    gameList.innerHTML = `<p class="no-results">Nenhum jogo encontrado.</p>`;
    return;
  }

  games.forEach(game => {
    const clone = gameCardTemplate.content.cloneNode(true);
    const card = clone.querySelector(".game-card");
    card.querySelector("h3").textContent = game.title;

    const tagsContainer = card.querySelector(".tags");
    tagsContainer.innerHTML = "";

    game.tags.forEach(tag => {
      const span = document.createElement("span");
      span.textContent = tag;
      tagsContainer.appendChild(span);
    });

    gameList.appendChild(clone);
  });
}

// Alterna seleção das tags e chama a busca
tagButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    btn.classList.toggle("selected");
    const tag = btn.textContent.toLowerCase();

    if (btn.classList.contains("selected")) {
      if (!selectedTags.includes(tag)) selectedTags.push(tag);
    } else {
      selectedTags = selectedTags.filter(t => t !== tag);
    }

    fetchGamesByTags(selectedTags);
  });
});

// Opcional: busca inicial sem filtro (vazio)
games = [];
renderGames();

const button = document.querySelector(".profile_button");
const dropdown = document.getElementById("profileDropdown");

button.addEventListener("mouseenter", () => {
  dropdown.style.display = "flex";
});

button.addEventListener("mouseleave", () => {
  setTimeout(() => {
    if (!dropdown.matches(':hover')) {
      dropdown.style.display = "none";
    }
  }, 200);
});

dropdown.addEventListener("mouseleave", () => {
  dropdown.style.display = "none";
});

//login
window.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("usuarioLogado"));
  const profileButton = document.getElementById("profileButton");

  if (user) {
    profileButton.style.backgroundImage = `url('${user.fotoUrl}')`;
    profileButton.textContent = "";
    profileButton.onclick = () => {
      window.location.href = "/perfil.html";
    };
  } else {
    profileButton.onclick = () => {
      window.location.href = "/register.html";
    };
  }
});

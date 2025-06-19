document.addEventListener('DOMContentLoaded', async () => {
  // Elementos do DOM
  const tagsContainer = document.getElementById('tagsContainer');
  const searchBtn = document.getElementById('searchBtn');
  const resultsContainer = document.getElementById('resultsContainer');
  
  // Carregar tags do servidor
  async function loadTags() {
    try {
      const response = await fetch('/api/tags');
      if (!response.ok) throw new Error('Erro ao carregar tags');
      
      const tags = await response.json();
      renderTags(tags);
    } catch (error) {
      console.error('Erro:', error);
      tagsContainer.innerHTML = '<p class="error">Erro ao carregar tags</p>';
    }
  }
  
  // Renderizar tags na tela
  function renderTags(tags) {
    tagsContainer.innerHTML = '';
    
    tags.forEach(tag => {
      const tagElement = document.createElement('div');
      tagElement.className = 'tag';
      tagElement.dataset.id = tag.id;
      tagElement.textContent = tag.nome;
      
      tagElement.addEventListener('click', () => {
        tagElement.classList.toggle('selected');
      });
      
      tagsContainer.appendChild(tagElement);
    });
  }
  
  // Buscar jogos pelas tags selecionadas
  async function searchGames() {
    const selectedTags = Array.from(document.querySelectorAll('.tag.selected'));
    
    if (selectedTags.length === 0) {
      alert('Selecione pelo menos uma tag');
      return;
    }
    
    const tagIds = selectedTags.map(tag => tag.dataset.id);
    
    try {
      const response = await fetch('/api/jogos/tags', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tagIds })
      });
      
      if (!response.ok) throw new Error('Erro na busca');
      
      const jogos = await response.json();
      renderResults(jogos);
    } catch (error) {
      console.error('Erro:', error);
      resultsContainer.innerHTML = '<p class="error">Erro ao buscar jogos</p>';
    }
  }
  
  // Renderizar resultados da busca
  function renderResults(jogos) {
    resultsContainer.innerHTML = '';
    
    if (jogos.length === 0) {
      resultsContainer.innerHTML = '<p>Nenhum jogo encontrado com essas tags</p>';
      return;
    }
    
    jogos.forEach(jogo => {
      const jogoCard = document.createElement('div');
      jogoCard.className = 'jogo-card';
      
      // Imagem do jogo (se existir)
      if (jogo.imagem_url) {
        const img = document.createElement('img');
        img.src = jogo.imagem_url;
        img.alt = jogo.nome;
        jogoCard.appendChild(img);
      }
      
      // Informações do jogo
      const info = document.createElement('div');
      info.className = 'jogo-info';
      
      const title = document.createElement('h3');
      title.textContent = jogo.nome;
      info.appendChild(title);
      
      if (jogo.data_lancamento) {
        const date = new Date(jogo.data_lancamento);
        const dateElem = document.createElement('p');
        dateElem.className = 'release-date';
        dateElem.textContent = `Lançamento: ${date.toLocaleDateString()}`;
        info.appendChild(dateElem);
      }
      
      // Tags do jogo
      if (jogo.tags && jogo.tags.length > 0) {
        const tagsContainer = document.createElement('div');
        tagsContainer.className = 'jogo-tags';
        
        jogo.tags.forEach(tag => {
          const tagElem = document.createElement('span');
          tagElem.className = 'tag';
          tagElem.textContent = tag.nome;
          tagsContainer.appendChild(tagElem);
        });
        
        info.appendChild(tagsContainer);
      }
      
      // Descrição do jogo
      if (jogo.descricao) {
        const desc = document.createElement('p');
        desc.className = 'description';
        desc.textContent = jogo.descricao;
        info.appendChild(desc);
      }
      
      jogoCard.appendChild(info);
      resultsContainer.appendChild(jogoCard);
    });
  }
  
  // Event Listeners
  searchBtn.addEventListener('click', searchGames);
  
  // Inicialização
  loadTags();
});
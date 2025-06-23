const searchButton = document.querySelector('.search_button');
const dropdown = document.getElementById('search_dropdown');

// Toggle do dropdown
searchButton.addEventListener('click', () => {
  dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
});

// Função para carregar todas as tags
async function carregarTags() {
  try {
    const res = await fetch('http://localhost:3000/tags');
    if (!res.ok) throw new Error('Erro ao carregar tags');
    
    const tags = await res.json();
    if (!Array.isArray(tags)) throw new Error('Formato de tags inválido');

    dropdown.innerHTML = '';

    // Agrupar tags por categoria
    const categorias = {};
    tags.forEach(tag => {
      if (!categorias[tag.categoria]) {
        categorias[tag.categoria] = [];
      }
      categorias[tag.categoria].push(tag);
    });

    for (const categoria in categorias) {
      const grupo = document.createElement('div');
      grupo.classList.add('tag-group');

      const titulo = document.createElement('h3');
      titulo.textContent = categoria;
      titulo.classList.add('tag-group-title');
      grupo.appendChild(titulo);

      categorias[categoria].forEach(tag => {
        const tagElement = document.createElement('div');
        tagElement.classList.add('tag-chip');
        tagElement.textContent = tag.nome;
        tagElement.dataset.id = tag.id;

        tagElement.addEventListener('click', () => {
          tagElement.classList.toggle('selected');
          atualizarJogosExibidos();
        });

        grupo.appendChild(tagElement);
      });

      dropdown.appendChild(grupo);
    }

  } catch (err) {
    console.error('Erro ao carregar tags:', err);
    dropdown.innerHTML = '<p style="color:white;">Erro ao carregar tags.</p>';
  }
}

// Função para buscar todos os jogos
async function buscarTodosJogos() {
  try {
    const res = await fetch('http://localhost:3000/jogos');
    if (!res.ok) throw new Error(`Erro HTTP! status: ${res.status}`);
    
    const jogos = await res.json();
    if (!Array.isArray(jogos)) throw new Error('Resposta não é um array');
    
    return jogos;
  } catch (err) {
    console.error('Erro ao buscar jogos:', err);
    return [];
  }
}

// Função para buscar jogos por tags
async function buscarJogosPorTags(tagIds) {
  // Normalização dos IDs
  if (!tagIds) tagIds = [];
  if (!Array.isArray(tagIds)) tagIds = [tagIds];
  
  // Converter para números válidos
  const numericTagIds = tagIds
    .map(id => {
      const num = parseInt(id, 10);
      return isNaN(num) ? null : num;
    })
    .filter(id => id !== null);

  try {
    console.log('Buscando jogos para tags:', numericTagIds);

    const response = await fetch('http://localhost:3000/jogos/jogos-por-tags', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ tagIds: numericTagIds })
    });

    // Tratamento de erro melhorado
    if (!response.ok) {
      const errorText = await response.text();
      let errorData;
      
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { error: `Erro ${response.status}: ${errorText || response.statusText}` };
      }
      
      throw new Error(errorData.error || errorData.message || 'Erro na requisição');
    }

    const data = await response.json();
    
    if (!Array.isArray(data)) {
      throw new Error('Formato de resposta inválido');
    }

    return data;

  } catch (error) {
    console.error('Falha ao buscar jogos:', {
      error: error.toString(),
      tagIds: numericTagIds,
      stack: error.stack
    });

    // Exibição de erro amigável
    const container = document.getElementById('jogosContainer');
    if (container) {
      container.innerHTML = `
        <div class="error-message">
          <h3>Erro ao filtrar jogos</h3>
          <p>${error.message}</p>
          <div class="error-details">
            <p>Tags selecionadas: ${numericTagIds.join(', ')}</p>
            <button onclick="atualizarJogosExibidos()">Tentar novamente</button>
          </div>
        </div>
      `;
    }

    return [];
  }
}

// Função para atualizar a exibição dos jogos
async function atualizarJogosExibidos() {
  const tagsSelecionadas = document.querySelectorAll('.tag-chip.selected');
  const tagIds = Array.from(tagsSelecionadas).map(tag => tag.dataset.id);

  const jogosContainer = document.getElementById('jogosContainer');
  jogosContainer.innerHTML = '<p style="color:white;">Carregando jogos...</p>';

  let jogos;
  if (tagIds.length === 0) {
    jogos = await buscarTodosJogos();
  } else {
    jogos = await buscarJogosPorTags(tagIds);
  }

  exibirJogos(jogos);
}

// Função para exibir jogos
function exibirJogos(jogos) {
  const jogosContainer = document.getElementById('jogosContainer');
  jogosContainer.innerHTML = '';

  if (!Array.isArray(jogos) || jogos.length === 0) {
    jogosContainer.innerHTML = `
      <div class="no-games-container">
        <p style="color: white;">Nenhum jogo encontrado com as tags selecionadas</p>
        <button id="btnAdicionarJogo" class="add-game-button">
          <i class="fas fa-plus"></i> Adicionar Novo Jogo
        </button>
      </div>
    `;
    
    // Adiciona o evento de clique ao botão
    document.getElementById('btnAdicionarJogo')?.addEventListener('click', () => {
      abrirModalAdicionarJogo();
    });
    return;
  }

  // Código existente para exibir jogos
  jogos.forEach(jogo => {
    const div = document.createElement('div');
    div.classList.add('jogo-card');
    div.innerHTML = `
      <img src="${jogo.imagem_url || 'placeholder.jpg'}" alt="${jogo.nome}">
      <h3>${jogo.nome}</h3>
      ${jogo.descricao ? `<p>${jogo.descricao.substring(0, 100)}...</p>` : ''}
    `;
    jogosContainer.appendChild(div);
  });
}

// Inicialização
document.addEventListener('DOMContentLoaded', async () => {
  await carregarTags();
  await atualizarJogosExibidos(); // Mostra todos os jogos inicialmente
});

function abrirModalAdicionarJogo() {
  // Cria o modal
  const modal = document.createElement('div');
  modal.className = 'modal-overlay';
  modal.innerHTML = `
    <div class="modal-content">
      <h2>Adicionar Novo Jogo</h2>
      <form id="formAdicionarJogo">
        <div class="form-group">
          <label for="nomeJogo">Nome do Jogo:</label>
          <input type="text" id="nomeJogo" required>
        </div>
        
        <div class="form-group">
          <label for="descricaoJogo">Descrição:</label>
          <textarea id="descricaoJogo" rows="4"></textarea>
        </div>
        
        <div class="form-group">
          <label for="imagemJogo">URL da Imagem:</label>
          <input type="url" id="imagemJogo">
        </div>
        
        <div class="form-group">
          <label>Tags:</label>
          <div id="tagsDisponiveis" class="tags-container"></div>
        </div>
        
        <div class="modal-actions">
          <button type="button" class="cancel-button">Cancelar</button>
          <button type="submit" class="submit-button">Salvar Jogo</button>
        </div>
      </form>
    </div>
  `;

  document.body.appendChild(modal);

  // Carrega as tags disponíveis
  carregarTagsParaModal();

  // Fecha o modal ao clicar no botão cancelar
  modal.querySelector('.cancel-button').addEventListener('click', () => {
    document.body.removeChild(modal);
  });

  // Submissão do formulário
  modal.querySelector('#formAdicionarJogo').addEventListener('submit', async (e) => {
    e.preventDefault();
    await salvarNovoJogo();
    document.body.removeChild(modal);
  });
}

async function carregarTagsParaModal() {
  try {
    const response = await fetch('http://localhost:3000/tags');
    const tags = await response.json();
    const container = document.getElementById('tagsDisponiveis');
    
    tags.forEach(tag => {
      const tagElement = document.createElement('div');
      tagElement.className = 'modal-tag-chip';
      tagElement.innerHTML = `
        <input type="checkbox" id="tag-${tag.id}" value="${tag.id}">
        <label for="tag-${tag.id}">${tag.nome}</label>
      `;
      container.appendChild(tagElement);
    });
  } catch (error) {
    console.error('Erro ao carregar tags:', error);
  }
}

async function salvarNovoJogo() {
  const nome = document.getElementById('nomeJogo').value;
  const descricao = document.getElementById('descricaoJogo').value;
  const imagemUrl = document.getElementById('imagemJogo').value;
  
  // Coleta as tags selecionadas
  const tagsSelecionadas = Array.from(
    document.querySelectorAll('#tagsDisponiveis input[type="checkbox"]:checked')
  ).map(checkbox => parseInt(checkbox.value));

  try {
    // 1. Cria o jogo com as tags em uma única transação
    const response = await fetch('http://localhost:3000/jogos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nome,
        descricao,
        imagem_url: imagemUrl,
        tags: tagsSelecionadas  // Envia as tags junto com o jogo
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Erro ao criar jogo');
    }

    // 2. Atualiza a lista de jogos
    await atualizarJogosExibidos();
    
    // 3. Fecha o modal
    document.querySelector('.modal-overlay')?.remove();
    
    // 4. Feedback visual
    alert('Jogo criado com sucesso!');
    
  } catch (error) {
    console.error('Erro ao salvar jogo:', error);
    alert(`Erro ao salvar o jogo: ${error.message}`);
  }
}
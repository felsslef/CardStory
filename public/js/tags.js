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

    dropdown.innerHTML = '';                                              // limpa

    // agrupa por categoria
    const grupos = {};
    tags.forEach(t => (grupos[t.categoria] = grupos[t.categoria] || []).push(t));

    // monta cada categoria
    Object.entries(grupos).forEach(([categoria, lista]) => {
      const grupo = document.createElement('div');
      grupo.className = 'tag-group';
      grupo.innerHTML = `<h3 class="tag-group-title">${categoria}</h3>`;
      lista.forEach(tag => {
        const chip = document.createElement('div');
        chip.className = 'tag-chip';
        chip.dataset.id = tag.id;

        // nome
        const nomeSpan = document.createElement('span');
        nomeSpan.textContent = tag.nome;
        chip.appendChild(nomeSpan);

        // botão editar
        const bEd = document.createElement('button');
        bEd.textContent = '✏️';
        bEd.title = 'Editar';
        bEd.style.cssText = 'margin-left:8px;background:transparent;border:none';
        bEd.onclick = e => { e.stopPropagation(); editTag(tag); };
        chip.appendChild(bEd);

        // botão deletar
        const bDel = document.createElement('button');
        bDel.textContent = '🗑️';
        bDel.title  = 'Excluir';
        bDel.style.cssText = 'margin-left:5px;background:transparent;border:none';
        bDel.onclick = async e => {
          e.stopPropagation();
          if (!confirm(`Excluir a tag "${tag.nome}"?`)) return;
          try {
            const r = await fetch(`http://localhost:3000/tags/${tag.id}`, { method:'DELETE' });
            if (!r.ok) throw new Error('Falha ao excluir tag');
            await carregarTags();
            atualizarJogosExibidos();
          } catch (err) { alert(err.message); }
        };
        chip.appendChild(bDel);

        // seleção para filtro
        chip.onclick = () => {
          chip.classList.toggle('selected');
          atualizarJogosExibidos();
        };

        grupo.appendChild(chip);
      });
      dropdown.appendChild(grupo);
    });

    // botão "Adicionar Tag" no fim
    const btnAdd = document.createElement('button');
    btnAdd.textContent = '➕ Adicionar Tag';
    btnAdd.style.cssText = `
      width:100%;padding:10px;margin-top:10px;background:#222;color:#fff;
      border:none;border-radius:4px;cursor:pointer`;
    btnAdd.onclick = abrirModalAdicionarTag;
    dropdown.appendChild(btnAdd);

  } catch (err) {
    console.error(err);
    dropdown.innerHTML = '<p style="color:white;">Erro ao carregar tags.</p>';
  }
}

async function abrirModalAdicionarTag() {
  // carrega categorias existentes
  fetch('http://localhost:3000/tags')
    .then(r => r.json())
    .then(tags => {
      const categorias = [...new Set(tags.map(t => t.categoria))];
      const opts = categorias.map(c => `<option value="${c}">${c}</option>`).join('');

      const modal = document.createElement('div');
      modal.className = 'modal-overlay';
      modal.style.cssText = `
        position:fixed;inset:0;background:rgba(0,0,0,.8);
        display:flex;align-items:center;justify-content:center;z-index:1000`;
      modal.innerHTML = `
        <div style="background:#1a1a1a;padding:20px;border-radius:8px;color:#fff;width:280px">
          <h3 style="margin-top:0">Nova Tag</h3>
          <form id="formAddTag">
            <label>Nome:</label>
            <input id="nomeTag" style="width:100%;padding:6px;margin:4px 0" required>
            <label>Categoria:</label>
            <select id="catTag" style="width:100%;padding:6px;margin:4px 0">${opts}</select>
            <div style="text-align:right;margin-top:8px">
              <button type="button" id="cancelTag" style="margin-right:8px">Cancelar</button>
              <button type="submit">Salvar</button>
            </div>
          </form>
        </div>`;
      document.body.appendChild(modal);

      modal.querySelector('#cancelTag').onclick = () => document.body.removeChild(modal);

      modal.querySelector('#formAddTag').onsubmit = async (e) => {
        e.preventDefault();
        const nome = document.getElementById('nomeTag').value.trim();
        const categoria = document.getElementById('catTag').value;
        try {
          const r = await fetch('http://localhost:3000/tags', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome, categoria })
          });
          if (!r.ok) throw new Error('Falha ao criar tag');
          alert('Tag criada!');
          document.body.removeChild(modal);
          await carregarTags();
          atualizarJogosExibidos();
        } catch (err) {
          alert(err.message);
        }
      };
    })
    .catch(err => alert('Erro ao preparar modal: ' + err));
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
  if (!tagIds) tagIds = [];
  if (!Array.isArray(tagIds)) tagIds = [tagIds];
  
  const numericTagIds = tagIds
    .map(id => {
      const num = parseInt(id, 10);
      return isNaN(num) ? null : num;
    })
    .filter(id => id !== null);

  try {
    const response = await fetch('http://localhost:3000/jogos/jogos-por-tags', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ tagIds: numericTagIds })
    });

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

// Atualiza a lista de jogos exibida
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

// Exibe os jogos no container
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
    
    document.getElementById('btnAdicionarJogo')?.addEventListener('click', () => {
      abrirModalAdicionarJogo();
    });
    return;
  }

  jogos.forEach(jogo => {
    const card = document.createElement('div');
    card.classList.add('jogo-card');

    card.innerHTML = `
      <img src="${jogo.imagem_url || 'placeholder.jpg'}" alt="${jogo.nome}">
      <h3>${jogo.nome}</h3>
      ${jogo.descricao ? `<p>${jogo.descricao.substring(0, 100)}...</p>` : ''}
      <button class="btn-excluir" data-id="${jogo.id}" title="Excluir jogo">🗑️</button>
      <button class="btn-editar" data-id="${jogo.id}" title="Editar jogo">✏️</button>
    `;

    jogosContainer.appendChild(card);
  });

  document.querySelectorAll('.btn-excluir').forEach(botao => {
    botao.addEventListener('click', async (e) => {
      const id = e.target.dataset.id;
      if (!confirm('Tem certeza que deseja excluir este jogo?')) return;

      try {
        const res = await fetch(`http://localhost:3000/jogos/${id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Erro ao excluir jogo');
        await atualizarJogosExibidos();
      } catch (err) {
        alert('Erro ao excluir jogo: ' + err.message);
      }
    });
  });

  document.querySelectorAll('.btn-editar').forEach(botao => {
    botao.addEventListener('click', () => {
      const id = botao.dataset.id;
      const jogo = jogos.find(j => j.id == id);
      if (!jogo) return console.error('Jogo não encontrado para editar:', id);
      abrirModalEditarJogo(jogo);
    });
  });
}

function abrirModalEditarJogo(jogo) {
  const modal = document.createElement('div');
  modal.className = 'modal-overlay';
  modal.innerHTML = `
    <div class="modal-content">
      <h2>Editar Jogo</h2>
      <form id="formEditarJogo">
        <div class="form-group">
          <label for="nomeJogoEditar">Nome do Jogo:</label>
          <input type="text" id="nomeJogoEditar" value="${jogo.nome || ''}" required>
        </div>

        <div class="form-group">
          <label for="descricaoJogoEditar">Descrição:</label>
          <textarea id="descricaoJogoEditar" rows="4">${jogo.descricao || ''}</textarea>
        </div>

        <div class="form-group">
          <label for="imagemJogoEditar">URL da Imagem:</label>
          <input type="url" id="imagemJogoEditar" value="${jogo.imagem_url || ''}">
        </div>

        <div class="form-group">
          <label>Tags:</label>
          <div id="tagsEditar" class="tags-container"></div>
        </div>

        <div class="modal-actions">
          <button type="button" class="cancel-button">Cancelar</button>
          <button type="submit" class="submit-button">Salvar Alterações</button>
        </div>
      </form>
    </div>
  `;

  document.body.appendChild(modal);

  // Fecha o modal ao clicar em cancelar
  modal.querySelector('.cancel-button').addEventListener('click', () => {
    document.body.removeChild(modal);
  });

  // Carrega as tags com pré-seleção para o jogo
  carregarTagsParaEditar(jogo);

  // Tratar submissão do formulário de edição
  modal.querySelector('#formEditarJogo').addEventListener('submit', async (e) => {
    e.preventDefault();
    await salvarJogoEditado(jogo.id);
    document.body.removeChild(modal);
    await atualizarJogosExibidos();
  });
}

// Carrega tags no modal de edição e marca as que já pertencem ao jogo
async function carregarTagsParaEditar(jogo) {
  const container = document.getElementById('tagsEditar');
  container.innerHTML = ''; // limpa antes

  try {
    const response = await fetch('http://localhost:3000/tags');
    const todasTags = await response.json();

    // Pegando ids das tags do jogo, assumindo que jogo.JogoTags é array com {tag: {id,...}}
    const tagsDoJogo = (jogo.JogoTags || []).map(rel => rel.tag.id);

    todasTags.forEach(tag => {
      const tagEl = document.createElement('div');
      tagEl.className = 'modal-tag-chip';
      tagEl.innerHTML = `
        <input type="checkbox" id="tag-edit-${tag.id}" value="${tag.id}" ${tagsDoJogo.includes(tag.id) ? 'checked' : ''}>
        <label for="tag-edit-${tag.id}">${tag.nome}</label>
      `;
      container.appendChild(tagEl);
    });

  } catch (error) {
    console.error('Erro ao carregar tags para editar:', error);
  }
}

// Função para salvar as alterações do jogo
async function salvarJogoEditado(id) {
  const nome = document.getElementById('nomeJogoEditar').value.trim();
  const descricao = document.getElementById('descricaoJogoEditar').value.trim();
  const imagem_url = document.getElementById('imagemJogoEditar').value.trim();

  const tagsSelecionadas = Array.from(
    document.querySelectorAll('#tagsEditar input[type="checkbox"]:checked')
  ).map(cb => parseInt(cb.value));

  if (!nome) {
    alert('Nome do jogo é obrigatório!');
    return;
  }

  try {
    const res = await fetch(`http://localhost:3000/jogos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome, descricao, imagem_url, tags: tagsSelecionadas }),
    });

    if (!res.ok) {
      const erro = await res.json();
      throw new Error(erro.error || 'Erro ao atualizar jogo');
    }

    alert('Jogo atualizado com sucesso!');

  } catch (err) {
    alert('Erro ao salvar edição: ' + err.message);
    console.error(err);
  }
}


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

  // Carrega as tags disponíveis para seleção
  carregarTagsParaModal();

  // Fecha o modal ao clicar no cancelar
  modal.querySelector('.cancel-button').addEventListener('click', () => {
    document.body.removeChild(modal);
  });

  // Trata o envio do formulário para salvar o jogo
  modal.querySelector('#formAdicionarJogo').addEventListener('submit', async (e) => {
    e.preventDefault();
    await salvarNovoJogo();
    document.body.removeChild(modal);
  });
}

// Função para carregar as tags dentro do modal adicionar jogo
async function carregarTagsParaModal() {
  try {
    const response = await fetch('http://localhost:3000/tags');
    const tags = await response.json();
    const container = document.getElementById('tagsDisponiveis');
    
    container.innerHTML = ''; // Limpa antes de preencher

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

// Função para salvar novo jogo no backend
async function salvarNovoJogo() {
  const nome = document.getElementById('nomeJogo').value.trim();
  const descricao = document.getElementById('descricaoJogo').value.trim();
  const imagemUrl = document.getElementById('imagemJogo').value.trim();
  
  // Pega as tags selecionadas
  const tagsSelecionadas = Array.from(
    document.querySelectorAll('#tagsDisponiveis input[type="checkbox"]:checked')
  ).map(checkbox => parseInt(checkbox.value));

  if (!nome) {
    alert('Nome do jogo é obrigatório!');
    return;
  }

  try {
    const response = await fetch('http://localhost:3000/jogos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nome,
        descricao,
        imagem_url: imagemUrl,
        tags: tagsSelecionadas
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Erro ao criar jogo');
    }

    alert('Jogo criado com sucesso!');
    await atualizarJogosExibidos(); // Atualiza lista
  } catch (error) {
    alert(`Erro ao salvar o jogo: ${error.message}`);
    console.error(error);
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  await carregarTags();
  await atualizarJogosExibidos();
});

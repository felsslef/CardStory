const searchButton = document.querySelector('.search_button');
const dropdown = document.getElementById('search_dropdown');

// Alternar visibilidade do dropdown
searchButton.addEventListener('click', () => {
  dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
});

// Função para carregar as tags da API
async function carregarTags() {
  try {
    const res = await fetch('http://localhost:3000/tags');
    const tags = await res.json();

    const dropdown = document.getElementById('search_dropdown');
    dropdown.innerHTML = '';

    // Agrupar tags por categoria
    const categorias = {};
    tags.forEach(tag => {
      if (!categorias[tag.categoria]) {
        categorias[tag.categoria] = [];
      }
      categorias[tag.categoria].push(tag);
    });

    // Criar seções por categoria
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
        });

        grupo.appendChild(tagElement);
      });

      dropdown.appendChild(grupo);
    }

  } catch (err) {
    console.error('Erro ao carregar tags:', err);
    document.getElementById('search_dropdown').innerHTML = '<p style="color:white;">Erro ao carregar tags.</p>';
  }
}


// Chama a função quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', carregarTags);

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

function updateProfileButton() {
  const userData = localStorage.getItem('usuarioLogado');
  const profileButton = document.getElementById('profileButton');
  const profileDropdown = document.getElementById('profileDropdown');

  if (userData) {
    try {
      const user = JSON.parse(userData);

      profileButton.innerHTML = '';
      profileButton.style.backgroundImage = `url('${user.fotoUrl}')`;
      profileButton.style.backgroundSize = 'cover';
      profileButton.style.backgroundPosition = 'center';
      profileButton.style.borderRadius = '50%';
      profileButton.style.width = '40px';
      profileButton.style.height = '40px';
      profileButton.style.padding = '0';

      profileDropdown.innerHTML = `
        <button onclick="openEditPhotoModal()">Editar Foto</button>
        <button onclick="logout()">Sair</button>
      `;

    } catch (error) {
      console.error('Erro ao processar dados do usuário:', error);
    }
  }
}

document.addEventListener('DOMContentLoaded', updateProfileButton);
window.addEventListener('storage', updateProfileButton);

function logout() {
  localStorage.removeItem('usuarioLogado');
  window.location.href = '/login.html';
}

function toggleDropdown() {
  const dropdown = document.getElementById("profileDropdown");
  dropdown.style.display = dropdown.style.display === "flex" ? "none" : "flex";

  document.addEventListener("click", function(event) {
    const dropdown = document.getElementById("profileDropdown");
    const button = document.querySelector(".profile_button");
    if (!dropdown.contains(event.target) && !button.contains(event.target)) {
      dropdown.style.display = "none";
    }
  });
}

const editPhotoModal = document.getElementById('editPhotoModal');
const closeModal = document.querySelector('.close-modal');
const photoUrlInput = document.getElementById('photoUrlInput');
const confirmEdit = document.getElementById('confirmEdit');

function openEditPhotoModal() {
  const user = JSON.parse(localStorage.getItem('usuarioLogado'));
  photoUrlInput.value = user.fotoUrl || '';
  editPhotoModal.style.display = 'block';
}

function closeEditPhotoModal() {
  editPhotoModal.style.display = 'none';
}

closeModal.addEventListener('click', closeEditPhotoModal);

confirmEdit.addEventListener('click', async () => {
  const novaFotoUrl = photoUrlInput.value.trim();
  const user = JSON.parse(localStorage.getItem('usuarioLogado'));

  if (!novaFotoUrl || !user || !user.Username) {
    alert('URL inválida ou usuário não encontrado.');
    return;
  }

  try {
    const response = await fetch('http://localhost:3000/usuarios/update-photo', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },

      body: JSON.stringify({
        username: user.Username,
        fotoUrl: novaFotoUrl
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Erro da API:', response.status, errorData);
      alert(errorData.error || 'Erro ao atualizar a foto no servidor.');
      return;
    }

    const data = await response.json();

    const updatedUser = { ...user, fotoUrl: novaFotoUrl };
    localStorage.setItem('usuarioLogado', JSON.stringify(updatedUser));

    updateProfileButton();
    closeEditPhotoModal();

  } catch (error) {
    console.error('Erro ao atualizar foto de perfil:', error);
    alert('Erro ao atualizar a foto de perfil. Tente novamente.');
  }
});

window.addEventListener('click', (event) => {
  if (event.target === editPhotoModal) {
    closeEditPhotoModal();
  }
});

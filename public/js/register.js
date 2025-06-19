document.getElementById("registroForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const form = e.target;
  const senha = form.senha.value;
  const confirmarSenha = form.confirmarSenha.value;
  const mensagem = document.getElementById("mensagem");

  if (senha !== confirmarSenha) {
    mensagem.style.color = "red";
    mensagem.textContent = "As senhas não coincidem.";
    return;
  }

  const data = {
    Nome: form.nome.value,
    Sobrenome: form.sobrenome.value,
    Username: form.username.value,
    Email: form.email.value,
    Senha: senha,
    confirmSenha: confirmarSenha,
    Sexo: form.sexo.value || null,
    DataNasc: form.dataNasc.value || null
  };

  try {
    const response = await fetch("http://localhost:3000/usuarios/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const resultado = await response.json();

    if (!response.ok) {
      mensagem.style.color = "red";
      mensagem.textContent = resultado.error || "Erro ao registrar.";
    } else {
      mensagem.style.color = "lightgreen";
      mensagem.textContent = "Usuário cadastrado com sucesso!";
      window.location.href = "/login.html";
      form.reset();
    }
  } catch (error) {
    mensagem.style.color = "red";
    mensagem.textContent = "Erro ao conectar com o servidor.";
  }
});

function toggleSenha(id, elemento) {
  const input = document.getElementById(id);
  const tipoSenha = input.type === "password";
  input.type = tipoSenha ? "text" : "password";
  elemento.textContent = tipoSenha ? "Esconda" : "Mostre";
}

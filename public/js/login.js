document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const usuarioOuEmail = document.getElementById("usuarioOuEmail").value;
  const senha = document.getElementById("senha").value;

  try {
    const res = await fetch("http://localhost:3000/usuarios/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ login: usuarioOuEmail, senha }),
    });

    const dados = await res.json();

    if (!res.ok){ throw new Error(dados.erro || "Login inválido")};

    localStorage.setItem("usuarioLogado", JSON.stringify({
      ...dados.usuario,

      fotoUrl: dados.usuario.fotoUrl
    }));
    
    window.location.href = "/index.html";
  } catch (err) {
    alert("Erro no login: " + err.message);
  }
});

function toggleSenha(id, elemento) {
  const input = document.getElementById(id);
  const tipoSenha = input.type === "password";
  input.type = tipoSenha ? "text" : "password";
  elemento.textContent = tipoSenha ? "Esconda" : "Mostre";
}

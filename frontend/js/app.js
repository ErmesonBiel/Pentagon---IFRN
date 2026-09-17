document.addEventListener("DOMContentLoaded", () => {

  const formCadastro = document.getElementById("formCadastro");
  if (formCadastro) {
    formCadastro.addEventListener("submit", (e) => {
      e.preventDefault();
      
      const nome = document.getElementById("cadNome").value.trim();
      const email = document.getElementById("cadEmail").value.trim();
      const senha = document.getElementById("cadSenha").value;
      const confirmaSenha = document.getElementById("cadConfirmaSenha").value;

      if (!email.includes("@") || !email.includes(".")) {
        alert("Erro: Digite um e-mail válido!");
        return;
      }

      if (senha !== confirmaSenha) {
        alert("Erro: As senhas não correspondem!");
        return;
      }

      const usuarioLogado = { nome, email };
      localStorage.setItem("usuarioLogado", JSON.stringify(usuarioLogado));

      alert("Conta criada com sucesso!");
      window.location.href = "dashboard.html";
    });
  }

  if (document.getElementById("tabelaRankingBody")) {
    renderizarRanking();
  }

  const formPartida = document.getElementById("formPartida");
  if (formPartida) {
    formPartida.addEventListener("submit", (e) => {
      e.preventDefault();

      const j1 = document.getElementById("j1").value.trim();
      const j2 = document.getElementById("j2").value.trim();
      const vencedor = document.getElementById("vencedor").value.trim();
      const placar = document.getElementById("placar").value.trim();

      if (vencedor !== j1 && vencedor !== j2) {
        alert("Erro (RN02): O vencedor deve ser um dos participantes da partida!");
        return;
      }

      const partidas = JSON.parse(localStorage.getItem("pentagon_partidas")) || [];
      partidas.push({ id: Date.now(), jogador1: j1, jogador2: j2, vencedor, placar });
      localStorage.setItem("pentagon_partidas", JSON.stringify(partidas));

      atualizarPontos(vencedor);

      alert("Partida registrada e ranking atualizado!");
      formPartida.reset();
    });
  }

  const userNomeElement = document.getElementById("userNome");
  if (userNomeElement) {
    const userLogado = JSON.parse(localStorage.getItem("usuarioLogado")) || { nome: "Maria Vitória", email: "maria@gmail.com" };
    userNomeElement.innerText = userLogado.nome;
    document.getElementById("userEmail").innerText = userLogado.email;
  }
});

function renderizarRanking() {
  const tbody = document.getElementById("tabelaRankingBody");
  const ranking = JSON.parse(localStorage.getItem("pentagon_ranking")) || [];

  ranking.sort((a, b) => b.pontos - a.pontos);
  tbody.innerHTML = "";

  ranking.forEach((item, index) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>#${index + 1}</td>
      <td>${item.nickname}</td>
      <td><strong>${item.pontos} pts</strong></td>
      <td>${item.vitorias}</td>
      <td>${item.derrotas}</td>
      <td><button onclick="removerJogador(${item.id})" class="btn-del">Excluir</button></td>
    `;
    tbody.appendChild(tr);
  });
}

function atualizarPontos(vencedorNickname) {
  let ranking = JSON.parse(localStorage.getItem("pentagon_ranking")) || [];
  let jogador = ranking.find(j => j.nickname.toLowerCase() === vencedorNickname.toLowerCase());

  if (jogador) {
    jogador.pontos += 3;
    jogador.vitorias += 1;
  } else {
    ranking.push({ id: Date.now(), nickname: vencedorNickname, pontos: 3, vitorias: 1, derrotas: 0 });
  }

  localStorage.setItem("pentagon_ranking", JSON.stringify(ranking));
}

function removerJogador(id) {
  if (confirm("Tem certeza que deseja remover este jogador do ranking?")) {
    let ranking = JSON.parse(localStorage.getItem("pentagon_ranking")) || [];
    ranking = ranking.filter(j => j.id !== id);
    localStorage.setItem("pentagon_ranking", JSON.stringify(ranking));
    renderizarRanking();
  }
}
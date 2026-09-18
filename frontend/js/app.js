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

  const selectJ1 = document.getElementById("j1");
  const selectJ2 = document.getElementById("j2");
  const selectVencedor = document.getElementById("vencedor");

  function carregarJogadoresNosSelects() {
    if (!selectJ1 || !selectJ2) return;

    const ranking = JSON.parse(localStorage.getItem("pentagon_ranking")) || [];

    selectJ1.innerHTML = '<option value="" disabled selected>Selecione o Jogador 1</option>';
    selectJ2.innerHTML = '<option value="" disabled selected>Selecione o Jogador 2</option>';

    ranking.forEach(jogador => {
      const opt1 = document.createElement("option");
      opt1.value = jogador.nickname;
      opt1.textContent = jogador.nickname;
      selectJ1.appendChild(opt1);

      const opt2 = document.createElement("option");
      opt2.value = jogador.nickname;
      opt2.textContent = jogador.nickname;
      selectJ2.appendChild(opt2);
    });
  }

  function atualizarOpcoesVencedor() {
    if (!selectVencedor) return;
    const j1Val = selectJ1.value;
    const j2Val = selectJ2.value;

    selectVencedor.innerHTML = '<option value="" disabled selected>Selecione o Vencedor</option>';

    if (j1Val) {
      const opt1 = document.createElement("option");
      opt1.value = j1Val;
      opt1.textContent = j1Val;
      selectVencedor.appendChild(opt1);
    }
    if (j2Val && j2Val !== j1Val) {
      const opt2 = document.createElement("option");
      opt2.value = j2Val;
      opt2.textContent = j2Val;
      selectVencedor.appendChild(opt2);
    }  
  }

  if (selectJ1 && selectJ2) {
    carregarJogadoresNosSelects();
    selectJ1.addEventListener("change", atualizarOpcoesVencedor);
    selectJ2.addEventListener("change", atualizarOpcoesVencedor);
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
      renderizarChaveamento();

      alert("Partida registrada e ranking atualizado com sucesso!");
      formPartida.reset();
      atualizarOpcoesVencedor();
    });
  }

  if (document.getElementById("bracket-container")){
    renderizarChaveamento();
  }

  // --- DADOS DO PERFIL (CORRIGIDO) ---
  const userNomeElement = document.getElementById("userNome");
  const userEmailElement = document.getElementById("userEmail");

  if (userNomeElement || userEmailElement) {
    const userLogado = JSON.parse(localStorage.getItem("usuarioLogado")) || { nome: "Maria Vitória", email: "maria@gmail.com" };
    if (userNomeElement) userNomeElement.innerText = userLogado.nome || "Maria Vitória";
    if (userEmailElement) userEmailElement.innerText = userLogado.email || "maria@gmail.com";
  }

  // --- HISTÓRICO DO PERFIL (CORRIGIDO) ---
  const historicoList = document.getElementById("historicoPerfil");
  if (historicoList) {
    const partidas = JSON.parse(localStorage.getItem("pentagon_partidas")) || [];
    historicoList.innerHTML = "";

    if (!partidas || partidas.length === 0) {
      historicoList.innerHTML = '<li class="history-item">Nenhuma partida registrada ainda.</li>';
    } else {
      partidas.slice(-5).reverse().forEach(p => {
        const li = document.createElement("li");
        li.className = "history-item";
        
        // Trata os valores para evitar renderizar 'undefined'
        const j1 = p.jogador1 || 'Jogador 1';
        const j2 = p.jogador2 || 'Jogador 2';
        const placar = p.placar ? p.placar : 'vs';
        const vencedor = p.vencedor || 'N/A';

        li.innerHTML = `
          <div class="history-match">
            <span class="player">${j1}</span>
            <span class="score">${placar}</span>
            <span class="player">${j2}</span>
          </div>
          <span class="winner-tag">Vencedor: <strong>${vencedor}</strong></span>
        `;
        historicoList.appendChild(li);
      });
    }
  }
});

function renderizarRanking() {
  const tbody = document.getElementById("tabelaRankingBody");
  if (!tbody) return;
  
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

function renderizarChaveamento() {
  const container = document.getElementById("bracket-container");
  if (!container) return;

  const partidas = JSON.parse(localStorage.getItem("pentagon_partidas")) || [];

  const p1 = partidas[0] ? `${partidas[0].jogador1} vs ${partidas[0].jogador2} (${partidas[0].vencedor})` : "Aguardando...";
  const p2 = partidas[1] ? `${partidas[1].jogador1} vs ${partidas[1].jogador2} (${partidas[1].vencedor})` : "Aguardando...";
  const p3 = partidas[2] ? `${partidas[2].jogador1} vs ${partidas[2].jogador2} (${partidas[2].vencedor})` : "Aguardando...";
  const p4 = partidas[3] ? `${partidas[3].jogador1} vs ${partidas[3].jogador2} (${partidas[3].vencedor})` : "Aguardando...";

  const v1 = partidas[0] ? partidas[0].vencedor : "Aguardando...";
  const v2 = partidas[1] ? partidas[1].vencedor : "Aguardando...";
  const v3 = partidas[2] ? partidas[2].vencedor : "Aguardando...";
  const v4 = partidas[3] ? partidas[3].vencedor : "Aguardando...";

  const semi1 = (partidas[4]) ? `${partidas[4].jogador1} vs ${partidas[4].jogador2} (${partidas[4].vencedor})` : `${v1} vs ${v2}`;
  const semi2 = (partidas[5]) ? `${partidas[5].jogador1} vs ${partidas[5].jogador2} (${partidas[5].vencedor})` : `${v3} vs ${v4}`;

  const vencedorSemi1 = partidas[4] ? partidas[4].vencedor : "Aguardando...";
  const vencedorSemi2 = partidas[5] ? partidas[5].vencedor : "Aguardando...";

  const finalTexto = partidas[6] ? `${partidas[6].jogador1} vs ${partidas[6].jogador2} — Vencedor: ${partidas[6].vencedor}` : `${vencedorSemi1} vs ${vencedorSemi2}`;

  container.innerHTML = `
    <div class="round">
      <h3>Quartas de Final</h3>
      <div class="matchup"><span>${p1}</span></div>
      <div class="matchup"><span>${p2}</span></div>
      <div class="matchup"><span>${p3}</span></div>
      <div class="matchup"><span>${p4}</span></div>
    </div>
    <div class="round">
      <h3>Semifinais</h3>
      <div class="matchup"><span>${semi1}</span></div>
      <div class="matchup"><span>${semi2}</span></div>
    </div>
    <div class="round">
      <h3>Final</h3>
      <div class="matchup"><span>${finalTexto}</span></div>
    </div>
  `;
}
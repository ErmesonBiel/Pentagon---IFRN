document.addEventListener("DOMContentLoaded", () => {

  // --- CONTROLE DAS ABAS (ENTRAR / CRIAR CONTA) ---
  const tabLogin = document.getElementById("tabLogin");
  const tabCadastro = document.getElementById("tabCadastro");
  const formLogin = document.getElementById("formLogin");
  const formCadastro = document.getElementById("formCadastro");

  if (tabLogin && tabCadastro && formLogin && formCadastro) {
    tabLogin.addEventListener("click", () => {
      tabLogin.classList.add("active");
      tabCadastro.classList.remove("active");
      formLogin.classList.remove("hidden");
      formCadastro.classList.add("hidden");
    });

    tabCadastro.addEventListener("click", () => {
      tabCadastro.classList.add("active");
      tabLogin.classList.remove("active");
      formCadastro.classList.remove("hidden");
      formLogin.classList.add("hidden");
    });
  }

  // --- FORMULÁRIO DE LOGIN ---
  if (formLogin) {
    formLogin.addEventListener("submit", (e) => {
      e.preventDefault();

      const email = document.getElementById("loginEmail").value.trim();
      if (!email) {
        alert("Por favor, digite um e-mail!");
        return;
      }

      const usuarioLogado = { nome: email.split("@")[0], email };
      localStorage.setItem("usuarioLogado", JSON.stringify(usuarioLogado));
      window.location.href = "dashboard.html";
    });
  }

  // --- FORMULÁRIO DE CADASTRO ---
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

  // --- PÁGINA DE PERFIL / PAINEL (EXIBIR DADOS DO USUÁRIO) ---
  const userNomeElement = document.getElementById("userNome");
  const userEmailElement = document.getElementById("userEmail");

  if (userNomeElement || userEmailElement) {
    const userLogado = JSON.parse(localStorage.getItem("usuarioLogado")) || { nome: "Jogador", email: "jogador@pentagon.com" };
    if (userNomeElement) userNomeElement.innerText = userLogado.nome;
    if (userEmailElement) userEmailElement.innerText = userLogado.email;
  }

  // --- RENDEREIZAR RANKING & SELECTS ---
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

  // --- FORMULÁRIO REGISTRAR PARTIDA ---
  const formPartida = document.getElementById("formPartida");
  if (formPartida) {
    formPartida.addEventListener("submit", (e) => {
      e.preventDefault();

      const j1 = selectJ1 ? selectJ1.value : "";
      const j2 = selectJ2 ? selectJ2.value : "";
      const vencedor = selectVencedor ? selectVencedor.value : "";
      const placar = document.getElementById("placar").value.trim();
      const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado")) || { nome: "Admin" };

      if (!j1 || !j2 || !vencedor) {
        alert("Preencha todos os campos do formulário!");
        return;
      }

      if (j1 === j2) {
        alert("Selecione dois jogadores diferentes!");
        return;
      }

      const partidas = JSON.parse(localStorage.getItem("pentagon_partidas")) || [];
      partidas.push({
        id: Date.now(),
        jogador1: j1,
        jogador2: j2,
        vencedor,
        placar,
        organizador: usuarioLogado.nome
      });
      localStorage.setItem("pentagon_partidas", JSON.stringify(partidas));

      atualizarPontos(vencedor);
      alert("Partida registrada com sucesso!");

      formPartida.reset();
      renderizarRanking();
      carregarJogadoresNosSelects();
      atualizarOpcoesVencedor();
    });
  }

});

// --- FUNÇÃO PARA RENDERIZAR RANKING ---
function renderizarRanking() {
  const tbody = document.getElementById("tabelaRankingBody");
  if (!tbody) return;

  const ranking = JSON.parse(localStorage.getItem("pentagon_ranking")) || [];

  // Se o ranking estiver vazio, adiciona dados de exemplo iniciais
  if (ranking.length === 0) {
    const dadosIniciais = [
      { id: 1, nickname: "Ermeson", pontos: 9, vitorias: 3, derrotas: 0 },
      { id: 2, nickname: "Maria", pontos: 6, vitorias: 2, derrotas: 1 },
      { id: 3, nickname: "Gabriele", pontos: 3, vitorias: 1, derrotas: 2 }
    ];
    localStorage.setItem("pentagon_ranking", JSON.stringify(dadosIniciais));
    return renderizarRanking();
  }

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
      <td><button onclick="removerJogador(${item.id})" class="btn-del" style="background:#ff274b; color:#fff; border:none; padding:4px 8px; border-radius:4px; cursor:pointer;">Excluir</button></td>
    `;
    tbody.appendChild(tr);
  });
}

// --- ATUALIZAR PONTOS ---
function atualizarPontos(vencedorNickname) {
  let ranking = JSON.parse(localStorage.getItem("pentagon_ranking")) || [];
  let jogador = ranking.find(j => j.nickname.toLowerCase() === vencedorNickname.toLowerCase());

  if (jogador) {
    jogador.pontos = (jogador.pontos || 0) + 3;
    jogador.vitorias = (jogador.vitorias || 0) + 1;
  } else {
    ranking.push({ id: Date.now(), nickname: vencedorNickname, pontos: 3, vitorias: 1, derrotas: 0 });
  }

  localStorage.setItem("pentagon_ranking", JSON.stringify(ranking));
}

// --- REMOVER JOGADOR ---
function removerJogador(id) {
  if (confirm("Tem certeza que deseja remover este jogador?")) {
    let ranking = JSON.parse(localStorage.getItem("pentagon_ranking")) || [];
    ranking = ranking.filter(j => j.id !== id);
    localStorage.setItem("pentagon_ranking", JSON.stringify(ranking));
    renderizarRanking();
    location.reload();
  }
}

async function carregarIntegrantesDoServidor() {
  try {
    const resposta = await fetch('http://localhost:3000/integrantes');
    const integrantes = await resposta.json();
    
    console.log("Integrantes carregados:", integrantes);
    
   } catch (erro) {
    console.error("Erro ao buscar integrantes:", erro);
  }
}

carregarIntegrantesDoServidor();

async function carregarEExibirIntegrantes() {
  try {
    const resposta = await fetch('http://localhost:3000/integrantes');
    const integrantes = await resposta.json();
    
    const container = document.getElementById('integrantes-container');

    if (!container) return;

    container.innerHTML = '';

    integrantes.forEach(integrante => {
      const card = document.createElement('div');
      card.classList.add('integrantes-card');

      card.innerHTML = `
        <img src="${integrante.foto}" alt="${integrante.nome}" class="foto-equipe">
        <span class="nome-integrante">${integrante.nome}</span>
      `;

      container.appendChild(card);
    });

  } catch (erro) {
    console.error("Erro ao carregar os integrantes:", erro);
  }
}

document.addEventListener("DOMContentLoaded", carregarEExibirIntegrantes);

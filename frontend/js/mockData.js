const mockData = {
  usuarios: [
    { id: 1, nome: "Maria Vitória", email: "maria@gmail.com", senha: "123", tipo: "organizador" },
    { id: 2, nome: "Emerson Gabriel", email: "emerson@gmail.com", senha: "123", tipo: "jogador" },
    { id: 3, nome: "Gabriele Costa", email: "gabriele@gmail.com", senha: "123", tipo: "jogador" }
  ],
  campeonatos: [
    { id: 101, nome: "Pentagon Valorant Masters", modalidade: "Valorant", status: "Ativo" },
    { id: 102, nome: "Torneio LoL IFRN", modalidade: "League of Legends", status: "Ativo" }
  ],
  partidas: [
    { id: 1, jogador1: "Maria Vitória", jogador2: "Emerson Gabriel", vencedor: "Maria Vitória", placar: "2x1" },
    { id: 2, jogador1: "Gabriele Costa", jogador2: "Emerson Gabriel", vencedor: "Gabriele Costa", placar: "2x0" }
  ],
  ranking: [
    { id: 1, nickname: "Maria Vitória", pontos: 15, vitorias: 5, derrotas: 1 },
    { id: 2, nickname: "Gabriele Costa", pontos: 12, vitorias: 4, derrotas: 2 },
    { id: 3, nickname: "Emerson Gabriel", pontos: 6, vitorias: 2, derrotas: 4 }
  ]
};

if (!localStorage.getItem('pentagon_ranking')) {
  localStorage.setItem('pentagon_ranking', JSON.stringify(mockData.ranking));
}
if (!localStorage.getItem('pentagon_partidas')) {
  localStorage.setItem('pentagon_partidas', JSON.stringify(mockData.partidas));
}
if (!localStorage.getItem('pentagon_campeonatos')) {
  localStorage.setItem('pentagon_campeonatos', JSON.stringify(mockData.campeonatos));
}
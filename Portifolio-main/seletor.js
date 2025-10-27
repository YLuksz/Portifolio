// Seleciona todos os cards e o botão
const profileCards = document.querySelectorAll('.profile-card');
const continueButton = document.getElementById('continueBtn');

let selectedProfile = null;

// Função de seleção de perfil
function selectProfile(profile) {
  selectedProfile = profile;

  // Remove seleção anterior
  profileCards.forEach(card => card.classList.remove('selected'));

  // Marca o card atual
  const selectedCard = document.querySelector(`[data-profile="${profile}"]`);
  if (selectedCard) {
    selectedCard.classList.add('selected');
  }

  // Ativa o botão continuar
  continueButton.classList.add('active');
}

// Adiciona evento de clique em cada card
profileCards.forEach(card => {
  card.addEventListener('click', () => {
    const profile = card.dataset.profile; // "candidato" ou "empregador"
    selectProfile(profile);

    // Atualiza o visual do botão
    continueButton.classList.add('active');
  });
});

// Caso o usuário clique no botão "Continuar"
continueButton.addEventListener('click', () => {
  if (!selectedProfile) {
    alert('Selecione um perfil para continuar.');
    return;
  }

  // Armazena a escolha
  localStorage.setItem('perfilSelecionado', selectedProfile);

  // Redireciona para a página correspondente
  if (selectedProfile === 'candidato') {
    window.location.href = 'cadastro_candidato.html';
  } else if (selectedProfile === 'empregador') {
    window.location.href = 'cadastro_empregador.html';
  }
});

// (Opcional) — ao carregar a página, verifica se já existe uma escolha anterior
window.addEventListener('load', () => {
  const perfilSalvo = localStorage.getItem('perfilSelecionado');
  if (perfilSalvo) {
    selectProfile(perfilSalvo);
  }
});
const form = document.getElementById('loginForm');
const email = document.getElementById('email');
const password = document.getElementById('password');
const createAccountLink = document.querySelector('.create-account');

// Adiciona evento de clique no link "Criar conta"
createAccountLink.addEventListener('click', (e) => {
  e.preventDefault();
  window.location.href = 'seletor.html';
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  if (!email.value || !password.value) {
    alert('Preencha todos os campos.');
    return;
  }

  // Função para verificar login em um nó do Firebase
  async function checkLogin(node) {
    return db.ref(node)
      .orderByChild('email')
      .equalTo(email.value)
      .once('value')
      .then(snapshot => {
        let found = null;
        snapshot.forEach(child => {
          const val = child.val();
          if (val.senha === password.value) {
            found = { key: child.key, val };
          }
        });
        return found;
      });
  }
  // Tenta login como candidato
  const candidato = await checkLogin('candidatos');
  if (candidato) {
    try { localStorage.setItem('accountType', 'candidato'); } catch {}
    try { localStorage.setItem('user', JSON.stringify({ email: candidato.val.email, username: candidato.val.username })); } catch {}
    // salva id do perfil para permitir que perfil_candidato carregue do nó correto imediatamente
    try { localStorage.setItem('pf_candidate_id', candidato.key); } catch {}
    alert('Login realizado como candidato!');
    window.location.href = 'home.html';
    return;
  }

  // Tenta login como empregador
  const empregador = await checkLogin('empregadores');
  if (empregador) {
    try { localStorage.setItem('accountType', 'empregador'); } catch {}
    try { localStorage.setItem('user', JSON.stringify({ email: empregador.val.email, companyName: empregador.val.companyName })); } catch {}
    try { localStorage.setItem('pf_employer_id', empregador.key); } catch {}
    alert('Login realizado como empregador!');
    window.location.href = 'home.html';
    return;
  }
  
  alert('E-mail ou senha inválidos.');
});
// cadastro_candidato.js

const form = document.getElementById('registerForm');
const email = document.getElementById('email');
const username = document.getElementById('username');
const cpf = document.getElementById('cpf');
const password = document.getElementById('password');
const confirmPassword = document.getElementById('confirmPassword');

// helper: salva informação de login com tipo de conta
function saveLoginInfo(emailValue, type, extra = {}) {
  const login = {
    email: emailValue,
    accountType: type,
    createdAt: Date.now(),
    ...extra
  };
  return db.ref('users').push(login);
}

form.addEventListener('submit', (e) => {
  e.preventDefault();

  // Validação
  if (password.value !== confirmPassword.value) {
    alert('As senhas não coincidem!');
    return;
  }

  if (!email.value || !username.value || !cpf.value || !password.value) {
    alert('Preencha todos os campos.');
    return;
  }

  const candidato = {
    email: email.value,
    username: username.value,
    cpf: cpf.value,
    senha: password.value,
    accountType: 'candidato' // adiciona o tipo de conta
  };

  // Envia para o Firebase e cria entrada de login
  db.ref('candidatos').push(candidato)
    .then((ref) => {
      return saveLoginInfo(candidato.email, candidato.accountType, { candidatoRef: ref.key });
    })
    .then(() => {
      try { localStorage.setItem('accountType', 'candidato'); } catch {}
      try { localStorage.setItem('user', JSON.stringify({ email: candidato.email, username: candidato.username })); } catch {}
      alert('Cadastro realizado com sucesso!');
      // Redireciona para a home
      window.location.href = 'home.html';
    })
    .catch((error) => {
      console.error('Erro ao cadastrar:', error);
      alert('Ocorreu um erro ao cadastrar. Veja o console para mais detalhes.');
    });
});

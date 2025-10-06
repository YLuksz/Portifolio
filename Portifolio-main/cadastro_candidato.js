// cadastro_candidato.js

const form = document.getElementById('registerForm');
const email = document.getElementById('email');
const username = document.getElementById('username');
const cpf = document.getElementById('cpf');
const password = document.getElementById('password');
const confirmPassword = document.getElementById('confirmPassword');

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
    senha: password.value
  };

  // Envia para o Firebase
  db.ref('candidatos').push(candidato)
    .then(() => {
      alert('Cadastro realizado com sucesso!');
      // Redireciona para a home
      window.location.href = 'home.html';
    })
    .catch((error) => {
      console.error('Erro ao cadastrar:', error);
      alert('Ocorreu um erro ao cadastrar. Veja o console para mais detalhes.');
    });
});

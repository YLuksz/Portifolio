const form = document.getElementById('loginForm');
const email = document.getElementById('email');
const password = document.getElementById('password');

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
        let user = null;
        snapshot.forEach(child => {
          if (child.val().senha === password.value) {
            user = child.val();
          }
        });
        return user;
      });
  }

  // Tenta login como candidato
  const candidato = await checkLogin('candidatos');
  if (candidato) {
    alert('Login realizado como candidato!');
    window.location.href = 'home.html';
    return;
  }

  // Tenta login como empregador
  const empregador = await checkLogin('empregadores');
  if (empregador) {
    alert('Login realizado como empregador!');
    window.location.href = 'home.html';
    return;
  }

  alert('E-mail ou senha inválidos.');
});
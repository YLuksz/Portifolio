const form = document.getElementById('registerEmployerForm');
const companyName = document.getElementById('companyName');
const email = document.getElementById('email');
const cnpj = document.getElementById('cnpj');
const password = document.getElementById('password');
const confirmPassword = document.getElementById('confirmPassword');

form.addEventListener('submit', (e) => {
  e.preventDefault();

  if (password.value !== confirmPassword.value) {
    alert('As senhas não coincidem!');
    return;
  }

  if (!companyName.value || !email.value || !cnpj.value || !password.value) {
    alert('Preencha todos os campos.');
    return;
  }

  const empregador = {
    companyName: companyName.value,
    email: email.value,
    cnpj: cnpj.value,
    senha: password.value
  };

  db.ref('empregadores').push(empregador)
    .then(() => {
      alert('Cadastro de empregador realizado com sucesso!');
      window.location.href = 'home.html';
    })
    .catch((error) => {
      console.error('Erro ao cadastrar empregador:', error);
      alert('Ocorreu um erro ao cadastrar. Veja o console para mais detalhes.');
    });
});
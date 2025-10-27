const form = document.getElementById('registerEmployerForm');
const companyName = document.getElementById('companyName');
const email = document.getElementById('email');
const cnpj = document.getElementById('cnpj');
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
  // grava em users (ou ajuste para sua estrutura de DB)
  return db.ref('users').push(login);
}

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
    senha: password.value,
    accountType: 'empregador' // adiciona o tipo de conta
  };

  // grava dados do empregador e depois cria entrada de login com accountType
  db.ref('empregadores').push(empregador)
    .then((ref) => {
      // opcional: referenciar o cadastro específico no nó de login
      return saveLoginInfo(empregador.email, empregador.accountType, { empregadorRef: ref.key });
    })
    .then(() => {
      // salva local para uso imediato (home.js usa localStorage/accountType)
      try { localStorage.setItem('accountType', 'empregador'); } catch {}
      try { localStorage.setItem('user', JSON.stringify({ email: empregador.email, companyName: empregador.companyName })); } catch {}
      alert('Cadastro de empregador realizado com sucesso!');
      window.location.href = 'home.html';
    })
    .catch((error) => {
      console.error('Erro ao cadastrar empregador:', error);
      alert('Ocorreu um erro ao cadastrar. Veja o console para mais detalhes.');
    });
});
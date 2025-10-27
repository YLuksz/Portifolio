document.addEventListener('DOMContentLoaded', function() {
  // Elementos do DOM
  const companyNameEl = document.querySelector('.company-name');
  const contactInfoEl = document.querySelector('.contact-info');
  const locationInfoEl = document.querySelector('.location-info');
  const customizeBtn = document.querySelector('.customize-btn');

  // Função para obter dados do localStorage
  function getProfileData() {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const profile = JSON.parse(localStorage.getItem('employerProfile') || '{}');
      return { ...user, ...profile };
    } catch {
      return {};
    }
  }

  // Função para salvar dados
  function saveProfileData(data) {
    try {
      localStorage.setItem('employerProfile', JSON.stringify(data));
    } catch {}
    // Se quiser salvar no Firebase, descomente e ajuste:
     if (window.db && data.email) {
      db.ref('empregadores').orderByChild('email').equalTo(data.email).once('value').then(snapshot => {
      snapshot.forEach(child => child.ref.update(data));
       });
     }
  }

  // Preenche os campos com os dados salvos
  function renderProfile() {
    const data = getProfileData();
    companyNameEl.textContent = data.companyName || 'Nome da empresa';
    contactInfoEl.textContent = data.contact || 'Formas de Contato';
    locationInfoEl.textContent = data.location || '📍 Localização';
  }

  // Abre modal de edição (simples prompt)
  customizeBtn.addEventListener('click', () => {
    const data = getProfileData();
    const companyName = prompt('Nome da empresa:', data.companyName || '');
    if (companyName === null) return;
    const contact = prompt('Formas de contato:', data.contact || '');
    if (contact === null) return;
    const location = prompt('Localização:', data.location || '');
    if (location === null) return;
    const newData = { ...data, companyName, contact, location };
    saveProfileData(newData);
    renderProfile();
    alert('Perfil atualizado!');
  });

  // Inicializa a tela
  renderProfile();
});

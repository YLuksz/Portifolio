// perfil_candidato.js
// GitHub Copilot
// Implementa funcionalidades comuns para uma página perfil_candidato.html
// - Armazenamento local (localStorage)
// - Edição de campos básicos, avatar, habilidades, formação e experiência
// - Import / Export JSON
// - Validação simples
// Ajuste IDs/classes no HTML conforme necessário.

// Configurações
const STORAGE_KEY = 'perfil_candidato_v1';
const AUTO_SAVE_DEBOUNCE = 600;

// Utilitários
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
const el = (tag, attrs = {}, ...children) => {
    const e = document.createElement(tag);
    Object.entries(attrs).forEach(([k, v]) => {
        if (k === 'class') e.className = v;
        else if (k === 'dataset') Object.assign(e.dataset, v);
        else if (k === 'html') e.innerHTML = v;
        else e.setAttribute(k, v);
    });
    children.flat().forEach(c => {
        if (c == null) return;
        e.append(typeof c === 'string' ? document.createTextNode(c) : c);
    });
    return e;
};

// Estado em memória
let state = {
    nome: '',
    email: '',
    telefone: '',
    bio: '',
    avatarDataUrl: '', // base64
    skills: [], // strings
    education: [], // {id, escola, curso, inicio, fim, descricao}
    experience: []  // {id, empresa, cargo, inicio, fim, descricao}
};

let saveTimeout = null;

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    bindUI();
    loadProfile();
    observeInputsForAutosave();
});

// Bind de elementos e eventos com IDs esperados no HTML.
// Ajuste os IDs no HTML para conectar corretamente.
function bindUI() {
    const avatarInput = $('#avatarInput');
    if (avatarInput) avatarInput.addEventListener('change', handleAvatarInput);

    const addSkillBtn = $('#addSkillBtn');
    if (addSkillBtn) addSkillBtn.addEventListener('click', e => {
        e.preventDefault();
        const input = $('#skillInput');
        if (input) addSkill(input.value.trim());
    });

    const saveBtn = $('#saveBtn');
    if (saveBtn) saveBtn.addEventListener('click', e => {
        e.preventDefault();
        saveProfile(true);
    });

    const resetBtn = $('#resetBtn');
    if (resetBtn) resetBtn.addEventListener('click', e => {
        e.preventDefault();
        if (confirm('Redefinir perfil? Todos os dados locais serão removidos.')) {
            resetProfile();
        }
    });

    const exportBtn = $('#exportBtn');
    if (exportBtn) exportBtn.addEventListener('click', e => {
        e.preventDefault();
        exportProfile();
    });

    const importBtn = $('#importBtn');
    if (importBtn) importBtn.addEventListener('click', e => {
        e.preventDefault();
        const fileInput = el('input', { type: 'file', accept: 'application/json' });
        fileInput.addEventListener('change', ev => {
            const f = ev.target.files[0];
            if (!f) return;
            const r = new FileReader();
            r.onload = () => {
                try {
                    const data = JSON.parse(r.result);
                    importProfile(data);
                } catch (err) {
                    alert('Arquivo inválido');
                }
            };
            r.readAsText(f);
        });
        fileInput.click();
    });

    // Delegação para lista de skills, educação e experiência (remoção/edição)
    const skillsList = $('#skillsList');
    if (skillsList) skillsList.addEventListener('click', e => {
        if (e.target.matches('.skill-remove')) {
            const idx = Number(e.target.closest('[data-idx]').dataset.idx);
            removeSkill(idx);
        }
    });

    const educationList = $('#educationList');
    if (educationList) educationList.addEventListener('click', e => {
        if (e.target.matches('.edu-remove')) {
            const id = e.target.closest('[data-id]').dataset.id;
            removeEducation(id);
        }
    });

    const experienceList = $('#experienceList');
    if (experienceList) experienceList.addEventListener('click', e => {
        if (e.target.matches('.exp-remove')) {
            const id = e.target.closest('[data-id]').dataset.id;
            removeExperience(id);
        }
    });

    // Add new education / experience
    const addEduBtn = $('#addEduBtn');
    if (addEduBtn) addEduBtn.addEventListener('click', e => {
        e.preventDefault(); addEducation(); 
    });
    const addExpBtn = $('#addExpBtn');
    if (addExpBtn) addExpBtn.addEventListener('click', e => {
        e.preventDefault(); addExperience();
    });
}

// Observa inputs textareas/selects para salvar automaticamente (debounced)
function observeInputsForAutosave() {
    const inputs = $$('input, textarea, select');
    inputs.forEach(inp => {
        inp.addEventListener('input', () => scheduleSave());
        inp.addEventListener('change', () => scheduleSave());
    });

    // Observa contêineres dinâmicos para delegar salvamento (education/experience fields)
    const containers = ['#educationList', '#experienceList', '#skillsList'];
    containers.forEach(sel => {
        const c = $(sel);
        if (c) c.addEventListener('input', () => scheduleSave());
    });
}

function scheduleSave() {
    if (saveTimeout) clearTimeout(saveTimeout);
    saveTimeout = setTimeout(() => saveProfile(false), AUTO_SAVE_DEBOUNCE);
}

// Load / Save / Reset
function saveProfile(showAlert = false) {
    collectFromDOM();
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        if (showAlert) alert('Perfil salvo localmente.');
    } catch (err) {
        console.error('Erro ao salvar', err);
        alert('Não foi possível salvar localmente.');
    }
}

function loadProfile() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return; // nada a carregar
    try {
        const data = JSON.parse(raw);
        state = Object.assign(state, data);
        renderAll();
    } catch (err) {
        console.error('Erro ao carregar perfil', err);
    }
}

function resetProfile() {
    localStorage.removeItem(STORAGE_KEY);
    state = {
        nome: '',
        email: '',
        telefone: '',
        bio: '',
        avatarDataUrl: '',
        skills: [],
        education: [],
        experience: []
    };
    renderAll();
}

// Collect data from DOM into state
function collectFromDOM() {
    const nome = $('#nome');
    const email = $('#email');
    const telefone = $('#telefone');
    const bio = $('#bio');

    if (nome) state.nome = nome.value.trim();
    if (email) state.email = email.value.trim();
    if (telefone) state.telefone = telefone.value.trim();
    if (bio) state.bio = bio.value.trim();

    const avatarImg = $('#avatarImg');
    if (avatarImg && avatarImg.src) state.avatarDataUrl = avatarImg.src;

    // Skills are maintained in state array (manipulated by add/remove)
    // Education & Experience: read inputs inside lists if present
    const eduList = $('#educationList');
    if (eduList) {
        state.education = $$('.edu-item', eduList).map(node => ({
            id: node.dataset.id,
            escola: (node.querySelector('.edu-school')?.value || '').trim(),
            curso: (node.querySelector('.edu-course')?.value || '').trim(),
            inicio: (node.querySelector('.edu-start')?.value || '').trim(),
            fim: (node.querySelector('.edu-end')?.value || '').trim(),
            descricao: (node.querySelector('.edu-desc')?.value || '').trim()
        }));
    }

    const expList = $('#experienceList');
    if (expList) {
        state.experience = $$('.exp-item', expList).map(node => ({
            id: node.dataset.id,
            empresa: (node.querySelector('.exp-company')?.value || '').trim(),
            cargo: (node.querySelector('.exp-role')?.value || '').trim(),
            inicio: (node.querySelector('.exp-start')?.value || '').trim(),
            fim: (node.querySelector('.exp-end')?.value || '').trim(),
            descricao: (node.querySelector('.exp-desc')?.value || '').trim()
        }));
    }
}

// Renderização
function renderAll() {
    // Campos simples
    if ($('#nome')) $('#nome').value = state.nome || '';
    if ($('#email')) $('#email').value = state.email || '';
    if ($('#telefone')) $('#telefone').value = state.telefone || '';
    if ($('#bio')) $('#bio').value = state.bio || '';

    // Avatar
    const avatarImg = $('#avatarImg');
    if (avatarImg) {
        avatarImg.src = state.avatarDataUrl || avatarImg.getAttribute('data-default') || '';
    }

    // Skills
    renderSkills();

    // Education
    renderEducation();

    // Experience
    renderExperience();
}

function renderSkills() {
    const skillsList = $('#skillsList');
    if (!skillsList) return;
    skillsList.innerHTML = '';
    state.skills.forEach((s, idx) => {
        const item = el('div', { class: 'skill-item', 'data-idx': idx },
            el('span', { class: 'skill-text' }, s),
            el('button', { type: 'button', class: 'skill-remove', title: 'Remover' }, '✕')
        );
        skillsList.appendChild(item);
    });
    const skillInput = $('#skillInput');
    if (skillInput) skillInput.value = '';
}

function addSkill(value) {
    if (!value) return;
    if (state.skills.includes(value)) {
        alert('Habilidade já adicionada.');
        return;
    }
    state.skills.push(value);
    renderSkills();
    scheduleSave();
}

function removeSkill(index) {
    if (index == null || index < 0 || index >= state.skills.length) return;
    state.skills.splice(index, 1);
    renderSkills();
    scheduleSave();
}

// Education
function renderEducation() {
    const list = $('#educationList');
    if (!list) return;
    list.innerHTML = '';
    state.education.forEach(item => list.appendChild(createEducationNode(item)));
}

function createEducationNode(item = {}) {
    const id = item.id || String(Date.now()) + Math.random().toString(16).slice(2);
    const wrapper = el('div', { class: 'edu-item', 'data-id': id },
        el('input', { class: 'edu-school', placeholder: 'Instituição', value: item.escola || '' }),
        el('input', { class: 'edu-course', placeholder: 'Curso', value: item.curso || '' }),
        el('input', { class: 'edu-start', placeholder: 'Início', value: item.inicio || '' }),
        el('input', { class: 'edu-end', placeholder: 'Fim', value: item.fim || '' }),
        el('textarea', { class: 'edu-desc', placeholder: 'Descrição' }, item.descricao || ''),
        el('button', { type: 'button', class: 'edu-remove' }, 'Remover')
    );
    return wrapper;
}

function addEducation() {
    const newItem = {
        id: String(Date.now()) + Math.random().toString(16).slice(2),
        escola: '',
        curso: '',
        inicio: '',
        fim: '',
        descricao: ''
    };
    state.education.push(newItem);
    renderEducation();
    scheduleSave();
}

function removeEducation(id) {
    state.education = state.education.filter(e => e.id !== id);
    renderEducation();
    scheduleSave();
}

// Experience
function renderExperience() {
    const list = $('#experienceList');
    if (!list) return;
    list.innerHTML = '';
    state.experience.forEach(item => list.appendChild(createExperienceNode(item)));
}

function createExperienceNode(item = {}) {
    const id = item.id || String(Date.now()) + Math.random().toString(16).slice(2);
    const wrapper = el('div', { class: 'exp-item', 'data-id': id },
        el('input', { class: 'exp-company', placeholder: 'Empresa', value: item.empresa || '' }),
        el('input', { class: 'exp-role', placeholder: 'Cargo', value: item.cargo || '' }),
        el('input', { class: 'exp-start', placeholder: 'Início', value: item.inicio || '' }),
        el('input', { class: 'exp-end', placeholder: 'Fim', value: item.fim || '' }),
        el('textarea', { class: 'exp-desc', placeholder: 'Descrição' }, item.descricao || ''),
        el('button', { type: 'button', class: 'exp-remove' }, 'Remover')
    );
    return wrapper;
}

function addExperience() {
    const newItem = {
        id: String(Date.now()) + Math.random().toString(16).slice(2),
        empresa: '',
        cargo: '',
        inicio: '',
        fim: '',
        descricao: ''
    };
    state.experience.push(newItem);
    renderExperience();
    scheduleSave();
}

function removeExperience(id) {
    state.experience = state.experience.filter(e => e.id !== id);
    renderExperience();
    scheduleSave();
}

// Avatar handling
function handleAvatarInput(ev) {
    const file = ev.target.files && ev.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
        alert('Escolha uma imagem válida.');
        return;
    }
    const reader = new FileReader();
    reader.onload = () => {
        const dataUrl = reader.result;
        const avatarImg = $('#avatarImg');
        if (avatarImg) avatarImg.src = dataUrl;
        state.avatarDataUrl = dataUrl;
        scheduleSave();
    };
    reader.readAsDataURL(file);
}

// Export / Import
function exportProfile() {
    collectFromDOM();
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = el('a', { href: url, download: 'perfil_candidato.json' });
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
}

function importProfile(data) {
    if (!data || typeof data !== 'object') {
        alert('Dados inválidos');
        return;
    }
    // Merge allowed keys only
    const allowed = ['nome','email','telefone','bio','avatarDataUrl','skills','education','experience'];
    allowed.forEach(k => {
        if (k in data) state[k] = data[k];
    });
    renderAll();
    saveProfile(true);
}

// Validações simples (pode ser usada antes de salvar/submit)
function isValidEmail(email) {
    if (!email) return true; // opcional
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
function isValidPhone(phone) {
    if (!phone) return true; // opcional
    return /^[0-9+\s().-]{6,}$/.test(phone);
}

// Exemplo: valida e alerta se inválido
function validateProfile() {
    collectFromDOM();
    if (!isValidEmail(state.email)) {
        alert('E-mail inválido.');
        return false;
    }
    if (!isValidPhone(state.telefone)) {
        alert('Telefone inválido.');
        return false;
    }
    return true;
}
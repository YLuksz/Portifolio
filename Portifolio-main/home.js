const menuBtn = document.querySelector(".icon-btn");
const avatar = document.querySelector(".avatar");
const searchInput = document.querySelector(".search-input");

const sideMenu = document.createElement("div");
sideMenu.style.position = "fixed";
sideMenu.style.top = "0";
sideMenu.style.left = "-250px";
sideMenu.style.width = "250px";
sideMenu.style.height = "100%";
sideMenu.style.background = "white";
sideMenu.style.boxShadow = "2px 0 10px rgba(0,0,0,0.2)";
sideMenu.style.transition = "all 0.3s ease";
sideMenu.style.padding = "20px";
sideMenu.innerHTML = `
  <h3>Menu</h3>
  <ul style="list-style:none; padding:0; margin-top:20px;">
    <li><a href="#" data-action="home" style="text-decoration:none; color:#10ac84;">🏠 Início</a></li>
    <li><a href="#" data-action="projects" style="text-decoration:none; color:#10ac84;">📂 Projetos</a></li>
    <li><a href="#" data-action="settings" style="text-decoration:none; color:#10ac84;">⚙️ Configurações</a></li>
  </ul>
`;
document.body.appendChild(sideMenu);

let menuAberto = false;

if (menuBtn) {
    menuBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        if (menuAberto) {
            sideMenu.style.left = "-250px";
            menuAberto = false;
        } else {
            sideMenu.style.left = "0";
            menuAberto = true;
        }
    });
}

// handle clicks on side menu links
sideMenu.querySelectorAll('a[data-action]').forEach(a => {
    a.addEventListener('click', (e) => {
        e.preventDefault();
        const action = a.dataset.action;
        switch (action) {
            case 'home':
                location.href = 'index.html';
                break;
            case 'projects':
                location.href = 'projects.html';
                break;
            case 'settings':
                location.href = 'settings.html';
                break;
            default:
                console.log('Ação de menu desconhecida:', action);
        }
    });
});

if (searchInput) {
    searchInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            const q = searchInput.value.trim();
            if (!q) return;
            // redireciona para uma página de busca com query param
            location.href = `search.html?q=${encodeURIComponent(q)}`;
        }
    });
}

const userMenu = document.createElement("div");
userMenu.style.position = "absolute";
userMenu.style.top = "60px";
userMenu.style.right = "20px";
userMenu.style.background = "white";
userMenu.style.borderRadius = "10px";
userMenu.style.boxShadow = "0 4px 12px rgba(0,0,0,0.2)";
userMenu.style.padding = "10px";
userMenu.style.display = "none";
userMenu.innerHTML = `
  <p data-action="profile" style="margin:8px 0; cursor:pointer;">👤 Perfil</p>
  <p data-action="settings" style="margin:8px 0; cursor:pointer;">⚙️ Configurações</p>
  <p data-action="logout" style="margin:8px 0; cursor:pointer; color:red;">🚪 Sair</p>
`;
document.body.appendChild(userMenu);

// profile / settings / logout handlers
userMenu.querySelectorAll('[data-action]').forEach(el => {
    el.addEventListener('click', (e) => {
        const action = el.dataset.action;
        switch (action) {
            case 'profile':
                (async () => {
                    // chaves comuns onde o tipo/role pode estar salvo
                    const roleKeys = ['accountType','role','userType','tipoConta','tipo_usuario','tipoUsuario','empregador'];
                    let role = '';

                    // verifica valores simples em localStorage/sessionStorage
                    for (const k of roleKeys) {
                        const v = localStorage.getItem(k) || sessionStorage.getItem(k);
                        if (v) { role = String(v).toLowerCase(); break; }
                    }

                    // checa flags booleanas armazenadas como strings
                    const isEmployerFlags = ['isEmployer','is_empregador','empregador'];
                    for (const f of isEmployerFlags) {
                        const val = localStorage.getItem(f) || sessionStorage.getItem(f);
                        if (String(val).toLowerCase() === 'true') {
                            location.href = 'perfil_empregador.html';
                            return;
                        }
                    }

                    // tenta extrair role de um objeto user salvo como JSON
                    const possibleUserKeys = ['user','profile','me'];
                    for (const k of possibleUserKeys) {
                        const raw = localStorage.getItem(k) || sessionStorage.getItem(k);
                        if (raw) {
                            try {
                                const obj = JSON.parse(raw);
                                const candidate = String(obj?.role || obj?.tipo || obj?.accountType || obj?.userType || '').toLowerCase();
                                if (candidate) { role = candidate; break; }
                            } catch {}
                        }
                    }

                    // mapeia para as páginas corretas
                    if (role.includes('empreg') || role.includes('employ') || role.includes('empresa')) {
                        location.href = 'perfil_empregador.html';
                        return;
                    }
                    if (role.includes('cand') || role.includes('candidat') || role.includes('candidato')) {
                        location.href = 'perfil_candidato.html';
                        return;
                    }

                    // fallback: tenta consultar /api/me para obter role (se existir backend)
                    try {
                        const res = await fetch('/api/me', { credentials: 'include' });
                        if (res.ok) {
                            const data = await res.json();
                            const r = String(data?.role || data?.accountType || data?.tipo || '').toLowerCase();
                            if (r.includes('empreg') || r.includes('employ') || r.includes('empresa')) {
                                location.href = 'perfil_empregador.html';
                                return;
                            }
                            if (r.includes('cand') || r.includes('candidat') || r.includes('candidato')) {
                                location.href = 'perfil_candidato.html';
                                return;
                            }
                        }
                    } catch (err) {
                        // ignora erro e usa fallback
                    }

                    // fallback final
                    location.href = 'perfil_candidato.html';
                })();
                break;
            case 'settings':
                location.href = 'settings.html';
                break;
            case 'logout':
                if (confirm('Tem certeza que deseja sair?')) {
                    // limpar sessão / tokens e tipo de conta
                    try { localStorage.removeItem('authToken'); } catch {}
                    try { localStorage.removeItem('accountType'); } catch {}
                    try { sessionStorage.clear(); } catch {}
                    // opcional: chamar endpoint de logout
                    // fetch('/api/logout', { method: 'POST', credentials: 'include' }).finally(() => location.href = 'login.html');
                    location.href = 'login.html';
                }
                break;
        }
    });
});

if (avatar) {
    avatar.addEventListener("click", (e) => {
        e.stopPropagation();
        userMenu.style.display = userMenu.style.display === "none" ? "block" : "none";
    });
}

// fechar menus ao clicar fora
document.addEventListener("click", (e) => {
    if (avatar && !avatar.contains(e.target) && userMenu && !userMenu.contains(e.target)) {
        userMenu.style.display = "none";
    }
    if (menuAberto && sideMenu && !sideMenu.contains(e.target) && menuBtn && !menuBtn.contains(e.target)) {
        sideMenu.style.left = "-250px";
        menuAberto = false;
    }
});

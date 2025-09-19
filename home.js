
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
    <li><a href="#" style="text-decoration:none; color:#10ac84;">🏠 Início</a></li>
    <li><a href="#" style="text-decoration:none; color:#10ac84;">📂 Projetos</a></li>
    <li><a href="#" style="text-decoration:none; color:#10ac84;">⚙️ Configurações</a></li>
  </ul>
`;
document.body.appendChild(sideMenu);

let menuAberto = false;
menuBtn.addEventListener("click", () => {
    if (menuAberto) {
        sideMenu.style.left = "-250px";
        menuAberto = false;
    } else {
        sideMenu.style.left = "0";
        menuAberto = true;
    }
});


searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        alert(`Você pesquisou por: ${searchInput.value}`);
    }
});

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
  <p style="margin:8px 0; cursor:pointer;">👤 Perfil</p>
  <p style="margin:8px 0; cursor:pointer;">⚙️ Configurações</p>
  <p style="margin:8px 0; cursor:pointer; color:red;">🚪 Sair</p>
`;
document.body.appendChild(userMenu);

avatar.addEventListener("click", () => {
    userMenu.style.display = userMenu.style.display === "none" ? "block" : "none";
});

document.addEventListener("click", (e) => {
    if (!avatar.contains(e.target) && !userMenu.contains(e.target)) {
        userMenu.style.display = "none";
    }
});

// ui_toast.js - very small toast notification helper
(function(){
    const style = document.createElement('style');
    style.textContent = `
    .ui-toast-container{position:fixed;right:20px;top:20px;z-index:99999;display:flex;flex-direction:column;gap:8px}
    .ui-toast{min-width:200px;max-width:360px;padding:10px 14px;border-radius:8px;color:#fff;box-shadow:0 6px 18px rgba(2,6,23,0.2);font-weight:600}
    .ui-toast.info{background:linear-gradient(90deg,#4b79a1,#283e51)}
    .ui-toast.success{background:linear-gradient(90deg,#34c38f,#28a745)}
    .ui-toast.error{background:linear-gradient(90deg,#f46a6a,#d64545)}
    .ui-toast.hide{opacity:0;transform:translateX(20px);transition:all .35s ease}
    `;
    document.head.appendChild(style);

    const container = document.createElement('div');
    container.className = 'ui-toast-container';
    document.body.appendChild(container);

    window.showToast = function(message, type='info', timeout=3000){
        try{
            const t = document.createElement('div');
            t.className = 'ui-toast ' + (type||'info');
            t.textContent = message;
            container.appendChild(t);
            // auto hide
            setTimeout(()=>{
                t.classList.add('hide');
                setTimeout(()=> t.remove(), 400);
            }, timeout);
        }catch(e){
            console.warn('showToast error', e);
        }
    };
})();
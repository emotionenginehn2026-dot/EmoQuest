document.addEventListener('DOMContentLoaded', () => {
    // 1. Cargar credenciales guardadas en el inventario local
    const user = localStorage.getItem('emoquest_user') || 'Nathan Drake';
    const role = localStorage.getItem('emoquest_role') || 'Usuario / Estudiante';

    const displayUser = document.getElementById('displayUser');
    const displayRole = document.getElementById('displayRole');

    if (displayUser) displayUser.textContent = user.toUpperCase();
    if (displayRole) displayRole.textContent = role;

    // 2. Control de Acceso por Rol (Vista del Líder de Expedición)
    const adminPanel = document.getElementById('adminPanel');
    if (adminPanel) {
        if (role === 'Administrador del Sistema') {
            adminPanel.style.display = 'block';
        } else {
            adminPanel.style.display = 'none';
        }
    }

    // 3. Manejar creación de nuevas misiones (Modo Admin)
    const missionForm = document.getElementById('missionForm');
    if (missionForm) {
        missionForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const title = document.getElementById('missionTitle').value;
            const xp = document.getElementById('missionXP').value;

            crearNuevaMision(title, xp);
            missionForm.reset();
        });
    }
});

// --- SISTEMA DE PUNTOS XP Y PROGRESO ---
let currentXP = 250;
const maxXP = 500;

function completarMision(puntos) {
    currentXP += puntos;
    
    const xpSpan = document.getElementById('userXP');
    const xpBar = document.getElementById('xpBar');
    const levelSpan = document.getElementById('userLevel');

    // Actualizar texto de XP
    if (xpSpan) xpSpan.textContent = currentXP;

    // Calcular porcentaje para la barra Neón Verde
    let porcentaje = (currentXP / maxXP) * 100;
    if (porcentaje > 100) porcentaje = 100;
    
    if (xpBar) xpBar.style.width = porcentaje + '%';

    // Verificar si sube de nivel / Rango
    if (currentXP >= maxXP) {
        if (levelSpan) {
            levelSpan.textContent = '2 [RANGO SUPERIOR]';
            levelSpan.style.color = 'var(--uncharted-gold)';
        }
        alert('🏆 ¡LOGRO TÁCTICO COMPLETADO!\n\nHas subido al RANGO 2 y desbloqueado la Reliquia del Conocimiento.');
    } else {
        alert(`✨ ¡ENIGMA RESUELTO!\n\nHas extraído +${puntos} XP para tu inventario táctico.`);
    }
}

// --- CREAR NUEVA MISIÓN DINÁMICAMENTE ---
function crearNuevaMision(titulo, xp) {
    const contenedorMisiones = document.querySelector('.mission-card').parentElement;
    
    const nuevaMision = document.createElement('div');
    nuevaMision.className = 'mission-card';
    nuevaMision.innerHTML = `
        <div>
            <h4>[MISIÓN] ${titulo}</h4>
            <p>RECOMPENSA DE RELIQUIA: +${xp} XP</p>
        </div>
        <button class="btn-action" onclick="completarMision(${parseInt(xp)})">RESOLVER 🎯</button>
    `;

    contenedorMisiones.appendChild(nuevaMision);
    alert(`📜 Misión "[${titulo}]" registrada con éxito en el mapa.`);
}

// --- CERRAR SESIÓN / ABANDONAR MAPA ---
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        if (confirm('¿Deseas guardar el estado actual y abandonar el mapa de expedición?')) {
            window.location.href = 'index.html';
        }
    });
}
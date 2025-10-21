// ============================================
// 👤 PANEL DE CLIENTE
// ============================================

import { protegerPagina, mostrarInfoUsuario, crearBotonCerrarSesion, obtenerSesion } from '../../utils/auth';

// 🛡️ Proteger esta página
const sesion = protegerPagina();

if (sesion) {
  // Mostrar información del usuario
  mostrarInfoUsuario('userInfo');
  
  // Crear botón de logout
  crearBotonCerrarSesion('logoutContainer');
  
  // Personalizar mensaje de bienvenida
  personalizarMensaje();
  
  // Configurar botón de configuración
  configurarBotonSettings();
}

// ============================================
// 💬 Personalizar mensaje de bienvenida
// ============================================
function personalizarMensaje(): void {
  const sesion = obtenerSesion();
  const mensajeBienvenida = document.getElementById('welcomeMessage');
  
  if (mensajeBienvenida && sesion.nombre) {
    mensajeBienvenida.textContent = `¡Hola ${sesion.nombre}! Aquí puedes gestionar tu perfil y servicios`;
  }
}

// ============================================
// ⚙️ Configurar botón de settings
// ============================================
function configurarBotonSettings(): void {
  const btnSettings = document.getElementById('settingsBtn');
  
  if (btnSettings) {
    btnSettings.addEventListener('click', mostrarSettings);
  }
}

// ============================================
// 📋 Mostrar información de configuración
// ============================================
function mostrarSettings(): void {
  const sesion = obtenerSesion();
  
  if (sesion) {
    let info = `Información de tu cuenta:\n\n`;
    info += `Email: ${sesion.email}\n`;
    info += `Nombre: ${sesion.nombre || 'No especificado'}\n`;
    info += `Última sesión: ${new Date(sesion.horaLogin).toLocaleString()}\n`;
    
    alert(info);
  }
}

console.log('👤 Panel de cliente cargado');
console.log('Usuario:', sesion);

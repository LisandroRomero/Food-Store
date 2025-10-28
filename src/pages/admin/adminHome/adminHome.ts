import { protegerPagina, mostrarInfoUsuario, crearBotonCerrarSesion, obtenerSesion } from '../../../utils/auth';

// 🛡️ Proteger esta página (solo usuarios autenticados)
const sesion = protegerPagina();

if (sesion) {
  // Mostrar información del usuario
  mostrarInfoUsuario('userInfo');
  
  // Crear botón de logout
  crearBotonCerrarSesion('logoutContainer');
  
  // Cargar estadísticas
  cargarEstadisticas();
  
  // Configurar botones
  configurarBotones();
  
  // Mostrar hora de login
  mostrarHoraLogin();
}

// ============================================
// 📊 Función para cargar estadísticas
// ============================================
function cargarEstadisticas(): void {
  // Obtener usuarios del localStorage
  const usuariosTexto = localStorage.getItem('usuarios');
  const usuarios = usuariosTexto ? JSON.parse(usuariosTexto) : [];
  
  // Mostrar total de usuarios
  const totalUsuarios = document.getElementById('totalUsers');
  if (totalUsuarios) {
    totalUsuarios.textContent = usuarios.length.toString();
  }
}

// ============================================
// 🔘 Configurar botones
// ============================================
function configurarBotones(): void {
  // Botón para ver usuarios
  const btnVerUsuarios = document.getElementById('viewUsersBtn');
  if (btnVerUsuarios) {
    btnVerUsuarios.addEventListener('click', verUsuarios);
  }
  
  // Botón para limpiar storage
  const btnLimpiar = document.getElementById('clearStorageBtn');
  if (btnLimpiar) {
    btnLimpiar.addEventListener('click', limpiarStorage);
  }
}

// ============================================
// 👥 Ver lista de usuarios
// ============================================
function verUsuarios(): void {
  const usuariosTexto = localStorage.getItem('usuarios');
  const usuarios = usuariosTexto ? JSON.parse(usuariosTexto) : [];
  
  let lista = 'Usuarios registrados:\n\n';
  usuarios.forEach((user: any, index: number) => {
    lista += `${index + 1}. ${user.nombre || 'Sin nombre'}\n`;
    lista += `   Email: ${user.email}\n\n`;
  });
  
  alert(lista);
}

// ============================================
// 🗑️ Limpiar localStorage (mantener sesión)
// ============================================
function limpiarStorage(): void {
  if (confirm('¿Estás seguro? Esto reiniciará los usuarios de prueba.')) {
    // Guardar sesión actual
    const sesionActual = localStorage.getItem('sesion');
    
    // Borrar todo
    localStorage.clear();
    
    // Restaurar sesión
    if (sesionActual) {
      localStorage.setItem('sesion', sesionActual);
    }
    
    // Recrear usuarios de prueba
    const usuarios = [
      { email: 'admin@ejemplo.com', password: 'admin123', nombre: 'Admin' },
      { email: 'usuario@ejemplo.com', password: 'usuario123', nombre: 'Usuario' }
    ];
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
    
    alert('LocalStorage reiniciado correctamente');
    location.reload();
  }
}

// ============================================
// ⏰ Mostrar hora de login
// ============================================
function mostrarHoraLogin(): void {
  const sesion = obtenerSesion();
  const elementoHora = document.getElementById('loginTime');
  
  if (sesion && elementoHora) {
    const horaLogin = new Date(sesion.horaLogin);
    elementoHora.textContent = horaLogin.toLocaleString();
  }
}

console.log('🛠️ Panel de administración cargado');

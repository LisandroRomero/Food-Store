// ============================================
// 📄 PÁGINA PRINCIPAL - Ejemplo de página protegida
// ============================================

import './style.css'
import { protegerPagina, mostrarInfoUsuario, crearBotonCerrarSesion } from './utils/auth'

// 🛡️ Paso 1: Proteger esta página
// Si no hay sesión, esta función redirige automáticamente al login
const sesion = protegerPagina();

// 🎉 Si llegamos aquí, significa que el usuario SÍ está autenticado
if (sesion) {
  console.log('✅ Usuario autenticado:', sesion);
  
  // 📺 Paso 2: Mostrar el nombre del usuario
  // Busca un elemento con id="userInfo" y le pone el nombre
  mostrarInfoUsuario('userInfo');
  
  // 🔴 Paso 3: Crear un botón para cerrar sesión
  // Busca un elemento con id="logoutContainer" y crea el botón ahí
  crearBotonCerrarSesion('logoutContainer');
  
  console.log('💡 Puedes ver tu sesión escribiendo en la consola:');
  console.log('   localStorage.getItem("sesion")');
}


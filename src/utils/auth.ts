// ============================================
// 📚 UTILIDADES DE AUTENTICACIÓN SIMPLIFICADAS
// ============================================
// Este archivo contiene funciones útiles que puedes
// usar en cualquier página de tu proyecto

// Constantes para las "llaves" del localStorage
const SESION_KEY = 'sesion';

// ============================================
// 🔍 Función 1: Obtener la sesión actual
// ============================================
// Retorna los datos de la sesión si existe, o null si no hay sesión
export function obtenerSesion(): any {
  // 1. Leer el texto de localStorage
  const sesionTexto = localStorage.getItem(SESION_KEY);
  
  // 2. Si no hay nada, retornar null
  if (!sesionTexto) {
    return null;
  }
  try {
    // 3. Intentar convertir el texto a objeto y retornarlo
    return JSON.parse(sesionTexto);
  } catch (error) {
    console.error('Error al obtener la sesión:', error);
    return null;
  }
}

// ============================================
// 🔒 Función 2: Verificar si hay sesión activa
// ============================================
// Retorna true si hay sesión, false si no
export function haySesion(): boolean {
  const sesion = obtenerSesion();
  return sesion !== null;
}

export function guardarSesion(sesion: any): void {
  localStorage.setItem(SESION_KEY, JSON.stringify(sesion));
}

// ============================================
// 🚪 Función 3: Cerrar sesión
// ============================================
// Borra la sesión y redirige al login
export function cerrarSesion(): void {
  // 1. Borrar la sesión de localStorage
  localStorage.removeItem(SESION_KEY);
  
  // 2. Redirigir al login
  window.location.href = '/src/pages/auth/login/login.html';
}

export function esAdmin(): boolean {

  const sesion = obtenerSesion();

  return sesion && sesion.rol === 'ADMIN';
}


export function esUsuario(): boolean {

  const sesion = obtenerSesion();

  return sesion && sesion.rol === 'USUARIO';
}

// ============================================
// 🛡️ Función 4: Proteger una página
// ============================================
// Si no hay sesión, redirige al login automáticamente
// Úsala al inicio de cualquier página que quieras proteger
export function protegerPagina(): any {
  
  // 1. Verificar si hay sesión
  const sesion = obtenerSesion();
  
  // 2. Si NO hay sesión, redirigir al login
  if (!sesion) {
    window.location.href = '/src/pages/auth/login/login.html';
    return null;
  }
  
  // 3. Si hay sesión, retornar los datos
  return sesion;
}

export function protegerPaginaAdmin(): any {
  const sesion = protegerPagina(); // Primero verifica que haya sesión
  if (!sesion) return null;
  
  if (sesion.rol !== 'ADMIN') {
    alert('Acceso denegado');
    redirigirSegunRol(); // Redirige al home del usuario
    return null;
  }
  
  return sesion;
}

// Redirigir según rol 
export function redirigirSegunRol(): void {
  const sesion = obtenerSesion();
  
  if (!sesion) {
    //redirigir al pagina principal si no hay sesion
    window.location.href = '/src/pages/auth/login/login.html';
    return;
  }
  if (sesion.rol === 'ADMIN') {


    //ahora que tenemos ejempl ode prueba vamos a redirigia aca
    window.location.href = '/src/pages/admin/index.html';

    //En el futuro cambiar a adminHome
    //window.location.href = '/src/pages/admin/adminHome/adminHome.html';

  } else {

    window.location.href = '/src/pages/client/index.html';
    
    //window.location.href = '/src/pages/store/home/home.html';
  }
}

// ============================================
// 📺 Función 5: Mostrar info del usuario en pantalla
// ============================================
// Busca un elemento por ID y le pone el texto con el nombre del usuario
export function mostrarInfoUsuario(idElemento: string): void {
  // 1. Obtener la sesión
  const sesion = obtenerSesion();
  
  // 2. Buscar el elemento en el HTML
  const elemento = document.getElementById(idElemento);
  
  // 3. Si existen ambos, poner el texto
  if (elemento && sesion) {
    elemento.textContent = `Bienvenido, ${sesion.nombre} ${sesion.apellido}`;
  }
}

// ============================================
// 🔴 Función 6: Crear botón de cerrar sesión
// ============================================
// Crea un botón automáticamente dentro de un contenedor
export function crearBotonCerrarSesion(idContenedor: string): void {
  // 1. Buscar el contenedor en el HTML
  const contenedor = document.getElementById(idContenedor);
  
  if (contenedor) {
    // 2. Crear el botón
    const boton = document.createElement('button');
    boton.textContent = 'Cerrar Sesión';
    
    // 3. Cuando hagan click, cerrar sesión
    boton.onclick = cerrarSesion;
    
    // 4. Darle estilos al botón
    boton.style.padding = '0.5rem 1rem';
    boton.style.background = '#dc3545';
    boton.style.color = 'white';
    boton.style.border = 'none';
    boton.style.borderRadius = '5px';
    boton.style.cursor = 'pointer';
    boton.style.fontWeight = '600';
    
    // 5. Agregar el botón al contenedor
    contenedor.appendChild(boton);
  }
}

// ============================================
// 📝 EJEMPLO DE USO
// ============================================
/*
En cualquier página que quieras proteger, haz esto:

import { protegerPagina, mostrarInfoUsuario, crearBotonCerrarSesion } from './utils/auth';

// Proteger la página (redirige al login si no hay sesión)
const sesion = protegerPagina();

// Si llegamos aquí, el usuario está autenticado
if (sesion) {
  // Mostrar su nombre en un elemento con id="userInfo"
  mostrarInfoUsuario('userInfo');
  
  // Crear botón de logout en un elemento con id="logoutBtn"
  crearBotonCerrarSesion('logoutBtn');
}
*/





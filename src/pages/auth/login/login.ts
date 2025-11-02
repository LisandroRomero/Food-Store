
import { login } from "../../../utils/api";
import { obtenerSesion, guardarSesion, redirigirSegunRol } from "../../../utils/auth";

// ============================================
// ✅ Validar datos del login
// ============================================
function validarLogin(email: string, password: string): string | null {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'Por favor ingresa un email válido';
  }
  
  if (password.length < 5) {
    return 'Por favor ingresa tu contraseña';
  }
  
  return null;
}

// ============================================
// 🔓 Hacer LOGIN con API
// ============================================
async function hacerLogin(
  email: string, 
  password: string, 
  mostrarMensaje: (tipo: 'error' | 'exito', texto: string) => void
): Promise<boolean> {
  
  const errorValidacion = validarLogin(email, password);
  if (errorValidacion) {
    mostrarMensaje('error', errorValidacion);
    return false;
  }
  
  const resultado = await login(email, password);
  
  if (resultado.success) {
    guardarSesion(resultado.data);
    mostrarMensaje('exito', `¡Bienvenido ${resultado.data.nombre}!`);
    return true;
  } else {
    mostrarMensaje('error', resultado.message || 'Email o contraseña incorrectos');
    return false;
  }
}

// ============================================
// 🎨 Conectar con el HTML
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  console.log('🔍 DOM cargado...');
  
  // Si ya hay sesión activa, redirigir
  const sesion = obtenerSesion();
  if (sesion) {
    console.log('✅ Sesión activa, redirigiendo...');
    redirigirSegunRol();
    return;
  }
  
  const formulario = document.getElementById('loginForm') as HTMLFormElement;
  const inputEmail = document.getElementById('email') as HTMLInputElement;
  const inputPassword = document.getElementById('password') as HTMLInputElement;
  const mensajeError = document.getElementById('errorMessage') as HTMLDivElement;
  const mensajeExito = document.getElementById('successMessage') as HTMLDivElement;
  
  if (!formulario) {
    console.error('❌ No se encontró el formulario');
    return;
  }
  
  console.log('✅ Formulario encontrado');

  function mostrarMensaje(tipo: 'error' | 'exito', texto: string): void {
    if (tipo === 'error') {
      mensajeError.textContent = texto;
      mensajeError.classList.add('show');
      mensajeExito.classList.remove('show');
    } else {
      mensajeExito.textContent = texto;
      mensajeExito.classList.add('show');
      mensajeError.classList.remove('show');
    }
    
    setTimeout(() => {
      mensajeError.classList.remove('show');
      mensajeExito.classList.remove('show');
    }, 5000);
  }

  formulario.addEventListener('submit', async (evento: Event) => {
    evento.preventDefault();
    
    const email = inputEmail.value.trim();
    const password = inputPassword.value;
    
    const loginExitoso = await hacerLogin(email, password, mostrarMensaje);
    
    if (loginExitoso) {
      formulario.reset();
      
      setTimeout(() => {
        redirigirSegunRol();
      }, 1500);
    }
  });
  
  console.log('🔐 Sistema de Login - ¡Listo!');
});
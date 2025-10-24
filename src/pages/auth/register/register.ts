// ============================================
// 📚 REGISTRO CON API
// ============================================

import { register } from "../../../utils/api";
import { obtenerSesion, guardarSesion, redirigirSegunRol } from "../../../utils/auth";

// ============================================
// ✅ Validar datos del registro
// ============================================
function validarRegistro(
  nombre: string, 
  apellido: string,
  email: string, 
  password: string, 
  confirmPassword: string,
  aceptaTerminos: boolean
): string | null {
  
  if (!nombre || nombre.trim().length < 2) {
    return 'El nombre debe tener al menos 2 caracteres';
  }
  
  if (!apellido || apellido.trim().length < 2) {
    return 'El apellido debe tener al menos 2 caracteres';
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'Por favor ingresa un email válido';
  }
  
  if (password.length < 6) {
    return 'La contraseña debe tener al menos 6 caracteres';
  }
  
  if (password !== confirmPassword) {
    return 'Las contraseñas no coinciden';
  }
  
  if (!aceptaTerminos) {
    return 'Debes aceptar los términos y condiciones';
  }
  
  return null;
}

// ============================================
// 🎨 Conectar con el HTML
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  
  // Si ya hay sesión, redirigir
  const sesion = obtenerSesion();
  if (sesion) {
    redirigirSegunRol();
    return;
  }

  const formulario = document.getElementById('registerForm') as HTMLFormElement;
  const inputNombre = document.getElementById('nombre') as HTMLInputElement;
  const inputApellido = document.getElementById('apellido') as HTMLInputElement;
  const inputEmail = document.getElementById('email') as HTMLInputElement;
  const inputPassword = document.getElementById('password') as HTMLInputElement;
  const inputConfirmPassword = document.getElementById('confirmPassword') as HTMLInputElement;
  const inputAceptaTerminos = document.getElementById('acceptTerms') as HTMLInputElement;
  const mensajeError = document.getElementById('errorMessage') as HTMLDivElement;
  const mensajeExito = document.getElementById('successMessage') as HTMLDivElement;

  // ✅ Función para mostrar mensajes (DENTRO del DOMContentLoaded)
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

  // ✅ Función hacer registro 
  async function hacerRegistro(
    nombre: string, 
    apellido: string,
    email: string, 
    password: string, 
    confirmPassword: string,
    aceptaTerminos: boolean
  ): Promise<boolean> {
    
    const errorValidacion = validarRegistro(nombre, apellido, email, password, confirmPassword, aceptaTerminos);
    if (errorValidacion) {
      mostrarMensaje('error', errorValidacion);
      return false;
    }
    
    const resultado = await register(nombre, apellido, email, password);
    
    if (resultado.success) {
      guardarSesion(resultado.data);
      mostrarMensaje('exito', `¡Cuenta creada! Bienvenido ${nombre}`);
      return true;
    } else {
      mostrarMensaje('error', resultado.message || 'Error al crear la cuenta');
      return false;
    }
  }

  // Validar contraseñas en tiempo real
  inputConfirmPassword.addEventListener('input', () => {
    const password = inputPassword.value;
    const confirmPassword = inputConfirmPassword.value;
    
    if (confirmPassword && password !== confirmPassword) {
      inputConfirmPassword.style.borderColor = '#c33';
    } else {
      inputConfirmPassword.style.borderColor = '#ddd';
    }
  });

  // Manejar envío del formulario
  formulario.addEventListener('submit', async (evento: Event) => {
    evento.preventDefault();
    
    const nombre = inputNombre.value.trim();
    const apellido = inputApellido.value.trim();
    const email = inputEmail.value.trim();
    const password = inputPassword.value;
    const confirmPassword = inputConfirmPassword.value;
    const aceptaTerminos = inputAceptaTerminos.checked;
    
    const registroExitoso = await hacerRegistro(
      nombre, 
      apellido, 
      email, 
      password, 
      confirmPassword, 
      aceptaTerminos
    );
    
    if (registroExitoso) {
      formulario.reset();
      
      setTimeout(() => {
        redirigirSegunRol();
      }, 1500);
    }
  });

  console.log('📝 Sistema de Registro - ¡Listo!');
});
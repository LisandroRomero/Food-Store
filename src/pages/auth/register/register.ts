// ============================================
// 📚 REGISTRO: TypeScript + localStorage
// ============================================

import { register } from "../../../utils/api";

// Usamos la misma interface del login
// interface Usuario {
//   nombre: string;
//   apellido: string;
//   email: string;
//   password: string;
// }

// ============================================
// 📦 Variables globales (mismas que en login)
// ============================================
// const USUARIOS_KEY = 'usuarios';
// const SESION_KEY = 'sesion';

// ============================================
// 🔍 Función para verificar si un email ya existe
// ============================================
// function emailExiste(email: string): boolean {
//   // 1. Obtener usuarios guardados
//   const usuariosTexto = localStorage.getItem(USUARIOS_KEY);
  
//   // 2. Si no hay usuarios, el email no existe
//   if (!usuariosTexto) {
//     return false;
//   }
  
//   // 3. Convertir texto a array y buscar el email
//   const usuarios: Usuario[] = JSON.parse(usuariosTexto);
//   const usuarioExistente = usuarios.find(u => u.email === email);
  
//   // 4. Retornar true si existe, false si no
//   return usuarioExistente !== undefined;
// }

// ============================================
// ➕ Función para agregar un nuevo usuario
// ============================================
// function agregarUsuario(nuevoUsuario: Usuario): boolean {
//   try {
//     // 1. Obtener usuarios actuales
//     const usuariosTexto = localStorage.getItem(USUARIOS_KEY);
//     let usuarios: Usuario[] = [];
    
//     // 2. Si ya hay usuarios, cargarlos
//     if (usuariosTexto) {
//       usuarios = JSON.parse(usuariosTexto);
//     }
    
//     // 3. Agregar el nuevo usuario al array
//     usuarios.push(nuevoUsuario);
    
//     // 4. Guardar el array actualizado en localStorage
//     const nuevosUsuariosTexto = JSON.stringify(usuarios);
//     localStorage.setItem(USUARIOS_KEY, nuevosUsuariosTexto);
    
//     console.log('✅ Nuevo usuario registrado:', nuevoUsuario);
//     return true;
    
//   } catch (error) {
//     console.error('❌ Error al registrar usuario:', error);
//     return false;
//   }
// }

// ============================================
// ✅ Función para validar los datos del registro
// ============================================
function validarRegistro(
  nombre: string, 
  email: string, 
  password: string, 
  confirmPassword: string,
  aceptaTerminos: boolean
): string | null {
  
  // Validar nombre
  if (!nombre || nombre.trim().length < 2) {
    return 'El nombre debe tener al menos 2 caracteres';
  }
  
  // Validar email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'Por favor ingresa un email válido';
  }
  
  // Validar contraseña
  if (password.length < 6) {
    return 'La contraseña debe tener al menos 6 caracteres';
  }
  
  // Validar que las contraseñas coincidan
  if (password !== confirmPassword) {
    return 'Las contraseñas no coinciden';
  }
  
  // Validar términos y condiciones
  if (!aceptaTerminos) {
    return 'Debes aceptar los términos y condiciones';
  }
  
  // Si todo está bien, retornar null
  return null;
}

// ============================================
// 📝 Función para hacer REGISTRO
// ============================================
async function hacerRegistro(
  nombre: string, 
  apellido: string,
  email: string, 
  password: string, 
  confirmPassword: string,
  aceptaTerminos: boolean
): Promise<boolean> {
  
  // 1. Validar los datos
  const errorValidacion = validarRegistro(nombre, email, password, confirmPassword, aceptaTerminos);
  if (errorValidacion) {
    mostrarMensaje('error', errorValidacion);
    return false;
  }
  
  // 2. Separar nombre y apellido del campo único
 
  
  // 3. Llamar a la API
  const resultado = await register(nombre, apellido, email, password);
  
  if (resultado.success) {
    // 4. Si el backend fue exitoso, guardar TAMBIÉN en localStorage para el login
    const usuarioParaLocalStorage = {
      nombre: nombre.trim(),
      apellido: apellido.trim(), 
      email: email.trim(),
      password: password // Para poder hacer login después
    };
    
    // Obtener usuarios actuales del localStorage
    const usuariosTexto = localStorage.getItem('usuarios');
    let usuarios = [];
    
    if (usuariosTexto) {
      usuarios = JSON.parse(usuariosTexto);
    }
    
    // Agregar el nuevo usuario
    usuarios.push(usuarioParaLocalStorage);
    
    // Guardar la lista actualizada
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
    
    console.log('✅ Usuario guardado en backend Y localStorage');
    
    mostrarMensaje('exito', `¡Cuenta creada exitosamente! Bienvenido ${nombre}`);
    return true;
  } else {
    mostrarMensaje('error', resultado.message || 'Error al crear la cuenta');
    return false;
  }
}

// ============================================
// 🎨 Conectar con el HTML
// ============================================

// 1️⃣ Obtener referencias a los elementos del HTML
const formulario = document.getElementById('registerForm') as HTMLFormElement;
const inputNombre = document.getElementById('nombre') as HTMLInputElement;
const inputApellido = document.getElementById('apellido') as HTMLInputElement;
const inputEmail = document.getElementById('email') as HTMLInputElement;
const inputPassword = document.getElementById('password') as HTMLInputElement;
const inputConfirmPassword = document.getElementById('confirmPassword') as HTMLInputElement;
const inputAceptaTerminos = document.getElementById('acceptTerms') as HTMLInputElement;
const mensajeError = document.getElementById('errorMessage') as HTMLDivElement;
const mensajeExito = document.getElementById('successMessage') as HTMLDivElement;

// 2️⃣ Función para mostrar mensajes (igual que en login)
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
  
  // Ocultar el mensaje después de 5 segundos
  setTimeout(() => {
    mensajeError.classList.remove('show');
    mensajeExito.classList.remove('show');
  }, 5000);
}

// 3️⃣ Función para validar contraseñas en tiempo real
inputConfirmPassword.addEventListener('input', () => {
  const password = inputPassword.value;
  const confirmPassword = inputConfirmPassword.value;
  
  if (confirmPassword && password !== confirmPassword) {
    inputConfirmPassword.style.borderColor = '#c33';
  } else {
    inputConfirmPassword.style.borderColor = '#ddd';
  }
});

// 4️⃣ Manejar el envío del formulario
formulario.addEventListener('submit', async (evento: Event) => {
  // Prevenir que el formulario recargue la página
  evento.preventDefault();
  
  // Obtener los valores ingresados por el usuario
  const nombre = inputNombre.value.trim();
  const apellido = inputApellido.value.trim();
  const email = inputEmail.value.trim();
  const password = inputPassword.value;
  const confirmPassword = inputConfirmPassword.value;
  const aceptaTerminos = inputAceptaTerminos.checked;
  
  // Intentar hacer el registro
  const registroExitoso = await hacerRegistro(nombre, apellido, email, password, confirmPassword, aceptaTerminos);;
  
  if (registroExitoso) {
    // Limpiar el formulario
    formulario.reset();
    
    // Redirigir a la página principal después de 2 segundos
    setTimeout(() => {
      window.location.href = '/';
    }, 2000);
  }
  
});

// ============================================
// 📝 Información en la consola
// ============================================
console.log('============================================');
console.log('👤 Sistema de Registro');
console.log('============================================');
console.log('💡 CARACTERÍSTICAS:');
console.log('   ✅ Validación de email único');
console.log('   ✅ Confirmación de contraseña');
console.log('   ✅ Términos y condiciones');
console.log('   ✅ Login automático después del registro');
console.log('============================================');
console.log('🔍 COMANDOS ÚTILES EN LA CONSOLA:');
console.log('   localStorage.getItem("usuarios")      ← Ver todos los usuarios');
console.log('   localStorage.clear()                  ← Borrar todo (reset)');
console.log('============================================');
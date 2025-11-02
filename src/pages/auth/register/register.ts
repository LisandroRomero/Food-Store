// ============================================
// 📚 REGISTRO: TypeScript + localStorage
// ============================================

// Usamos la misma interface del login
interface Usuario {
  email: string;
  password: string;
  nombre?: string;
}

// ============================================
// 📦 Variables globales (mismas que en login)
// ============================================
const USUARIOS_KEY = 'usuarios';
const SESION_KEY = 'sesion';

// ============================================
// 🔍 Función para verificar si un email ya existe
// ============================================
function emailExiste(email: string): boolean {
  // 1. Obtener usuarios guardados
  const usuariosTexto = localStorage.getItem(USUARIOS_KEY);
  
  // 2. Si no hay usuarios, el email no existe
  if (!usuariosTexto) {
    return false;
  }
  
  // 3. Convertir texto a array y buscar el email
  const usuarios: Usuario[] = JSON.parse(usuariosTexto);
  const usuarioExistente = usuarios.find(u => u.email === email);
  
  // 4. Retornar true si existe, false si no
  return usuarioExistente !== undefined;
}

// ============================================
// ➕ Función para agregar un nuevo usuario
// ============================================
function agregarUsuario(nuevoUsuario: Usuario): boolean {
  try {
    // 1. Obtener usuarios actuales
    const usuariosTexto = localStorage.getItem(USUARIOS_KEY);
    let usuarios: Usuario[] = [];
    
    // 2. Si ya hay usuarios, cargarlos
    if (usuariosTexto) {
      usuarios = JSON.parse(usuariosTexto);
    }
    
    // 3. Agregar el nuevo usuario al array
    usuarios.push(nuevoUsuario);
    
    // 4. Guardar el array actualizado en localStorage
    const nuevosUsuariosTexto = JSON.stringify(usuarios);
    localStorage.setItem(USUARIOS_KEY, nuevosUsuariosTexto);
    
    console.log('✅ Nuevo usuario registrado:', nuevoUsuario);
    return true;
    
  } catch (error) {
    console.error('❌ Error al registrar usuario:', error);
    return false;
  }
}

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
function hacerRegistro(
  nombre: string, 
  email: string, 
  password: string, 
  confirmPassword: string,
  aceptaTerminos: boolean
): boolean {
  
  // 1. Validar los datos
  const errorValidacion = validarRegistro(nombre, email, password, confirmPassword, aceptaTerminos);
  if (errorValidacion) {
    console.log('❌ Error de validación:', errorValidacion);
    return false;
  }
  
  // 2. Verificar si el email ya existe
  if (emailExiste(email)) {
    console.log('❌ El email ya está registrado');
    return false;
  }
  
  // 3. Crear el nuevo usuario
  const nuevoUsuario: Usuario = {
    nombre: nombre.trim(),
    email: email.trim(),
    password: password // En una app real, esto debería estar encriptado
  };
  
  // 4. Agregar el usuario
  const registroExitoso = agregarUsuario(nuevoUsuario);
  
  if (registroExitoso) {
    console.log('✅ Registro exitoso');
    
    // 5. Iniciar sesión automáticamente después del registro
    const sesion = {
      email: nuevoUsuario.email,
      nombre: nuevoUsuario.nombre,
      horaLogin: new Date().toISOString()
    };
    
    const sesionTexto = JSON.stringify(sesion);
    localStorage.setItem(SESION_KEY, sesionTexto);
    
    return true;
  }
  
  return false;
}

// ============================================
// 🎨 Conectar con el HTML
// ============================================

// 1️⃣ Obtener referencias a los elementos del HTML
const formulario = document.getElementById('registerForm') as HTMLFormElement;
const inputNombre = document.getElementById('nombre') as HTMLInputElement;
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
formulario.addEventListener('submit', (evento: Event) => {
  // Prevenir que el formulario recargue la página
  evento.preventDefault();
  
  // Obtener los valores ingresados por el usuario
  const nombre = inputNombre.value.trim();
  const email = inputEmail.value.trim();
  const password = inputPassword.value;
  const confirmPassword = inputConfirmPassword.value;
  const aceptaTerminos = inputAceptaTerminos.checked;
  
  // Intentar hacer el registro
  const registroExitoso = hacerRegistro(nombre, email, password, confirmPassword, aceptaTerminos);
  
  if (registroExitoso) {
    // Si el registro fue exitoso
    mostrarMensaje('exito', `¡Cuenta creada exitosamente! Bienvenido ${nombre}`);
    
    // Limpiar el formulario
    formulario.reset();
    
    // Redirigir a la página principal después de 2 segundos
    setTimeout(() => {
      window.location.href = '/';
    }, 2000);
  } else {
    // Si el registro falló
    if (emailExiste(email)) {
      mostrarMensaje('error', 'Este email ya está registrado');
    } else {
      mostrarMensaje('error', 'Error al crear la cuenta. Verifica los datos.');
    }
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
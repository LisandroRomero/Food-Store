// ============================================
// 📚 TUTORIAL: TypeScript + localStorage
// ============================================

// ¿Qué es una Interface? 
// Es como un "contrato" que define la forma de un objeto
// Nos ayuda a saber qué propiedades debe tener
interface Usuario {
  email: string;      // Texto obligatorio
  password: string;   // Texto obligatorio
  nombre?: string;    // Texto opcional (el ? significa opcional)
}

// ============================================
// 🗄️ localStorage - El almacenamiento del navegador
// ============================================
// localStorage es como una "caja" donde guardamos datos
// Los datos se guardan como TEXTO (string)
// Permanecen aunque cierres el navegador

// IMPORTANTE: localStorage solo guarda TEXTO
// Para guardar objetos/arrays, usamos JSON.stringify() y JSON.parse()

// Ejemplo de cómo funciona localStorage:
// localStorage.setItem('nombre', 'Juan')  ← Guardar
// localStorage.getItem('nombre')          ← Leer (retorna 'Juan')
// localStorage.removeItem('nombre')       ← Borrar

// ============================================
// 📦 Variables globales para las "llaves" del localStorage
// ============================================
const USUARIOS_KEY = 'usuarios';  // Llave para guardar lista de usuarios
const SESION_KEY = 'sesion';      // Llave para guardar sesión activa

// ============================================
// 👥 Crear usuarios de ejemplo
// ============================================
function crearUsuariosDemo(): void {
  // 1. Verificar si ya hay usuarios guardados
  const usuariosGuardados = localStorage.getItem(USUARIOS_KEY);
  
  // 2. Si NO hay usuarios, crear algunos de prueba
  if (!usuariosGuardados) {
    // Array de usuarios de prueba
    const usuarios: Usuario[] = [
      { email: 'admin@ejemplo.com', password: 'admin123', nombre: 'Admin' },
      { email: 'usuario@ejemplo.com', password: 'usuario123', nombre: 'Usuario' }
    ];
    
    // 3. Convertir el array a texto JSON y guardarlo
    const usuariosTexto = JSON.stringify(usuarios);
    localStorage.setItem(USUARIOS_KEY, usuariosTexto);
    
    console.log('✅ Usuarios de prueba creados:', usuarios);
  }
}

// ============================================
// 🔍 Función para buscar un usuario
// ============================================
function buscarUsuario(email: string, password: string): Usuario | null {
  // 1. Obtener el texto guardado en localStorage
  const usuariosTexto = localStorage.getItem(USUARIOS_KEY);
  
  // 2. Si no hay nada, retornar null
  if (!usuariosTexto) {
    return null;
  }
  
  // 3. Convertir el texto JSON a array de objetos
  const usuarios: Usuario[] = JSON.parse(usuariosTexto);
  
  // 4. Buscar el usuario con ese email y contraseña
  const usuario = usuarios.find(u => 
    u.email === email && u.password === password
  );
  
  // 5. Retornar el usuario encontrado (o null si no existe)
  return usuario || null;
}

// ============================================
// 💾 Función para guardar la sesión
// ============================================
function guardarSesion(usuario: Usuario): void {
  // 1. Crear un objeto con los datos de la sesión
  const sesion = {
    email: usuario.email,
    nombre: usuario.nombre,
    horaLogin: new Date().toISOString() // Fecha actual
  };
  
  // 2. Convertir a texto y guardar en localStorage
  const sesionTexto = JSON.stringify(sesion);
  localStorage.setItem(SESION_KEY, sesionTexto);
  
  console.log('✅ Sesión guardada:', sesion);
}

// ============================================
// 🔓 Función para hacer LOGIN
// ============================================
function hacerLogin(email: string, password: string): boolean {
  // 1. Buscar el usuario  
  const usuario = buscarUsuario(email, password);
  
  // 2. Si no existe, retornar false
  if (!usuario) {
    console.log('❌ Usuario no encontrado');
    return false;
  }
  
  // 3. Si existe, guardar la sesión
  guardarSesion(usuario);
  console.log('✅ Login exitoso');
  return true;
}

// ============================================
// 🚪 Función para hacer LOGOUT
// ============================================
// Exportamos la función para que pueda ser usada desde otros archivos
// o desde la consola del navegador
export function hacerLogout(): void {
  // Simplemente borrar la sesión del localStorage
  localStorage.removeItem(SESION_KEY);
  console.log('👋 Sesión cerrada');
}

// ============================================
// 🔒 Función para verificar si hay sesión activa
// ============================================
function haySesionActiva(): boolean {
  const sesion = localStorage.getItem(SESION_KEY);
  return sesion !== null; // Si hay algo guardado, retorna true
}

// ============================================
// 📋 Función para obtener datos de la sesión
// ============================================
function obtenerSesion(): any {
  const sesionTexto = localStorage.getItem(SESION_KEY);
  if (sesionTexto) {
    return JSON.parse(sesionTexto); // Convertir texto a objeto
  }
  return null;
}

// ============================================
// 🎬 Inicializar cuando carga la página
// ============================================
crearUsuariosDemo();

// ============================================
// 🎨 PARTE 2: Conectar con el HTML
// ============================================

// 1️⃣ Obtener referencias a los elementos del HTML
// document.getElementById() busca un elemento por su ID
const formulario = document.getElementById('loginForm') as HTMLFormElement;
const inputEmail = document.getElementById('email') as HTMLInputElement;
const inputPassword = document.getElementById('password') as HTMLInputElement;
// Nota: El checkbox 'rememberMe' existe en el HTML pero no lo usamos en esta versión simple
const mensajeError = document.getElementById('errorMessage') as HTMLDivElement;
const mensajeExito = document.getElementById('successMessage') as HTMLDivElement;

// 2️⃣ Función para mostrar mensajes en pantalla
function mostrarMensaje(tipo: 'error' | 'exito', texto: string): void {
  if (tipo === 'error') {
    // Mostrar mensaje de error
    mensajeError.textContent = texto;
    mensajeError.classList.add('show');
    mensajeExito.classList.remove('show');
  } else {
    // Mostrar mensaje de éxito
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

// 3️⃣ Verificar si ya hay una sesión activa
if (haySesionActiva()) {
  const sesion = obtenerSesion();
  mostrarMensaje('exito', `Ya tienes sesión como ${sesion.email}`);
  
  // Redirigir a la página principal después de 2 segundos
  setTimeout(() => {
    window.location.href = '/';
  }, 2000);
}

// 4️⃣ Manejar el envío del formulario
// addEventListener() espera a que ocurra un evento (en este caso 'submit')
formulario.addEventListener('submit', (evento: Event) => {
  // Prevenir que el formulario recargue la página
  evento.preventDefault();
  
  // Obtener los valores ingresados por el usuario
  const email = inputEmail.value.trim();     // .trim() quita espacios
  const password = inputPassword.value;
  
  // Validar que no estén vacíos
  if (!email || !password) {
    mostrarMensaje('error', 'Por favor completa todos los campos');
    return; // Salir de la función
  }
  
  // Intentar hacer login
  const loginExitoso = hacerLogin(email, password);
  
  if (loginExitoso) {
    // Si el login fue exitoso
    const sesion = obtenerSesion();
    mostrarMensaje('exito', `¡Bienvenido ${sesion.nombre || sesion.email}!`);
    
    // Limpiar el formulario
    formulario.reset();
    
    // Redirigir después de 2 segundos
    setTimeout(() => {
      window.location.href = '/';
    }, 2000);
  } else {
    // Si el login falló
    mostrarMensaje('error', 'Email o contraseña incorrectos');
  }
});

// ============================================
// 📝 Información en la consola
// ============================================
console.log('============================================');
console.log('🔐 Sistema de Login Simple');
console.log('============================================');
console.log('📚 USUARIOS DE PRUEBA:');
console.log('   Email: admin@ejemplo.com');
console.log('   Contraseña: admin123');
console.log('');
console.log('   Email: usuario@ejemplo.com');
console.log('   Contraseña: usuario123');
console.log('============================================');
console.log('💡 COMANDOS ÚTILES EN LA CONSOLA:');
console.log('   localStorage.getItem("usuarios")      ← Ver usuarios');
console.log('   localStorage.getItem("sesion")        ← Ver sesión');
console.log('   localStorage.clear()                  ← Borrar todo');
console.log('============================================');


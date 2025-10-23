// ============================================
// 📚 LOGIN: TypeScript + API
// ============================================

// Ya no necesitamos importar login de api.ts - usamos localStorage

// ============================================
// ✅ Función para validar los datos del login
// ============================================
function validarLogin(email: string, password: string): string | null {
  // Validar email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'Por favor ingresa un email válido';
  }
  
  // Validar contraseña
  if (password.length < 1) {
    return 'Por favor ingresa tu contraseña';
  }
  
  return null;
}

// ============================================
// 🔍 Función para buscar un usuario en localStorage
// ============================================
function buscarUsuario(email: string, password: string): any | null {
  // 1. Obtener usuarios del localStorage
  const usuariosTexto = localStorage.getItem('usuarios');
  
  // 2. Si no hay usuarios, retornar null
  if (!usuariosTexto) {
    return null;
  }
  
  // 3. Convertir texto a array de objetos
  const usuarios = JSON.parse(usuariosTexto);
  
  // 4. Buscar el usuario con email y contraseña coincidentes
  const usuario = usuarios.find((u: any) => 
    u.email === email && u.password === password
  );
  
  return usuario || null;
}

// ============================================
// 💾 Función para guardar la sesión
// ============================================
function guardarSesion(usuario: any): void {
  const sesion = {
    email: usuario.email,
    nombre: usuario.nombre,
    apellido: usuario.apellido,
    horaLogin: new Date().toISOString()
  };
  
  localStorage.setItem('sesion', JSON.stringify(sesion));
  console.log('✅ Sesión guardada:', sesion);
}

// ============================================
// 🔓 Función para hacer LOGIN
// ============================================
function hacerLogin(email: string, password: string, mostrarMensaje: (tipo: 'error' | 'exito', texto: string) => void): boolean {
  // 1. Validar los datos
  const errorValidacion = validarLogin(email, password);
  if (errorValidacion) {
    mostrarMensaje('error', errorValidacion);
    return false;
  }
  
  // 2. Buscar el usuario en localStorage
  const usuario = buscarUsuario(email, password);
  
  if (!usuario) {
    mostrarMensaje('error', 'Email o contraseña incorrectos');
    return false;
  }
  
  // 3. Si existe, guardar la sesión
  guardarSesion(usuario);
  mostrarMensaje('exito', `¡Bienvenido de vuelta ${usuario.nombre}!`);
  return true;
}

// ============================================
// 🎨 Conectar con el HTML
// ============================================

// Asegurar que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {
  console.log('🔍 DOM cargado, conectando elementos...');
  
  // Obtener referencias a los elementos del HTML
  const formulario = document.getElementById('loginForm') as HTMLFormElement;
  const inputEmail = document.getElementById('email') as HTMLInputElement;
  const inputPassword = document.getElementById('password') as HTMLInputElement;
  const mensajeError = document.getElementById('errorMessage') as HTMLDivElement;
  const mensajeExito = document.getElementById('successMessage') as HTMLDivElement;
  
  // Verificar que los elementos existan
  if (!formulario) {
    console.error('❌ No se encontró el formulario loginForm');
    return;
  }
  
  console.log('✅ Elementos encontrados, configurando event listeners...');

  // Función para mostrar mensajes
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

  // Manejar el envío del formulario
  formulario.addEventListener('submit', (evento: Event) => {
    evento.preventDefault();
    console.log('📝 Formulario enviado, procesando login...');
    
    const email = inputEmail.value.trim();
    const password = inputPassword.value;
    
    const loginExitoso = hacerLogin(email, password, mostrarMensaje);
    
    if (loginExitoso) {
      formulario.reset();
      
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);
    }
  });
  
  console.log('🔐 Sistema de Login - API Mode - ¡Listo!');
});
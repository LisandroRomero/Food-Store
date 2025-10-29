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

// ============================================
// ⏰ Side Bar
// ============================================

// Define la estructura de tu proyecto para mapear el data-page a la URL del archivo
// Rutas relativas desde 'pages/admin/adminHome' a las carpetas hermanas en 'pages/admin'
const pageMap: { [key: string]: string } = {
    adminHome: 'adminHome.html', 
    categories: '../categories/categories.html', 
    products: '../products/products.html',       
    orders: '../orders/orders.html',
};

const contentArea = document.getElementById('main-content-wrapper') as HTMLElement | null;
const sidebarNav = document.querySelector('.sidebar-nav') as HTMLElement | null;


async function loadContent(pageKey: string): Promise<void> {
    if (!contentArea) return;

    if (pageKey === 'adminHome') {
        // Recargar la página para volver al estado inicial del Dashboard
        location.reload(); 
        return;
    }

    const url = pageMap[pageKey];
    if (!url) {
        contentArea.innerHTML = `<h1>Error</h1><p>No se encontró la página para la clave: ${pageKey}</p>`;
        return;
    }

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Error ${response.status}: No se pudo cargar el archivo desde: ${url}`);
        }

        const html = await response.text();

        // EXTRAER SOLO EL CONTENIDO DENTRO DEL BODY
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const newContent = doc.querySelector('body')?.innerHTML;
        
        if (newContent) {
            contentArea.innerHTML = newContent;
        } else {
            // Fallback
            contentArea.innerHTML = html;
        }

    } catch (error) {
        console.error('Fallo la carga del contenido:', error);
        contentArea.innerHTML = `<h1>Error de Carga</h1><p>No se pudo cargar el contenido de ${pageKey}.</p>`;
    }
}


function handleSidebarClick(event: MouseEvent): void {
    const target = event.target as HTMLAnchorElement;
    
    if (target.tagName === 'A' && target.hasAttribute('data-page')) {
        event.preventDefault(); 
        const pageKey = target.getAttribute('data-page');

        if (pageKey) {
            loadContent(pageKey);

            // Actualiza la clase 'active' para resaltar el enlace actual
            const currentActive = document.querySelector('.sidebar-nav a.active');
            if (currentActive) {
                currentActive.classList.remove('active');
            }
            target.classList.add('active');
        }
    }
}

sidebarNav?.addEventListener('click', handleSidebarClick);

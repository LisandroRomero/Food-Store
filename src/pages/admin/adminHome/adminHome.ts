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
  
  // Configurar menú móvil
  setupMobileMenu();
}


//mobile
function setupMobileMenu(): void {
  const toggle = document.getElementById('mobileMenuToggle');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');
  
  if (toggle && sidebar && overlay) {
    // Abrir/cerrar sidebar
    toggle.addEventListener('click', () => {
      sidebar.classList.toggle('show');
      overlay.classList.toggle('show');
    });
    
    // Cerrar al hacer clic en overlay
    overlay.addEventListener('click', () => {
      sidebar.classList.remove('show');
      overlay.classList.remove('show');
    });
  }
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
//  Configurar botones
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

//siddebar
// Define la estructura de tu proyecto para mapear el data-page a la URL del archivo
const pageMap: { [key: string]: string } = {
    adminHome: 'dashboard', 
    categories: '../categories/categories.html', 
    products: '../products/products.html',       
    orders: '../orders/orders.html',
};

const contentArea = document.getElementById('main-content-wrapper') as HTMLElement | null;
const sidebarNav = document.querySelector('.sidebar-nav') as HTMLElement | null;

async function loadContent(pageKey: string): Promise<void> {
    if (!contentArea) return;

    // Caso especial para el dashboard
    if (pageKey === 'adminHome') {
        showDashboard();
        updateActiveNav(pageKey);
        return;
    }

    const url = pageMap[pageKey];
    if (!url) {
        contentArea.innerHTML = `
            <div class="alert alert-danger">
                <h3>Error 404</h3>
                <p>No se encontró la página: ${pageKey}</p>
            </div>
        `;
        return;
    }

    try {
        // Mostrar loading
        contentArea.innerHTML = `
            <div class="loading-container text-center p-4">
                <div style="text-align: center; padding: 2rem;">
                    <p style="font-size: 1.5rem;">⏳ Cargando ${pageKey}...</p>
                </div>
            </div>
        `;

        // Cargar el contenido HTML parcial
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Error ${response.status}: No se pudo cargar ${url}`);
        }

        const html = await response.text();
        contentArea.innerHTML = html;

        // Cargar CSS específico del módulo
        loadModuleCSS(pageKey);
        
        // Cargar e inicializar el módulo TypeScript
        try {
            let module: any;
            if (pageKey === 'categories') {
                module = await import('../categories/categories.js');
            } else if (pageKey === 'products') {
                module = await import('../products/products.js');
            } else if (pageKey === 'orders') {
                console.log('Módulo de pedidos aún no está implementado');
                return;
            }
            
            if (module && module.init) {
                await module.init();
            } else if (module && module.default) {
                await module.default();
            }
        } catch (moduleError) {
            console.error(`Error al cargar módulo ${pageKey}:`, moduleError);
        }

        updateActiveNav(pageKey);

    } catch (error) {
        console.error('Error al cargar contenido:', error);
        contentArea.innerHTML = `
            <div style="text-align: center; padding: 2rem;">
                <h3>❌ Error de Carga</h3>
                <p>No se pudo cargar el contenido de ${pageKey}</p>
                <small>${error instanceof Error ? error.message : 'Error desconocido'}</small>
            </div>
        `;
    }
}

// Mostrar el dashboard original
function showDashboard(): void {
    if (!contentArea) return;
    
    contentArea.innerHTML = `
        <div class="dashboard-grid">
            <div class="card">
                <h2 class="card-title">Usuarios Registrados</h2>
                <div class="stat-number" id="totalUsers">0</div>
                <div class="stat-label">Total de usuarios</div>
            </div>

            <div class="card">
                <h2 class="card-title">Sesiones Activas</h2>
                <div class="stat-number">1</div>
                <div class="stat-label">En este momento</div>
            </div>

            <div class="card">
                <h2 class="card-title">Módulos</h2>
                <div class="stat-number">3</div>
                <div class="stat-label">Disponibles</div>
            </div>

            <div class="card">
                <h2 class="card-title">Estado del Sistema</h2>
                <div class="stat-number status-ok">✓</div>
                <div class="stat-label">Operativo</div>
            </div>
        </div>

        <div class="card">
            <h2 class="card-title">Acciones Rápidas</h2>
            <div class="actions">
                <button class="btn btn-primary" onclick="window.location.href='/'">
                    🏠 Inicio
                </button>
                <button class="btn btn-primary" onclick="window.location.href='/src/pages/client/index.html'">
                    👥 Panel de Cliente
                </button>
                <button class="btn btn-secondary" id="viewUsersBtn">
                    📋 Ver Usuarios
                </button>
                <button class="btn btn-secondary" id="clearStorageBtn">
                    🗑️ Limpiar LocalStorage
                </button>
            </div>
        </div>

        <div class="card recent-activity">
            <h2 class="card-title">Actividad Reciente</h2>
            <div id="activityList">
                <div class="activity-item">
                    <div>Inicio de sesión exitoso</div>
                    <div class="activity-time" id="loginTime"></div>
                </div>
                <div class="activity-item">
                    <div>Acceso al panel de administración</div>
                    <div class="activity-time">Hace un momento</div>
                </div>
            </div>
        </div>
    `;
    
    // Re-configurar botones del dashboard
    configurarBotones();
    cargarEstadisticas();
    mostrarHoraLogin();
}

// Actualizar navegación activa
function updateActiveNav(pageKey: string): void {
    const navLinks = document.querySelectorAll('.sidebar-nav a');
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-page') === pageKey) {
            link.classList.add('active');
        }
    });
}

// Cargar CSS específico del módulo
function loadModuleCSS(pageKey: string): void {
    const oldModuleCSS = document.getElementById('module-css');
    if (oldModuleCSS) {
        oldModuleCSS.remove();
    }
    
    if (pageKey === 'adminHome') return;
    
    const link = document.createElement('link');
    link.id = 'module-css';
    link.rel = 'stylesheet';
    link.href = `../${pageKey}/${pageKey}.css`;
    document.head.appendChild(link);
    
    console.log(`📄 CSS cargado: ../${pageKey}/${pageKey}.css`);
}

// Manejar clicks en el sidebar
function handleSidebarClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const link = target.closest('a[data-page]') as HTMLAnchorElement;
    
    if (link && link.hasAttribute('data-page')) {
        event.preventDefault(); 
        const pageKey = link.getAttribute('data-page');

        if (pageKey) {
            loadContent(pageKey);

            const currentActive = document.querySelector('.sidebar-nav .nav-item.active');
            if (currentActive) {
                currentActive.classList.remove('active');
            }
            link.classList.add('active');
            
            // Cerrar sidebar en móvil
            if (window.innerWidth <= 768) {
                const sidebar = document.getElementById('sidebar');
                const overlay = document.getElementById('sidebarOverlay');
                sidebar?.classList.remove('show');
                overlay?.classList.remove('show');
            }
        }
    }
}

// Escuchar clicks en el sidebar
sidebarNav?.addEventListener('click', handleSidebarClick);

// Mostrar el dashboard por defecto solo después de que todas las referencias DOM estén inicializadas
if (sesion) {
    // loadContent comprobará contentArea internamente
    loadContent('adminHome');
}

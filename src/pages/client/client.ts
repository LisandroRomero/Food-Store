// ============================================
// 📦 I N T E R F A C E S / T Y P E S
// ============================================

interface Categoria {
    id: number;
    nombre: string;
}

interface Producto {
    id: number;
    nombre: string;
    descripcion: string;
    precio: number;
    stock: number;
    disponible: boolean;
    imagen: string;
    categoria: Categoria;
    activo: boolean;
}

// Interfaz para la sesión (asumiendo que viene de `obtenerSesion()`)
interface Sesion {
    nombre?: string;
    email?: string;
    horaLogin: number;
}

// ============================================
// ⚙️ C O N S T A N T E S
// ============================================

import { protegerPagina, mostrarInfoUsuario, crearBotonCerrarSesion, obtenerSesion } from '../../utils/auth';


const BASE_URL: string = import.meta.env.VITE_API_URL; 
const API_PRODUCTOS_URL: string = `${BASE_URL}/productos`;
// ============================================
// 👤 L Ó G I C A   D E   U S U A R I O / S E S I Ó N
// ============================================

/**
 * 💬 Personaliza el mensaje de bienvenida usando el nombre del usuario de la sesión.
 */
function personalizarMensaje(): void {
    const sesion: Sesion = obtenerSesion();
    const mensajeBienvenida = document.getElementById('welcomeMessage');
    
    // Asume que `obtenerSesion()` devuelve un objeto Sesion
    if (mensajeBienvenida && sesion && sesion.nombre) {
        mensajeBienvenida.textContent = `¡Hola ${sesion.nombre}! Aquí puedes gestionar tu perfil y servicios`;
    }
}

/**
 * ⚙️ Configura el listener de eventos para el botón de configuración (Settings).
 */
function configurarBotonSettings(): void {
    const btnSettings = document.getElementById('settingsBtn');
    
    if (btnSettings) {
        btnSettings.addEventListener('click', mostrarSettings);
    }
}

/**
 * 📋 Muestra información detallada de la sesión en una alerta.
 */
function mostrarSettings(): void {
    const sesion: Sesion = obtenerSesion();
    
    if (sesion) {
        let info = `Información de tu cuenta:\n\n`;
        info += `Email: ${sesion.email || 'No disponible'}\n`;
        info += `Nombre: ${sesion.nombre || 'No especificado'}\n`;
        info += `Última sesión: ${new Date(sesion.horaLogin).toLocaleString()}\n`;
        
        alert(info);
    }
}

// ============================================
// 🛍️ L Ó G I C A   D E   P R O D U C T O S / A P I
// ============================================

/**
 * 🎣 Obtiene la lista de productos de la API.
 */
async function obtenerProductos(): Promise<Producto[]> {
    try {
        const response = await fetch(API_PRODUCTOS_URL);
        
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        
        const data: Producto[] = await response.json();
        return data;
        
    } catch (error) {
        console.error("❌ Error al cargar productos:", error);
        return [];
    }
}

/**
 * 🎨 Crea la cadena HTML para una tarjeta de producto.
 */
function crearTarjetaProducto(producto: Producto): string {
    const precioFormateado = new Intl.NumberFormat('es-CO', { 
        style: 'currency', 
        currency: 'COP',
        minimumFractionDigits: 2 
    }).format(producto.precio);

    const statusClass = producto.disponible ? 'disponible' : 'agotado';
    const statusText = producto.disponible ? 'Disponible' : 'Agotado';

    return `
        <div class="product-card">
            <img 
                src="${producto.imagen}" 
                alt="${producto.nombre}" 
                class="product-image"
            />
            
            <div class="product-info">
                <p class="product-category">${producto.categoria?.nombre || 'Sin Categoría'}</p>
                
                <h3 class="product-name">${producto.nombre}</h3>
                
                <p class="product-description">${producto.descripcion}</p>
                
                <div class="product-footer">
                    <span class="product-price">${precioFormateado}</span>
                    
                    <span class="product-status ${statusClass}">
                        ${statusText}
                    </span>
                    
                    ${producto.disponible ? 
                        '<button class="add-to-cart-btn">Agregar</button>' : 
                        '<button class="add-to-cart-btn disabled" disabled>Ver más</button>'
                    }
                </div>
            </div>
        </div>
    `;
}

/**
 * 🖼️ Función principal para inyectar la lista de productos en el DOM.
 */
async function renderizarProductos(): Promise<void> {
    const contenedorProductos = document.getElementById('productos-container');
    const contadorProductos = document.getElementById('product-count-span');

    if (!contenedorProductos) {
        console.error("🚫 Contenedor de productos no encontrado (ID: productos-container).");
        return;
    }

    // Estado de carga
    contenedorProductos.innerHTML = '<p>Cargando productos...</p>';

    const productos = await obtenerProductos();
    
    // Limpiar y evaluar
    contenedorProductos.innerHTML = ''; 

    if (productos.length === 0) {
        contenedorProductos.innerHTML = '<p>No se encontraron productos disponibles.</p>';
        if (contadorProductos) {
            contadorProductos.textContent = '0 producto';
        }
        return;
    }

    // Actualizar el contador
    if (contadorProductos) {
        contadorProductos.textContent = `${productos.length} producto${productos.length !== 1 ? 's' : ''}`;
    }

    // Generar e inyectar HTML
    const htmlProductos = productos.map(crearTarjetaProducto).join('');
    contenedorProductos.innerHTML = htmlProductos;
}


// ============================================
// 🚀 I N I C I A L I Z A C I Ó N
// ============================================

/**
 * 🏁 Punto de entrada principal de la aplicación.
 */
function main(): void {
    // 1. Proteger la página y obtener la sesión
    const sesion = protegerPagina() as Sesion | null;

    if (sesion) {
        // Lógica de usuario
        mostrarInfoUsuario('userInfo');
        crearBotonCerrarSesion('logoutContainer');
        personalizarMensaje();
        configurarBotonSettings();
    }
    
    // 2. Iniciar la carga de productos (siempre se ejecuta, esté o no logueado)
    // Se ejecuta sólo cuando el DOM está completamente cargado
    document.addEventListener('DOMContentLoaded', renderizarProductos);

    console.log('✅ Panel de cliente inicializado.');
    console.log('Usuario:', sesion);
}

// Ejecutar el punto de entrada principal
main();
// 1. DEFINICIÓN DE TIPOS/INTERFACES para la estructura del JSON
// Esto es el corazón de TypeScript: asegurar que los datos tengan el formato esperado.

import { obtenerSesion } from "../../../utils/auth";

interface Producto {
    id: number;
    nombre: string;
    descripcion: string;
    precio: number;
    stock: number;
    disponible: boolean;
    imagen: string;
    categoria: {
        id: number;
        nombre: string;
    };
    activo: boolean;
}

interface DetallePedido {
    id: number;
    cantidad: number;
    subtotal: number;
    producto: Producto;
}

interface Usuario {
    id: number;
    nombre: string;
    apellido: string;
    email: string;
    rol: string;
}

interface Pedido {
    id: number;
    fecha: [number, number, number]; // [año, mes, día]
    estado: string;
    total: number;
    usuario: Usuario;
    detalles: DetallePedido[];
}


// 2. MOCK DE DATOS (Simula la respuesta del endpoint)
// Se han agregado productos diferentes para el pedido 3 para un mejor ejemplo.
const mockResponse: Pedido[] = [
    {
        "id": 1, "fecha": [2025, 11, 8], "estado": "PENDIENTE", "total": 1250.0,
        "usuario": { "id": 2, "nombre": "Juan", "apellido": "Pérez", "email": "juan@mail.com", "rol": "USUARIO" },
        "detalles": [{ "id": 1, "cantidad": 10, "subtotal": 1250.0, "producto": { "id": 1, "nombre": "Coca Cola zero", "descripcion": "Refresco de cola sin azucar", "precio": 500.0, "stock": 0, "disponible": true, "imagen": "", "categoria": { "id": 1, "nombre": "Bebidas Frías" }, "activo": true } }]
    },
    {
        "id": 2, "fecha": [2025, 11, 8], "estado": "PENDIENTE", "total": 2450.0,
        "usuario": { "id": 2, "nombre": "Juan", "apellido": "Pérez", "email": "juan@mail.com", "rol": "USUARIO" },
        "detalles": [{ "id": 2, "cantidad": 5, "subtotal": 2450.0, "producto": { "id": 2, "nombre": "Hamburguesa Sencilla", "descripcion": "Clásica Hamburguesa", "precio": 490.0, "stock": 100, "disponible": true, "imagen": "", "categoria": { "id": 2, "nombre": "Comidas" }, "activo": true } }]
    },
    {
        "id": 3, "fecha": [2025, 10, 25], "estado": "COMPLETADO", "total": 1000.0,
        "usuario": { "id": 2, "nombre": "Juan", "apellido": "Pérez", "email": "juan@mail.com", "rol": "USUARIO" },
        "detalles": [
            { "id": 3, "cantidad": 1, "subtotal": 600.0, "producto": { "id": 3, "nombre": "Hamburguesa Triple", "descripcion": "La de la foto original", "precio": 600.0, "stock": 50, "disponible": true, "imagen": "", "categoria": { "id": 2, "nombre": "Comidas" }, "activo": true } },
            { "id": 4, "cantidad": 2, "subtotal": 400.0, "producto": { "id": 4, "nombre": "Papas Fritas", "descripcion": "Porción individual", "precio": 200.0, "stock": 200, "disponible": true, "imagen": "", "categoria": { "id": 3, "nombre": "Acompañamientos" }, "activo": true } }
        ]
    }
];

// 3. FUNCIONES DE UTILIDAD

/**
 * Formatea la fecha del array [año, mes, día] a un string legible.
 */
function formatDate(dateArray: Pedido['fecha']): string {
    const [year, month, day] = dateArray;
    // El mes en JS es 0-indexado, por eso se resta 1.
    const date = new Date(year, month - 1, day);
    
    // Agrega una hora simulada ya que la hora no está en el JSON
    const hours = new Date().getHours();
    const minutes = new Date().getMinutes();

    const options: Intl.DateTimeFormatOptions = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    
    // Ejemplo de formato: "8 de noviembre de 2025, 20:18"
    return `${date.toLocaleDateString('es-ES', options)}, ${hours}:${minutes < 10 ? '0' + minutes : minutes}`;
}

/**
 * Formatea el monto a moneda (ej: $1.250,00).
 */
function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS',
        minimumFractionDigits: 2
    }).format(amount);
}

/**
 * Obtiene el color de la etiqueta de estado.
 */
function getStatusStyle(status: string): { background: string; color: string } {
    switch(status.toUpperCase()) {
        case 'PENDIENTE':
            return { background: '#ffe0b2', color: '#d68910' }; // Amarillo/Naranja
        case 'COMPLETADO':
            return { background: '#d4edda', color: '#155724' }; // Verde
        case 'CANCELADO':
            return { background: '#f8d7da', color: '#721c24' }; // Rojo
        case 'EN CAMINO':
            return { background: '#cce5ff', color: '#004085' }; // Azul
        default:
            return { background: '#e9ecef', color: '#495057' }; // Gris
    }
}

/**
 * Construye la tarjeta HTML para un pedido dado.
 */
function createOrderCard(order: Pedido): string {
    // 1. Obtiene estilos dinámicos
    const statusStyles = getStatusStyle(order.estado);

    // 2. Prepara la lista de productos
    const productsHtml = order.detalles.map(detail => `
        <div class="product-item">
            <span>+ <strong>${detail.producto.nombre}</strong> (x${detail.cantidad})</span>
        </div>
    `).join('');

    // 3. Calcula la cantidad de tipos de producto (simplemente la longitud del array detalles)
    const itemCount = order.detalles.length;

    // 4. Retorna el string HTML completo para la tarjeta
    return `
        <div class="order-card">
            <div class="order-header">
                <div class="order-id">
                    Pedido #ORD-${order.id}
                </div>
                <div class="status-tag" style="background-color: ${statusStyles.background}; color: ${statusStyles.color};">
                    ${order.estado.toUpperCase()}
                </div>
            </div>
            
            <div class="order-date">
                <span class="icon">📅</span>
                <span>${formatDate(order.fecha)}</span>
            </div>
            
            <div class="order-content">
                ${productsHtml}
            </div>
            
            <div class="order-footer">
                <div class="item-count">
                    <span class="icon">📦</span>
                    <span>${itemCount} tipo(s) de producto</span>
                </div>
                <div class="total-price">
                    ${formatCurrency(order.total)}
                </div>
            </div>
        </div>
    `;
}

/**
 * Renderiza todos los pedidos en el DOM.
 */
function renderOrders(orders: Pedido[]): void {
    const ordersContainer = document.getElementById('orders-container');
    const loadingMessage = document.getElementById('loading');

    if (!ordersContainer) return;

    // 1. Eliminar el mensaje de carga
    if (loadingMessage) {
        loadingMessage.remove();
    }

    // 2. Concatenar todas las tarjetas en un solo string
    const cardsHtml = orders.map(order => createOrderCard(order)).join('');

    // 3. Inyectar todo el HTML de una vez (mejor performance)
    ordersContainer.innerHTML = cardsHtml;
}


// 4. FUNCIÓN ASÍNCRONA PARA SIMULAR LA LLAMADA AL ENDPOINT

async function fetchOrders(): Promise<void> {
    const session = obtenerSesion();
    const userId = session?.id;

    // Puedes agregar una protección aquí para evitar la llamada si no hay userId
    if (!userId) {
         const ordersContainer = document.getElementById('orders-container');
         if (ordersContainer) {
             ordersContainer.innerHTML = '<p class="error-message">❌ Debes iniciar sesión para ver tus pedidos.</p>';
         }
         return; // Detiene la ejecución si no hay usuario
    }
    
    try {
        // En un entorno real, descomentarías la línea siguiente y usarías fetch:
        const response = await fetch(`http://localhost:8080/pedidos/usuario/${userId}`);
        
        // Agregar verificación de respuesta HTTP (muy recomendable)
        if (!response.ok) {
            throw new Error(`Error al obtener pedidos: ${response.status}`);
        }
        
        const data: Pedido[] = await response.json();
        
        // Simulación de la demora de red y uso de datos mock
        // const data: Pedido[] = mockResponse;

        renderOrders(data);
    } catch (error) {
        const ordersContainer = document.getElementById('orders-container');
        if (ordersContainer) {
            ordersContainer.innerHTML = '<p class="error-message">Error al cargar los pedidos. Por favor, verifica el servidor local.</p>';
        }
        console.error("Error fetching data:", error);
    }
}

// 5. INICIALIZACIÓN
document.addEventListener('DOMContentLoaded', () => {
    // ✨ SOLUCIÓN: Llama a la función async DENTRO de un callback síncrono.
    fetchOrders(); 
});
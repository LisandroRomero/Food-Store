// orders.ts - Módulo de gestión de pedidos (Admin)
import { ordersService } from '../../../utils/services/orders.service';
import { mostrarExito, mostrarError } from '../../../utils/notifications';
import type { IPedido } from '../../../types/IOrders';

// Variables globales del módulo
let pedidos: IPedido[] = [];
let filtroEstado: string = '';

/**
 * Inicializa el módulo de pedidos: configura eventos y carga los datos
 */
export async function init(): Promise<void> {
    setupEventListeners();
    await cargarPedidos();
}

// Configurar todos los event listeners
function setupEventListeners(): void {
    // Filtro por estado
    const filterEstado = document.getElementById('filterEstado') as HTMLSelectElement;
    if (filterEstado) {
        filterEstado.addEventListener('change', (e) => {
            filtroEstado = (e.target as HTMLSelectElement).value;
            renderizarPedidos();
        });
    }
    
    // Event delegation para botones de cambio de estado
    const ordersContainer = document.getElementById('ordersContainer');
    if (ordersContainer) {
        ordersContainer.addEventListener('click', handleOrderActions);
    }
}

// Manejar acciones de las tarjetas de pedidos
function handleOrderActions(e: Event): void {
    const target = e.target as HTMLElement;
    const btn = target.closest('button');
    
    if (!btn) return;
    
    if (btn.classList.contains('btn-change-status')) {
        const pedidoId = btn.getAttribute('data-pedido-id');
        const nuevoEstado = btn.getAttribute('data-nuevo-estado');
        
        if (pedidoId && nuevoEstado) {
            cambiarEstadoPedido(parseInt(pedidoId), nuevoEstado);
        }
    }
}

/**
 * Carga todos los pedidos desde la API y los renderiza
 */
async function cargarPedidos(): Promise<void> {
    try {
        const response = await ordersService.obtenerTodosPedidos();
        
        if (response.success) {
            pedidos = Array.isArray(response.data) ? response.data : [];
            renderizarPedidos();
        } else {
            mostrarError(response.message || 'Error al cargar pedidos');
        }
    } catch (error) {
        console.error('Error al cargar pedidos:', error);
        mostrarError('Error al cargar los pedidos');
    }
}

/**
 * Renderiza los pedidos aplicando el filtro de estado seleccionado
 */
function renderizarPedidos(): void {
    const container = document.getElementById('ordersContainer');
    if (!container) return;
    
    // Filtrar pedidos
    const pedidosFiltrados = filtroEstado 
        ? pedidos.filter(p => p.estado.toUpperCase() === filtroEstado.toUpperCase())
        : pedidos;
    
    if (pedidosFiltrados.length === 0) {
        container.innerHTML = `
            <div class="empty-message">
                <p>No hay pedidos disponibles</p>
                <small>${filtroEstado ? `Con estado: ${filtroEstado}` : ''}</small>
            </div>
        `;
        return;
    }
    
    // Renderizar tarjetas
    container.innerHTML = pedidosFiltrados.map(pedido => crearTarjetaPedido(pedido)).join('');
}

/**
 * Genera el HTML de una tarjeta de pedido con toda su información
 */
function crearTarjetaPedido(pedido: IPedido): string {
    const statusStyles = obtenerEstiloEstado(pedido.estado);
    const fechaFormateada = formatearFecha(pedido.fecha);
    const totalFormateado = formatearMoneda(pedido.total);
    const cantidadProductos = pedido.detalles.reduce((sum, det) => sum + det.cantidad, 0);
    
    // Botones de cambio de estado según el estado actual
    const botonesEstado = generarBotonesEstado(pedido.id, pedido.estado);
    
    return `
        <div class="order-card">
            <div class="order-card__header">
                <div class="order-card__info">
                    <h3 class="order-card__title">Pedido #ORD-${pedido.id}</h3>
                    <p class="order-card__detail">Cliente: <strong>${pedido.usuario.nombre} ${pedido.usuario.apellido}</strong></p>
                    <p class="order-card__detail">${pedido.usuario.email}</p>
                    <p class="order-card__detail">${fechaFormateada}</p>
                </div>
                <div class="order-card__status" style="background-color: ${statusStyles.background}; color: ${statusStyles.color};">
                    ${pedido.estado.toUpperCase()}
                </div>
            </div>
            
            <hr class="order-card__separator">
            
            <div class="order-card__summary">
                <span class="order-card__item-count">${cantidadProductos} producto(s)</span>
                <span class="order-card__total-price">${totalFormateado}</span>
            </div>
            
            <div class="order-card__actions">
                ${botonesEstado}
            </div>
        </div>
    `;
}

// Generar botones de cambio de estado según el estado actual
// Estados válidos según backend: PENDIENTE, CONFIRMADO, CANCELADO, TERMINADO
function generarBotonesEstado(pedidoId: number, estadoActual: string): string {
    const estadoUpper = estadoActual.toUpperCase();
    const botones: string[] = [];
    
    if (estadoUpper === 'PENDIENTE') {
        botones.push(`
            <button class="btn-change-status" data-pedido-id="${pedidoId}" data-nuevo-estado="CONFIRMADO">
                Confirmar Pedido
            </button>
            <button class="btn-change-status btn-cancel" data-pedido-id="${pedidoId}" data-nuevo-estado="CANCELADO">
                Cancelar
            </button>
        `);
    } else if (estadoUpper === 'CONFIRMADO') {
        botones.push(`
            <button class="btn-change-status" data-pedido-id="${pedidoId}" data-nuevo-estado="TERMINADO">
                Marcar como Terminado
            </button>
        `);
    }
    
    return botones.length > 0 ? `<div class="order-actions">${botones.join('')}</div>` : '';
}

/**
 * Actualiza el estado de un pedido mediante la API
 */
async function cambiarEstadoPedido(pedidoId: number, nuevoEstado: string): Promise<void> {
    const confirmacion = confirm(`¿Cambiar el estado del pedido #ORD-${pedidoId} a "${nuevoEstado}"?`);
    if (!confirmacion) return;
    
    try {
        const response = await ordersService.actualizarEstadoPedido(pedidoId.toString(), nuevoEstado);
        if (response.success) {
            mostrarExito('Estado del pedido actualizado correctamente');
            await cargarPedidos();
        } else {
            mostrarError(response.message || 'Error al actualizar estado');
        }
    } catch (error) {
        console.error('Error al cambiar estado:', error);
        mostrarError('Error al cambiar el estado del pedido');
    }
}

// ============================================
// Funciones de utilidad
// ============================================

/**
 * Formatea un array de fecha [año, mes, día] a string legible
 */
function formatearFecha(dateArray: IPedido['fecha']): string {
    const [year, month, day] = dateArray;
    const date = new Date(year, month - 1, day);
    const hours = new Date().getHours();
    const minutes = new Date().getMinutes();
    
    const options: Intl.DateTimeFormatOptions = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    
    return `${date.toLocaleDateString('es-ES', options)}, ${hours}:${minutes < 10 ? '0' + minutes : minutes}`;
}

/**
 * Formatea un número a formato de moneda argentina (ARS)
 */
function formatearMoneda(amount: number): string {
    return new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS',
        minimumFractionDigits: 2
    }).format(amount);
}

/**
 * Retorna los colores de fondo y texto según el estado del pedido
 */
function obtenerEstiloEstado(status: string): { background: string; color: string } {
    switch(status.toUpperCase()) {
        case 'PENDIENTE':
            return { background: '#ffe0b2', color: '#d68910' }; // Amarillo/Naranja
        case 'CONFIRMADO':
            return { background: '#cce5ff', color: '#004085' }; // Azul
        case 'TERMINADO':
            return { background: '#d4edda', color: '#155724' }; // Verde
        case 'CANCELADO':
            return { background: '#f8d7da', color: '#721c24' }; // Rojo
        default:
            return { background: '#e9ecef', color: '#495057' }; // Gris
    }
}

// Exportar init como default
export default init;


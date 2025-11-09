// cart.ts
import { protegerPagina, mostrarInfoUsuario, crearBotonCerrarSesion, actualizarContadorCarrito } from '../../../utils/auth';

// ============================================
// 📦 I N T E R F A C E S   D E L   C A R R I T O
// ============================================

/**
 * Representa un artículo dentro del carrito de compras.
 */
interface CartItem {
    id: number;
    nombre: string;
    precio: number;
    cantidad: number;
    imagen: string;
}

// ============================================
// 💾 L Ó G I C A   D E   S T O R A G E
// ============================================

/**
 * 💾 Carga los artículos del carrito desde localStorage.
 * @returns Array de CartItem o un array vacío si no hay datos.
 */
function loadCart(): CartItem[] {
    try {
        const cartJson = localStorage.getItem('cart');
        return cartJson ? JSON.parse(cartJson) : [];
    } catch (e) {
        console.error("Error al cargar el carrito de localStorage:", e);
        return [];
    }
}

/**
 * 💾 Guarda los artículos del carrito en localStorage y actualiza el contador.
 * @param cart Array de CartItem a guardar.
 */
function saveCart(cart: CartItem[]): void {
    try {
        // Filtra elementos con cantidad cero para eliminarlos
        const cleanedCart = cart.filter(item => item.cantidad > 0);
        localStorage.setItem('cart', JSON.stringify(cleanedCart));
        actualizarContadorCarrito();
        renderizarCarrito(); // Vuelve a renderizar la UI después de guardar
    } catch (e) {
        console.error("Error al guardar el carrito en localStorage:", e);
    }
}


// ============================================
// 🎨 R E N D E R I Z A C I Ó N   D E L   C A R R I T O
// ============================================

/**
 * 🎨 Genera el HTML para un solo artículo del carrito.
 */
function createCartItemHtml(item: CartItem): string {
    const totalItem = (item.precio * item.cantidad).toFixed(2);
    
    return `
        <div class="cart-item" data-product-id="${item.id}">
            <img 
                src="${item.imagen || '/assets/default-food.png'}" 
                alt="${item.nombre}" 
                class="cart-item-image"
                onerror="this.onerror=null; this.src='/assets/default-food.png';">
            
            <div class="cart-item-info">
                <a href="/src/pages/client/productDetail/productDetail.html?id=${item.id}" class="cart-item-title">${item.nombre}</a>
                <p class="cart-item-price">$${item.precio.toFixed(2)} c/u</p>
                
                <div class="cart-item-controls">
                    <div class="qty-controls small">
                        <button class="btn btn-outline btn-qty-decrease" data-id="${item.id}">-</button>
                        <input type="number" value="${item.cantidad}" min="1" class="qty-input" data-id="${item.id}">
                        <button class="btn btn-outline btn-qty-increase" data-id="${item.id}">+</button>
                    </div>
                    
                    <button class="btn btn-link remove-btn" data-id="${item.id}">Eliminar</button>
                </div>
            </div>
            
            <p class="cart-item-total">$${totalItem}</p>
        </div>
    `;
}

/**
 * 🎨 Renderiza todos los artículos del carrito y actualiza el resumen.
 */
function renderizarCarrito(): void {
    const cart = loadCart();
    const listContainer = document.getElementById('cart-items-list');
    const messageContainer = document.getElementById('cart-message');
    const totalItemsSpan = document.getElementById('total-items');
    const subtotalSpan = document.getElementById('subtotal');
    const totalFinalSpan = document.getElementById('total-final');
    const checkoutBtn = document.getElementById('checkout-btn') as HTMLButtonElement;
    
    if (!listContainer || !messageContainer || !totalItemsSpan || !subtotalSpan || !totalFinalSpan || !checkoutBtn) return;
    
    if (cart.length === 0) {
        // Carrito vacío
        listContainer.innerHTML = '';
        messageContainer.style.display = 'block';
        totalItemsSpan.textContent = '0';
        subtotalSpan.textContent = '$0.00';
        totalFinalSpan.textContent = '$0.00';
        checkoutBtn.disabled = true;
        return;
    }

    // Carrito con artículos
    messageContainer.style.display = 'none';
    
    // 1. Renderizar artículos
    listContainer.innerHTML = cart.map(createCartItemHtml).join('');
    
    // 2. Calcular resumen
    let totalItemsCount = 0;
    let subtotal = 0;
    
    cart.forEach(item => {
        totalItemsCount += item.cantidad;
        subtotal += item.precio * item.cantidad;
    });
    
    const totalFinal = subtotal; // No hay costos adicionales por ahora
    
    // 3. Actualizar resumen en la UI
    totalItemsSpan.textContent = totalItemsCount.toString();
    subtotalSpan.textContent = `$${subtotal.toFixed(2)}`;
    totalFinalSpan.textContent = `$${totalFinal.toFixed(2)}`;
    checkoutBtn.disabled = false;
    
    // 4. Re-adjuntar Event Listeners después de renderizar
    setupEventListeners();
}


// ============================================
// ⚙️ H A N D L E R S   D E   I N T E R A C C I Ó N
// ============================================

/**
 * ⬆️ Actualiza la cantidad de un producto.
 * @param productId ID del producto.
 * @param delta +1 para incrementar, -1 para decrementar.
 */
function updateItemQuantity(productId: number, delta: number): void {
    const cart = loadCart();
    const item = cart.find(i => i.id === productId);

    if (item) {
        item.cantidad += delta;
        // La validación de cantidad > 0 y la actualización de UI se hace en saveCart
        saveCart(cart); 
    }
}

/**
 * 🗑️ Elimina completamente un producto del carrito.
 * @param productId ID del producto a eliminar.
 */
function removeItem(productId: number): void {
    const cart = loadCart();
    const newCart = cart.filter(item => item.id !== productId);
    saveCart(newCart);
}

/**
 * 🧹 Vacía completamente el carrito.
 */
function clearCart(): void {
    const isConfirmed = window.confirm("¿Estás seguro de que quieres vaciar el carrito?");
    if (isConfirmed) {
        localStorage.removeItem('cart');
        // Usar console.log en lugar de alert/confirm para el mensaje de éxito
        console.log("El carrito ha sido vaciado.");
        actualizarContadorCarrito();
        renderizarCarrito();
    }
}

/**
 * 🎯 Configura todos los event listeners para los controles del carrito.
 */
function setupEventListeners(): void {
    // 1. Listeners para aumentar/disminuir/eliminar
    document.querySelectorAll('.btn-qty-increase').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = parseInt((btn as HTMLElement).dataset.id || '0');
            updateItemQuantity(id, 1);
        });
    });

    document.querySelectorAll('.btn-qty-decrease').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = parseInt((btn as HTMLElement).dataset.id || '0');
            updateItemQuantity(id, -1);
        });
    });
    
    document.querySelectorAll('.remove-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = parseInt((btn as HTMLElement).dataset.id || '0');
            removeItem(id);
        });
    });

    // 2. Listener para cambiar cantidad manualmente en el input
    document.querySelectorAll('.qty-input').forEach(inputEl => {
        const input = inputEl as HTMLInputElement;
        input.addEventListener('change', () => {
            const id = parseInt(input.dataset.id || '0');
            let newQuantity = parseInt(input.value);
            
            if (isNaN(newQuantity) || newQuantity < 1) newQuantity = 1;
            
            const cart = loadCart();
            const item = cart.find(i => i.id === id);
            
            if (item) {
                item.cantidad = newQuantity;
                saveCart(cart);
            }
        });
    });

    // 3. Listener para Vaciar Carrito
    const clearBtn = document.getElementById('clear-cart-btn');
    if (clearBtn) {
        clearBtn.addEventListener('click', clearCart);
    }
    
    // 4. Listener para Finalizar Compra (placeholder)
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            console.log("🚀 Lógica de Finalizar Compra (Checkout) iría aquí.");
            // Aquí iría la lógica para procesar el pedido y, probablemente, vaciar el carrito
        });
    }
}

// ============================================
// 🚀 I N I C I A L I Z A C I Ó N
// ============================================

function main(): void {
    // Proteger la página
    protegerPagina();
    
    // Mostrar información del usuario
    mostrarInfoUsuario('userInfo');
    crearBotonCerrarSesion('logoutContainer');
    
    // Cargar y renderizar el carrito
    renderizarCarrito();
    
    // Iniciar el contador del carrito
    actualizarContadorCarrito();
    
    console.log('✅ Página de Carrito inicializada.');
}

document.addEventListener('DOMContentLoaded', main);
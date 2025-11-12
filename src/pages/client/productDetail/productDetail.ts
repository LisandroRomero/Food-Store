// productDetail.ts
// Se asume que '../../../utils/auth' provee las funciones de autenticación y el contador.
// Ahora importamos 'actualizarContadorCarrito' correctamente.
import { protegerPagina, mostrarInfoUsuario, crearBotonCerrarSesion, actualizarContadorCarrito } from '../../../utils/auth';
import { productsService } from '../../../utils/services/products.service';
import type { IProduct } from '../../../types/IProduct';

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
// 🛍️ L Ó G I C A   D E   C A R R I T O
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
 * 💾 Guarda los artículos del carrito en localStorage.
 * @param cart Array de CartItem a guardar.
 */
function saveCart(cart: CartItem[]): void {
    try {
        localStorage.setItem('cart', JSON.stringify(cart));
        // Llama a la función global para actualizar el contador
        actualizarContadorCarrito(); 
    } catch (e) {
        console.error("Error al guardar el carrito en localStorage:", e);
    }
}

/**
 * 🛒 Agrega o actualiza un producto en el carrito.
 * @param producto El producto base.
 * @param cantidad La cantidad a añadir.
 */
function addItemToCart(producto: IProduct, cantidad: number): void {
    let cart = loadCart();
    const existingItemIndex = cart.findIndex(item => item.id === producto.id);

    if (existingItemIndex > -1) {
        // El producto ya existe, actualiza la cantidad
        cart[existingItemIndex].cantidad += cantidad;
    } else {
        // Nuevo producto, agrégalo
        const newItem: CartItem = {
            id: producto.id,
            nombre: producto.nombre,
            precio: producto.precio,
            cantidad: cantidad,
            imagen: producto.imagen || '/assets/default-food.png' // Usar imagen o fallback
        };
        cart.push(newItem);
    }

    // Asegurar que la cantidad mínima sea 1 si se reduce o se añade de forma incorrecta
    cart = cart.filter(item => item.cantidad > 0);
    
    saveCart(cart);
    
    // Muestra un mensaje amigable
    const successMsg = document.getElementById('success-message');
    if (successMsg) {
        successMsg.textContent = `✅ ${cantidad} x ${producto.nombre} agregado al carrito.`;
        successMsg.style.display = 'block';
        successMsg.classList.remove('error');
        successMsg.classList.add('success');
        setTimeout(() => successMsg.style.display = 'none', 3000);
    } else {
         console.log(`✅ Producto agregado al carrito: ${cantidad} x ${producto.nombre}`);
    }
}


// ============================================
// 🛍️ L Ó G I C A   D E   P R O D U C T O S
// ============================================

/**
 * 🎣 Obtiene los detalles de un producto específico
 */
async function obtenerDetalleProducto(id: string): Promise<IProduct | null> {
    try {
        // Simulación: Si no tienes un servicio real, asegúrate de que productsService.getProductos()
        // devuelve un objeto con la estructura { success: boolean, data: IProduct[] }.
        const response = await productsService.getProductos(); 
        if (!response.success) {
            throw new Error(response.message || 'Error al obtener productos');
        }
        
        // Encontrar el producto específico
        const producto = response.data.find((p: IProduct) => p.id.toString() === id);
        if (!producto) {
            throw new Error('Producto no encontrado');
        }
        
        return producto;
        
    } catch (error) {
        console.error("❌ Error al cargar el producto:", error);
        return null;
    }
}

/**
 * 🎨 Renderiza los detalles del producto en la página
 */
async function renderizarDetalleProducto(): Promise<void> {
    // Obtener el ID del producto de la URL
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('id');

    const container = document.getElementById('product-detail-container');
    if (!container) return;

    if (!productId) {
        container.innerHTML = '<p class="message error">❌ Error: ID de producto no especificado.</p>';
        return;
    }

    const producto = await obtenerDetalleProducto(productId);
    
    if (!producto) {
        container.innerHTML = `<p class="message error">❌ Error: Producto con ID ${productId} no encontrado o servicio falló.</p>`;
        return;
    }

    // Generar el HTML
    const html = `
        <div class="pd-image">
            <img 
                src="${producto.imagen || '/assets/default-food.png'}" 
                alt="${producto.nombre}" 
                class="product-image"
                onerror="this.onerror=null; this.src='/assets/default-food.png';">
        </div>
        <div class="product-info">
            <h2 class="pd-title">${producto.nombre}</h2>
            <p class="pd-price">$${producto.precio.toFixed(2)}</p>
            <span class="badge-available ${producto.stock > 0 ? '' : 'badge-disabled'}">
                ${producto.stock > 0 ? 'Disponible' : 'Sin Stock'}
            </span>
            
            <p class="pd-desc">${producto.descripcion}</p>
            
            <div class="pd-quantity">
                <label for="qty" class="qty-label">Cantidad:</label>
                <div class="qty-controls">
                    <button class="btn btn-outline" id="qty-decrease" ${producto.stock === 0 ? 'disabled' : ''}>-</button>
                    <input type="number" id="qty" value="1" min="1" max="${producto.stock}" class="qty-input" ${producto.stock === 0 ? 'disabled' : ''}>
                    <button class="btn btn-outline" id="qty-increase" ${producto.stock === 0 ? 'disabled' : ''}>+</button>
                </div>
            </div>

            <div class="pd-actions">
                <button class="btn btn-primary btn-block" id="addToCart" ${producto.stock === 0 ? 'disabled' : ''}>
                    ${producto.stock === 0 ? 'Sin Stock' : 'Agregar al Carrito'}
                </button>
                <a href="/src/pages/client/index.html" class="btn btn-secondary">← Volver</a>
            </div>
        </div>
    `;

    container.innerHTML = html;
    
    // Configurar la lógica de cantidad y carrito después de renderizar
    setupQuantityControls(producto.stock);
    setupAddToCart(producto);
}

/**
 * 🔢 Configura los controles de cantidad con el stock máximo.
 */
function setupQuantityControls(maxStock: number): void {
    const dec = document.getElementById('qty-decrease');
    const inc = document.getElementById('qty-increase');
    const input = document.getElementById('qty') as HTMLInputElement;

    if (!dec || !inc || !input) return;
    
    // Si no hay stock, los botones ya están deshabilitados en el HTML generado
    if (maxStock === 0) return; 

    // Disminuir cantidad
    dec.addEventListener('click', () => { 
        let value = parseInt(input.value);
        if (value > 1) {
            input.value = (value - 1).toString();
        }
    });

    // Aumentar cantidad
    inc.addEventListener('click', () => { 
        let value = parseInt(input.value);
        if (value < maxStock) {
            input.value = (value + 1).toString();
        }
    });
    
    // Validación de entrada manual
    input.addEventListener('change', () => {
        let value = parseInt(input.value);
        if (isNaN(value) || value < 1) value = 1;
        if (value > maxStock) value = maxStock;
        input.value = value.toString();
    });
}

/**
 * 🛒 Configura el botón de agregar al carrito
 */
function setupAddToCart(producto: IProduct): void {
    const addToCartBtn = document.getElementById('addToCart');
    const qtyInput = document.getElementById('qty') as HTMLInputElement;
    
    if (!addToCartBtn || !qtyInput) return;
    
    addToCartBtn.addEventListener('click', () => {
        const cantidad = parseInt(qtyInput.value);
        if (cantidad > 0 && cantidad <= producto.stock) {
            addItemToCart(producto, cantidad);
        } else {
            // Muestra un mensaje amigable de error
            const errorMsg = document.getElementById('success-message');
            if (errorMsg) {
                errorMsg.textContent = `❌ La cantidad debe estar entre 1 y ${producto.stock}.`;
                errorMsg.style.display = 'block';
                errorMsg.classList.remove('success');
                errorMsg.classList.add('error');
                setTimeout(() => {
                    errorMsg.style.display = 'none';
                    errorMsg.classList.remove('error');
                    errorMsg.classList.add('success');
                }, 3000);
            }
        }
    });
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
    
    // Cargar detalles del producto
    renderizarDetalleProducto();

    // Iniciar contador del carrito
    actualizarContadorCarrito();
}

document.addEventListener('DOMContentLoaded', main);
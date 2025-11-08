// productDetail.ts
import { protegerPagina, mostrarInfoUsuario, crearBotonCerrarSesion } from '../../../utils/auth';
import { productsService } from '../../../utils/services/products.service';
import type { IProduct } from '../../../types/IProduct';

// ============================================
// 🛍️ L Ó G I C A   D E   P R O D U C T O S
// ============================================

/**
 * 🎣 Obtiene los detalles de un producto específico
 */
async function obtenerDetalleProducto(id: string): Promise<IProduct | null> {
    try {
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
    
    if (!productId) {
        window.location.href = '/src/pages/client/index.html';
        return;
    }
    
    const producto = await obtenerDetalleProducto(productId);
    
    if (!producto) {
        alert('Producto no encontrado');
        window.location.href = '/src/pages/client/index.html';
        return;
    }
    
    // Formatear el precio
    const precioFormateado = new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 2
    }).format(producto.precio);
    
    // Actualizar el título de la página
    document.title = `${producto.nombre} - Food Store`;
    
    // Actualizar el contenido
    const titleElement = document.querySelector('.pd-title');
    const priceElement = document.querySelector('.pd-price');
    const descElement = document.querySelector('.pd-desc');
    const badgeElement = document.querySelector('.badge-available');
    const imgElement = document.querySelector('.product-image') as HTMLImageElement;
    
    if (titleElement) titleElement.textContent = producto.nombre;
    if (priceElement) priceElement.textContent = precioFormateado;
    if (descElement) descElement.textContent = producto.descripcion;
    if (badgeElement) {
        badgeElement.textContent = producto.disponible ? 
            `Disponible (Stock: ${producto.stock})` : 'Agotado';
        badgeElement.className = `badge ${producto.disponible ? 'badge-available' : 'badge-sold-out'}`;
    }
    
    // Actualizar la imagen
    if (imgElement) {
        imgElement.src = producto.imagen || 'https://via.placeholder.com/400x300?text=Producto';
        imgElement.alt = producto.nombre;
    }
    
    // Configurar los botones de cantidad y agregar al carrito
    setupQuantityControls(producto.stock);
    setupAddToCart(producto);
}

/**
 * ➕ Configura los controles de cantidad
 */
function setupQuantityControls(maxStock: number): void {
    const qtyInput = document.getElementById('qty') as HTMLInputElement;
    const decreaseBtn = document.getElementById('qty-decrease') as HTMLButtonElement;
    const increaseBtn = document.getElementById('qty-increase') as HTMLButtonElement;
    const addToCartBtn = document.getElementById('addToCart') as HTMLButtonElement;
    
    if (!qtyInput || !decreaseBtn || !increaseBtn || !addToCartBtn) return;
    
    // Deshabilitar el botón de agregar si no hay stock
    if (maxStock <= 0) {
        addToCartBtn.disabled = true;
        addToCartBtn.textContent = 'Sin Stock';
        qtyInput.disabled = true;
        decreaseBtn.disabled = true;
        increaseBtn.disabled = true;
        return;
    }
    
    decreaseBtn.addEventListener('click', () => {
        const currentValue = parseInt(qtyInput.value);
        if (currentValue > 1) {
            qtyInput.value = (currentValue - 1).toString();
        }
    });
    
    increaseBtn.addEventListener('click', () => {
        const currentValue = parseInt(qtyInput.value);
        if (currentValue < maxStock) {
            qtyInput.value = (currentValue + 1).toString();
        }
    });
    
    qtyInput.addEventListener('change', () => {
        let value = parseInt(qtyInput.value);
        if (isNaN(value) || value < 1) value = 1;
        if (value > maxStock) value = maxStock;
        qtyInput.value = value.toString();
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
        // TODO: Implementar lógica real del carrito
        console.log('Agregando al carrito:', {
            productoId: producto.id,
            nombre: producto.nombre,
            cantidad,
            precio: producto.precio
        });
        
        alert(`Producto agregado al carrito: ${cantidad} x ${producto.nombre}`);
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
}

// Iniciar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', main);
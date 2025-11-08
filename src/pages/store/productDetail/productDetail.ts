import { productsService } from '../../../utils/services';
import type { IProduct } from '../../../types/IProduct';
import { loadNavbar } from '../../../utils/navigate';
import { addToCart } from '../../../utils/cart';

// Cargar el navbar
loadNavbar();

// Obtener el ID del producto de la URL
const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('id');

// Función para renderizar el detalle del producto
const renderizarDetalleProducto = (producto: IProduct) => {
    const productDetailElement = document.getElementById('product-detail');
    if (!productDetailElement) return;

    productDetailElement.innerHTML = `
        <div class="col-md-6">
            <img src="${producto.imagen || '/placeholder.jpg'}" 
                 alt="${producto.nombre}" 
                 class="img-fluid rounded">
        </div>
        <div class="col-md-6">
            <h1 class="mb-4">${producto.nombre}</h1>
            <p class="text-muted mb-4">${producto.descripcion}</p>
            <h3 class="mb-4">$${producto.precio.toFixed(2)}</h3>
            
            <div class="d-flex align-items-center mb-4">
                <button class="btn btn-outline-secondary" onclick="decrementarCantidad()">-</button>
                <input type="number" id="cantidad" value="1" min="1" class="form-control mx-2 text-center" style="max-width: 80px">
                <button class="btn btn-outline-secondary" onclick="incrementarCantidad()">+</button>
            </div>

            <button class="btn btn-primary" onclick="agregarAlCarrito(${producto.id})">
                Agregar al Carrito
            </button>
        </div>
    `;
};

// Función para obtener y mostrar el detalle del producto
const obtenerDetalleProducto = async () => {
    if (!productId) {
        console.error('No se proporcionó ID del producto');
        return;
    }

    try {
        const response = await productsService.getProductoById(productId);
        if (response.success) {
            renderizarDetalleProducto(response.data);
        } else {
            console.error('Error al obtener el producto:', response.message);
        }
    } catch (error) {
        console.error('Error al obtener el producto:', error);
    }
};

// Funciones para manejar la cantidad
(window as any).decrementarCantidad = () => {
    const cantidadInput = document.getElementById('cantidad') as HTMLInputElement;
    const valorActual = parseInt(cantidadInput.value);
    if (valorActual > 1) {
        cantidadInput.value = (valorActual - 1).toString();
    }
};

(window as any).incrementarCantidad = () => {
    const cantidadInput = document.getElementById('cantidad') as HTMLInputElement;
    cantidadInput.value = (parseInt(cantidadInput.value) + 1).toString();
};

// Función para agregar al carrito
(window as any).agregarAlCarrito = async (productoId: string) => {
    const cantidadInput = document.getElementById('cantidad') as HTMLInputElement;
    const cantidad = parseInt(cantidadInput.value);
    
    try {
        const response = await productsService.getProductoById(productoId);
        if (response.success) {
            const cart = addToCart(response.data, cantidad);
            // Mostrar notificación de éxito
            alert('¡Producto agregado al carrito!');
        } else {
            console.error('Error al obtener el producto:', response.message);
        }
    } catch (error) {
        console.error('Error al agregar al carrito:', error);
    }
};

// Cargar el detalle del producto al cargar la página
obtenerDetalleProducto();

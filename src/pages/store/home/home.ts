import { productsService } from '../../../utils/services';
import type { IProduct } from '../../../types/IProduct';
import { loadNavbar } from '../../../utils/navigate';

// Cargar el navbar
loadNavbar();

// Función para renderizar los productos
const renderizarProductos = (productos: IProduct[]) => {
    const productosContainer = document.getElementById('productos-container');
    if (!productosContainer) return;

    productosContainer.innerHTML = productos.map(producto => `
        <div class="col-md-4 col-lg-3 mb-4">
            <div class="card h-100">
                <img src="${producto.imagen || '/placeholder.jpg'}" 
                     class="card-img-top" 
                     alt="${producto.nombre}"
                     style="height: 200px; object-fit: cover;">
                <div class="card-body">
                    <h5 class="card-title">${producto.nombre}</h5>
                    <p class="card-text text-muted">${producto.descripcion.substring(0, 100)}...</p>
                    <div class="d-flex justify-content-between align-items-center">
                        <span class="h5 mb-0">$${producto.precio.toFixed(2)}</span>
                        <button class="btn btn-primary" onclick="verDetalleProducto('${producto.id}')">
                            Ver Detalle
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
};

// Función para cargar los productos
const cargarProductos = async () => {
    try {
        const response = await productsService.getProductos();
        if (response.success) {
            renderizarProductos(response.data);
        } else {
            console.error('Error al obtener productos:', response.message);
        }
    } catch (error) {
        console.error('Error al cargar productos:', error);
    }
};

// Función para ver el detalle de un producto
(window as any).verDetalleProducto = (id: string) => {
    window.location.href = `/src/pages/store/productDetail/productDetail.html?id=${id}`;
};

// Cargar productos al iniciar la página
cargarProductos();

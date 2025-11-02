// products.ts - Módulo de gestión de productos
import { productsService, categoriesService } from '../../../utils/services';
import type { IProduct } from '../../../types/IProduct';
import type { ICategoria } from '../../../types/ICategoria';

// Declarar funciones globales para TypeScript
declare global {
    interface Window {
        editarProducto: (id: number) => Promise<void>;
        eliminarProducto: (id: number) => Promise<void>;
        closeProductModal: () => void;
    }
}

// Variables globales del módulo
let productos: IProduct[] = [];
let categorias: ICategoria[] = [];
let productoEditando: IProduct | null = null;

export async function init(): Promise<void> {
    console.log('🛍️ Inicializando módulo de productos...');
    
    // Configurar event listeners
    setupEventListeners();
    
    // Cargar datos iniciales
    await Promise.all([
        cargarProductos(),
        cargarCategorias()
    ]);
}

// Configurar todos los event listeners
function setupEventListeners(): void {
    // Botón nuevo producto
    const btnNuevo = document.getElementById('btnNuevoProducto');
    if (btnNuevo) {
        btnNuevo.addEventListener('click', () => abrirModalProducto());
    }
    
    // Formulario de producto
    const form = document.getElementById('productForm') as HTMLFormElement;
    if (form) {
        form.addEventListener('submit', handleSubmit);
    }
    
    // Cerrar modal con ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            window.closeProductModal();
        }
    });
    
    // Cerrar modal al hacer clic fuera
    const modal = document.getElementById('productModal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                window.closeProductModal();
            }
        });
    }
}

// Cargar productos desde la API
async function cargarProductos(): Promise<void> {
    try {
        const response = await productsService.getProductos();
        if (response.success) {
            productos = response.data;
            renderizarTablaProductos(productos);
        } else {
            mostrarError(response.message || 'Error al cargar productos');
        }
    } catch (error) {
        console.error('Error al cargar productos:', error);
        mostrarError('Error al cargar los productos');
    }
}

// Cargar categorías
async function cargarCategorias(): Promise<void> {
    try {
        const response = await categoriesService.getCategorias();
        if (response.success) {
            categorias = response.data;
            llenarSelectCategorias();
        } else {
            mostrarError(response.message || 'Error al cargar categorías');
        }
    } catch (error) {
        console.error('Error al cargar categorías:', error);
    }
}

// Renderizar tabla de productos
function renderizarTablaProductos(productosAMostrar: IProduct[]): void {
    const tbody = document.getElementById('productsTableBody');
    if (!tbody) return;
    
    if (productosAMostrar.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="9" class="empty-message">
                    <div class="loading-spinner"></div>
                    <p>No hay productos disponibles</p>
                    <small>Comienza creando tu primer producto</small>
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = productosAMostrar.map(producto => `
        <tr>
            <td class="text-center">${producto.id}</td>
            <td>
                <img src="${producto.imagen}" 
                     alt="${producto.nombre}" 
                     class="product-img"
                     onerror="this.src='https://via.placeholder.com/60x60/667eea/ffffff?text=IMG'"
                     loading="lazy">
            </td>
            <td><strong>${producto.nombre}</strong></td>
            <td>${producto.descripcion.length > 50 ? producto.descripcion.substring(0, 50) + '...' : producto.descripcion}</td>
            <td class="product-price">$${producto.precio.toFixed(2)}</td>
            <td>${producto.categoria?.nombre || 'Sin categoría'}</td>
            <td class="text-center">
                <strong>${producto.stock}</strong>
            </td>
            <td class="text-center">
                <span class="${producto.disponible ? 'badge-available' : 'badge-unavailable'}">
                    ${producto.disponible ? 'Disponible' : 'No disponible'}
                </span>
            </td>
            <td>
                <div class="action-buttons">
                    <button class="btn-edit" onclick="window.editarProducto(${producto.id})">
                        Editar
                    </button>
                    <button class="btn-delete" onclick="window.eliminarProducto(${producto.id})">
                        Eliminar
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

// Llenar select de categorías
function llenarSelectCategorias(): void {
    const selectFilter = document.getElementById('filterCategory') as HTMLSelectElement;
    const selectForm = document.getElementById('productCategory') as HTMLSelectElement;
    
    const options = categorias.map(cat => 
        `<option value="${cat.id}">${cat.nombre}</option>`
    ).join('');
    
    if (selectFilter) {
        selectFilter.innerHTML = '<option value="">Todas las categorías</option>' + options;
    }
    
    if (selectForm) {
        selectForm.innerHTML = '<option value="">Seleccione una categoría</option>' + options;
    }
}

// Abrir modal para crear/editar producto
function abrirModalProducto(producto?: IProduct): void {
    const modal = document.getElementById('productModal');
    const modalTitle = document.getElementById('modalTitle');
    const form = document.getElementById('productForm') as HTMLFormElement;
    
    if (!modal || !modalTitle || !form) {
        console.error('❌ No se encontraron elementos del modal');
        return;
    }
    
    console.log('🔓 Abriendo modal de producto...');
    
    productoEditando = producto || null;
    
    if (producto) {
        modalTitle.textContent = '✏️ Editar Producto';
        (document.getElementById('productId') as HTMLInputElement).value = producto.id.toString();
        (document.getElementById('productName') as HTMLInputElement).value = producto.nombre;
        (document.getElementById('productDescription') as HTMLTextAreaElement).value = producto.descripcion;
        (document.getElementById('productPrice') as HTMLInputElement).value = producto.precio.toString();
        (document.getElementById('productStock') as HTMLInputElement).value = producto.stock.toString();
        (document.getElementById('productCategory') as HTMLSelectElement).value = producto.categoria?.id?.toString() || '';
        (document.getElementById('productImage') as HTMLInputElement).value = producto.imagen;
        (document.getElementById('productActive') as HTMLInputElement).checked = producto.disponible;
    } else {
        modalTitle.textContent = '➕ Nuevo Producto';
        form.reset();
        (document.getElementById('productActive') as HTMLInputElement).checked = true;
    }
    
    // Mostrar modal con la clase active
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    console.log('✅ Modal abierto');
}

// Cerrar modal
window.closeProductModal = function(): void {
    console.log('🔒 Cerrando modal...');
    const modal = document.getElementById('productModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        
        const form = document.getElementById('productForm') as HTMLFormElement;
        if (form) {
            form.reset();
        }
        console.log('✅ Modal cerrado');
    }
    productoEditando = null;
};

// Manejar envío del formulario
async function handleSubmit(e: Event): Promise<void> {
    e.preventDefault();
    
    const submitBtn = document.getElementById('btnGuardarProducto') as HTMLButtonElement;
    
    // Deshabilitar botón
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Guardando...';
    }
    
    const formData = {
        nombre: (document.getElementById('productName') as HTMLInputElement).value.trim(),
        descripcion: (document.getElementById('productDescription') as HTMLTextAreaElement).value.trim(),
        precio: parseFloat((document.getElementById('productPrice') as HTMLInputElement).value),
        stock: parseInt((document.getElementById('productStock') as HTMLInputElement).value),
        categoriaId: parseInt((document.getElementById('productCategory') as HTMLSelectElement).value),
        imagen: (document.getElementById('productImage') as HTMLInputElement).value.trim(),
        disponible: (document.getElementById('productActive') as HTMLInputElement).checked
    };
    
    // Validaciones
    if (!formData.nombre || !formData.descripcion) {
        mostrarError('Todos los campos son requeridos');
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Guardar Producto';
        }
        return;
    }
    
    try {
        let response;
        if (productoEditando) {
            response = await productsService.actualizarProducto(productoEditando.id.toString(), formData);
            if (response.success) {
                mostrarExito('Producto actualizado correctamente');
            } else {
                mostrarError(response.message || 'Error al actualizar producto');
                return;
            }
        } else {
            response = await productsService.crearProducto(formData);
            if (response.success) {
                mostrarExito('Producto creado correctamente');
            } else {
                mostrarError(response.message || 'Error al crear producto');
                return;
            }
        }
        
        window.closeProductModal();
        await cargarProductos();
        
    } catch (error) {
        console.error('Error al guardar producto:', error);
        mostrarError('Error al guardar el producto');
    } finally {
        // Restaurar botón
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Guardar Producto';
        }
    }
}

// Editar producto (función global para onclick)
window.editarProducto = async function(id: number): Promise<void> {
    const producto = productos.find(p => p.id === id);
    if (producto) {
        abrirModalProducto(producto);
    }
};

// Eliminar producto (función global para onclick)
window.eliminarProducto = async function(id: number): Promise<void> {
    const producto = productos.find(p => p.id === id);
    if (!producto) return;
    
    // Confirmación más elegante
    const confirmacion = confirm(`🗑️ ¿Está seguro de eliminar el producto "${producto.nombre}"?\n\nEsta acción no se puede deshacer.`);
    if (!confirmacion) return;
    
    try {
        const response = await productsService.eliminarProducto(id.toString());
        if (response.success) {
            mostrarExito('Producto eliminado correctamente');
            await cargarProductos();
        } else {
            mostrarError(response.message || 'Error al eliminar producto');
        }
    } catch (error) {
        console.error('Error al eliminar producto:', error);
        mostrarError('Error al eliminar el producto');
    }
};

// Filtrar productos por búsqueda
function filtrarProductos(searchTerm: string): void {
    const filtrados = productos.filter(p => 
        p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
    );
    renderizarTablaProductos(filtrados);
}

// Filtrar por categoría
function filtrarPorCategoria(categoriaId: string): void {
    if (!categoriaId) {
        renderizarTablaProductos(productos);
        return;
    }
    
    const filtrados = productos.filter(p => 
        p.categoria?.id?.toString() === categoriaId
    );
    renderizarTablaProductos(filtrados);
}

// Filtrar por estado
function filtrarPorEstado(estado: string): void {
    let filtrados = productos;
    
    switch(estado) {
        case 'disponible':
            filtrados = productos.filter(p => p.disponible && p.stock > 0);
            break;
        case 'no-disponible':
            filtrados = productos.filter(p => !p.disponible);
            break;
        case 'sin-stock':
            filtrados = productos.filter(p => p.stock === 0);
            break;
    }
    
    renderizarTablaProductos(filtrados);
}

// Sistema de notificaciones elegante
function mostrarExito(mensaje: string): void {
    mostrarNotificacion(mensaje, 'success');
}

function mostrarError(mensaje: string): void {
    mostrarNotificacion(mensaje, 'error');
}

function mostrarNotificacion(mensaje: string, tipo: 'success' | 'error'): void {
    const container = document.getElementById('messageContainer');
    if (!container) return;
    
    const icon = tipo === 'success' ? '✅' : '❌';
    const alertClass = tipo === 'success' ? 'alert-success' : 'alert-error';
    
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert ${alertClass}`;
    alertDiv.innerHTML = `
        <span style="font-size: 1.2rem;">${icon}</span>
        <span>${mensaje}</span>
        <button onclick="this.parentElement.remove()" style="
            margin-left: auto;
            background: none;
            border: none;
            font-size: 1.2rem;
            cursor: pointer;
            opacity: 0.7;
        ">×</button>
    `;
    
    container.appendChild(alertDiv);
    
    // Auto-remove después de 5 segundos
    setTimeout(() => {
        if (alertDiv.parentElement) {
            alertDiv.style.animation = 'fadeOut 0.3s ease-out';
            setTimeout(() => alertDiv.remove(), 300);
        }
    }, 5000);
}

// Exportar init como default también por si acaso
export default init;

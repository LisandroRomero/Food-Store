// products.ts - Módulo de gestión de productos
import { productsService, categoriesService } from '../../../utils/services';
import { mostrarExito, mostrarError } from '../../../utils/notifications';
import type { IProduct } from '../../../types/IProduct';
import type { ICategoria } from '../../../types/ICategoria';

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
    
    // Event delegation para botones de acción en la tabla
    const tbody = document.getElementById('productsTableBody');
    if (tbody) {
        tbody.addEventListener('click', handleTableActions);
    }
    
    // Cerrar modal con ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            cerrarModal();
        }
    });
    
    // Cerrar modal al hacer clic fuera
    const modal = document.getElementById('productModal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                cerrarModal();
            }
        });
    }
    
    // Botón cerrar modal
    const btnCerrar = modal?.querySelector('.modal-close');
    if (btnCerrar) {
        btnCerrar.addEventListener('click', cerrarModal);
    }
    
    // Botón cancelar del footer
    const btnCancelar = modal?.querySelector('.btn-cancel');
    if (btnCancelar) {
        btnCancelar.addEventListener('click', cerrarModal);
    }
}

// Manejar acciones de la tabla con event delegation
function handleTableActions(e: Event): void {
    const target = e.target as HTMLElement;
    const btn = target.closest('button') as HTMLButtonElement;
    
    if (!btn) return;
    
    // Obtener el ID del producto desde el atributo data
    const row = btn.closest('tr');
    if (!row) return;
    
    const idCell = row.querySelector('td:first-child');
    if (!idCell) return;
    
    const id = parseInt(idCell.textContent || '0');
    
    if (btn.classList.contains('btn-edit')) {
        editarProducto(id);
    } else if (btn.classList.contains('btn-delete')) {
        eliminarProducto(id);
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
                    <button class="btn-edit">
                        Editar
                    </button>
                    <button class="btn-delete">
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
function cerrarModal(): void {
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
}

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
        
        cerrarModal();
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

// Editar producto
function editarProducto(id: number): void {
    const producto = productos.find(p => p.id === id);
    if (producto) {
        abrirModalProducto(producto);
    }
}

// Eliminar producto
async function eliminarProducto(id: number): Promise<void> {
    const producto = productos.find(p => p.id === id);
    if (!producto) return;
    
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
}

// Exportar init como default
export default init;

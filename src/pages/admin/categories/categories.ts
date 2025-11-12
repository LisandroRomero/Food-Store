// categories.ts - Módulo de gestión de categorías
import { categoriesService } from "../../../utils/services";
import { mostrarExito, mostrarError } from '../../../utils/notifications';
import type { ICategoria } from "../../../types/ICategoria";

// Variables globales del módulo
let categorias: ICategoria[] = [];
let categoriaEditando: ICategoria | null = null;

// Función de inicialización 
export async function init(): Promise<void> {
    console.log('🏷️ Inicializando módulo de categorías...');
    
    setupEventListeners();
    await cargarCategorias();
}

// Configurar listeners de eventos
function setupEventListeners(): void {
    // Botón nueva categoría
    const btnNueva = document.getElementById('btnNuevaCategoria');
    if (btnNueva) {
        btnNueva.addEventListener('click', () => abrirModalCategoria());
    }
    
    // Formulario de categoría
    const form = document.getElementById('categoryForm') as HTMLFormElement;
    if (form) {
        form.addEventListener('submit', handleSubmit);
    }
    
    // Event delegation para botones de acción en la tabla
    const tbody = document.getElementById('categoriesTableBody');
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
    const modal = document.getElementById('categoryModal');
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
    
    // Obtener el ID de la categoría desde el atributo data
    const row = btn.closest('tr');
    if (!row) return;
    
    const idCell = row.querySelector('td:first-child');
    if (!idCell) return;
    
    const id = parseInt(idCell.textContent || '0');
    
    if (btn.classList.contains('btn-edit')) {
        editarCategoria(id);
    } else if (btn.classList.contains('btn-delete')) {
        eliminarCategoria(id);
    }
}

// Cargar categorías desde la API
async function cargarCategorias(): Promise<void> {
    try {
        const response = await categoriesService.getCategorias();
        if (response.success) {
            categorias = response.data;
            renderizarTablaCategorias(categorias);
        } else {
            mostrarError(response.message || 'Error al cargar categorías');
        }
    } catch (error) {
        console.error('Error al cargar categorías:', error);
        mostrarError('Error al cargar las categorías');
    }
}

// Renderizar tabla de categorías
function renderizarTablaCategorias(categoriasAMostrar: ICategoria[]): void {
    const tbody = document.getElementById('categoriesTableBody');
    if (!tbody) return;
    
    if (categoriasAMostrar.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" class="empty-message">
                    <div class="loading-spinner"></div>
                    <p>No hay categorías disponibles</p>
                    <small>Comienza creando tu primera categoría</small>
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = categoriasAMostrar.map(categoria => `
        <tr>
            <td class="text-center">${categoria.id}</td>
            <td>
                <img src="${categoria.imagen}" 
                    alt="${categoria.nombre}" 
                    class="category-img"
                    onerror="this.src='https://via.placeholder.com/60x60/667eea/ffffff?text=CAT'"
                    loading="lazy">
            </td>
            <td><strong>${categoria.nombre}</strong></td>
            <td>${categoria.descripcion}</td>
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

// Abrir modal para crear/editar categoría
function abrirModalCategoria(categoria?: ICategoria): void {
    const modal = document.getElementById('categoryModal');
    const modalTitle = document.getElementById('modalTitle');
    const form = document.getElementById('categoryForm') as HTMLFormElement;
    
    if (!modal || !modalTitle || !form) {
        console.error('❌ No se encontraron elementos del modal');
        return;
    }
    
    console.log('🔓 Abriendo modal de categoría...');
    
    categoriaEditando = categoria || null;
    
    if (categoria) {
        modalTitle.textContent = '✏️ Editar Categoría';
        (document.getElementById('categoryId') as HTMLInputElement).value = categoria.id.toString();
        (document.getElementById('categoryName') as HTMLInputElement).value = categoria.nombre;
        (document.getElementById('categoryDescription') as HTMLTextAreaElement).value = categoria.descripcion;
        (document.getElementById('categoryImage') as HTMLInputElement).value = categoria.imagen;
    } else {
        modalTitle.textContent = '➕ Nueva Categoría';
        form.reset();
    }
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    console.log('✅ Modal abierto');
}

// Cerrar modal
function cerrarModal(): void {
    console.log('🔒 Cerrando modal...');
    const modal = document.getElementById('categoryModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        
        const form = document.getElementById('categoryForm') as HTMLFormElement;
        if (form) {
            form.reset();
        }
        console.log('✅ Modal cerrado');
    }
    categoriaEditando = null;
}

// Manejar envío del formulario
async function handleSubmit(e: Event): Promise<void> {
    e.preventDefault();
    
    const submitBtn = document.getElementById('btnGuardarCategoria') as HTMLButtonElement;
    
    // Deshabilitar botón
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Guardando...';
    }
    
    const formData = {
        nombre: (document.getElementById('categoryName') as HTMLInputElement).value.trim(),
        descripcion: (document.getElementById('categoryDescription') as HTMLTextAreaElement).value.trim(),
        imagen: (document.getElementById('categoryImage') as HTMLInputElement).value.trim()
    };
    
    // Validaciones
    if (!formData.nombre) {
        mostrarError('El nombre es requerido');
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Guardar Categoría';
        }
        return;
    }
    
    if (!formData.descripcion) {
        mostrarError('La descripción es requerida');
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Guardar Categoría';
        }
        return;
    }
    
    try {
        let response;
        if (categoriaEditando) {
            response = await categoriesService.actualizarCategoria(
                categoriaEditando.id.toString(),
                formData.nombre,
                formData.descripcion,
                formData.imagen
            );
            if (response.success) {
                mostrarExito('Categoría actualizada correctamente');
            } else {
                mostrarError(response.message || 'Error al actualizar categoría');
                return;
            }
        } else {
            response = await categoriesService.crearCategoria(
                formData.nombre,
                formData.descripcion,
                formData.imagen
            );
            if (response.success) {
                mostrarExito('Categoría creada correctamente');
            } else {
                mostrarError(response.message || 'Error al crear categoría');
                return;
            }
        }
        
        cerrarModal();
        await cargarCategorias();
        
    } catch (error) {
        console.error('Error al guardar categoría:', error);
        mostrarError('Error al guardar la categoría');
    } finally {
        // Restaurar botón
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Guardar Categoría';
        }
    }
}

// Editar categoría
function editarCategoria(id: number): void {
    const categoria = categorias.find(c => c.id === id);
    if (categoria) {
        abrirModalCategoria(categoria);
    }
}

// Eliminar categoría
async function eliminarCategoria(id: number): Promise<void> {
    const categoria = categorias.find(c => c.id === id);
    if (!categoria) return;
    
    const confirmacion = confirm(`🗑️ ¿Está seguro de eliminar la categoría "${categoria.nombre}"?\n\nEsta acción no se puede deshacer.`);
    if (!confirmacion) return;
    
    try {
        const response = await categoriesService.eliminarCategoria(id.toString());
        if (response.success) {
            mostrarExito('Categoría eliminada correctamente');
            await cargarCategorias();
        } else {
            mostrarError(response.message || 'Error al eliminar categoría');
        }
    } catch (error) {
        console.error('Error al eliminar categoría:', error);
        mostrarError('Error al eliminar la categoría');
    }
}

// Exportar init como default
export default init;

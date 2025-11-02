import type { ICategoria } from "../../../types/ICategoria";
import { categoriesService } from "../../../utils/services";

// Declarar funciones globales para TypeScript
declare global {
    interface Window {
        editarCategoria: (id: number) => Promise<void>;
        eliminarCategoria: (id: number) => Promise<void>;
        closeCategoryModal: () => void;
    }
}

let categorias: ICategoria[] = [];
let categoriaEditando: ICategoria | null = null;

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
    const bgColor = tipo === 'success' ? '#d4edda' : '#f8d7da';
    const textColor = tipo === 'success' ? '#155724' : '#721c24';
    const borderColor = tipo === 'success' ? '#c3e6cb' : '#f5c6cb';
    
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${tipo}`;
    alertDiv.style.cssText = `
        padding: 1rem 1.5rem;
        border-radius: 8px;
        margin: 1rem 0;
        font-weight: 500;
        background: ${bgColor};
        color: ${textColor};
        border: 1px solid ${borderColor};
        display: flex;
        align-items: center;
        gap: 0.5rem;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        animation: slideInDown 0.3s ease-out;
    `;
    
    alertDiv.innerHTML = `
        <span style="font-size: 1.2rem;">${icon}</span>
        <span>${mensaje}</span>
        <button onclick="this.parentElement.remove()" style="
            margin-left: auto;
            background: none;
            border: none;
            font-size: 1.2rem;
            cursor: pointer;
            color: ${textColor};
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

// Agregar estilos para animaciones
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInDown {
        from {
            opacity: 0;
            transform: translateY(-20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes fadeOut {
        from {
            opacity: 1;
            transform: scale(1);
        }
        to {
            opacity: 0;
            transform: scale(0.95);
        }
    }
`;
document.head.appendChild(style);

// Función de inicialización 
export async function init(): Promise<void> {
    console.log('🏷️ Inicializando módulo de categorías...');
    
    setupEventListeners();
    await cargarCategorias();
}

// Configurar listeners de eventos con funcionalidades modernas
function setupEventListeners(): void {
    
    const btnNueva = document.getElementById('btnNuevaCategoria') as HTMLButtonElement;
    if (btnNueva) {
        btnNueva.addEventListener('click', () => abrirModalCategoria());
    }
    
    // Formulario de categoría
    const form = document.getElementById('categoryForm') as HTMLFormElement;
    if (form) {
        form.addEventListener('submit', handleSubmit);
    }
    
    // Cerrar modal con ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            window.closeCategoryModal();
        }
    });
    
    // Cerrar modal al hacer clic fuera
    const modal = document.getElementById('categoryModal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                window.closeCategoryModal();
            }
        });
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

// Renderizar tabla de categorías con diseño moderno
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
                     onerror="this.src='https://via.placeholder.com/60x60/667eea/ffffff?text=IMG'"
                     loading="lazy">
            </td>
            <td><strong>${categoria.nombre}</strong></td>
            <td>${categoria.descripcion || 'Sin descripción'}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn-edit" onclick="window.editarCategoria(${categoria.id})">
                        ✏️ Editar
                    </button>
                    <button class="btn-delete" onclick="window.eliminarCategoria(${categoria.id})">
                        🗑️ Eliminar
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

// Abrir modal para crear/editar categoría
function abrirModalCategoria(categoria?: ICategoria): void {
    const modal = document.getElementById('categoryModal') as HTMLElement;
    const modalTitle = document.getElementById('modalTitle');
    const form = document.getElementById('categoryForm') as HTMLFormElement;
    
    if (!modal || !modalTitle || !form) {
        console.error('❌ No se encontraron elementos del modal');
        return;
    }
    
    console.log('🔓 Abriendo modal...');
    
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
    
    // Mostrar modal con la clase active
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    console.log('✅ Modal abierto');
}

// Cerrar modal
window.closeCategoryModal = function(): void {
    console.log('🔒 Cerrando modal...');
    const modal = document.getElementById('categoryModal') as HTMLElement;
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
};

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
    
    // Validaciones mejoradas
    if (!formData.nombre) {
        mostrarError('El nombre es requerido');
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Guardar';
        }
        return;
    }
    
    if (!formData.descripcion) {
        mostrarError('La descripción es requerida');
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Guardar';
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
        
        window.closeCategoryModal();
        await cargarCategorias();
        
    } catch (error) {
        console.error('Error al guardar categoría:', error);
        mostrarError('Error al guardar la categoría');
    } finally {
        // Restaurar botón
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Guardar';
        }
    }
}

// Editar categoría (función global para onclick)
window.editarCategoria = async function(id: number): Promise<void> {
    const categoria = categorias.find(c => c.id === id);
    if (categoria) {
        abrirModalCategoria(categoria);
    }
};

// Eliminar categoría con confirmación elegante (función global para onclick)
window.eliminarCategoria = async function(id: number): Promise<void> {
    const categoria = categorias.find(c => c.id === id);
    if (!categoria) return;
    
    // Confirmación más elegante
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
};

// Exportar init como default también por si acaso
export default init;
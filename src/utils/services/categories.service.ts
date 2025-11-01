export const categoriesService = {
  // Obtener todas las categorías
  getCategorias: async () => {
    try {
      const response = await fetch('/api/categorias',{
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Error al obtener categorías');
      }
      
      return { success: true, data };
    } catch (error) {
      console.error('Error al obtener categorías:', error);
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'Error de conexión' 
      };
    }
  },

  // Crear nueva categoría
  crearCategoria: async (nombre: string, descripcion: string, imagen: string) => {
    try {
      const response = await fetch('/api/categorias', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, descripcion, imagen })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Error al crear categoría');
      }
      
      return { success: true, data };
    } catch (error) {
      console.error('Error al crear categoría:', error);
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'Error de conexión' 
      };
    }
  },

  // Actualizar categoría
  actualizarCategoria: async (id: string, nombre: string, descripcion: string, imagen: string) => {
    try {
      const response = await fetch(`/api/categorias/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, descripcion, imagen })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Error al actualizar categoría');
      }
      
      return { success: true, data };
    } catch (error) {
      console.error('Error al actualizar categoría:', error);
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'Error de conexión' 
      };
    }
  },

  // Eliminar categoría
  eliminarCategoria: async (id: string) => {
    try {
      const response = await fetch(`/api/categorias/${id}`, {
        method: 'DELETE'
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Error al eliminar categoría');
      }
      
      return { success: true, data };
    } catch (error) {
      console.error('Error al eliminar categoría:', error);
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'Error de conexión' 
      };
    }
  }
};
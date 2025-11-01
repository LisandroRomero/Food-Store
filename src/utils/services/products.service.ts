export const productsService = {
  // Obtener todos los productos
  getProductos: async () => {
    try {
      const response = await fetch(`/api/productos`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Error al obtener productos');
      }
      
      return { success: true, data };
    } catch (error) {
      console.error('Error al obtener productos:', error);
      return { 
        success: false, 
        message: (error as Error).message || 'Error de conexión' 
      };
    }
  },

  // Crear nuevo producto
  crearProducto: async (productoData: any) => {
    try {
      const response = await fetch(`/api/productos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productoData)
      });
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Error al crear producto');
      }
      
      return { success: true, data };
    } catch (error) {
      console.error('Error al crear producto:', error);
      return { 
        success: false, 
        message: (error as Error).message || 'Error de conexión' 
      };
    }
  },

  // Actualizar producto
  actualizarProducto: async (id: string, productoData: any) => {
    try {
      const response = await fetch(`/api/productos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productoData)
      });
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Error al actualizar producto');
      }
      
      return { success: true, data };
    } catch (error) {
      console.error('Error al actualizar producto:', error);
      return { 
        success: false, 
        message: (error as Error).message || 'Error de conexión' 
      };
    }
  },

  // Eliminar producto
  eliminarProducto: async (id: string) => {
    try {
      const response = await fetch(`/api/productos/${id}`, {
        method: 'DELETE'
      });
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Error al eliminar producto');
      }
      
      return { success: true, data };
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      return { 
        success: false, 
        message: (error as Error).message || 'Error de conexión' 
      };
    }
  }
};  
export const ordersService = {
  // Crear nuevo pedido
  crearPedido: async (pedidoData: any) => {
    try {
      const response = await fetch('/api/pedidos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pedidoData)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Error al crear pedido');
      }
      
      return { success: true, data };
    } catch (error) {
      console.error('Error al crear pedido:', error);
      return { 
        success: false, 
        message: (error as Error).message || 'Error de conexión' 
      };
    }
  },

  // Obtener pedidos del usuario
  obtenerPedidosUsuario: async (usuarioId: string) => {
    try {
      const response = await fetch(`/api/pedidos/usuario/${usuarioId}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Error al obtener pedidos');
      }
      
      return { success: true, data };
    } catch (error) {
      console.error('Error al obtener pedidos:', error);
      return { 
        success: false, 
        message: (error as Error).message || 'Error de conexión' 
      };
    }
  },

  // Obtener todos los pedidos (admin)
  obtenerTodosPedidos: async () => {
    try {
      const response = await fetch('/api/pedidos');
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Error al obtener pedidos');
      }
      
      return { success: true, data };
    } catch (error) {
      console.error('Error al obtener pedidos:', error);
      return { 
        success: false, 
        message: (error as Error).message || 'Error de conexión' 
      };
    }
  },

  // Actualizar estado del pedido
  actualizarEstadoPedido: async (pedidoId: string, estado: string) => {
    try {
      const response = await fetch(`/api/pedidos/${pedidoId}/estado`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Error al actualizar estado');
      }
      
      return { success: true, data };
    } catch (error) {
      console.error('Error al actualizar estado:', error);
      return { 
        success: false, 
        message: (error as Error).message || 'Error de conexión' 
      };
    }
  }
};
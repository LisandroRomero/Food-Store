export const ordersService = {
  /**
   * Crea un nuevo pedido en el sistema
   */
  crearPedido: async (pedidoData: any) => {
    try {
      const response = await fetch('http://localhost:8080/pedidos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pedidoData)
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: `Error ${response.status}` }));
        throw new Error(errorData.message || 'Error al crear pedido');
      }
      
      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error('Error al crear pedido:', error);
      return { 
        success: false, 
        message: (error as Error).message || 'Error de conexión' 
      };
    }
  },

  /**
   * Obtiene todos los pedidos de un usuario específico
   */
  obtenerPedidosUsuario: async (usuarioId: string) => {
    try {
      const response = await fetch(`http://localhost:8080/pedidos/usuario/${usuarioId}`);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: `Error ${response.status}` }));
        throw new Error(errorData.message || 'Error al obtener pedidos');
      }
      
      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error('Error al obtener pedidos:', error);
      return { 
        success: false, 
        message: (error as Error).message || 'Error de conexión' 
      };
    }
  },

  /**
   * Obtiene todos los pedidos del sistema (endpoint admin)
   */
  obtenerTodosPedidos: async () => {
    try {
      const response = await fetch('http://localhost:8080/pedidos');
      
      // Verificar que la respuesta sea JSON antes de parsear
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Respuesta no es JSON:', text.substring(0, 200));
        throw new Error(`La API devolvió HTML en lugar de JSON. Status: ${response.status}`);
      }
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: `Error ${response.status}` }));
        throw new Error(errorData.message || `Error al obtener pedidos: ${response.status}`);
      }
      
      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error('Error al obtener pedidos:', error);
      return { 
        success: false, 
        message: (error as Error).message || 'Error de conexión' 
      };
    }
  },

  /**
   * Actualiza el estado de un pedido
   * Estados válidos: PENDIENTE, CONFIRMADO, CANCELADO, TERMINADO
   */
  actualizarEstadoPedido: async (pedidoId: string, estado: string) => {
    try {
      const body = { estado };
      
      const response = await fetch(`http://localhost:8080/pedidos/${pedidoId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { message: errorText || `Error ${response.status}` };
        }
        throw new Error(errorData.message || `Error al actualizar estado: ${response.status}`);
      }
      
      const data = await response.json();
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
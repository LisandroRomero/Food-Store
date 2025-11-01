export const usersService = {
  // Obtener todos los usuarios
  getUsers: async () => {
    try {
      const response = await fetch(`/api/usuarios`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Error al obtener usuarios');
      }
      
      return { success: true, data };
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      return { 
        success: false, 
        message: (error as Error).message || 'Error de conexión' 
      };
    }
  },

  // Obtener usuario por ID
  getUserById: async (id: string) => {
    try {
      const response = await fetch(`/api/usuarios/${id}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Error al obtener usuario');
      }
      
      return { success: true, data };
    } catch (error) {
      console.error('Error al obtener usuario:', error);
      return { 
        success: false, 
        message: (error as Error).message || 'Error de conexión' 
      };
    }
  },

  // Eliminar usuario
  deleteUser: async (id: string) => {
    try {
      const response = await fetch(`/api/usuarios/${id}`, {
        method: 'DELETE'
      });
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Error al eliminar usuario');
      }
      
      return { success: true, data };
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      return { 
        success: false, 
        message: (error as Error).message || 'Error de conexión' 
      };
    }
  },

  // Actualizar usuario
  updateUser: async (id: string, userData: any) => {
    try {
      const response = await fetch(`/api/usuarios/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Error al actualizar usuario');
      }
      
      return { success: true, data };
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      return { 
        success: false, 
        message: (error as Error).message || 'Error de conexión' 
      };
    }
  }
};

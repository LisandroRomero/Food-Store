const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export const login = async (email: string, password: string) => {
  try {
    const response = await fetch(`${baseURL}/api/usuarios/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
   const responseData = await response.json();
    
    if (!response.ok) {
      console.error('Error al iniciar sesión:', responseData);
      return { 
        success: false, 
        message: responseData.message || 'Credenciales inválidas' 
      };
    }
    
    const sesion = {
      id: responseData.id,
      nombre: responseData.nombre,
      apellido: responseData.apellido,
      email: responseData.email,
      rol: responseData.rol,
    };
    
    localStorage.setItem('sesion', JSON.stringify(sesion));
    return { success: true, data: responseData };
    
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    return { 
      success: false, 
      message: 'Error de conexión con el servidor' 
    };
  }
};

export const register = async (nombre: string, apellido: string, email: string, password: string) => {
  
  try {
    const response = await fetch(`${baseURL}/api/usuarios/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, apellido, email, password, rol: 'USUARIO' })
    });

    const responseData = await response.json();
    
    if (!response.ok) {
      console.error('Error al registrar:', responseData);
      return { 
        success: false, 
        message: responseData.message || 'Error al registrar' 
      };
    }
    
    const sesion = {
      id: responseData.id,
      nombre: responseData.nombre,
      apellido: responseData.apellido,
      email: responseData.email,
      rol: responseData.rol
    };
    
    localStorage.setItem('sesion', JSON.stringify(sesion));
    return { success: true, data: responseData };
    
  } catch (error) {
    console.error('Error al registrar:', error);
    return { 
      success: false, 
      message: 'Error de conexión con el servidor' 
    };
  }
};

// !! sin autenticación ¡¡
export const getProductos = async () => {
  try {
    const response = await fetch(`${baseURL}/api/productos`);
    if (!response.ok) throw new Error('Error');
    return await response.json();
  } catch (error) {
    throw error;
  }
};

// !! sin autenticación ¡¡
export const crearPedido = async (pedidoData: any) => {
  try {
    const response = await fetch(`${baseURL}/api/pedidos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pedidoData)
    });
    
    if (!response.ok) throw new Error('Error al crear pedido');
    return await response.json();
  } catch (error) {
    throw error;
  }
};

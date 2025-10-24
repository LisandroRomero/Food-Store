const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export const login = async (email: string, password: string) => {
  try {
    const response = await fetch(`${baseURL}/api/usuarios/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    if (!response.ok) {
      return { success: false, message: 'Credenciales inválidas' };
    }
    
    const usuario = await response.json();
    
    const sesion = {
      id: usuario.id,
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      email: usuario.email,
      rol: usuario.rol,
    };
    
    localStorage.setItem('sesion', JSON.stringify(sesion));
    
    return { success: true, data: usuario };
  } catch (error) {
    return { success: false, message: 'Error al conectar' };
  }
};

export const register = async (nombre: string, apellido: string, email: string, password: string) => {
  try {
    const response = await fetch(`${baseURL}/api/usuarios/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, apellido, email, password, rol: 'USUARIO' })
    });
    
    if (!response.ok) {
      return { success: false, message: 'Error al registrar' };
    }
    
    const usuario = await response.json();
    
    // session
    const sesion = {
      id: usuario.id,
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      email: usuario.email,
      rol: usuario.rol
    };
    
    localStorage.setItem('sesion', JSON.stringify(sesion));
    
    return { success: true, data: usuario };
  } catch (error) {
    return { success: false, message: 'Error al registrar' };
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

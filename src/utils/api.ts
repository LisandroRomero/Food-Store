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



export const getUsers = async () => {
  try {
    const response = await fetch(`${baseURL}/api/usuarios`);
    if (!response.ok) throw new Error('Error al obtener usuarios');
    return await response.json();
  } catch (error) {
    throw error;
  }
};
export const getUserById = async (id: string) => {
  try {
    const response = await fetch(`${baseURL}/api/usuarios/${id}`);
    if (!response.ok) throw new Error('Error al obtener usuario');
    return await response.json();
  } catch (error) {
    throw error;
  }
};



export const deleteUser = async (id: string) => {
  try {
      const response = await fetch(`${baseURL}/api/usuarios/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Error al eliminar usuario');
    return await response.json();
  } catch (error) {
    throw error;
  }
};


export const updateUser = async (id: string, userData: any) => {
  try {
    const response = await fetch(`${baseURL}/api/usuarios/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    if (!response.ok) throw new Error('Error al actualizar usuario');
    return await response.json();
  } catch (error) {
    throw error;
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

export const crearProducto = async (productoData: any) => {
  try {
    const response = await fetch(`${baseURL}/api/productos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productoData)
    });
    if (!response.ok) throw new Error('Error al crear producto');
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const actualizarProducto = async (id: string, productoData: any) => {
  try {
    const response = await fetch(`${baseURL}/api/productos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productoData)
    });
    if (!response.ok) throw new Error('Error al actualizar producto');
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const eliminarProducto = async (id: string) => {
  try {
    const response = await fetch(`${baseURL}/api/productos/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Error al eliminar producto');
    return await response.json();
  } catch (error) {
    throw error;
  }
};  


export const getCategorias = async () => {
  try {
    const response = await fetch(`${baseURL}/api/categorias`);
    if (!response.ok) throw new Error('Error al obtener categorias');
    return await response.json();
  } catch (error) {
    throw error;
  }
};
export const crearCategoria = async (categoriaData: any) => {
  try {
    const response = await fetch(`${baseURL}/api/categorias`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(categoriaData)
    });
    if (!response.ok) throw new Error('Error al crear categoria');
    return await response.json();
  } catch (error) {
    throw error;
  }
};
export const actualizarCategoria = async (id: string, categoriaData: any) => {
  try {
    const response = await fetch(`${baseURL}/api/categorias/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(categoriaData)
    });
    if (!response.ok) throw new Error('Error al actualizar categoria');
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const eliminarCategoria = async (id: string) => {
  try {
    const response = await fetch(`${baseURL}/api/categorias/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Error al eliminar categoria');
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



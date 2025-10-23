const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export const register = async (nombre: string, apellido: string, email: string, password: string) => {
  try {
    const response = await fetch(`${baseURL}/usuarios`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ nombre, apellido, rol: 'USUARIO', mail: email, password }),
    });
    
    if (!response.ok) {
      throw new Error('Error al registrar usuario');
    }
    
    return { success: true, data: await response.json() };
  } catch (error) {
    console.error('Error al registrar:', error);
    return { success: false, message: 'Error al registrar usuario' };
  }
};

export const getUsuarios = async () => {
  try {
    const response = await fetch(`${baseURL}/usuarios`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error('Error al obtener usuarios');
    }
    
    const usuarios = await response.json();
    return { success: true, data: usuarios };
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    return { success: false, message: 'Error al conectar con el servidor' };
  }
};

export const login = async (email: string, password: string) => {
  try {
    // 1. Obtener usuarios del backend
    const resultado = await getUsuarios();
    
    if (!resultado.success) {
      return { success: false, message: 'Error al conectar con el servidor' };
    }
    
    // 2. Buscar el usuario con email y password coincidentes
    const usuarios = resultado.data;
    const usuarioEncontrado = usuarios.find((user: any) => 
      user.mail === email && user.password === password
    );
    
    if (!usuarioEncontrado) {
      return { success: false, message: 'Email o contraseña incorrectos' };
    }
    
    // 3. Guardar sesión en localStorage
    const sesion = {
      id: usuarioEncontrado.id,
      email: usuarioEncontrado.mail,
      nombre: usuarioEncontrado.nombre,
      apellido: usuarioEncontrado.apellido,
      rol: usuarioEncontrado.rol,
      horaLogin: new Date().toISOString()
    };
    
    localStorage.setItem('sesion', JSON.stringify(sesion));
    
    return { success: true, data: usuarioEncontrado };
  } catch (error) {
    console.error('Error al hacer login:', error);
    return { success: false, message: 'Error al hacer login' };
  }
};



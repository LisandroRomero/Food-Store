export const authService = {
    login: async (email: string, password: string) => {
        try {
            console.log('🔍 Iniciando login...');
            const url = `/api/usuarios/login`;
            console.log('📍 URL:', url);
        
        const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
        });
        
        console.log('✅ Respuesta recibida. Status:', response.status);
        console.log('📍 URL final:', response.url);
        
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
    },
    register :async (nombre: string, apellido: string, email: string, password: string) => {
    
    try {
        const response = await fetch(`/api/usuarios/register`, {
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
    }
};
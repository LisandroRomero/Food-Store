// Interfaces para Pedidos - basado en la estructura del backend
export interface IProducto {
    id: number;
    nombre: string;
    descripcion: string;
    precio: number;
    stock: number;
    disponible: boolean;
    imagen: string;
    categoria: {
        id: number;
        nombre: string;
    };
    activo: boolean;
}

export interface IDetallePedido {
    id: number;
    cantidad: number;
    subtotal: number;
    producto: IProducto;
}

export interface IUsuario {
    id: number;
    nombre: string;
    apellido: string;
    email: string;
    rol: string;
}

export interface IPedido {
    id: number;
    fecha: [number, number, number]; // [año, mes, día]
    estado: string;
    total: number;
    usuario: IUsuario;
    detalles: IDetallePedido[];
}


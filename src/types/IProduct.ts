// Interface para Producto - basado en ProductoResponseDTO del backend
export interface IProduct {
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
    }; // CategoriaSimpleDTO
}

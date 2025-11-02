// Interface para Categoría - basado en CategoriaResponseDTO del backend
export interface ICategoria {
    id: number;
    nombre: string;
    descripcion: string;
    imagen: string;
    totalProductos: number; // Cantidad de productos en esta categoría
}

/**
 * Interfaz para listar la tabla de productos
 */
export interface ListaProductos{
    idProducto : number;
    nombre:string;
    tamaño:string;
    descripcion:string;
    precio:number;
    estatus:string;
    categoria:string;
}
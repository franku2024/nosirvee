export interface Producto {
    idProducto: string;
    nombre: string;
    precio: number;
    descripcion: string;
    categoria: string;
    imagen: string;
    alt: string;
}


export interface ProductoItemCart {
    Producto: Producto;
    Cantidad: number;
}
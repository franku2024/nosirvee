import { ProductoItemCart } from "./producto";
import { Usuario } from "./usuario";
import { Timestamp } from 'firebase/firestore';

export interface Pedido {
  id: string;
    usuario: {
      uid: string;
      nombre: string;
      apellido:string;
      email: string;
    };
    productos: ProductoItemCart[];
    fecha: Date;
    totalprecio: number;
    fechaEntrega: Date;
  }
  
  
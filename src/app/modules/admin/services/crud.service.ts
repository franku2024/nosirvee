import { Injectable } from '@angular/core';
import { Producto } from 'src/app/models/producto';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { map } from 'rxjs';
// Importaciones para el manejo de archivos y referencias de Storage
import { getDownloadURL, getStorage, ref, UploadResult, uploadString, deleteObject } from 'firebase/storage';

/*
  getDownloadURL -> Para obtener la URL de descarga de una imagen subida
  getStorage -> Para obtener la instancia de almacenamiento
  ref -> Para crear referencias a ubicaciones en el almacenamiento
  UploadResult -> Tipo que representa el resultado de una operación subida
  uploadString -> Para subir imágenes en formato de cadena (string)
  deleteObject -> Para eliminar un espacio en el almacenamiento
*/

@Injectable({
  providedIn: 'root'
})
export class CrudService {
  // Definimos colección para los productos de la web del tipo Producto
  private productosCollection: AngularFirestoreCollection<Producto>

  // Definimos variable "respuesta" que podrá subir resultados
  private respuesta!: UploadResult;

  // Inicializamos servicio de Storage
  private storage = getStorage();

  constructor(private database: AngularFirestore) {
    // Referenciamos colección productos y será subida como "producto" a Firebase
    this.productosCollection = database.collection('producto');
  }

  // CREAR productos -> obtiene datos del formulario y url de la imagen
  crearProducto(producto: Producto, url: string){
    return new Promise(async (resolve, reject) => {
      try{
        // Creamos número identificativo para el producto en la base de datos
        const idProducto = this.database.createId();

        // Asignamos ID creado al atributo idProducto de la interfaz "Producto"
        producto.idProducto = idProducto;

        // Asignamos URL recibida del parámetro al atributo imagen de la interfaz Producto
        producto.imagen = url;

        const resultado = await this.productosCollection.doc(idProducto).set(producto);

        resolve(resultado);
      }catch(error){
        reject(error);
      }
    })
  }

  // OBTENER productos
  obtenerProducto(){
    // snapshotChanges -> toma una captura del estado de los datos
    // pipe -> funciona como una tubería que retorna el nuevo arreglo de datos
    // map -> "mapea" o recorre esa nueva información
    // a -> resguarda la nueva información y la envía
    return this.productosCollection.snapshotChanges().pipe(map(action => action.map(a => a.payload.doc.data())));
  }

  // EDITAR productos
  modificarProducto(idProducto: string, nuevaData: Producto){
    // accedemos a la colección, buscamos por ID y actualizamos información
    return this.database.collection('producto').doc(idProducto).update(nuevaData);
  }

  // ELIMINAR productos
  eliminarProducto(idProducto: string, imagenUrl: string){
    return new Promise((resolve, reject) => {
      try{
        // Definimos referencia local de Storage en el bloque "try"
        const storage = getStorage();

        // Definimos referencia local desde el almacenamiento de Storage
        const referenciaImagen = ref(storage, imagenUrl);

        // Eliminamos la imagen desde el almacenamiento
        deleteObject(referenciaImagen)
        .then((res) => {
          // Accedo a la colección, busco su ID y lo elimino
          const respuesta = this.productosCollection.doc(idProducto).delete();
          resolve(respuesta);
        })
        .catch(error => {
          reject("Error al eliminar la imagen: \n"+error);
        })
      }
      catch(error){
        reject(error);
      }
    })
  }

  // OBTENER url de las imágenes
  obtenerUrlImagen(respuesta: UploadResult){
    // Retorna URL obtnenida como REFERENCIA
    return getDownloadURL(respuesta.ref);
  }

  /**
   * PARÁMETROS DEFINIDOS
   * @param {string} nombre <- nombre de la imagen
   * @param {any} imagen <- tipo de imágenes que se pueden subir (extension)
   * @param {string} ruta <- ruta de almacenamiento de las imágenes
   * @returns <- se retorna lo obtenido
  */

  // SUBIR imágenes con sus referencias
  async subirImagen(nombre: string, imagen: any, ruta: string){
    try{
      // Crear una referencia de imagen
      // accede a Storage (almacenamiento), ruta (carpeta) / nombre (nombreImagen)
      let referenciaImagen = ref(this.storage, ruta + '/' + nombre);

      // Asignamos a la respuesta la información de la imagen subida
      this.respuesta = await uploadString(referenciaImagen, imagen, 'data_url')
      .then(resp => {
        return resp;
      })

      return this.respuesta;
    }
    catch(error){
      console.log("Error: \n"+error);

      return this.respuesta;
    }
  }
}
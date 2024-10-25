import { Injectable } from '@angular/core';
// Servicio de AUTENTIFICACIÓN de FIREBASE
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { GoogleAuthProvider } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private usuarioActual = new BehaviorSubject<any>(null);

  
  // Referenciar Auth de Firebase para inicializarlo
  constructor(
    private auth: AngularFireAuth,
    private servicioFirestore: AngularFirestore
  ) {
       // Actualizar el usuario actual cuando cambie el estado de autenticación
    this.auth.authState.subscribe(user => {
      this.usuarioActual.next(user); // Agregar esta línea
    });
   }

    // Método para obtener el usuario actual como observable
  obtenerUsuarioActual() {
    return this.usuarioActual.asObservable(); // Usar el BehaviorSubject
  }


  obtenerEstadoUsuario(): Observable<any> {
    return this.auth.authState; // Devuelve un observable del estado del usuario
  }
  // Función para REGISTRO
  registrar(email: string, password: string){
    // Retorna nueva información de EMAIL y CONTRASEÑA
    return this.auth.createUserWithEmailAndPassword(email, password);
  }

  // Función para INICIO DE SESIÓN
  iniciarSesion(email: string, password: string){
    // Validar el email y la contraseña
    return this.auth.signInWithEmailAndPassword(email, password);
  }

  // Función para CERRAR SESIÓN
  cerrarSesion(){
    // Devolver una promesa vacía
    return this.auth.signOut();
  }

  // Función para tomar UID
  async obtenerUid():Promise<string | null> {

    const user = await this.auth.currentUser;
    return user?.uid ?? null; // Devuelve null si user es null o undefined
      // Nos va a generar una promesa, y la constante la va a capturar
      
  
      /*
        Si el usuario no respeta la estructura de la interfaz /
        Si tuvo problemas para el registro -> ej.: mal internet
      */
    
    }

    iniciarSesionConGoogle() {
      const provider = new GoogleAuthProvider();
      return this.auth.signInWithPopup(provider);
    }
  
    // Función que busca un usuario en la colección de 'usuarios' cuyo correo electrónico coincida con el valor proporcionado
    obtenerUsuario(email: string){
      return this.servicioFirestore.collection('usuarios', ref => ref.where('email', '==', email)).get().toPromise();
    }
    recuperarContrasena(email: string) {
      return this.auth.sendPasswordResetEmail(email);
    }
  
}

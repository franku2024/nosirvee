import { Component } from '@angular/core';
import { Usuario } from 'src/app/models/usuario';
import { AuthService } from '../../services/auth.service';
import { FirestoreService } from 'src/app/modules/shared/services/firestore.service';
import { Router } from '@angular/router';
import * as CryptoJS from 'crypto-js';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-inicio-sesion',
  templateUrl: './inicio-sesion.component.html',
  styleUrls: ['./inicio-sesion.component.css']
})
export class InicioSesionComponent {
  hide = true;
//   captchaResolved = false;
// captchaResponse: string | null = null;

  constructor(
    public servicioAuth: AuthService,
    public servicioFirestore: FirestoreService,
    public servicioRutas: Router
  ) { }

  // resolvedCaptcha(captchaResponse: string) {
  //   this.captchaResolved = !!captchaResponse;
  //   this.captchaResponse = captchaResponse;
  // }
  // ####################################### INGRESADO
  // Importamos la interfaz de usuario e inicializamos vacío
  usuarioIngresado: Usuario = {
    uid: '',
    nombre: '',
    apellido: '',
    email: '',
    //rol: '',
    password: ''
  }

  // Función para el inicio de sesión
  async iniciarSesion() {

    // if (!this.captchaResolved) {
    //   Swal.fire({
    //     text: "Por favor, completa el captcha.",
    //     icon: "error"
    //   });
    //   return;
    // }

    const credenciales = {
      email: this.usuarioIngresado.email,
      password: this.usuarioIngresado.password
    }

    try{
      // Obtenemos el usuario desde la BD -> Cloud Firestore
      const usuarioBD = await this.servicioAuth.obtenerUsuario(credenciales.email);

      // ! -> si es diferente
      // .empy -> método de Firebase para marcar si algo es vacío
      if(!usuarioBD || usuarioBD.empty){
        Swal.fire({
          text: "Correo electrónico no registrado",
          icon: "error"
        })
        this.limpiarInputs();
        return;
      }
      
      /* Primer documento (registro) en la colección de usuarios que se obtiene desde la 
        consulta.
      */
      const usuarioDoc = usuarioBD.docs[0];

      /**
       * Extrae los datos del documento en forma de un objeto y se específica como de tipo 
       * "Usuario" -> haciendo referencia a nuestra interfaz de Usuario.
       */
      const usuarioData = usuarioDoc.data() as Usuario;

      // Hash de la contraseña ingresada por el usuario
      
      const hashedPassword = CryptoJS.SHA256(credenciales.password).toString();

      if(hashedPassword !== usuarioData.password){
        Swal.fire({
          text: "Contraseña incorrecta",
          icon: "error"
        })

        this.usuarioIngresado.password = '';
        return;
      }
      //Funcion para ingresar el email
      const res = await this.servicioAuth.iniciarSesion(credenciales.email, credenciales.password)
      .then(res => {
        Swal.fire({
          text: "¡Se ha logueado con éxito! :D",
          icon: "success"
        });

        this.servicioRutas.navigate(['/inicio']);
      })
      .catch(err => {
        Swal.fire({
          text: "Hubo un problema al iniciar sesión :(" + err,
          icon: "error"
        })

        this.limpiarInputs();
      })
    }catch(error){
      this.limpiarInputs();
    }
  }

  // Función para vaciar el formulario
  limpiarInputs() {
    const inputs = {
      email: this.usuarioIngresado.email = '',
      password: this.usuarioIngresado.password = ''
    }
  }

  async recuperarContrasena() {
    const { value: email } = await Swal.fire({
      title: 'Recuperar contraseña',
      input: 'email',
      inputLabel: 'Ingresa tu correo electrónico',
      inputPlaceholder: 'Correo electrónico',
      showCancelButton: true,
      confirmButtonText: 'Enviar',
      cancelButtonText: 'Cancelar'
    });
  
    if (email) {
      this.servicioAuth.recuperarContrasena(email)
        .then(() => {
          Swal.fire({
            title: '¡Listo!',
            text: 'Se ha enviado un enlace de recuperación a tu correo.',
            icon: 'success'
          });
        })
        .catch(error => {
          Swal.fire({
            title: 'Error',
            text: 'Hubo un problema al intentar recuperar la contraseña: ' + error.message,
            icon: 'error'
          });
        });
    }
  }

  async iniciarSesionConGoogle() {
    try {
      const res = await this.servicioAuth.iniciarSesionConGoogle();
      Swal.fire({
        text: "¡Se ha logueado con Google exitosamente! :D",
        icon: "success"
      });
      this.servicioRutas.navigate(['/inicio']);
    } catch (error: any) {  // Definimos el tipo de error como 'any'
      Swal.fire({
        text: "Hubo un problema al iniciar sesión con Google: " + error.message,
        icon: "error"
      });
    }
  }
  
}

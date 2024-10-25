import { Component, Output, Input, EventEmitter } from '@angular/core';
import { Producto } from 'src/app/models/producto';
import { CrudService } from 'src/app/modules/admin/services/crud.service';
import { CarritoService } from 'src/app/modules/shared/services/carrito.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Usuario } from 'src/app/models/usuario';
import { AuthService } from 'src/app/modules/autentificacion/services/auth.service';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent {
  coleccionProducto: Producto[] = [];
  productoSeleccionado!: Producto;

  usuarioRegistrado: Usuario = {
    uid: '',
    nombre: '',
    apellido: '',
    email: '',
    password: ''
  };

  modalVisible: boolean = false;
  compraVisible: boolean = false;

  @Input() productoReciente: string = '';
  @Output() productoAgregado = new EventEmitter<Producto>();

  constructor(
    public servicioCrud: CrudService,
    private carritoService: CarritoService,
    public servicioRutas: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Cargamos los productos desde el servicio al iniciar el componente.
    this.servicioCrud.obtenerProducto().subscribe(producto => {
      this.coleccionProducto = producto;
    });

    // Observamos el estado del usuario
    this.authService.obtenerEstadoUsuario().subscribe(user => {
      if (user) {
        // Si hay un usuario autenticado, asignamos el UID al usuario registrado
        this.usuarioRegistrado.uid = user.uid;
        this.usuarioRegistrado.email = user.email || ''; // También podrías capturar el email si es necesario
      } else {
        // Si no hay usuario autenticado, aseguramos que el uid esté vacío
        this.usuarioRegistrado.uid = '';
      }
    });
  }

  agregarProducto(producto: Producto) {
    const productoItemCart = { Producto: producto, Cantidad: 1 };
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger"
      },
      buttonsStyling: false
    });

    if (this.usuarioRegistrado.uid) {
      this.carritoService.agregarProducto(productoItemCart);
      Swal.fire({
        title: "Producto agregado",
        text: "El producto ha sido añadido al carrito.",
        icon: "success",
      });
    } else {
      swalWithBootstrapButtons.fire({
        title: "Operación fallida",
        text: "No puedes realizar compras sin registrarte previamente.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Iniciar Sesión",
        cancelButtonText: "Cancelar Operación",
        reverseButtons: true
      }).then((result) => {
        if (result.isConfirmed) {
          this.servicioRutas.navigate(['/inicio-sesion']);
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire({
            title: "Cancelado",
          });
        }
      });
    }
  }
}
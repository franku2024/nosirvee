import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/modules/autentificacion/services/auth.service';
import { Router } from '@angular/router';
import { Producto, ProductoItemCart } from 'src/app/models/producto';
import { CarritoService } from '../../services/carrito.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { MatMenuTrigger } from '@angular/material/menu';




@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  productosEnCarrito: ProductoItemCart[] = [];
  logueado = true; // variable booleana para el botón de Registro e Inicio de Sesión
  deslogueado = false; // variable booleana para el botón de Cerrar Sesión
  cantidadTotalProductos: number = 0;
  isDarkTheme = false; //Declara una propiedad booleana llamada isDarkTheme y la inicializa en false. Esta propiedad se utiliza para rastrear si el tema oscuro está activado o no.
  isLoggedIn = false;//este inicializa la variable el estado de la variable de inicio de sesion como falso
  @ViewChild(MatMenuTrigger)
  menuTrigger!: MatMenuTrigger;

  constructor(
    public servicioAuth: AuthService,
    public servicioRutas: Router,
    private carritoService: CarritoService,
    private auth: AngularFireAuth,
  ){}

    //esto permite alternar entre un tema claro y un tema oscuro
    toggleTheme() {
      this.isDarkTheme = !this.isDarkTheme;
      if (this.isDarkTheme) {
        document.documentElement.classList.add('dark-theme');
      } else {
        document.documentElement.classList.remove('dark-theme');
      }
    };
  // Cambia los valores de logueado y deslogueado para ocultar los primeros y mostrar el último
  iniciar(){
    this.logueado = false;
    this.deslogueado = true;
  }

  cerrarSesion(){
    this.deslogueado = false;
    // va a eliminar el "token" actual del usuario
    // token: estado actual del usuario en el navegador para mantener la sesión abierta
    this.servicioAuth.cerrarSesion();

    this.servicioRutas.navigate(['/']); // redigirimos a la raíz de la página
    this.logueado = true;
  }


  irAlCarrito() {
    this.servicioRutas.navigate(['/carrito']); // Asegúrate de que '/carrito' es la ruta correcta a tu componente Carrito
  }



  ngOnInit(): void {
    // Cargar el carrito al iniciar
    this.carritoService.cargarCarrito();
  
    this.carritoService.carrito$.subscribe(productos => {
      this.productosEnCarrito = productos;
      this.cantidadTotalProductos = productos.reduce((total, item) => total + item.Cantidad, 0);
    });
  
    this.auth.authState.subscribe(user => {
      this.isLoggedIn = !!user;
    });
  }
  
  
  
    agregarProductoAlCarrito(producto: Producto) {
      const productoExistente = this.productosEnCarrito.find(item => item.Producto.idProducto === producto.idProducto);
     
  
  
      if (productoExistente) {
        // Si ya existe el producto, aumentar la cantidad
        productoExistente.Cantidad++;
      } else {
        // Si no existe, agregar el producto con cantidad 1
        this.productosEnCarrito.push({ Producto: producto, Cantidad: 1 });
      }
   
      // Actualizar el carrito
      this.carritoService.actualizarCarrito(this.productosEnCarrito);
    }
  
  
  
  
     //aumentar la cantidad de un producto
    aumentarCantidad(producto: ProductoItemCart){
      producto.Cantidad++;
  
  
      this.carritoService.actualizarCarrito(this.productosEnCarrito);
    }
  
  
  
  
    //Disminuir la cantidad de un producto (no menor a 1)
    restarCantidad(producto: ProductoItemCart){
      if (producto.Cantidad >1){
        producto.Cantidad--;
      }
      this.carritoService.actualizarCarrito(this.productosEnCarrito);
    }
   
   
     // Método para calcular el total
     calcularTotal(): number {
      return this.productosEnCarrito.reduce((total, item) => total + (item.Producto.precio * item.Cantidad), 0);
    }
  
  
  
  
    eliminarProductoDelCarrito(idProducto: string) {
      this.carritoService.eliminarProducto(idProducto);
    }
  }
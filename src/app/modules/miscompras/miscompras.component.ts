import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/modules/autentificacion/services/auth.service';
import { FirestoreService } from 'src/app/modules/shared/services/firestore.service';
import { Pedido } from 'src/app/models/pedido';
import { Timestamp } from 'firebase/firestore'; 



@Component({
  selector: 'app-miscompras',
  templateUrl: './miscompras.component.html',
  styleUrls: ['./miscompras.component.css']
})
export class MiscomprasComponent implements OnInit {
  misPedidos: Pedido[] = [];
  usuarioActual: any;

  constructor(
    private authService: AuthService,
    private firestoreService: FirestoreService
  ) {}

  ngOnInit(): void {
    this.authService.obtenerUsuarioActual().subscribe(usuario => {
      this.usuarioActual = usuario;
      this.cargarMisPedidos();
    });
  }

  
  cargarMisPedidos() {
    if (this.usuarioActual) {
      this.firestoreService.obtenerPedidosPorUsuario(this.usuarioActual.uid).subscribe(pedidos => {
        this.misPedidos = pedidos.map(pedido => {
          // Convertimos la fecha solo si es un Timestamp
          return {
            ...pedido,
            fecha: pedido.fecha instanceof Timestamp ? pedido.fecha.toDate() : pedido.fecha,
            fechaEntrega: pedido.fechaEntrega instanceof Timestamp ? pedido.fechaEntrega.toDate() : pedido.fechaEntrega // Asegúrate de convertir también aquí
          };
        });
        console.log('Mis pedidos:', this.misPedidos);
      });
    }
  }
}
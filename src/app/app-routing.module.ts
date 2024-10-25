import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InicioComponent } from './modules/inicio/pages/inicio/inicio.component';
import { PedidosComponent } from './modules/pedidos/pedidos.component';
import { MiscomprasComponent } from './modules/miscompras/miscompras.component';
import { ProductoComponent } from './modules/producto/pages/producto/producto.component';

const routes: Routes = [
  {
  path:"",component:InicioComponent
},
{
  path:"",loadChildren:()=>import('./modules/inicio/inicio.module').then(m=>m.InicioModule)
},
{
    path:"",loadChildren:()=>import('./modules/autentificacion/autentificacion.module').then(m=>m.AutentificacionModule)
  },
  {
    path:"",loadChildren:()=>import('./modules/admin/admin.module').then(m=>m.AdminModule)
  },
  {
    path:"",loadChildren:()=>import('./modules/producto/producto.module').then(m=>m.ProductoModule)
  },
  {
    path:"",loadChildren:()=>import('./modules/carrito/carrito.module').then(m=>m.CarritoModule)
  },
  { path: 'pedidos', component: PedidosComponent }, //LO HIZO FRANCO MONDONGO
  { path: 'miscompras', component: MiscomprasComponent }, //LO HIZO FRANCO MONDONGO
  { path: 'producto', component: ProductoComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

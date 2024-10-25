import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

import { CarritoRoutingModule } from './carrito-routing.module';
import { CarritoComponent } from './pages/carrito/carrito.component';


@NgModule({
  declarations: [
    CarritoComponent
  ],
  imports: [
    CommonModule,
    CarritoRoutingModule,
    MatButtonModule
  ]
})
export class CarritoModule { }

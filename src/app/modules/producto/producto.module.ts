import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductoRoutingModule } from './producto-routing.module';

import { CardComponent } from './components/card/card.component';

import {  MatCardModule } from '@angular/material/card';
import { ProductoComponent } from './pages/producto/producto.component';



@NgModule({
  declarations: [
    CardComponent,
    ProductoComponent
    
    
  ],
  imports: [
    CommonModule,
    ProductoRoutingModule,
    MatCardModule,
    
  
  ],
  exports:[
    CardComponent,
    MatCardModule,
    ProductoComponent
  ]
})
export class ProductoModule { }

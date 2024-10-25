import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Archivo de rutas del módulo
import { AdminRoutingModule } from './admin-routing.module';

// Componente de VISTA
import { AdminComponent } from './pages/admin/admin.component';

// Componente LOCAL
import { TableComponent } from './components/table/table.component';

// Componente de MATERIAL
import { MatIconModule } from '@angular/material/icon';

// Paqueterías de formularios y formularios reactivos de ANGULAR
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import {MatSelectModule} from '@angular/material/select';

@NgModule({
  declarations: [
    AdminComponent,
    TableComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule
  ],
  exports: [
    AdminComponent,
    TableComponent,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule
  ]
})
export class AdminModule { }
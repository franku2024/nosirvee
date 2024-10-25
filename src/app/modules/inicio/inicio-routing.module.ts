import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InicioComponent } from 'src/app/modules/inicio/pages/inicio/inicio.component';

const routes: Routes = [
  {
    path:"",component:InicioComponent
  },
  {
    path:"inicio",component:InicioComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InicioRoutingModule { }

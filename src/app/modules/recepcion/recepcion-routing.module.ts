import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RecepDashboardComponent } from './components/recep-dashboard/recep-dashboard.component';
import { HomeComponent } from './components/home/home.component';
import { ListaMembresiasPagoEfecComponent } from './components/lista-membresias-pago-efec/lista-membresias-pago-efec.component';
import { InventariosComponent } from './components/inventarios/inventarios.component';

const routes: Routes = [
  {
    path: '',
    component: RecepDashboardComponent,
    children: [
      { path: 'home', component: HomeComponent },
      { path: '', redirectTo: '/recepcion/home', pathMatch: 'full' },
      //Componente lista mebresias
      { path: 'listaMembresias', component: ListaMembresiasPagoEfecComponent },
      { path: 'inventarios', component: InventariosComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RecepcionRoutingModule {}

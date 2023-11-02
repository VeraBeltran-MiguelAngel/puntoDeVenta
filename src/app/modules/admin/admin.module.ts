import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

//agregar modulo material para las vistas del admin
import { AdminMaterialModule } from './adminMaterial';

import {
  FaIconLibrary,
  FontAwesomeModule,
} from '@fortawesome/angular-fontawesome';
import {
  faFacebook,
  faGoogle,
  faInstagram,
  faPaypal,
  faTwitter,
  faXTwitter,
} from '@fortawesome/free-brands-svg-icons';
import {
  faCheckCircle,
  faCircleUser,
  faCreditCard,
} from '@fortawesome/free-regular-svg-icons';
import { faPowerOff } from '@fortawesome/free-solid-svg-icons';
import { HomeComponent } from './components/home/home.component';
import { MembresiasComponent } from './components/membresias/membresias.component';
import { ColaboradoresComponent } from './components/colaboradores/colaboradores.component';
import { MensajeEmergentesComponent } from './components/mensaje-emergentes/mensaje-emergentes.component';
import { MembresiasListaComponent } from './components/membresias-lista/membresias-lista.component';
import { MensajeEliminarComponent } from './components/mensaje-eliminar/mensaje-eliminar.component';
import { MembresiasEditarComponent } from './components/membresias-editar/membresias-editar.component';

@NgModule({
  declarations: [
    AdminDashboardComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    MembresiasComponent,
    ColaboradoresComponent,
    MensajeEmergentesComponent,
    MembresiasListaComponent,
    MensajeEliminarComponent,
    MembresiasEditarComponent,
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    FormsModule,
    AdminMaterialModule //aqui esta todo lo que se necesita de material
  ],
})
export class AdminModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(
      faFacebook,
      faGoogle,
      faInstagram,
      faTwitter,
      faCircleUser,
      faCreditCard,
      faPaypal,
      faXTwitter,
      faCheckCircle,
      faPowerOff
    );
  }
}

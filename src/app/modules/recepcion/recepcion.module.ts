import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecepcionRoutingModule } from './recepcion-routing.module';
import { RecepDashboardComponent } from './components/recep-dashboard/recep-dashboard.component';
import { HeaderComponent } from './components/header/header.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

//incluir librerias de material que necesitara el modulo recepcion
import { RecepMaterialModule } from './recepMaterial';

import {
  FaIconLibrary,
  FontAwesomeModule,
} from '@fortawesome/angular-fontawesome'; //librerias de iconos
import {
  faFacebook,
  faGoogle,
  faInstagram,
  faPaypal,
  faTwitter,
  faXTwitter,
} from '@fortawesome/free-brands-svg-icons'; //librerias de iconos
import {
  faCheckCircle,
  faCircleUser,
  faCreditCard,
} from '@fortawesome/free-regular-svg-icons'; //librerias de iconos
import { faPowerOff } from '@fortawesome/free-solid-svg-icons';
import { HomeComponent } from './components/home/home.component';
import { ListaMembresiasPagoEfecComponent } from './components/lista-membresias-pago-efec/lista-membresias-pago-efec.component'; //librerias de iconos
import { MensajeEmergenteComponent } from './components/mensaje-emergente/mensaje-emergente.component';
import { InventariosComponent } from './components/inventarios/inventarios.component';
import { TransferenciasComponent } from './components/transferencias/transferencias.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MensajeListaComponent } from './components/ListaClientes/mensaje-cargando.component';
import { MensajeEliminarComponent } from './components/mensaje-eliminar/mensaje-eliminar.component';

@NgModule({
  declarations: [
    RecepDashboardComponent,
    HeaderComponent,
    HomeComponent,
    ListaMembresiasPagoEfecComponent,
    InventariosComponent,
    TransferenciasComponent,
    MensajeEmergenteComponent,
    MensajeListaComponent,
    MensajeEliminarComponent
  ],
  imports: [
    CommonModule,
    RecepcionRoutingModule,
    FontAwesomeModule, //tipo de letra
    RecepMaterialModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MatFormFieldModule,
    MatInputModule,
    
  ],
})
export class RecepcionModule {
  //librerias de iconos
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

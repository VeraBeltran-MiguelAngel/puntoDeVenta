import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecepcionRoutingModule } from './recepcion-routing.module';
import { RecepDashboardComponent } from './components/recep-dashboard/recep-dashboard.component';
import { HeaderComponent } from './components/header/header.component';
import { FormsModule } from '@angular/forms';

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
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MensajeEmergenteComponent } from './components/mensaje-emergente/mensaje-emergente.component';
import { MatDialogModule } from '@angular/material/dialog';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
  declarations: [RecepDashboardComponent, HeaderComponent, HomeComponent, ListaMembresiasPagoEfecComponent, MensajeEmergenteComponent],
  imports: [
    CommonModule,
    RecepcionRoutingModule,
    FontAwesomeModule, //tipo de letra
    RecepMaterialModule,
    FormsModule,
    MatTabsModule,
    MatTableModule,
    MatPaginatorModule,
    MatDialogModule,
    FlexLayoutModule,
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

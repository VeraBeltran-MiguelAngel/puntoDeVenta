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
import { HomeComponent } from './components/home/home.component'; //librerias de iconos

@NgModule({
  declarations: [RecepDashboardComponent, HeaderComponent, HomeComponent],
  imports: [
    CommonModule,
    RecepcionRoutingModule,
    FontAwesomeModule, //tipo de letra
    RecepMaterialModule,
    FormsModule
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

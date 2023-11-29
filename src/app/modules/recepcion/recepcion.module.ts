import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecepcionRoutingModule } from './recepcion-routing.module';
import { RecepDashboardComponent } from './components/recep-dashboard/recep-dashboard.component';
import { HeaderComponent } from './components/header/header.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

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
import { faPowerOff, faSearch } from '@fortawesome/free-solid-svg-icons';
import { HomeComponent } from './components/home/home.component';
import { ListaMembresiasPagoEfecComponent } from './components/lista-membresias-pago-efec/lista-membresias-pago-efec.component'; //librerias de iconos
import { MensajeEmergenteComponent } from './components/mensaje-emergente/mensaje-emergente.component';
import { InventariosComponent } from './components/inventarios/inventarios.component';
import { TransferenciasComponent } from './components/transferencias/transferencias.component';
import { TablaProductosTransferenciaComponent } from './components/tablaProductosTransferencia/tablaProductosTransferencia.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormPagoEmergenteComponent } from './components/form-pago-emergente/form-pago-emergente.component';
import { TablaEmergenteService } from 'src/app/service/tablaEmergente.service';

@NgModule({
  declarations: [
    RecepDashboardComponent,
    HeaderComponent,
    HomeComponent,
    ListaMembresiasPagoEfecComponent,
    InventariosComponent,
    TransferenciasComponent,
    TablaProductosTransferenciaComponent,
    MensajeEmergenteComponent,
    FormPagoEmergenteComponent
  ],
  imports: [
    CommonModule,
    RecepcionRoutingModule,
    FontAwesomeModule, //tipo de letra
    RecepMaterialModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
  ],
  providers: [TablaEmergenteService], //*si no colocas el servicio no se mostrara la tabla emergente ni el resto de contenido todo estara en blanco
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
      faPowerOff,
      faSearch
    );
  }
}

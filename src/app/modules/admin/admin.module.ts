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
import { CategoriasComponent } from './components/categorias/categorias.component';
import { ProductosComponent } from './components/productos/productos.component';
import { ProveedoresComponent } from './components/proveedores/proveedores.component';
import { EntradasComponent } from './components/entradas/entradas.component';
import { InventarioComponent } from './components/inventario/inventario.component';
import { ValidarTransferenciaComponent } from './components/validarTransferencia/validarTransferencia.component';
import { HistorialCajaComponent } from './components/historial-caja/historial-caja.component';
import { FiltroFechaPipe } from './components/pipes/filtro-fecha.pipe';
import { MensajeListaComponent } from './components/ListaEmpleados/mensaje-cargando.component';
import { ProductosVendidosComponent } from './components/productos-vendidos/productos-vendidos.component';
import { MembresiasComponent } from './components/membresias/membresias.component';
import { MembresiasAgregarComponent } from './components/membresias-agregar/membresias-agregar.component';
import { MembresiasEditarComponent } from './components/membresias-editar/membresias-editar.component';
import { MensajeEmergentesComponent } from './components/mensaje-emergentes/mensaje-emergentes.component';
import { ConfiguracionComponent } from './components/configuracion/configuracion.component';
import { VerConfiguracionComponent } from './components/ver-configuracion/ver-configuracion.component';
@NgModule({
  declarations: [
    AdminDashboardComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    CategoriasComponent,
    ProductosComponent,
    ProveedoresComponent,
    EntradasComponent,
    InventarioComponent,
    ValidarTransferenciaComponent,
    HistorialCajaComponent,
    FiltroFechaPipe,
    MensajeListaComponent,
    ProductosVendidosComponent,
    MembresiasComponent,
    MembresiasAgregarComponent,
    MembresiasEditarComponent,
    MensajeEmergentesComponent,
    ConfiguracionComponent,
    VerConfiguracionComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    FormsModule,
    AdminMaterialModule 
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

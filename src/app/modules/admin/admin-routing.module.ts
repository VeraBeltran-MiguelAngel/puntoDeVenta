import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { HomeComponent } from './components/home/home.component';
import { CategoriasComponent } from './components/categorias/categorias.component';
import { ProductosComponent } from './components/productos/productos.component';
import { ProveedoresComponent } from './components/proveedores/proveedores.component';
import { EntradasComponent } from './components/entradas/entradas.component';
import { InventarioComponent } from './components/inventario/inventario.component';
import { ValidarTransferenciaComponent } from './components/validarTransferencia/validarTransferencia.component';
import { HistorialCajaComponent } from './components/historial-caja/historial-caja.component';
import { ProductosVendidosComponent } from './components/productos-vendidos/productos-vendidos.component';
import { MembresiasComponent } from './components/membresias/membresias.component';
import { MembresiasAgregarComponent } from './components/membresias-agregar/membresias-agregar.component';
import { MembresiasEditarComponent } from './components/membresias-editar/membresias-editar.component';
import { ConfiguracionComponent } from './components/configuracion/configuracion.component';
import { VerConfiguracionComponent } from './components/ver-configuracion/ver-configuracion.component';
import { HorariosComponent } from './components/horarios/horarios.component';
import { CrearProductoComponent } from './components/crearProducto/crearProducto.component';
import { AltaCategoriaComponent } from './components/alta-categoria/alta-categoria.component';
import { EditarCategoriaComponent } from './components/editar-categoria/editar-categoria.component';
import { EditarProductoComponent } from './components/editar-producto/editar-producto.component';
import { NotificacionesComponent } from './components/notificaciones/notificaciones.component';
const routes: Routes = [
  {
    path: '',
    component: AdminDashboardComponent,
    children: [
      { path: 'home', component: HomeComponent },
      { path: 'categorias', component: CategoriasComponent },
      { path: 'productos', component: ProductosComponent },
      { path: 'proveedores', component: ProveedoresComponent },
      { path: 'entradas', component: EntradasComponent },
      { path: 'inventario', component: InventarioComponent },
      { path: 'caja', component: HistorialCajaComponent },
      { path: 'productosVendidos', component: ProductosVendidosComponent},
      { path: 'misMembresias', component: MembresiasComponent},
      { path: 'agregarMembresias', component: MembresiasAgregarComponent},
      { path: 'editarMembresias/:id', component: MembresiasEditarComponent},
      { path: 'configuracion', component: ConfiguracionComponent},
      { path: 'verConfiguracion', component: VerConfiguracionComponent},
      { path: 'agregarHorario', component:HorariosComponent},
      { path: 'crearProducto', component:CrearProductoComponent},
      { path: 'alta-categoria', component:AltaCategoriaComponent},
      { path: 'editar-categoria/:id', component:EditarCategoriaComponent},
      { path: 'editar-producto/:id', component:EditarProductoComponent},
      { path: 'notificacion', component:NotificacionesComponent},
      {
        path: 'validarTransferencia',
        component: ValidarTransferenciaComponent,
      },
      { path: '', redirectTo: '/admin/home', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}

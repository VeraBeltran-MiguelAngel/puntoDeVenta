import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { HomeComponent } from './components/home/home.component';
import { MembresiasComponent } from './components/membresias/membresias.component';
import { ColaboradoresComponent } from './components/colaboradores/colaboradores.component';
import { MembresiasListaComponent } from './components/membresias-lista/membresias-lista.component';
import { MembresiasEditarComponent } from './components/membresias-editar/membresias-editar.component';
import { EditarColaboradorComponent } from './components/editar-colaborador/editar-colaborador.component';
import { AltaColaboradoresComponent } from './components/alta-colaboradores/alta-colaboradores.component';
import { SucursalListaComponent } from './components/sucursal-lista/sucursal-lista.component';
import { SucursalAltaComponent } from './components/sucursal-alta/sucursal-alta.component';
import { SucursalEditarComponent } from './components/sucursal-editar/sucursal-editar.component';
import { HorariosComponent } from './components/horarios/horarios.component';
import { ListaProveedorComponent } from './components/lista-proveedor/lista-proveedor.component';
import { AltaProveedorComponent } from './components/alta-proveedor/alta-proveedor.component';
import { EditarProveedorComponent } from './components/editar-proveedor/editar-proveedor.component';
import { ListaCategoriaComponent } from './components/lista-categoria/lista-categoria.component';
import { AltaCategoriaComponent } from './components/alta-categoria/alta-categoria.component';
import { EditarCategoriaComponent } from './components/editar-categoria/editar-categoria.component';
import { ListaProductoComponent } from './components/lista-producto/lista-producto.component';
import { AltaProductoComponent } from './components/alta-producto/alta-producto.component';
import { EditarProductoComponent } from './components/editar-producto/editar-producto.component';
import { NotificacionesComponent } from './components/notificaciones/notificaciones.component';
import { ProductManagementComponent } from './components/productManagement/productManagement.component';
import { CrearProductoComponent } from './components/crearProducto/crearProducto.component';
//import { MapComponent } from './components/map/map.component';

const routes: Routes = [
  {
    path: '',
    component: AdminDashboardComponent,
    children: [
      { path: 'home', component: HomeComponent },
      { path: 'membresias', component: MembresiasComponent },
      { path: 'colaboradores', component: ColaboradoresComponent },
      { path: 'listaMembresias', component: MembresiasListaComponent },
      { path: 'editarMembresias/:id', component: MembresiasEditarComponent },
      { path: 'editar-colaborador/:id', component: EditarColaboradorComponent },
      { path: 'alta-colaborador', component: AltaColaboradoresComponent },
      { path: 'lista-sucursales', component: SucursalListaComponent },
      { path: 'alta-sucursal', component: SucursalAltaComponent },
      { path: 'editar-sucursal/:id', component: SucursalEditarComponent },
      { path: 'lista-proveedor', component: ListaProveedorComponent },
      { path: 'alta-proveedor', component: AltaProveedorComponent },
      { path: 'editar-proveedor/:id', component: EditarProveedorComponent },
      { path: 'lista-categoria', component: ListaCategoriaComponent },
      { path: 'alta-categoria', component: AltaCategoriaComponent },
      { path: 'editar-categoria/:id', component: EditarCategoriaComponent },
      { path: 'lista-producto', component: ListaProductoComponent },
      { path: 'alta-producto', component: AltaProductoComponent },
      { path: 'editar-producto/:id', component: EditarProductoComponent },
      { path: 'notificaciones', component: NotificacionesComponent },
      { path: 'gestion-productos', component: ProductManagementComponent },
      { path: 'crearProducto', component: CrearProductoComponent },
//{ path: 'Ubicacion', component: MapComponent},
      { path: '', redirectTo: '/sup-admin/home', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SuperAdminRoutingModule {}

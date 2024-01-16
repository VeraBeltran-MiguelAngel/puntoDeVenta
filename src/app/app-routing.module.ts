import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { authGuard } from './guards/auth.guard';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { hasRoleGuard } from './guards/has-role.guard';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  {
    path: 'admin',
    canActivate: [authGuard, hasRoleGuard],
    data: {
      rol: 'Administrador',
    },
    loadChildren: () =>
      import('./modules/admin/admin.module').then((m) => m.AdminModule),
  },
  {
    path: 'recepcion',
    canActivate: [authGuard, hasRoleGuard],
    data: {
      rol: 'Recepcionista',
    },
    loadChildren: () =>
      import('./modules/recepcion/recepcion.module').then(
        (m) => m.RecepcionModule
      ),
  },
  {
    path: 'sup-admin',
    canActivate: [authGuard, hasRoleGuard],
    data: {
      rol: 'SuperAdmin',
    },
    loadChildren: () =>
      import('./modules/sup-admin/sup-admin.module').then((m) => m.SuperAdminModule),
  },
  { path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })], //sin useHash no sirve la navegacion por ruta
  exports: [RouterModule],
})
export class AppRoutingModule {}

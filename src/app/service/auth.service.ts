import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, catchError, throwError } from 'rxjs';

//para conectarse al api
import { HttpClient, HttpHeaders } from '@angular/common/http';

//modelo usuarios
import { User } from './User';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  //variable que guarda el endpoint en el srver API: string = 'conf/';
  API: string = 'https://olympus.arvispace.com/panelAdmin/conf/loginRole.php/';
  //para guardar los headers que manda el API
  httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

  //guardar el json string en un arreglo (primero lo conviertes a json)
  usuarioRegistrado: any[] = [];
  //para guardar el rol del usuario
  rol: string;

  constructor(
    private router: Router,
    private clienteHttp: HttpClient,
    private toastr: ToastrService
  ) {}

  setUserData(userData: string): void {
    localStorage.setItem('userData', userData);
  }

  getUserData(): string | null {
    return localStorage.getItem('userData');
  }

  isLoggedIn() {
    return this.getUserData() !== null;
  }


  logout() {
    localStorage.removeItem('userData');
    this.router.navigate(['login']);
  }

  //login con token
  // login({ email, password }: any): Observable<any> {
  //   if (email === 'cliente@gmail.com' && password === 'cliente123') {
  //     this.setToken('abcdefghijklmnopqrstuvwxyz');
  //     return of({ name: 'Tarique Akhtar', email: 'cliente@gmail.com' });
  //   }
  //   return throwError(() => new Error('Error de autenticacion'));
  // }

  login(credenciales: User): Observable<any> {
    return this.clienteHttp
      .post(this.API + '?credenciales', credenciales, {
        headers: this.httpHeaders,
      })
      .pipe(
        catchError((err: any) => {
          if (err.status === 401) {
            this.router.navigate(['/login']);
            const errorMessage = err.error.message;
            // this.toastr.error(errorMessage,'Error');
            //  alert(`Error 401: ${errorMessage}`);
            return throwError(() => errorMessage);
          } else {
            return throwError(() => 'Error desconocido');
          }
        })
      );
  }
}

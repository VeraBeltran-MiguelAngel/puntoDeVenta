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
  // API: string = 'http://localhost/login/loginRole.php/';
  //variable que guarda el endpoint en el srver API: string = 'conf/';
  API: string = 'https://olympus.arvispace.com/puntoDeVenta/conf/loginRolev2.php/';
  //para guardar los headers que manda el API
  httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

  //guardar el json string en un arreglo (primero lo conviertes a json)
  usuarioRegistrado: any[] = [];
  //para guardar el rol del usuario
  rol: string;
  //para guardar la ubicacion del usario
  ubicacion: string;
  //idgym
  idGym:number;
  //id usuario
  idUsuario:number;

  constructor(
    private router: Router,
    private clienteHttp: HttpClient,
    private toastr: ToastrService
  ) {}

  setUserData(userData: string): void {
    localStorage.setItem('userData', userData);
  }
  
 getUltimoIdInsertado(): number | null {
    const lastInsertedIdString = localStorage.getItem('lastInsertedId');
    if (lastInsertedIdString) {
      return parseInt(lastInsertedIdString, 10);
    }
    return null;
  }

  //este metodo devuelve la info del usuario en un json ya no en una cadena
  getUserData(): any | null {
    const localData = localStorage.getItem('userData');
    if (localData != null) {
      return JSON.parse(localData);
    }
    return null;
  }

  getRol(): string {
    this.usuarioRegistrado = this.getUserData();
    this.rol = this.usuarioRegistrado[0].rol;
    return this.rol;
  }

  getUbicacion(): string {
    this.usuarioRegistrado = this.getUserData();
    this.ubicacion = this.usuarioRegistrado[0].nombreGym;
    return this.ubicacion;
  }

  getIdGym():number{
    this.usuarioRegistrado = this.getUserData();
    this.idGym=this.usuarioRegistrado[0].idGym;
    return this.idGym;
  }

  getIdUsuario():number{
    this.usuarioRegistrado = this.getUserData();
    this.idUsuario = this.usuarioRegistrado[0].idUsuarios;
    return this.idUsuario;
  }

  isLoggedIn() {
    return this.getUserData() !== null;
  }

  logout() {
    localStorage.removeItem('userData');
    this.router.navigate(['login']);
    localStorage.removeItem('lastInsertedId'); // Aquí eliminas lastInsertedId al cerrar sesión
  }

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

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ResetPasswordService {
  API: string =
    'https://olympus.arvispace.com/puntoDeVenta/conf/nuevaContra.php/';
  //para guardar los headers que manda el API
  httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private clienteHttp: HttpClient) {}

  login(email: string): Observable<any> {
    return this.clienteHttp.post(this.API + '?solicitaNuevaPass', email, {
      headers: this.httpHeaders,
    });
  }
}

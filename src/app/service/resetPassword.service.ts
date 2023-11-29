import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ResetPasswordService {
  // API: string = 'http://localhost/EnviarMail/nuevaContra.php/';
  API: string ='https://olympus.arvispace.com/puntoDeVenta/EnviarMail/nuevaContra.php/';
  //para guardar los headers que manda el API
  httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private clienteHttp: HttpClient) {}

  /**
   * Metodo para enviar mail con link de reset password
   * @param email
   * @returns
   */
  enviarMail(email: string): Observable<any> {
    return this.clienteHttp.post(this.API + '?solicitaNuevaPass', email, {
      headers: this.httpHeaders,
    });
  }

  /**
   * Metodo para verificar que el link tenga los valores correctos
   * @param id id usuario
   * @param token token generado al solicitar cambio de contraseña
   * @returns
   */
  validaToken(id: string, token: string): Observable<any> {
    return this.clienteHttp.post(
      this.API + '?consultaToken' + '&id=' + id + '&token=' + token,
      {
        headers: this.httpHeaders,
      }
    );
  }

  /**
   * Actualizar contraseña 
   * @param id 
   * @param token 
   * @param nuevaPass 
   * @returns 
   */
  actualizaPassword(id: string, token: string, nuevaPass: string) : Observable<any> {
    return this.clienteHttp.post(
      this.API + '?actualizarPass' + '&id=' + id + '&token=' + token,
      nuevaPass,
      {
        headers: this.httpHeaders,
      }
    );
  }
}

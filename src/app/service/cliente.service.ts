
import { BehaviorSubject } from 'rxjs';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Cliente } from '../modules/recepcion/components/models/Cliente';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  httpHeaders = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });

  API: string = 'https://localhost/plan/usuarios.php'
 URLServices: String = "https://olympus.arvispace.com/puntoDeVenta/conf/registros.php"; //http://localhost/plan/registro.php/ https://olympus.arvispace.com/conPrincipal/registro.php
  //URLServices: string = 'https://localhost/plan/registros.php'
  //apiUrl: string = 'https://localhost/plan/registros.php?insertar=1'
  apiUrl: string = 'https://olympus.arvispace.com/puntoDeVenta/conf/registros.php?insertar=1'

  constructor(private clienteHttp:HttpClient) {
  }
  private dataSubject = new BehaviorSubject<any>(null);
  data$ = this.dataSubject.asObservable();

  guardarCliente(data: any): Observable<any> {
    return this.clienteHttp.post<any>(this.apiUrl, data);
  }

  sendData(data: any) {
    this.dataSubject.next(data);
  }

  obtenerUsuariosPorId(id:any):Observable<any>{
    return this.clienteHttp.get(this.API+"?consultar="+id);
  }

  agregarCliente(datosCliente:Cliente):Observable<any>{
    console.log("aca llega");
    return this.clienteHttp.post(this.URLServices+"?insertar=1",datosCliente);
  }
  
  //validaciones correo
  consultarEmail(id:any):Observable<any>{
    return this.clienteHttp.get(this.URLServices+"?consultar="+id);
  }

  credenciales(data:string, password:string){
    let headers: any = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });
    let parameters = 'data=' + data + '&password=' + password;
    return this.clienteHttp.post(this.URLServices + 'login.php', parameters, { headers });
  }
}


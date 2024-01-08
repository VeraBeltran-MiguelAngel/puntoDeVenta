
import { BehaviorSubject } from 'rxjs';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Cliente } from '../modules/recepcion/components/models/Cliente';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  API: string = 'https://localhost/plan/usuarios.php'
  //URLServices: String = "https://olympus.arvispace.com/conPrincipal/registro.php"; //http://localhost/plan/registro.php/ https://olympus.arvispace.com/conPrincipal/registro.php
  URLServices: string = 'https://localhost/plan/registros.php'

  constructor(private clienteHttp:HttpClient) {
  }
  private dataSubject = new BehaviorSubject<any>(null);
  data$ = this.dataSubject.asObservable();

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


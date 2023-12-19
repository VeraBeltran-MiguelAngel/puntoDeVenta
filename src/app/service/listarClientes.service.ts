import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { caja } from '../modules/recepcion/components/models/caja';

@Injectable({
  providedIn: 'root'
})
export class listarClientesService {

 //  API: string = 'https://localhost/plan/ListaCliente.php'
  API: string = 'https://olympus.arvispace.com/puntoDeVenta/conf/ListaCliente.php'
  
  constructor(private clienteHttp:HttpClient) {
  }

  obternerCliente(){
    return this.clienteHttp.get(this.API)
  }

  consultarCliente(id:any):Observable<any>{
    return this.clienteHttp.get(this.API+"?consultar="+id);
  }

  consultarClienteNombre(id:any):Observable<any>{
    return this.clienteHttp.get(this.API+"?consultarNombre="+id);
  }

}

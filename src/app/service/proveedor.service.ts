import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { proveedor } from '../modules/admin/components/models/proveedor';

@Injectable({
  providedIn: 'root'
})
export class ProveedorService {

  API: string = 'https://olympus.arvispace.com/conPrincipal/proveedor.php'
  constructor(private clienteHttp:HttpClient) {
  }

  agregarProveedor(datosProveedor:proveedor):Observable<any>{
    return this.clienteHttp.post(this.API+"?insertar=1",datosProveedor);
  }

  obternerProveedor(){
    return this.clienteHttp.get(this.API)
  }

  consultarProveedor(id:any):Observable<any>{
    return this.clienteHttp.get(this.API+"?consultar="+id);
  }

  borrarProveedor(id:any):Observable<any>{
    return this.clienteHttp.get(this.API+"?borrar="+id)
  }

  actualizarProveedor(id:any,datosProveedor:any):Observable<any>{
    return this.clienteHttp.post(this.API+"?actualizar="+id,datosProveedor);
  }  


}

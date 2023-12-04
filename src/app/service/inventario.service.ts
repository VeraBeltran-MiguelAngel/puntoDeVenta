import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { caja } from '../modules/recepcion/components/models/caja';

@Injectable({
  providedIn: 'root'
})
export class inventarioService {

  //API: string = 'https://localhost/plan/inventario.php'
  API: string = 'https://olympus.arvispace.com/puntoDeVenta/conf/inventario.php'
  
  constructor(private clienteHttp:HttpClient) {
  }

  obtenerProducto(){
    return this.clienteHttp.get(this.API)
  }


  obtenerProductoPorId(id:any):Observable<any>{
    return this.clienteHttp.get(this.API+"?consultar="+id);
  }

  

}

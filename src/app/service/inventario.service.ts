import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { caja } from '../modules/recepcion/components/models/caja';

@Injectable({
  providedIn: 'root'
})
export class inventarioService {

API: string = 'https://localhost/plan/inventario.php'
  //API: string = 'https://olympus.arvispace.com/puntoDeVenta/conf/inventario.php'
  
  constructor(private clienteHttp:HttpClient) {
  }

  obtenerProducto(){
    return this.clienteHttp.get(this.API)
  }


  obtenerProductoPorId(id: any, idGimnasio: any): Observable<any> {
    let params = new HttpParams().set('consultar', id).set('idGimnasio', idGimnasio);
    return this.clienteHttp.get(this.API, { params: params });
  }

  

  

}

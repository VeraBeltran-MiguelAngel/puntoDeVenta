import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { caja } from '../modules/recepcion/components/models/caja';

@Injectable({
  providedIn: 'root'
})
export class CajaService {

//API: string = 'https://localhost/plan/caja.php'

API: string = 'https://olympus.arvispace.com/puntoDeVenta/conf/caja.php'
 
  constructor(private clienteHttp:HttpClient) {
  }

  obternerCaja(){
    return this.clienteHttp.get(this.API)
  }

  // Angular service method
  agregarCaja(datoscaja: caja):Observable<any>{
    console.log("llega")
    return this.clienteHttp.post(this.API+"?insertar=1", datoscaja);
    
  }

  actualizarCaja(id:any,datoscaja:any):Observable<any>{
    return this.clienteHttp.post(this.API+"?actualizar="+id,datoscaja);
  } 

  consultarCaja(id:any):Observable<any>{
    return this.clienteHttp.get(this.API+"?consultar="+id);
  }

  borrarCaja(id:any):Observable<any>{
    return this.clienteHttp.get(this.API+"?borrar="+id)
    //this.message = "¡Error al eliminar!, Restricción en la base de datos";
  }

}

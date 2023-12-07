import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Ventas } from '../modules/recepcion/components/models/ventas';

@Injectable({
  providedIn: 'root'
})
export class VentasService {

  // API: string = 'http://localhost/productos/categorias.php'
 API: string = 'https://localhost/plan/ventas.php'
//  API: string = 'https://olympus.arvispace.com/puntoDeVenta/conf/ventas.php' 
  
  constructor(private clienteHttp:HttpClient) {
  }

  obternerVentas(){
    return this.clienteHttp.get(this.API)
  }

  // Angular service method
  agregarVentas(Ventas: Ventas):Observable<any>{
    return this.clienteHttp.post(this.API+"?insertar=1", Ventas);
  }

  actualizarVentas(id:any,Ventas:any):Observable<any>{
    return this.clienteHttp.post(this.API+"?actualizar="+id,Ventas);
  } 

  consultarVentas(id:any):Observable<any>{
    return this.clienteHttp.get(this.API+"?consultar="+id);
  }

  borrarVentas(id:any):Observable<any>{
    return this.clienteHttp.get(this.API+"?borrar="+id)
    //this.message = "¡Error al eliminar!, Restricción en la base de datos";
  }

}

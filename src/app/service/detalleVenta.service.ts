import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable,forkJoin } from 'rxjs';
import { detalleVenta } from '../modules/recepcion/components/models/detalleVenta';

@Injectable({
  providedIn: 'root'
})
export class DetalleVenta {

  // API: string = 'https://localhost/plan/detalle_venta.php'
 API: string = 'https://olympus.arvispace.com/puntoDeVenta/conf/detalle_venta.php'
  constructor(private clienteHttp:HttpClient) {
  }

  obternerVentaDetalle(){
    return this.clienteHttp.get(this.API)
  }
  // Angular service method
  agregarVentaDetalle(datosVentaDetalle: detalleVenta[]): Observable<any> {
    // Iterar sobre cada elemento del array y realizar una solicitud por cada elemento
    return forkJoin(
      datosVentaDetalle.map((detalle: detalleVenta) =>
        this.clienteHttp.post(this.API + '?insertar=1', detalle)
      )
    );
  }
  
  actualizarVentaDetalle(id:any,datosVentaDetalle:any):Observable<any>{
    return this.clienteHttp.post(this.API+"?actualizar="+id,datosVentaDetalle);
  } 

  consultarVentaDetalle(id:any):Observable<any>{
    return this.clienteHttp.get(this.API+"?consultar="+id);
  }

  borrarVentaDetalle(id:any):Observable<any>{
    return this.clienteHttp.get(this.API+"?borrar="+id)
    //this.message = "¡Error al eliminar!, Restricción en la base de datos";
  }

}

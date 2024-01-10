import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ListProductVendidosService {

  URLServices: string = "https://olympus.arvispace.com/puntoDeVenta/conf/listadoProductosVendidos.php";   //http://localhost/plan/listadoProductosVendidos.php/     //https://olympus.arvispace.com/puntoDeVenta/conf/listadoProductosVendidos.php    
  constructor(private clienteHttp:HttpClient) { }

  obtenerListaProduct(dateInicio: any, dateFin:any):Observable<any>{
    const params = new HttpParams().set('fechaInicio',dateInicio).set('fechaFin',dateFin);

    return this.clienteHttp.get(this.URLServices, { params });
    //return this.clienteHttp.get(this.URLServices+"?consultar");
  }

  topVentasMes():Observable<any>{
    return this.clienteHttp.get(this.URLServices+"?topProductos=");
  }  
}

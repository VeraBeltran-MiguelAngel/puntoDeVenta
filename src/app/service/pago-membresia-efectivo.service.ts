import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PagoMembresiaEfectivoService {

  URLServices: string = "https://olympus.arvispace.com/puntoDeVenta/conf/pagoEfectivoMembresia.php/";   //http://localhost/plan/pagoEfectivoMembresiaV2.php/     //https://olympus.arvispace.com/puntoDeVenta/conf/pagoEfectivoMembresia.php/     
  constructor(private clienteHttp:HttpClient) { }

  obternerDataMem(){
    return this.clienteHttp.get(this.URLServices);
  }

  idPagoSucursal(id:any,MemId:any):Observable<any>{
    const params = new HttpParams().set('consClienteId', id).set('consDetMemId', MemId);

    return this.clienteHttp.get(this.URLServices, { params });
  }

  /*obtenerActivos(){
    return this.clienteHttp.get(this.URLServices+"?consultar");
  }*/

  obtenerActivos(inicioDate: any, finDate: any): Observable<any>{
    const params = new HttpParams().set('fechaInicio',inicioDate).set('fechaFin',finDate);
    return this.clienteHttp.get(this.URLServices, {params});
  }

  clientesMemReenovar(){
    return this.clienteHttp.get(this.URLServices+"?Reenovacion");
  }

  pagoMemOpcion1(id:any):Observable<any>{
    return this.clienteHttp.get(this.URLServices+"?updateMembresia="+id);
  }  

  membresiasLista(idSucu: any):Observable<any>{
    return this.clienteHttp.get(this.URLServices+"?listaMembre="+idSucu);
  }
  
  membresiasInfo(idMemb: any):Observable<any>{
    return this.clienteHttp.get(this.URLServices+"?infoMembre="+idMemb);
  }

  actualizacionMemebresia(idCli:any,idMem:any):Observable<any>{
    const params = new HttpParams().set('consultClienteId', idCli).set('consultMemId', idMem);

    return this.clienteHttp.get(this.URLServices, { params });
  }
}
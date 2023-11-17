import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PagoMembresiaEfectivoService {

  URLServices: string = "http://localhost/plan/pagoEfectivoMembresia.php/";
  constructor(private clienteHttp:HttpClient) { }
  obternerDataMem(){
    return this.clienteHttp.get(this.URLServices);
  }

  idPagoSucursal(id:any,MemId:any):Observable<any>{
    const params = new HttpParams().set('consClienteId', id).set('consDetMemId', MemId);

    return this.clienteHttp.get(this.URLServices, { params });
  }
  obtenerActivos(){
    return this.clienteHttp.get(this.URLServices+"?consultar");
  }

}

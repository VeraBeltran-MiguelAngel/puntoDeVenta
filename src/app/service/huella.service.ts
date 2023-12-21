import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { InstruccionHuella } from './InstruccionHuella';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HuellaService {

  URLServices: string = "http://192.168.100.37";  //http://192.168.100.37  //http://localhost/plan/huella.php     //https://olympus.arvispace.com/puntoDeVenta/conf/huella.php    
  constructor(private clienteHttp:HttpClient) { }

  registroHuella(id:any):Observable<any>{
    return this.clienteHttp.get(this.URLServices+"?NewHuella="+id);
  }  

  insertarInstruccion(dato: InstruccionHuella):Observable<any>{
    return this.clienteHttp.post(this.URLServices,dato);
                                                /*+"?insertar=1" <- Nota: Colocarlo al cambiarlo a un servicio de php*/
  }
}
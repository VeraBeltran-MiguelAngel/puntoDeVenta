import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HuellaService {

  URLServices: string = "https://olympus.arvispace.com/puntoDeVenta/conf/huella.php";   //http://localhost/plan/huella.php     //https://olympus.arvispace.com/puntoDeVenta/conf/huella.php    
  constructor(private clienteHttp:HttpClient) { }


  registroHuella(id:any):Observable<any>{
    return this.clienteHttp.get(this.URLServices+"?NewHuella="+id);
  }  
}
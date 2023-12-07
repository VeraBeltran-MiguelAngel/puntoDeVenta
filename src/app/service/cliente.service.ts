import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  API: string = 'https://localhost/plan/usuarios.php'

  constructor(private clienteHttp:HttpClient) {
  }
  private dataSubject = new BehaviorSubject<any>(null);
  data$ = this.dataSubject.asObservable();

  sendData(data: any) {
    this.dataSubject.next(data);
  }

  obtenerUsuariosPorId(id:any):Observable<any>{
    return this.clienteHttp.get(this.API+"?consultar="+id);
  }
  

}

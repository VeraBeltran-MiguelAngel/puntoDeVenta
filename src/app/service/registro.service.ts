
import { BehaviorSubject } from 'rxjs';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Cliente } from '../modules/recepcion/components/models/Cliente';

@Injectable({
  providedIn: 'root'
})
export class RegistroService {

  API: string = 'https://localhost/plan/registros.php'
 
  constructor(private clienteHttp:HttpClient) {
  }

  agregarCliente(datosCliente:Cliente):Observable<any>{
    console.log("aca llega");
    return this.clienteHttp.post(this.API+"?insertar=1",datosCliente);
  }
  
}


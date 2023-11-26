import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { dataGym } from '../modules/recepcion/components/models/gimnasio';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class GimnasioService {
  Api_home: string =
    'https://olympus.arvispace.com/conPrincipal/espacioCliente.php';
  //para guardar los headers que manda el API
  httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private clienteHttp: HttpClient) {}

  //Listar gimansios de manera general ----------------------------- Roghelio
  gimnasiosLista(): Observable<any> {
    return this.clienteHttp.get<dataGym>(this.Api_home + '?listaGym');
  }
}

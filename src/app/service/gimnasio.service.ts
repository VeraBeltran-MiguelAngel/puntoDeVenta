import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { dataGym } from '../modules/recepcion/components/models/gimnasio';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { gimnasio } from '../modules/admin/components/models/gimnasio';

@Injectable({
  providedIn: 'root',
})
export class GimnasioService {
  public botonEstado = new BehaviorSubject<boolean>(false);  
  Api_home: string ='https://olympus.arvispace.com/conPrincipal/espacioCliente.php';
  API: string = 'https://olympus.arvispace.com/conPrincipal/gimnasio.php'
  //para guardar los headers que manda el API
  httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private clienteHttp: HttpClient) {}

  //Listar gimansios de manera general ----------------------------- Roghelio
  gimnasiosLista(): Observable<any> {
    return this.clienteHttp.get<dataGym>(this.Api_home + '?listaGym');
  }

  obternerPlan(){
    return this.clienteHttp.get(this.API)
  }

  // Angular service method
  agregarSucursal(datosGym: gimnasio):Observable<any>{
    return this.clienteHttp.post(this.API+"?insertar=1", datosGym);
  }

  actualizarPlan(id:any,datosPlan:any):Observable<any>{
    console.log("datosPlan",id,datosPlan);
    return this.clienteHttp.post(this.API+"?actualizar="+id,datosPlan);
  } 

  consultarPlan(id:any):Observable<any>{
    return this.clienteHttp.get(this.API+"?consultar="+id);
  }

  borrarSucursal(id:any):Observable<any>{
    console.log("si entro aca") 
    return this.clienteHttp.get(this.API+"?borrar="+id)
    //this.message = "¡Error al eliminar!, Restricción en la base de datos";
  }

  /*getEstatus(): boolean{
    return this.loadForm.value;
  }*/

}

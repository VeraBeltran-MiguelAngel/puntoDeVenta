import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { dataGym } from '../modules/recepcion/components/models/gimnasio';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { gimnasio } from '../modules/admin/components/models/gimnasio';

@Injectable({
  providedIn: 'root',
})
export class GimnasioService {
  //public botonEstado = new BehaviorSubject<boolean>(false); 
  botonEstado = new Subject<{respuesta: boolean, idGimnasio: any}>();
 
  Api_home: string ='https://olympus.arvispace.com/conPrincipal/espacioCliente.php';
  API: string = 'https://olympus.arvispace.com/conPrincipal/gimnasio.php';
  APISERVICE: string = 'https://olympus.arvispace.com/puntoDeVenta/conf/serviciosGym.php';
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

  /*actualizarPlan(id:any,datosPlan:any):Observable<any>{
    console.log("datosPlan",id,datosPlan);
    return this.clienteHttp.post(this.API+"?actualizar="+id,datosPlan);
  } */

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

  actualizarPlan(id:any,datosPlan:any):Observable<any>{
    console.log("datosPlan",id,datosPlan);

    // Crear los datos como x-www-form-urlencoded
    let body = new URLSearchParams();
    body.set('nombreGym', datosPlan.nombreGym);
    body.set('codigoPostal', datosPlan.codigoPostal);
    body.set('estado', datosPlan.estado);
    body.set('ciudad', datosPlan.ciudad);
    body.set('colonia', datosPlan.colonia);
    body.set('calle', datosPlan.calle);
    body.set('numExt', datosPlan.numExt);
    body.set('numInt', datosPlan.numInt);
    body.set('telefono', datosPlan.telefono);
    body.set('tipo', datosPlan.tipo);
    body.set('Franquicia_idFranquicia', datosPlan.Franquicia_idFranquicia);
    body.set('casilleros', datosPlan.casilleros);
    body.set('estacionamiento', datosPlan.estacionamiento);
    body.set('regaderas', datosPlan.regaderas);
    body.set('bicicletero', datosPlan.bicicletero);
    body.set('estatus', datosPlan.estatus);

    // Crear las opciones de la solicitud
    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };

    return this.clienteHttp.post(this.API+"?actualizar="+id, body.toString(), options);
  } 

  actualizarEstatus(idGimnasio: any, estatus: any): Observable<any> {
    // Crear los datos como x-www-form-urlencoded
    let body = new URLSearchParams();
    body.set('idGimnasio', idGimnasio);
    body.set('estatus', estatus.toString());
    body.set('actualizarEstatus', '1');
  
    // Crear las opciones de la solicitud
    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };
  
    return this.clienteHttp.post(this.API, body.toString(), options);
}

getAllServices(): Observable<any> {
  return this.clienteHttp.get(this.APISERVICE);
}

getServicesForId(id: any): Observable<any> {
  return this.clienteHttp.post(this.APISERVICE, { id: id });
}

}